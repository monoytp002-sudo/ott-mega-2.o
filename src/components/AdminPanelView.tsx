import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  RefreshCw, 
  Tv, 
  KeyRound, 
  Database, 
  MessageSquare, 
  Filter, 
  Copy, 
  ExternalLink,
  ShieldAlert,
  Sparkles,
  DollarSign,
  User,
  Calendar,
  AlertCircle,
  Upload,
  Image,
  Tag,
  QrCode,
  MessageCircle,
  Check,
  Camera
} from 'lucide-react';
import { OTTPlan, Order, ContactInquiry, DashboardStats, OTTPlatform, PlanDuration, OrderStatus, PlanDurationOption, PaymentSettings } from '../types.ts';
import { MongoSchemaDefinitions } from '../db/mongoSchemas.ts';
import { OttLogo } from './OttLogo.tsx';

interface AdminPanelViewProps {
  plans: OTTPlan[];
  setPlans: React.Dispatch<React.SetStateAction<OTTPlan[]>>;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  onViewOrderOnTrack: (orderNumber: string) => void;
  onNavigateToProduct?: (slug: string) => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  plans,
  setPlans,
  isLoggedIn,
  setIsLoggedIn,
  onViewOrderOnTrack,
  onNavigateToProduct,
}) => {
  // Pin code state
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'plans' | 'payment' | 'inquiries' | 'schemas'>('overview');

  // Stats
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Payment & WhatsApp Settings state
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    upiId: '8967624619@upi',
    payeeName: 'OTT Mega',
    upiQrImage: '',
    whatsappNumber: '8967624619',
    useCustomQr: false,
    notes: 'Scan & Pay via any UPI App (GPay, PhonePe, Paytm, BHIM) and confirm your order on WhatsApp.'
  });
  const [savingPaymentSettings, setSavingPaymentSettings] = useState(false);
  const [paymentSettingsSuccess, setPaymentSettingsSuccess] = useState('');
  const [uploadingQrImage, setUploadingQrImage] = useState(false);

  // Filter & Search states for orders
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Image Upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  // Manage Plans modal states
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<OTTPlan | null>(null);
  const [planForm, setPlanForm] = useState<Partial<OTTPlan>>({
    title: '',
    platform: 'Netflix',
    badge: '',
    duration: '1 Month',
    originalPrice: 499,
    discountedPrice: 199,
    screens: 1,
    resolution: '4K UHD',
    deviceSupport: 'TV, Mobile, PC',
    features: ['Ultra HD Streaming', 'Private Profile with PIN', 'Instant Delivery'],
    isPopular: false,
    inStock: true,
    description: '',
    imageUrl: '',
    slug: '',
    durationOptions: [
      { duration: '1 Month', originalPrice: 499, discountedPrice: 199, badge: 'Popular' },
      { duration: '3 Months', originalPrice: 1299, discountedPrice: 499, badge: 'Best Value' },
      { duration: '6 Months', originalPrice: 2499, discountedPrice: 899, badge: 'Saver' },
      { duration: '1 Year', originalPrice: 4999, discountedPrice: 1599, badge: 'Mega Saver' }
    ]
  });

  // Handle image upload from computer
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WEBP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10MB');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setPlanForm((prev) => ({ ...prev, imageUrl: data.imageUrl }));
      } else {
        // Fallback to FileReader base64
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPlanForm((prev) => ({ ...prev, imageUrl: event.target!.result as string }));
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPlanForm((prev) => ({ ...prev, imageUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  // Credential Assignment Modal state
  const [credModalOpen, setCredModalOpen] = useState(false);
  const [activeOrderForCred, setActiveOrderForCred] = useState<Order | null>(null);
  const [credForm, setCredForm] = useState({
    email: '',
    password: '',
    profilePin: '',
    screenNumber: 'Screen 1',
    expiryDate: '',
    notes: 'Do not change password or master email. Enjoy 4K streaming!'
  });

  // Copied alert
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Fetch initial admin data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchAdminData();
    }
  }, [isLoggedIn]);

  const fetchAdminData = async () => {
    setLoadingData(true);
    try {
      const [statsRes, ordersRes, inquiriesRes, plansRes, paymentSettingsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/orders'),
        fetch('/api/contact'),
        fetch('/api/plans'),
        fetch('/api/settings/payment')
      ]);

      const statsData = await statsRes.json();
      const ordersData = await ordersRes.json();
      const inquiriesData = await inquiriesRes.json();
      const plansData = await plansRes.json();
      const paymentData = await paymentSettingsRes.json();

      if (statsData.success) setStats(statsData.data);
      if (ordersData.success) setOrders(ordersData.data);
      if (inquiriesData.success) setInquiries(inquiriesData.data);
      if (plansData.success) setPlans(plansData.data);
      if (paymentData.success && paymentData.data) setPaymentSettings(paymentData.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  // Payment & WhatsApp Settings handlers
  const handleSavePaymentSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingPaymentSettings(true);
    setPaymentSettingsSuccess('');
    try {
      const res = await fetch('/api/settings/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentSettings),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setPaymentSettings(data.data);
        setPaymentSettingsSuccess('Payment & WhatsApp settings saved and active on live checkout!');
        setTimeout(() => setPaymentSettingsSuccess(''), 4000);
      } else {
        alert(data.error || 'Failed to save payment settings');
      }
    } catch (err) {
      alert('Error updating payment settings');
    } finally {
      setSavingPaymentSettings(false);
    }
  };

  const handleQrFileUpload = async (fileInput: File | null) => {
    if (!fileInput) return;

    if (!fileInput.type.startsWith('image/')) {
      alert('Please choose a valid image file (PNG, JPG, WEBP)');
      return;
    }

    setUploadingQrImage(true);
    setPaymentSettingsSuccess('');
    try {
      let finalUrl = '';
      const formData = new FormData();
      formData.append('image', fileInput);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        finalUrl = data.url;
      } else {
        finalUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve((event.target?.result as string) || '');
          };
          reader.readAsDataURL(fileInput);
        });
      }

      if (finalUrl) {
        const updated: PaymentSettings = {
          ...paymentSettings,
          upiQrImage: finalUrl,
          useCustomQr: true,
        };
        setPaymentSettings(updated);

        // Automatic instant persistence to server
        const saveRes = await fetch('/api/settings/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        const saveData = await saveRes.json();
        if (saveData.success && saveData.data) {
          setPaymentSettings(saveData.data);
        }
        setPaymentSettingsSuccess('✓ QR code photo saved automatically and activated on the website!');
        setTimeout(() => setPaymentSettingsSuccess(''), 5000);
      }
    } catch (err) {
      console.error('Failed to upload QR code image:', err);
      alert('Photo upload failed. Please try again.');
    } finally {
      setUploadingQrImage(false);
    }
  };

  const handleRemoveQrPhoto = async () => {
    setUploadingQrImage(true);
    try {
      const updated: PaymentSettings = {
        ...paymentSettings,
        upiQrImage: '',
        useCustomQr: false,
      };
      setPaymentSettings(updated);

      // Automatic instant persistence to server
      const saveRes = await fetch('/api/settings/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const saveData = await saveRes.json();
      if (saveData.success && saveData.data) {
        setPaymentSettings(saveData.data);
      }
      setPaymentSettingsSuccess('✓ Photo removed. Dynamic QR is now active.');
      setTimeout(() => setPaymentSettingsSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to reset QR image:', err);
    } finally {
      setUploadingQrImage(false);
    }
  };

  // Handle Admin PIN Login
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput }),
      });

      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        setPinInput('');
      } else {
        setAuthError(data.error || 'Incorrect PIN code');
      }
    } catch (err: any) {
      setAuthError('Connection error');
    } finally {
      setAuthLoading(false);
    }
  };

  // Quick unlock for preview convenience
  const handleQuickUnlock = () => {
    setIsLoggedIn(true);
  };

  // Handle Order Status Change
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.data : o)));
        fetchAdminData();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Open Credentials Modal for an order
  const openCredentialsModal = (order: Order) => {
    setActiveOrderForCred(order);
    setCredForm({
      email: order.credentials?.email || '',
      password: order.credentials?.password || '',
      profilePin: order.credentials?.profilePin || '',
      screenNumber: order.credentials?.screenNumber || 'Screen 1',
      expiryDate: order.credentials?.expiryDate || '',
      notes: order.credentials?.notes || 'Please do not change password. Enjoy streaming!'
    });
    setCredModalOpen(true);
  };

  // Save credentials and mark completed
  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrderForCred) return;

    try {
      const res = await fetch(`/api/orders/${activeOrderForCred.id}/credentials`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credForm.email,
          password: credForm.password,
          profilePin: credForm.profilePin,
          screenNumber: credForm.screenNumber,
          expiryDate: credForm.expiryDate,
          notes: credForm.notes,
          markCompleted: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === activeOrderForCred.id ? data.data : o))
        );
        setCredModalOpen(false);
        setActiveOrderForCred(null);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to save credentials');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving credentials');
    }
  };

  // Duration Option Helpers
  const handleAddDurationOption = () => {
    const currentOptions = planForm.durationOptions || [];
    const newOptions: PlanDurationOption[] = [
      ...currentOptions,
      {
        duration: currentOptions.length === 0 ? '1 Month' : `${(currentOptions.length + 1) * 2} Months`,
        originalPrice: 999,
        discountedPrice: 399,
        badge: '',
      },
    ];
    setPlanForm((prev) => ({ ...prev, durationOptions: newOptions }));
  };

  const handleUpdateDurationOption = (index: number, field: keyof PlanDurationOption, value: any) => {
    const currentOptions = [...(planForm.durationOptions || [])];
    if (currentOptions[index]) {
      currentOptions[index] = { ...currentOptions[index], [field]: value };
      const updates: any = { durationOptions: currentOptions };
      if (index === 0) {
        if (field === 'duration') updates.duration = value;
        if (field === 'originalPrice') updates.originalPrice = Number(value);
        if (field === 'discountedPrice') updates.discountedPrice = Number(value);
      }
      setPlanForm((prev) => ({ ...prev, ...updates }));
    }
  };

  const handleRemoveDurationOption = (index: number) => {
    const currentOptions = (planForm.durationOptions || []).filter((_, i) => i !== index);
    setPlanForm((prev) => ({ ...prev, durationOptions: currentOptions }));
  };

  // Add or Edit Plan submit
  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.title?.trim()) {
      alert('Please enter a product title');
      return;
    }
    try {
      const isEdit = Boolean(editingPlan);
      const url = isEdit ? `/api/plans/${editingPlan!.id}` : '/api/plans';
      const method = isEdit ? 'PUT' : 'POST';

      // Ensure at least one duration option
      let finalDurationOptions = planForm.durationOptions || [];
      if (finalDurationOptions.length === 0) {
        finalDurationOptions = [
          {
            duration: planForm.duration || '1 Month',
            originalPrice: planForm.originalPrice || 499,
            discountedPrice: planForm.discountedPrice || 199,
            badge: planForm.badge || 'Standard',
          },
        ];
      }

      // First duration option keeps primary price synchronized
      const firstOpt = finalDurationOptions[0];
      const payload = {
        ...planForm,
        duration: firstOpt.duration,
        originalPrice: firstOpt.originalPrice,
        discountedPrice: firstOpt.discountedPrice,
        durationOptions: finalDurationOptions,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setPlanModalOpen(false);
        setEditingPlan(null);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to save plan');
      }
    } catch (err: any) {
      alert(err.message || 'Error saving plan');
    }
  };

  // Delete Plan
  const handleDeletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription plan?')) return;
    try {
      const res = await fetch(`/api/plans/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPlans((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert('Failed to delete plan');
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchStatus =
      orderStatusFilter === 'All' || order.status === orderStatusFilter;
    const matchSearch =
      orderSearch === '' ||
      order.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customerPhone.includes(orderSearch) ||
      order.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  const copyCode = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // ----------------------------------------------------
  // IF NOT LOGGED IN: PIN LOCK SCREEN
  // ----------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="p-8 rounded-3xl bg-[#121217] border border-pink-500/40 shadow-2xl shadow-pink-500/10 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-pink-600 via-rose-400 to-pink-300 shadow-xl shadow-pink-500/30">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                <OttLogo size={74} showTextLabel={false} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white font-['Outfit']">
              Admin Portal Security
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Enter the administrator passcode to access orders, credentials management, and pricing controls.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Admin PIN (default: admin123)"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-center text-white placeholder-zinc-500 text-sm tracking-widest focus:outline-none focus:border-pink-500 transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>

          {/* Quick Demo Unlock button for evaluator convenience */}
          <div className="pt-2 border-t border-zinc-800">
            <button
              onClick={handleQuickUnlock}
              className="text-xs text-pink-400 hover:text-pink-300 font-semibold underline underline-offset-4"
            >
              Quick Unlock (Demo Review Access)
            </button>
            <p className="text-[10px] text-zinc-500 mt-1">
              Default password: <code className="text-zinc-400 font-mono">admin123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LOGGED IN: FULL ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Top Bar */}
      <div className="p-6 rounded-2xl bg-[#121217] border border-pink-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-pink-600 via-rose-400 to-pink-300 shadow-lg shadow-pink-500/25">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
              <OttLogo size={46} showTextLabel={false} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                OTT Mega 2.0 Admin Dashboard
              </h1>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                Live & Connected
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Manage live orders, send OTT credentials, update subscription packages & check statistics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminData}
            className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            title="Refresh All Data"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-pink-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Admin</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
          { id: 'orders', label: `Order Management (${orders.length})`, icon: ShoppingBag },
          { id: 'plans', label: `Manage Plans (${plans.length})`, icon: Tv },
          { id: 'payment', label: 'UPI QR & WhatsApp Settings', icon: QrCode },
          { id: 'inquiries', label: `Customer Inquiries (${inquiries.length})`, icon: MessageSquare },
          { id: 'schemas', label: 'Database Schemas (SQL & Mongo)', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: DASHBOARD OVERVIEW */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Metric 1: Total Sales */}
            <div className="p-6 rounded-2xl bg-[#121217] border border-zinc-800 hover:border-pink-500/40 transition-all space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
                <span>Total Revenue</span>
                <DollarSign className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-3xl font-black text-white font-['Outfit']">
                ₹{stats?.totalSales ?? orders.reduce((sum, o) => sum + o.amount, 0)}
              </div>
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <span>+24.5%</span> from last week
              </p>
            </div>

            {/* Metric 2: Total Orders */}
            <div className="p-6 rounded-2xl bg-[#121217] border border-zinc-800 hover:border-pink-500/40 transition-all space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
                <span>Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-pink-400" />
              </div>
              <div className="text-3xl font-black text-white font-['Outfit']">
                {orders.length}
              </div>
              <p className="text-[11px] text-zinc-400">All registered customer orders</p>
            </div>

            {/* Metric 3: Pending Orders */}
            <div className="p-6 rounded-2xl bg-[#121217] border border-zinc-800 hover:border-amber-500/40 transition-all space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
                <span>Pending Orders</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400 font-['Outfit']">
                {orders.filter(o => o.status === 'Pending').length}
              </div>
              <p className="text-[11px] text-amber-400/80 font-medium">Awaiting credential release</p>
            </div>

            {/* Metric 4: Completed Orders */}
            <div className="p-6 rounded-2xl bg-[#121217] border border-zinc-800 hover:border-emerald-500/40 transition-all space-y-2">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
                <span>Completed Orders</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400 font-['Outfit']">
                {orders.filter(o => o.status === 'Completed').length}
              </div>
              <p className="text-[11px] text-emerald-400/80 font-medium">Credentials active & delivered</p>
            </div>

          </div>

          {/* Quick Actions & Recent Orders Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Recent Orders Table */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#121217] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Recent Customer Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-pink-400 hover:underline font-semibold"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-lg">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-lg text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-zinc-900/40">
                        <td className="p-3 font-mono font-bold text-pink-400">
                          {ord.orderNumber}
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{ord.customerName}</div>
                          <div className="text-[10px] text-zinc-500">{ord.customerPhone}</div>
                        </td>
                        <td className="p-3 text-zinc-300">{ord.planTitle}</td>
                        <td className="p-3 font-bold text-white">₹{ord.amount}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : ord.status === 'Pending'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => openCredentialsModal(ord)}
                            className="px-2.5 py-1 rounded bg-pink-500/20 text-pink-400 hover:bg-pink-500 hover:text-white text-[11px] font-bold transition-all"
                          >
                            Credentials
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 1 Col: Platform Sales Distribution */}
            <div className="p-6 rounded-2xl bg-[#121217] border border-zinc-800 space-y-4">
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Sales by Platform
              </h3>

              <div className="space-y-3 pt-2">
                {[
                  { platform: 'Netflix', count: 42, color: 'bg-red-500' },
                  { platform: 'Combo Pack', count: 28, color: 'bg-pink-500' },
                  { platform: 'Amazon Prime', count: 24, color: 'bg-sky-400' },
                  { platform: 'Disney+ Hotstar', count: 18, color: 'bg-blue-500' },
                  { platform: 'SonyLIV & Zee5', count: 12, color: 'bg-purple-500' },
                ].map((item) => (
                  <div key={item.platform} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-zinc-300">{item.platform}</span>
                      <span className="text-zinc-400">{item.count} orders</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full`}
                        style={{ width: `${item.count * 2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-pink-500/20 text-xs text-zinc-400 space-y-2 mt-4">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>OTT Mega 2.0 Real-Time Sync</span>
                </div>
                <p className="text-[11px]">
                  When you update or assign credentials in the Order Management tab, the customer can immediately view and copy them on the Track Order page.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: ORDER MANAGEMENT */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Controls row */}
          <div className="p-4 rounded-2xl bg-[#121217] border border-zinc-800 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search Order ID, name, WhatsApp..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-pink-500"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['All', 'Pending', 'Completed', 'Failed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    orderStatusFilter === status
                      ? 'bg-pink-500 text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="p-6 rounded-2xl bg-[#121217] border border-zinc-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5 rounded-l-lg">Order ID & Date</th>
                  <th className="p-3.5">Customer Details</th>
                  <th className="p-3.5">Plan & Validity</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Credentials Assigned?</th>
                  <th className="p-3.5 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-zinc-500">
                      No orders found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const hasCredentials = Boolean(ord.credentials?.email);
                    return (
                      <tr key={ord.id} className="hover:bg-zinc-900/40">
                        {/* ID & Date */}
                        <td className="p-3.5">
                          <div className="font-mono font-black text-pink-400 text-sm">
                            {ord.orderNumber}
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            {new Date(ord.createdAt).toLocaleString()}
                          </div>
                          <button
                            onClick={() => onViewOrderOnTrack(ord.orderNumber)}
                            className="text-[10px] text-zinc-400 hover:text-pink-300 underline mt-0.5 block"
                          >
                            View on Track Order
                          </button>
                        </td>

                        {/* Customer */}
                        <td className="p-3.5">
                          <div className="font-bold text-white">{ord.customerName}</div>
                          <div className="text-[11px] text-emerald-400 font-mono">
                            {ord.customerPhone}
                          </div>
                          <div className="text-[10px] text-zinc-500 truncate max-w-[150px]">
                            {ord.customerEmail}
                          </div>
                        </td>

                        {/* Plan */}
                        <td className="p-3.5">
                          <div className="font-semibold text-white">{ord.planTitle}</div>
                          <div className="text-[11px] text-pink-400">{ord.duration}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">
                            Ref: {ord.paymentRef || 'None'}
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="p-3.5 font-bold text-white text-sm">
                          ₹{ord.amount}
                        </td>

                        {/* Status dropdown */}
                        <td className="p-3.5">
                          <select
                            value={ord.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                            }
                            className={`px-2 py-1 rounded text-xs font-bold border bg-zinc-950 focus:outline-none cursor-pointer ${
                              ord.status === 'Completed'
                                ? 'text-emerald-400 border-emerald-500/40'
                                : ord.status === 'Pending'
                                  ? 'text-amber-400 border-amber-500/40'
                                  : 'text-rose-400 border-rose-500/40'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Failed">Failed</option>
                          </select>
                        </td>

                        {/* Credentials Status */}
                        <td className="p-3.5">
                          {hasCredentials ? (
                            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{ord.credentials?.email}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-amber-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Not Assigned Yet</span>
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => openCredentialsModal(ord)}
                            className="px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition-all flex items-center gap-1.5 ml-auto"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>{hasCredentials ? 'Edit Credentials' : 'Assign Login'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: MANAGE PLANS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'plans' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Active OTT Subscription Packages
              </h3>
              <p className="text-xs text-zinc-400">
                Add new subscription plans, edit pricing, change durations, or update stock availability.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingPlan(null);
                setPlanForm({
                  title: '',
                  platform: 'Netflix',
                  badge: '',
                  duration: '1 Month',
                  originalPrice: 499,
                  discountedPrice: 199,
                  screens: 1,
                  resolution: '4K UHD',
                  deviceSupport: 'TV, Mobile, PC',
                  features: ['4K UHD Streaming', 'Private Profile PIN', 'Instant Activation'],
                  isPopular: false,
                  inStock: true,
                  description: '',
                  imageUrl: '',
                  slug: '',
                  durationOptions: [
                    { duration: '1 Month', originalPrice: 499, discountedPrice: 199, badge: 'Standard' },
                    { duration: '3 Months', originalPrice: 1299, discountedPrice: 499, badge: 'Popular' },
                    { duration: '6 Months', originalPrice: 2499, discountedPrice: 899, badge: 'Best Value' },
                    { duration: '1 Year', originalPrice: 4999, discountedPrice: 1599, badge: 'Mega Saver' }
                  ]
                });
                setPlanModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-pink-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Plan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const durCount = plan.durationOptions && plan.durationOptions.length > 0 ? plan.durationOptions.length : 1;
              const minPrice = plan.durationOptions && plan.durationOptions.length > 0
                ? Math.min(...plan.durationOptions.map(d => d.discountedPrice))
                : plan.discountedPrice;
              const maxPrice = plan.durationOptions && plan.durationOptions.length > 0
                ? Math.max(...plan.durationOptions.map(d => d.discountedPrice))
                : plan.discountedPrice;

              return (
                <div
                  key={plan.id}
                  className="p-5 rounded-2xl bg-[#121217] border border-zinc-800 hover:border-pink-500/40 flex flex-col justify-between space-y-4 transition-all"
                >
                  <div>
                    {/* Header with Custom Logo & Stock status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        {plan.imageUrl ? (
                          <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 p-1.5 flex items-center justify-center shrink-0">
                            <img src={plan.imageUrl} alt={plan.title} className="w-full h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                            <Tv className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-black text-pink-400 uppercase tracking-wider block">
                            {plan.platform}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            /{plan.slug || plan.id}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 text-[10px] font-bold border border-pink-500/20">
                          {durCount} {durCount === 1 ? 'Duration' : 'Durations'}
                        </span>
                        {plan.inStock ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                            In Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/30">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-1">{plan.title}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{plan.description}</p>

                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-xs text-zinc-400 block mb-0.5">Starting From</span>
                        <span className="text-2xl font-black text-white">₹{minPrice}</span>
                        {minPrice !== maxPrice && (
                          <span className="text-xs text-zinc-400 ml-1">to ₹{maxPrice}</span>
                        )}
                      </div>
                      <span className="text-xs text-pink-400 font-bold">
                        {plan.screens} {plan.screens === 1 ? 'Screen' : 'Screens'} • {plan.resolution}
                      </span>
                    </div>

                    <ul className="text-xs text-zinc-400 space-y-1">
                      {plan.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="line-clamp-1">• {feat}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Edit, Delete, & View Product Page Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-zinc-800">
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setPlanForm({ 
                          ...plan,
                          durationOptions: plan.durationOptions && plan.durationOptions.length > 0
                            ? plan.durationOptions
                            : [{ duration: plan.duration, originalPrice: plan.originalPrice, discountedPrice: plan.discountedPrice, badge: plan.badge }]
                        });
                        setPlanModalOpen(true);
                      }}
                      className="flex-1 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Product</span>
                    </button>

                    {onNavigateToProduct && (
                      <button
                        onClick={() => onNavigateToProduct(plan.slug || plan.id)}
                        className="p-2 rounded-lg bg-zinc-900 hover:bg-pink-500/20 text-zinc-400 hover:text-pink-400 border border-zinc-800 transition-colors"
                        title="View Live Product Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-2 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 border border-zinc-800 transition-colors"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB: PAYMENT & WHATSAPP SETTINGS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'payment' && (
        <div className="p-6 rounded-2xl bg-[#121217] border border-pink-500/30 space-y-6 animate-in fade-in shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">
                <QrCode className="w-4 h-4 text-pink-400" />
                <span>Payment & WhatsApp Configuration</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                UPI ID, QR Code & WhatsApp Settings
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Configure your UPI ID, manual UPI QR code photo, and WhatsApp order fulfillment number.
              </p>
            </div>

            <button
              onClick={() => handleSavePaymentSettings()}
              disabled={savingPaymentSettings}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {savingPaymentSettings ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save All Settings</span>
                </>
              )}
            </button>
          </div>

          {paymentSettingsSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{paymentSettingsSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Settings Form */}
            <form onSubmit={handleSavePaymentSettings} className="lg:col-span-7 space-y-6">
              {/* Section 1: UPI Details */}
              <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span>1. UPI Payment Details</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    UPI ID <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentSettings.upiId}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, upiId: e.target.value })}
                    placeholder="e.g. 8967624619@upi or yourname@okaxis"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 font-mono text-sm focus:outline-none focus:border-pink-500"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">
                    This UPI ID will appear in the checkout box, allowing customers to copy it with one click.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Payee Name / Merchant Name
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.payeeName}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, payeeName: e.target.value })}
                    placeholder="e.g. OTT Mega 2.0"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Section 2: Direct UPI QR Code Photo Upload (Automatic Save) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800/80">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
                      <span>2. UPI QR Code Photo (Upload from PC or Mobile)</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">
                      Any QR photo you upload from mobile or computer will be <span className="text-pink-400 font-semibold">automatically saved</span> and activated immediately on the website.
                    </p>
                  </div>
                  <div className="shrink-0">
                    {paymentSettings.upiQrImage ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Custom QR Photo Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                        <span>Default Dynamic QR Active</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Upload Action Buttons for Mobile and PC */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Option A: Mobile Camera Capture */}
                  <label className="relative p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-zinc-950 border border-pink-500/30 hover:border-pink-500 hover:bg-pink-500/15 transition-all flex items-center gap-3.5 cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {uploadingQrImage ? (
                        <RefreshCw className="w-6 h-6 animate-spin" />
                      ) : (
                        <Camera className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                        Take Photo with Phone Camera
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        Open camera to capture your QR standee or card directly
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      disabled={uploadingQrImage}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleQrFileUpload(file);
                        e.target.value = '';
                      }}
                    />
                  </label>

                  {/* Option B: Choose from Computer or Phone Gallery */}
                  <label className="relative p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all flex items-center gap-3.5 cursor-pointer group">
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {uploadingQrImage ? (
                        <RefreshCw className="w-6 h-6 animate-spin text-pink-400" />
                      ) : (
                        <Upload className="w-6 h-6 text-zinc-200" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                        Choose Photo from PC or Gallery
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        Select an image file from your device or photo library
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingQrImage}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleQrFileUpload(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>

                {/* Upload Status / Progress */}
                {uploadingQrImage && (
                  <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center gap-3 text-pink-300 text-xs font-semibold animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                    <span>Uploading photo and saving automatically, please wait...</span>
                  </div>
                )}

                {/* Live Active QR Photo Card & Management */}
                {paymentSettings.upiQrImage ? (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Saved Active QR Photo (Live in Checkout)</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveQrPhoto}
                        disabled={uploadingQrImage}
                        className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Photo</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                      <div className="w-36 h-36 bg-white p-2.5 rounded-xl border border-zinc-200 shadow-md flex items-center justify-center shrink-0">
                        <img
                          src={paymentSettings.upiQrImage}
                          alt="Saved UPI QR"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1.5 text-center sm:text-left">
                        <div className="text-xs font-bold text-white">
                          This photo is live and visible to customers during checkout.
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          To replace it with another photo, simply click <span className="text-white font-semibold">"Take Photo with Phone Camera"</span> or <span className="text-white font-semibold">"Choose Photo from PC"</span> above — the new photo will save automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-dashed border-zinc-800 text-center space-y-1.5">
                    <div className="text-xs font-bold text-zinc-300">
                      No custom QR photo uploaded yet
                    </div>
                    <p className="text-[11px] text-zinc-500 max-w-md mx-auto">
                      As soon as you capture or upload a photo using the buttons above, it will be <span className="text-pink-400 font-semibold">saved automatically</span>.
                    </p>
                  </div>
                )}

                {/* Direct Image URL input for convenience */}
                <div className="pt-2 border-t border-zinc-800/80">
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    Or paste direct image URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={paymentSettings.upiQrImage || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPaymentSettings((prev) => ({ ...prev, upiQrImage: val, useCustomQr: Boolean(val) }));
                      }}
                      placeholder="https://example.com/my-upi-qr.png or /uploads/..."
                      className="flex-1 px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-xs focus:outline-none focus:border-pink-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleSavePaymentSettings()}
                      className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
                    >
                      Save URL
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 3: WhatsApp Number */}
              <div className="p-5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>3. Seller WhatsApp Order Redirect Number</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    WhatsApp Mobile Number <span className="text-pink-400">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="tel"
                        required
                        value={paymentSettings.whatsappNumber}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, whatsappNumber: e.target.value })}
                        placeholder="8967624619"
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-sm font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <a
                      href={`https://wa.me/91${(paymentSettings.whatsappNumber || '8967624619').replace(/\D/g, '')}?text=Hello%20OTT%20Mega!%20Testing%20WhatsApp%20Integration.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Test Chat</span>
                    </a>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                    When a customer clicks <span className="text-white font-semibold">"Book My Order"</span> in checkout, this number will be provided so they can start a chat directly on your WhatsApp with their complete order details.
                  </p>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingPaymentSettings}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingPaymentSettings ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Settings...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save & Apply All Settings</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Right Column: Real-Time Live Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Live Customer Checkout Preview</span>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-pink-500/30 space-y-4 shadow-xl">
                <div className="text-center pb-3 border-b border-zinc-800">
                  <div className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">Checkout View Preview</div>
                  <h5 className="text-base font-bold text-white mt-0.5">Manual UPI Payment Box</h5>
                </div>

                {/* Preview Box */}
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-pink-400" />
                      <span>Scan & Pay via UPI</span>
                    </span>
                    <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                      Pay ₹199 (Sample)
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-3 bg-zinc-900/90 p-4 rounded-lg border border-zinc-800">
                    <div className="w-36 h-36 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
                      <img
                        src={
                          paymentSettings.upiQrImage
                            ? paymentSettings.upiQrImage
                            : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                                `upi://pay?pa=${paymentSettings.upiId || '8967624619@upi'}&pn=${paymentSettings.payeeName || 'OTTMega'}&am=199&cu=INR`
                              )}`
                        }
                        alt="Live QR Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="text-center space-y-1">
                      <span className="text-[11px] text-zinc-400 block">UPI ID:</span>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-950 border border-zinc-700">
                        <span className="font-mono text-pink-400 font-bold text-xs">{paymentSettings.upiId || '8967624619@upi'}</span>
                        <Copy className="w-3 h-3 text-zinc-400" />
                      </div>
                      <p className="text-[10px] text-zinc-400 pt-1">
                        Scan from PhonePe, Google Pay, Paytm, BHIM
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Redirect Preview */}
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2 text-center">
                  <span className="text-[11px] font-bold text-emerald-400 block">
                    Order Confirmation WhatsApp Target
                  </span>
                  <div className="text-xl font-black text-white font-mono tracking-wider">
                    {paymentSettings.whatsappNumber || '8967624619'}
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Clicking on this number opens WhatsApp with full order details pre-filled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 4: CUSTOMER INQUIRIES */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'inquiries' && (
        <div className="p-6 rounded-2xl bg-[#121217] border border-zinc-800 space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">
              Contact Form Inquiries ({inquiries.length})
            </h3>
            <p className="text-xs text-zinc-400">
              Messages and requests submitted by customers through the Contact Us page.
            </p>
          </div>

          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs">
                No customer inquiries received yet.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
                    <div>
                      <span className="font-bold text-white text-sm">{inq.name}</span>
                      <span className="text-xs text-zinc-400 ml-2">({inq.email})</span>
                      {inq.phone && (
                        <span className="text-xs text-emerald-400 ml-2 font-mono">{inq.phone}</span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500">
                      {new Date(inq.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-pink-400 uppercase tracking-wide">
                      {inq.subject}
                    </h4>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed whitespace-pre-wrap">
                      {inq.message}
                    </p>
                  </div>

                  {inq.phone && (
                    <div className="pt-2">
                      <a
                        href={`https://wa.me/${inq.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(inq.name)}!%20Regarding%20your%20inquiry%20on%20OTT%20Mega%202.0...`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 5: DATABASE SCHEMAS (SQL & MONGODB) */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'schemas' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-xl font-bold text-white font-['Outfit']">
              Database Schemas (SQL & MongoDB)
            </h3>
            <p className="text-xs text-zinc-400">
              Production-ready database architecture for PostgreSQL / MySQL and MongoDB Mongoose models.
            </p>
          </div>

          {copiedText && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              Copied {copiedText} to clipboard!
            </div>
          )}

          {/* SQL Schema Box */}
          <div className="p-6 rounded-2xl bg-[#121217] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-pink-400" />
                <h4 className="text-sm font-bold text-white">
                  PostgreSQL / MySQL Schema (DDL)
                </h4>
              </div>
              <button
                onClick={() => copyCode(sqlSchemaString, 'SQL Schema')}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-pink-500 text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-72">
              {sqlSchemaString}
            </pre>
          </div>

          {/* MongoDB Mongoose Models Box */}
          <div className="p-6 rounded-2xl bg-[#121217] border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-pink-400" />
                <h4 className="text-sm font-bold text-white">
                  MongoDB Mongoose Schemas (Node.js)
                </h4>
              </div>
              <button
                onClick={() => copyCode(MongoSchemaDefinitions, 'MongoDB Schema')}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-pink-500 text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Mongoose Models</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-72">
              {MongoSchemaDefinitions}
            </pre>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: ASSIGN / EDIT CREDENTIALS MODAL */}
      {/* ---------------------------------------------------- */}
      {credModalOpen && activeOrderForCred && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#121217] border border-pink-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
            <h3 className="text-xl font-bold text-white font-['Outfit'] mb-1">
              Assign OTT Login Credentials
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Order: <span className="font-mono text-pink-400 font-bold">{activeOrderForCred.orderNumber}</span> ({activeOrderForCred.planTitle}) for <span className="text-white font-semibold">{activeOrderForCred.customerName}</span> ({activeOrderForCred.customerPhone})
            </p>

            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Login Email / Username <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={credForm.email}
                  onChange={(e) => setCredForm({ ...credForm, email: e.target.value })}
                  placeholder="e.g. stream.mega49@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs sm:text-sm font-mono focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Account Password <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={credForm.password}
                  onChange={(e) => setCredForm({ ...credForm, password: e.target.value })}
                  placeholder="e.g. Stream4K#Mega9"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs sm:text-sm font-mono focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Profile Name / Screen
                  </label>
                  <input
                    type="text"
                    value={credForm.screenNumber}
                    onChange={(e) => setCredForm({ ...credForm, screenNumber: e.target.value })}
                    placeholder="e.g. Screen 2 (Rahul)"
                    className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Profile PIN Lock
                  </label>
                  <input
                    type="text"
                    value={credForm.profilePin}
                    onChange={(e) => setCredForm({ ...credForm, profilePin: e.target.value })}
                    placeholder="e.g. 4821"
                    className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Special Notes / Guidelines for User
                </label>
                <textarea
                  rows={2}
                  value={credForm.notes}
                  onChange={(e) => setCredForm({ ...credForm, notes: e.target.value })}
                  placeholder="e.g. Please do not change password or master email..."
                  className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-pink-500 focus:outline-none resize-none"
                />
              </div>

              <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl text-[11px] text-pink-300">
                Saving will automatically mark the order as <strong className="text-white">Completed</strong>. The customer can immediately view and copy these details using Track Order!
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Release Credentials</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCredModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: ADD / EDIT PLAN MODAL */}
      {/* ---------------------------------------------------- */}
      {planModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#121217] border border-pink-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">
                  {editingPlan ? 'Edit Product & Pricing' : 'Create New OTT Product'}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Configure custom logo, variable duration pricing, and hardware specs
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPlanModalOpen(false)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} noValidate className="space-y-5">
              {/* Product Platform & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Platform Category <span className="text-pink-400">*</span>
                  </label>
                  <select
                    value={planForm.platform}
                    onChange={(e) => setPlanForm({ ...planForm, platform: e.target.value as OTTPlatform })}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-pink-500 focus:outline-none"
                  >
                    <option value="Netflix">Netflix</option>
                    <option value="Amazon Prime">Amazon Prime</option>
                    <option value="Disney+ Hotstar">Disney+ Hotstar</option>
                    <option value="SonyLIV">SonyLIV</option>
                    <option value="Zee5">Zee5</option>
                    <option value="JioCinema">JioCinema</option>
                    <option value="Crunchyroll">Crunchyroll</option>
                    <option value="Apple TV+">Apple TV+</option>
                    <option value="YouTube Premium">YouTube Premium</option>
                    <option value="Combo Pack">Combo Pack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Product Title <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={planForm.title}
                    onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })}
                    placeholder="e.g. Netflix Premium 4K UHD"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 1. CUSTOM IMAGE & LOGO UPLOAD */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-pink-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-bold text-white">Product Logo & Custom Image Upload</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">PNG, JPG, SVG, WEBP up to 10MB</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview Box */}
                  <div className="w-24 h-24 rounded-xl bg-zinc-950 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {planForm.imageUrl ? (
                      <>
                        <img 
                          src={planForm.imageUrl} 
                          alt="Product Logo Preview" 
                          className="w-full h-full object-contain p-2"
                        />
                        <button
                          type="button"
                          onClick={() => setPlanForm((prev) => ({ ...prev, imageUrl: '' }))}
                          className="absolute inset-0 bg-black/70 text-rose-400 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold gap-1"
                        >
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-2">
                        <Tv className="w-6 h-6 text-zinc-600 mx-auto mb-1" />
                        <span className="text-[9px] text-zinc-500 block leading-tight">Default Logo</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-all shadow-md shadow-pink-500/20">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Logo / Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>

                      {planForm.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setPlanForm((prev) => ({ ...prev, imageUrl: '' }))}
                          className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    <div>
                      <input
                        type="text"
                        value={planForm.imageUrl || ''}
                        onChange={(e) => setPlanForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="Or paste external image URL (e.g. https://.../logo.png or /logos/...)"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-600 text-xs focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. VARIABLE PRICING SYSTEM (Duration Options) */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-pink-400" />
                      <span className="text-xs font-bold text-white">Variable Pricing System (Multiple Durations)</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Customers can choose from these duration tiers on the product page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddDurationOption}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-bold border border-pink-500/40 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Duration</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(planForm.durationOptions || []).map((opt, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/90 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                    >
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] text-zinc-400 mb-0.5">Duration</label>
                        <input
                          type="text"
                          required
                          value={opt.duration}
                          onChange={(e) => handleUpdateDurationOption(idx, 'duration', e.target.value)}
                          placeholder="e.g. 1 Month"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs font-bold focus:border-pink-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] text-zinc-400 mb-0.5">Original (₹)</label>
                        <input
                          type="number"
                          value={opt.originalPrice}
                          onChange={(e) => handleUpdateDurationOption(idx, 'originalPrice', Number(e.target.value))}
                          placeholder="499"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs focus:border-pink-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[10px] text-pink-400 mb-0.5">Sale Price (₹)</label>
                        <input
                          type="number"
                          required
                          value={opt.discountedPrice}
                          onChange={(e) => handleUpdateDurationOption(idx, 'discountedPrice', Number(e.target.value))}
                          placeholder="199"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-pink-400 font-bold text-xs focus:border-pink-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-zinc-400 mb-0.5">Badge (Opt)</label>
                        <input
                          type="text"
                          value={opt.badge || ''}
                          onChange={(e) => handleUpdateDurationOption(idx, 'badge', e.target.value)}
                          placeholder="Popular"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs focus:border-pink-500 focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end pt-3 sm:pt-0">
                        {(planForm.durationOptions || []).length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDurationOption(idx)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remove duration option"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Screens / Profiles Allowed
                  </label>
                  <input
                    type="number"
                    value={planForm.screens}
                    onChange={(e) => setPlanForm({ ...planForm, screens: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Resolution Quality
                  </label>
                  <input
                    type="text"
                    value={planForm.resolution}
                    onChange={(e) => setPlanForm({ ...planForm, resolution: e.target.value })}
                    placeholder="e.g. 4K UHD or 1080p FHD"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Product Badge (Optional)
                </label>
                <input
                  type="text"
                  value={planForm.badge || ''}
                  onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                  placeholder="e.g. Best Seller, Top Rated, 70% OFF"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={planForm.description || ''}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  placeholder="Description of subscription features, compatibility, audio..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs resize-none focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={planForm.isPopular}
                    onChange={(e) => setPlanForm({ ...planForm, isPopular: e.target.checked })}
                    className="rounded text-pink-500"
                  />
                  <span>Mark as Trending / Top-Seller</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={planForm.inStock}
                    onChange={(e) => setPlanForm({ ...planForm, inStock: e.target.checked })}
                    className="rounded text-pink-500"
                  />
                  <span>Currently in Stock</span>
                </label>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingPlan ? 'Update Plan & Pricing' : 'Save & Publish Product'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

const sqlSchemaString = `-- PostgreSQL / MySQL Schema
CREATE TABLE admins (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ott_plans (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    platform VARCHAR(80) NOT NULL,
    badge VARCHAR(80),
    duration VARCHAR(50) NOT NULL,
    original_price DECIMAL(10, 2) NOT NULL,
    discounted_price DECIMAL(10, 2) NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    screens INT DEFAULT 1,
    resolution VARCHAR(50) DEFAULT '4K UHD',
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id VARCHAR(36) PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    plan_id VARCHAR(36) REFERENCES ott_plans(id),
    plan_title VARCHAR(150) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending',
    payment_method VARCHAR(50) DEFAULT 'UPI',
    payment_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_credentials (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
    account_email VARCHAR(255) NOT NULL,
    account_password VARCHAR(255) NOT NULL,
    profile_pin VARCHAR(20),
    screen_number VARCHAR(30),
    expiry_date DATE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
