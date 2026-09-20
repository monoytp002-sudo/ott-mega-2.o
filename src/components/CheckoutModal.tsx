import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Tv, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  QrCode, 
  Smartphone, 
  Zap,
  Info,
  ExternalLink,
  MessageCircle,
  Check
} from 'lucide-react';
import { OTTPlan, Order, PaymentSettings } from '../types.ts';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: OTTPlan | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  onOrderSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Dynamic Payment & WhatsApp Settings from backend
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    upiId: '8967624619@upi',
    payeeName: 'OTT Mega',
    upiQrImage: '',
    whatsappNumber: '8967624619',
    useCustomQr: false,
    notes: 'Scan & Pay via any UPI App (GPay, PhonePe, Paytm, BHIM) and confirm your order on WhatsApp.'
  });

  useEffect(() => {
    fetch('/api/settings/payment')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPaymentSettings(data.data);
        }
      })
      .catch((err) => console.warn('Could not load payment settings', err));
  }, []);

  if (!isOpen || !plan) {
    return null;
  }

  const sellerWhatsApp = paymentSettings.whatsappNumber || '8967624619';
  const cleanSellerWhatsApp = sellerWhatsApp.replace(/\D/g, '') || '8967624619';

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      setError('Please enter a valid WhatsApp mobile number');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name.trim(),
          customerEmail: email.trim().toLowerCase(),
          customerPhone: phone.trim(),
          planId: plan.id,
          duration: plan.duration,
          amount: plan.discountedPrice,
          paymentMethod: 'UPI / WhatsApp',
          paymentRef: paymentRef.trim() || `UPI-ORD-${Math.floor(10000000 + Math.random() * 90000000)}`
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setCreatedOrder(data.data);
        onOrderSuccess(data.data);
      } else {
        setError(data.error || 'There was an issue processing your order. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOrderNumber = () => {
    if (createdOrder) {
      navigator.clipboard.writeText(createdOrder.orderNumber);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(paymentSettings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Construct pre-filled WhatsApp message for redirect
  const getWhatsAppUrl = () => {
    if (!createdOrder) return `https://wa.me/91${cleanSellerWhatsApp}`;
    const text = 
      `Hello OTT Mega! 👋\n\n` +
      `I have placed a new OTT subscription order on the website:\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *Order ID:* ${createdOrder.orderNumber}\n` +
      `🎬 *Plan:* ${createdOrder.planTitle}\n` +
      `⏳ *Duration:* ${createdOrder.duration}\n` +
      `💰 *Amount:* ₹${createdOrder.amount}\n` +
      `👤 *Name:* ${createdOrder.customerName}\n` +
      `📱 *WhatsApp:* ${createdOrder.customerPhone}\n` +
      `✉️ *Email:* ${createdOrder.customerEmail}\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `Please activate my OTT subscription and share the login credentials. Thank you!`;

    return `https://wa.me/91${cleanSellerWhatsApp}?text=${encodeURIComponent(text)}`;
  };

  // QR Code URL logic - prioritize custom photo uploaded by admin
  const qrCodeUrl = paymentSettings.upiQrImage
    ? paymentSettings.upiQrImage
    : `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
        `upi://pay?pa=${paymentSettings.upiId || '8967624619@upi'}&pn=${paymentSettings.payeeName || 'OTTMega'}&am=${plan.discountedPrice}&cu=INR`
      )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-[#121217] border border-pink-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-pink-500/10 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!createdOrder ? (
          <div>
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Zap className="w-4 h-4 text-pink-400 fill-pink-400" />
                Instant Checkout
              </div>
              <h3 className="text-2xl font-bold text-white font-['Outfit']">
                Complete Your Subscription
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Fill in your details to book your order. Login credentials will be delivered directly to your WhatsApp.
              </p>
            </div>

            {/* Selected Plan Summary Card */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                  {plan.imageUrl ? (
                    <img src={plan.imageUrl} alt={plan.title} className="w-8 h-8 object-contain" />
                  ) : (
                    <Tv className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base line-clamp-1">{plan.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-pink-400 font-semibold">{plan.duration}</span>
                    <span>•</span>
                    <span>{plan.resolution}</span>
                    <span>•</span>
                    <span>{plan.screens} {plan.screens === 1 ? 'Screen' : 'Screens'}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-zinc-500 line-through">₹{plan.originalPrice}</div>
                <div className="text-xl font-black text-pink-400">₹{plan.discountedPrice}</div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Customer Information Form */}
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Full Name <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    WhatsApp Number <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 text-sm"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">Credentials will be delivered to this number</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Email Address <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 text-sm"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1">For order confirmation and receipt</p>
                </div>
              </div>

              {/* UPI QR & Payment Info Card */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-pink-500/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-bold text-white">Manual UPI Payment QR Code</span>
                  </div>
                  <span className="text-[10px] font-bold text-pink-300 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                    Pay ₹{plan.discountedPrice}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                  {/* UPI QR Code */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <img 
                      src={qrCodeUrl} 
                      alt="UPI QR Code" 
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* UPI ID details */}
                  <div className="text-xs text-zinc-400 space-y-2 text-center sm:text-left flex-1">
                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-1">Official UPI ID:</span>
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700">
                        <span className="font-mono text-pink-400 font-bold text-xs">{paymentSettings.upiId}</span>
                        <button
                          type="button"
                          onClick={handleCopyUpiId}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          title="Copy UPI ID"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      {copiedUpi && (
                        <span className="text-[10px] text-emerald-400 block mt-1">UPI ID Copied!</span>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400">
                      Scan with GPay, PhonePe, Paytm, or any UPI app to pay ₹{plan.discountedPrice}.
                    </p>
                  </div>
                </div>

                {/* Optional UTR Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-300 mb-1">
                    UPI UTR / Transaction ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="e.g. 408920194812 (Enter 12-digit UTR if already paid)"
                    className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-600 text-xs font-mono focus:border-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Book My Order (₹{plan.discountedPrice})</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Guaranteed OTT Activation & Support</span>
              </div>
            </form>
          </div>
        ) : (
          /* Order Confirmation Screen: Shows WhatsApp Number & Direct WhatsApp Redirect */
          <div className="text-center py-2 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center mx-auto shadow-lg shadow-pink-500/20">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white font-['Outfit']">
                Order Placed Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-md mx-auto">
                Click the WhatsApp button below to receive your activation credentials.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-pink-500/30 text-left max-w-md mx-auto space-y-2.5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs text-zinc-400">Order ID:</span>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-pink-400 font-mono">
                    {createdOrder.orderNumber}
                  </span>
                  <button
                    onClick={handleCopyOrderNumber}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Copy Order ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {copiedId && (
                <div className="text-[11px] text-emerald-400 text-right font-medium">
                  Order ID Copied!
                </div>
              )}

              <div className="text-xs space-y-1.5 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Plan:</span>
                  <span className="font-semibold">{createdOrder.planTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Validity:</span>
                  <span className="font-semibold">{createdOrder.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Amount:</span>
                  <span className="font-bold text-pink-400">₹{createdOrder.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Customer Name:</span>
                  <span className="font-semibold text-white">{createdOrder.customerName}</span>
                </div>
              </div>
            </div>

            {/* 🌟 WHATSAPP CONTACT & REDIRECT BOX */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/40 via-zinc-900/90 to-zinc-950 border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/10 text-center space-y-3 max-w-md mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Activation Support</span>
              </div>

              <div>
                <span className="text-xs text-zinc-300 block mb-1">
                  Contact to confirm order & get credentials:
                </span>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl sm:text-3xl font-black text-emerald-400 hover:text-emerald-300 tracking-wider font-mono inline-flex items-center gap-2 group transition-all"
                >
                  <span>{sellerWhatsApp}</span>
                  <ExternalLink className="w-5 h-5 opacity-70 group-hover:opacity-100" />
                </a>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Click the number to open direct chat with complete order details on WhatsApp.
                </p>
              </div>

              {/* Big Prominent WhatsApp Redirect Button */}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Send Order to WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  onOrderSuccess(createdOrder);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Track This Order</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold text-xs"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
