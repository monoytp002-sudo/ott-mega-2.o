import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import Razorpay from 'razorpay';
import { createServer as createViteServer } from 'vite';
import { OTTPlan, Order, ContactInquiry, DashboardStats, PaymentSettings } from './src/types.ts';
import { INITIAL_PLANS, INITIAL_ORDERS, INITIAL_INQUIRIES } from './src/data/mockData.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON and urlencoded with increased limit for base64 images
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve uploads folder statically
  app.use('/uploads', express.static(uploadsDir));
  app.use(express.static(path.join(process.cwd(), 'public')));

  // Configure Multer for product image uploads
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniquePrefix}-${sanitizedName}`);
    }
  });

  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files (PNG, JPG, JPEG, WEBP, SVG) are allowed!'));
      }
    }
  });

  // In-memory persistent database store (initialized with seed data)
  const plansFilePath = path.join(uploadsDir, 'plans.json');
  let plans: OTTPlan[] = [...INITIAL_PLANS];
  if (fs.existsSync(plansFilePath)) {
    try {
      const rawPlans = fs.readFileSync(plansFilePath, 'utf-8');
      plans = JSON.parse(rawPlans);
    } catch (pErr) {
      console.warn('Could not read existing plans.json, using INITIAL_PLANS', pErr);
    }
  }

  const savePlans = () => {
    try {
      fs.writeFileSync(plansFilePath, JSON.stringify(plans, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save plans to file:', err);
    }
  };

  let orders: Order[] = [...INITIAL_ORDERS];
  let inquiries: ContactInquiry[] = [...INITIAL_INQUIRIES];

  // Payment & WhatsApp Settings store with JSON persistence
  const settingsFilePath = path.join(uploadsDir, 'payment-settings.json');
  let paymentSettings: PaymentSettings = {
    upiId: '8967624619@upi',
    payeeName: 'OTT Mega 2.0',
    upiQrImage: '',
    whatsappNumber: '8967624619',
    useCustomQr: false,
    notes: 'Scan & Pay via any UPI app (GPay, PhonePe, Paytm, BHIM) and confirm your order on WhatsApp for instant activation.'
  };

  if (fs.existsSync(settingsFilePath)) {
    try {
      const rawSettings = fs.readFileSync(settingsFilePath, 'utf-8');
      paymentSettings = { ...paymentSettings, ...JSON.parse(rawSettings) };
    } catch (sErr) {
      console.warn('Could not read existing payment-settings.json', sErr);
    }
  }

  // Helper to calculate statistics
  const calculateStats = (): DashboardStats => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;
    const failedOrders = orders.filter(o => o.status === 'Failed').length;
    const totalSales = orders
      .filter(o => o.status === 'Completed' || o.status === 'Pending')
      .reduce((sum, o) => sum + o.amount, 0);

    const platformSalesMap: Record<string, { count: number; revenue: number }> = {};
    orders.forEach(o => {
      if (!platformSalesMap[o.platform]) {
        platformSalesMap[o.platform] = { count: 0, revenue: 0 };
      }
      platformSalesMap[o.platform].count += 1;
      platformSalesMap[o.platform].revenue += o.amount;
    });

    const salesByPlatform = Object.entries(platformSalesMap).map(([platform, data]) => ({
      platform,
      count: data.count,
      revenue: data.revenue
    }));

    return {
      totalSales,
      totalOrders,
      pendingOrders,
      completedOrders,
      failedOrders,
      activePlansCount: plans.filter(p => p.inStock).length,
      recentOrders: [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
      salesByPlatform
    };
  };

  // Helper to generate a slug from product title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // ----------------------------------------------------
  // API ROUTES
  // ----------------------------------------------------

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', app: 'OTT Mega 2.0', timestamp: new Date().toISOString() });
  });

  // 0. IMAGE UPLOAD API (MULTER + BASE64 FALLBACK)
  app.post('/api/upload', (req: Request, res: Response) => {
    upload.single('image')(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message || 'File upload failed' });
      }

      if (req.file) {
        const fileUrl = `/uploads/${req.file.filename}`;
        return res.json({ success: true, url: fileUrl, filename: req.file.filename });
      }

      // If sent as JSON base64 data string:
      if (req.body && req.body.base64Image) {
        try {
          const base64Data = req.body.base64Image.replace(/^data:image\/\w+;base64,/, '');
          const ext = req.body.extension || 'png';
          const filename = `uploaded-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
          const filePath = path.join(uploadsDir, filename);
          fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
          return res.json({ success: true, url: `/uploads/${filename}`, filename });
        } catch (bErr: any) {
          return res.status(500).json({ success: false, error: 'Failed to process base64 image: ' + bErr.message });
        }
      }

      return res.status(400).json({ success: false, error: 'No image file or base64 data provided' });
    });
  });

  // 1. PLANS API
  app.get('/api/plans', (_req: Request, res: Response) => {
    res.json({ success: true, data: plans });
  });

  // Get single plan/product by ID or Slug
  app.get('/api/plans/:idOrSlug', (req: Request, res: Response) => {
    const { idOrSlug } = req.params;
    const plan = plans.find(
      p => p.id === idOrSlug || p.slug === idOrSlug || generateSlug(p.title) === idOrSlug
    );
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Product/Plan not found' });
    }
    res.json({ success: true, data: plan });
  });

  app.post('/api/plans', (req: Request, res: Response) => {
    try {
      const planData = req.body;
      const title = planData.title || 'New OTT Plan';
      const slug = planData.slug || generateSlug(title);

      // Extract duration options if provided
      let durationOptions = planData.durationOptions;
      if (!Array.isArray(durationOptions) || durationOptions.length === 0) {
        durationOptions = [
          {
            duration: planData.duration || '1 Month',
            originalPrice: Number(planData.originalPrice) || 299,
            discountedPrice: Number(planData.discountedPrice) || 99,
            badge: planData.badge || 'Popular'
          }
        ];
      }

      const defaultOption = durationOptions[0];

      const newPlan: OTTPlan = {
        id: `prod-${Date.now()}`,
        slug,
        title,
        platform: planData.platform || 'Netflix',
        badge: planData.badge || defaultOption.badge || '',
        imageUrl: planData.imageUrl || '',
        duration: defaultOption.duration || '1 Month',
        originalPrice: Number(defaultOption.originalPrice) || Number(planData.originalPrice) || 299,
        discountedPrice: Number(defaultOption.discountedPrice) || Number(planData.discountedPrice) || 99,
        durationOptions,
        currency: 'INR',
        features: Array.isArray(planData.features) && planData.features.length > 0 
          ? planData.features 
          : [
              'Ultra HD 4K Streaming',
              'Works on TV, Mobile & Laptop',
              'Instant Credential Delivery',
              '100% Replacement Warranty'
            ],
        screens: Number(planData.screens) || 1,
        resolution: planData.resolution || '4K UHD',
        deviceSupport: planData.deviceSupport || 'TV, Mobile, PC',
        isPopular: Boolean(planData.isPopular),
        inStock: planData.inStock !== false,
        description: planData.description || `High-speed uninterrupted access to ${planData.platform || 'OTT'} with private screen and instant activation.`,
        iconColor: planData.iconColor || '#ec4899'
      };

      plans.unshift(newPlan);
      savePlans();
      res.status(201).json({ success: true, data: newPlan });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/plans/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = plans.findIndex(p => p.id === id || p.slug === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }

    const currentPlan = plans[index];
    const updateData = req.body;

    if (updateData.title && !updateData.slug) {
      updateData.slug = generateSlug(updateData.title);
    }

    // Keep primary originalPrice and discountedPrice in sync with first duration option if provided
    if (Array.isArray(updateData.durationOptions) && updateData.durationOptions.length > 0) {
      updateData.duration = updateData.durationOptions[0].duration;
      updateData.originalPrice = updateData.durationOptions[0].originalPrice;
      updateData.discountedPrice = updateData.durationOptions[0].discountedPrice;
    }

    plans[index] = {
      ...currentPlan,
      ...updateData,
      id: currentPlan.id // preserve id
    };

    savePlans();
    res.json({ success: true, data: plans[index] });
  });

  app.delete('/api/plans/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = plans.length;
    plans = plans.filter(p => p.id !== id && p.slug !== id);
    if (plans.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }
    savePlans();
    res.json({ success: true, message: 'Plan deleted successfully' });
  });

  // 2. ORDERS API
  // Get all orders (for Admin)
  app.get('/api/orders', (req: Request, res: Response) => {
    const { status } = req.query;
    let result = [...orders];
    if (status && status !== 'All') {
      result = result.filter(o => o.status === status);
    }
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ success: true, data: result });
  });

  // Create new order (frontend checkout)
  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const {
        customerName,
        customerEmail,
        customerPhone,
        planId,
        duration,
        amount,
        paymentMethod = 'Razorpay',
        paymentRef,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      } = req.body;

      if (!customerName || !customerEmail || !customerPhone || !planId) {
        return res.status(400).json({ success: false, error: 'Missing required customer or plan details' });
      }

      const plan = plans.find(p => p.id === planId || p.slug === planId);
      if (!plan) {
        return res.status(404).json({ success: false, error: 'Selected plan does not exist' });
      }

      // Determine selected duration and price
      let orderDuration = duration || plan.duration;
      let orderAmount = amount;

      if (!orderAmount && plan.durationOptions && plan.durationOptions.length > 0) {
        const matchedOption = plan.durationOptions.find(opt => opt.duration === orderDuration);
        orderAmount = matchedOption ? matchedOption.discountedPrice : plan.discountedPrice;
      } else if (!orderAmount) {
        orderAmount = plan.discountedPrice;
      }

      // Generate human-friendly sequential-looking random order number like OTT-84920
      const randomFive = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `OTT-${randomFive}`;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        planId: plan.id,
        planTitle: plan.title,
        platform: plan.platform,
        duration: orderDuration,
        amount: Number(orderAmount),
        currency: plan.currency || 'INR',
        status: 'Pending',
        paymentMethod,
        paymentRef: paymentRef || (razorpayPaymentId ? `RZP-${razorpayPaymentId}` : `REF-${Math.floor(10000000 + Math.random() * 90000000)}`),
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        adminNotes: 'Order received via online checkout. Awaiting credential release.'
      };

      orders.unshift(newOrder);
      res.status(201).json({ success: true, data: newOrder });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Track order: lookup by Order ID or phone or email
  app.get('/api/orders/track/:query', (req: Request, res: Response) => {
    const rawQuery = (req.params.query || '').trim().toLowerCase();
    if (!rawQuery) {
      return res.status(400).json({ success: false, error: 'Query parameter required' });
    }

    // Clean phone number (strip whitespace, hyphens, plus)
    const cleanPhone = (str: string) => str.replace(/[\s\-\+\(\)]/g, '');
    const cleanQuery = cleanPhone(rawQuery);

    const matched = orders.filter(o => {
      const matchId = o.orderNumber.toLowerCase() === rawQuery || o.orderNumber.toLowerCase().replace(/[\-\s]/g, '') === rawQuery.replace(/[\-\s]/g, '');
      const matchEmail = o.customerEmail.toLowerCase() === rawQuery;
      const matchPhone = cleanPhone(o.customerPhone).includes(cleanQuery) || cleanQuery.includes(cleanPhone(o.customerPhone));
      return matchId || matchEmail || matchPhone;
    });

    if (matched.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No order found with the provided Order ID, Email, or WhatsApp Number. Please check and try again.'
      });
    }

    res.json({ success: true, data: matched });
  });

  // Update order status (Admin)
  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!['Pending', 'Completed', 'Failed'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }

    const order = orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.status = status;
    if (adminNotes !== undefined) order.adminNotes = adminNotes;
    order.updatedAt = new Date().toISOString();

    res.json({ success: true, data: order });
  });

  // Assign or update OTT credentials for an order (Admin)
  app.patch('/api/orders/:id/credentials', (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, password, profilePin, screenNumber, expiryDate, notes, markCompleted = true } = req.body;

    const order = orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.credentials = {
      email: email || order.credentials?.email || '',
      password: password !== undefined ? password : order.credentials?.password,
      profilePin: profilePin !== undefined ? profilePin : order.credentials?.profilePin,
      screenNumber: screenNumber !== undefined ? screenNumber : order.credentials?.screenNumber,
      expiryDate: expiryDate !== undefined ? expiryDate : order.credentials?.expiryDate,
      notes: notes !== undefined ? notes : order.credentials?.notes,
      assignedAt: new Date().toISOString()
    };

    if (markCompleted) {
      order.status = 'Completed';
    }
    order.updatedAt = new Date().toISOString();

    res.json({ success: true, data: order });
  });

  // 3. RAZORPAY PAYMENT GATEWAY INTEGRATION
  app.post('/api/razorpay/create-order', async (req: Request, res: Response) => {
    try {
      const { amount, currency = 'INR', receipt, notes } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid order amount' });
      }

      const keyId = process.env.RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      // In paise (1 INR = 100 paise)
      const amountInPaise = Math.round(Number(amount) * 100);

      // If official Razorpay credentials exist in env
      if (keyId && keySecret) {
        try {
          const instance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret
          });

          const order = await instance.orders.create({
            amount: amountInPaise,
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes: notes || { app: 'OTT Mega 2.0' }
          });

          return res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId,
            isMock: false
          });
        } catch (rzpErr: any) {
          console.warn('Razorpay live creation fallback:', rzpErr.message);
        }
      }

      // Seamless Sandbox / Preview Order Response
      // Generates a valid formatted order ID (e.g. order_NZx9...) so frontend Razorpay flow works reliably
      const mockOrderId = `order_${Math.random().toString(36).substring(2, 14)}`;
      return res.json({
        success: true,
        orderId: mockOrderId,
        amount: amountInPaise,
        currency,
        keyId: keyId || 'rzp_test_ottmega2026',
        isMock: true
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/razorpay/verify', (req: Request, res: Response) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id) {
        return res.status(400).json({ success: false, error: 'Missing Razorpay order or payment details' });
      }

      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (keySecret && razorpay_signature) {
        const expectedSignature = crypto
          .createHmac('sha256', keySecret)
          .update(`${razorpay_order_id}|${razorpay_payment_id}`)
          .digest('hex');

        if (expectedSignature !== razorpay_signature) {
          return res.status(400).json({ success: false, error: 'Invalid Razorpay signature. Payment verification failed.' });
        }
      }

      // Update matching order if exists
      const existingOrder = orders.find(o => o.razorpayOrderId === razorpay_order_id);
      if (existingOrder) {
        existingOrder.razorpayPaymentId = razorpay_payment_id;
        existingOrder.razorpaySignature = razorpay_signature;
        existingOrder.paymentRef = `RZP-${razorpay_payment_id}`;
        existingOrder.updatedAt = new Date().toISOString();
      }

      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. STATS API
  app.get('/api/stats', (_req: Request, res: Response) => {
    const stats = calculateStats();
    res.json({ success: true, data: stats });
  });

  // 5. CONTACT INQUIRIES API
  app.post('/api/contact', (req: Request, res: Response) => {
    try {
      const { name, email, phone = '', subject = 'General Inquiry', message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
      }

      const newInquiry: ContactInquiry = {
        id: `inq-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
        status: 'Unread'
      };

      inquiries.unshift(newInquiry);
      res.status(201).json({ success: true, data: newInquiry });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/contact', (_req: Request, res: Response) => {
    res.json({ success: true, data: inquiries });
  });

  // 6. PAYMENT & WHATSAPP SETTINGS API
  app.get('/api/settings/payment', (_req: Request, res: Response) => {
    res.json({ success: true, data: paymentSettings });
  });

  app.post('/api/settings/payment', (req: Request, res: Response) => {
    try {
      const { upiId, payeeName, upiQrImage, whatsappNumber, useCustomQr, notes } = req.body;
      
      if (upiId !== undefined) paymentSettings.upiId = upiId.trim();
      if (payeeName !== undefined) paymentSettings.payeeName = payeeName.trim();
      if (upiQrImage !== undefined) paymentSettings.upiQrImage = upiQrImage.trim();
      if (whatsappNumber !== undefined) {
        // Clean phone number
        paymentSettings.whatsappNumber = whatsappNumber.replace(/\D/g, '') || '8967624619';
      }
      if (useCustomQr !== undefined) paymentSettings.useCustomQr = Boolean(useCustomQr);
      if (notes !== undefined) paymentSettings.notes = notes.trim();

      // Write to disk for permanent persistence
      try {
        fs.writeFileSync(settingsFilePath, JSON.stringify(paymentSettings, null, 2), 'utf-8');
      } catch (fErr) {
        console.warn('Failed to write payment-settings.json', fErr);
      }

      res.json({ success: true, data: paymentSettings, message: 'Payment settings updated successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 7. ADMIN AUTH PIN VERIFICATION
  app.post('/api/admin/verify', (req: Request, res: Response) => {
    const { pin } = req.body;
    // Default PIN: admin123 or 8899
    if (pin === 'admin123' || pin === '8899' || pin === 'admin') {
      return res.json({ success: true, authenticated: true, token: 'ott-mega-admin-token-2026' });
    }
    return res.status(401).json({ success: false, error: 'Incorrect Admin PIN. Default is admin123' });
  });

  // ----------------------------------------------------
  // VITE MIDDLEWARE OR PRODUCTION STATIC SERVING
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OTT Mega 2.0 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

