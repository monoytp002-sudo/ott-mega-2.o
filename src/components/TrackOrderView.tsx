import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Tv, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Copy, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ExternalLink, 
  MessageSquare, 
  RefreshCw,
  Sparkles,
  KeyRound,
  User,
  Calendar,
  Lock
} from 'lucide-react';
import { Order } from '../types.ts';

interface TrackOrderViewProps {
  initialOrderId?: string;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({ initialOrderId }) => {
  const [query, setQuery] = useState(initialOrderId || '');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  
  // Credentials interaction states
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-track if initialOrderId provided
  useEffect(() => {
    if (initialOrderId) {
      setQuery(initialOrderId);
      executeSearch(initialOrderId);
    }
  }, [initialOrderId]);

  const executeSearch = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setError('Please enter your Order ID, WhatsApp number, or Email');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (data.success && data.data && data.data.length > 0) {
        setOrders(data.data);
      } else {
        setOrders([]);
        setError(data.error || 'No orders found matching your search. Please verify your details.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to order server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const togglePasswordVisibility = (orderId: string) => {
    setShowPasswordMap((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const quickSearchDemo = (sampleId: string) => {
    setQuery(sampleId);
    executeSearch(sampleId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider">
          <KeyRound className="w-4 h-4" />
          <span>Real-Time Credential Delivery System</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
          Track Your Order & Credentials
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          Enter your Order ID (e.g. <span className="text-pink-400 font-mono">OTT-78210</span>) or your registered WhatsApp phone / email to view your status and retrieve your private streaming credentials.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121217] border border-pink-500/30 shadow-2xl shadow-pink-500/5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="track-order-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. OTT-78210) or WhatsApp / Email..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            id="track-order-submit-btn"
            disabled={loading}
            className="py-3.5 px-8 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Track Order</span>
          </button>
        </form>

        {/* Quick Demo Test Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span className="font-semibold text-zinc-500">Quick Test Samples:</span>
          <button
            type="button"
            onClick={() => quickSearchDemo('OTT-78210')}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-pink-500/50 text-pink-400 hover:text-white font-mono transition-colors"
          >
            OTT-78210 (Completed with Credentials)
          </button>
          <button
            type="button"
            onClick={() => quickSearchDemo('OTT-89341')}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-pink-500/50 text-amber-400 hover:text-white font-mono transition-colors"
          >
            OTT-89341 (Pending Verification)
          </button>
        </div>
      </div>

      {/* Error / Not Found Display */}
      {error && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <h4 className="font-bold text-white mb-1">Order Not Found</h4>
            <p className="text-zinc-400">{error}</p>
            <p className="text-zinc-500 mt-2 text-xs">
              Tip: Double check for typos. If you just paid via UPI, please allow 5-10 minutes for your order verification or reach out to WhatsApp support.
            </p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {searched && orders.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Found {orders.length} Order{orders.length > 1 ? 's' : ''}
            </h3>
            <button
              onClick={() => executeSearch(query)}
              className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1.5 font-semibold"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Status</span>
            </button>
          </div>

          {orders.map((order) => {
            const isCompleted = order.status === 'Completed';
            const isPending = order.status === 'Pending';
            const isFailed = order.status === 'Failed';
            const isPasswordVisible = showPasswordMap[order.id];

            return (
              <div
                key={order.id}
                className="rounded-2xl bg-[#111116] border border-zinc-800 overflow-hidden shadow-xl"
              >
                {/* Order Top Bar */}
                <div className="p-6 bg-zinc-950 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white font-mono">
                          {order.orderNumber}
                        </span>
                        <button
                          onClick={() => copyToClipboard(order.orderNumber, `id-${order.id}`)}
                          className="text-zinc-500 hover:text-white transition-colors"
                          title="Copy Order Number"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {order.planTitle} • <span className="text-pink-400">{order.duration}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    {isCompleted && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Credentials Ready
                      </span>
                    )}
                    {isPending && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 animate-spin" />
                        Processing Credentials
                      </span>
                    )}
                    {isFailed && (
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" />
                        Order Failed
                      </span>
                    )}

                    <div className="text-right pl-3 border-l border-zinc-800">
                      <span className="text-xs text-zinc-500">Amount Paid</span>
                      <div className="text-sm font-black text-white">₹{order.amount}</div>
                    </div>
                  </div>
                </div>

                {/* Progress Steps Visualizer */}
                <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/30">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="space-y-1.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-black font-black flex items-center justify-center mx-auto text-xs">
                        ✓
                      </div>
                      <div className="font-bold text-white text-[11px]">Order Placed</div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-black font-black flex items-center justify-center mx-auto text-xs">
                        ✓
                      </div>
                      <div className="font-bold text-white text-[11px]">Payment Received</div>
                    </div>

                    <div className="space-y-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black ${
                        isCompleted 
                          ? 'bg-emerald-500 text-black' 
                          : isPending 
                            ? 'bg-amber-500 text-black animate-pulse' 
                            : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {isCompleted ? '✓' : '3'}
                      </div>
                      <div className="font-bold text-zinc-300 text-[11px]">Profile Setup</div>
                    </div>

                    <div className="space-y-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-black ${
                        isCompleted 
                          ? 'bg-pink-500 text-white shadow-md shadow-pink-500/50' 
                          : 'bg-zinc-800 text-zinc-500'
                      }`}>
                        {isCompleted ? '★' : '4'}
                      </div>
                      <div className="font-bold text-zinc-300 text-[11px]">Ready to Stream</div>
                    </div>
                  </div>
                </div>

                {/* Order Details Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* If Credentials are Available */}
                  {isCompleted && order.credentials ? (
                    <div className="rounded-2xl bg-zinc-900 border border-pink-500/40 p-6 space-y-6 shadow-inner">
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-pink-400 font-bold text-xs uppercase tracking-wider">
                          <Sparkles className="w-4 h-4" />
                          <span>Your Verified Streaming Credentials</span>
                        </div>
                        <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          Active & Guaranteed
                        </span>
                      </div>

                      {/* Credential Data Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Login Email / ID */}
                        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase">Login Email / Username</span>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-mono font-bold text-white break-all select-all">
                              {order.credentials.email}
                            </span>
                            <button
                              onClick={() => copyToClipboard(order.credentials?.email || '', `email-${order.id}`)}
                              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white shrink-0 transition-colors"
                              title="Copy Email"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          {copiedKey === `email-${order.id}` && (
                            <span className="text-[10px] text-emerald-400 font-semibold">Copied email!</span>
                          )}
                        </div>

                        {/* Password */}
                        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase">Password</span>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-mono font-bold text-pink-400 break-all">
                              {isPasswordVisible ? order.credentials.password : '••••••••••••'}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => togglePasswordVisibility(order.id)}
                                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
                              >
                                {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => copyToClipboard(order.credentials?.password || '', `pwd-${order.id}`)}
                                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                title="Copy Password"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {copiedKey === `pwd-${order.id}` && (
                            <span className="text-[10px] text-emerald-400 font-semibold">Copied password!</span>
                          )}
                        </div>

                        {/* Screen / Profile Name */}
                        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase">Assigned Screen Profile</span>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-white">
                              {order.credentials.screenNumber || 'Screen 1 (Private)'}
                            </span>
                            <User className="w-4 h-4 text-zinc-500" />
                          </div>
                        </div>

                        {/* Profile PIN & Expiry */}
                        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase">Profile PIN Lock</span>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-mono font-black text-emerald-400">
                              {order.credentials.profilePin || 'No PIN Required'}
                            </span>
                            <Lock className="w-4 h-4 text-zinc-500" />
                          </div>
                        </div>

                      </div>

                      {/* Expiry and Notes */}
                      {order.credentials.notes && (
                        <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300">
                          <span className="font-bold text-pink-400">Important Instruction: </span>
                          <span>{order.credentials.notes}</span>
                        </div>
                      )}

                      {/* Quick Rules Banner */}
                      <div className="p-3 bg-pink-500/5 rounded-xl border border-pink-500/20 text-[11px] text-zinc-400 space-y-1">
                        <p className="text-white font-semibold">Rules for warranty protection:</p>
                        <ul className="list-disc list-inside space-y-0.5">
                          <li>Do not modify account email or master password.</li>
                          <li>Stream only on your designated screen profile name.</li>
                          <li>100% Replacement warranty is valid throughout your entire subscription period.</li>
                        </ul>
                      </div>

                    </div>
                  ) : isPending ? (
                    /* Pending Message Box */
                    <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/30 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                        <Clock className="w-6 h-6 animate-spin" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">Credentials Being Generated</h4>
                        <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                          Your order has been verified. Our staff is currently configuring your private profile and PIN. Expected delivery within 5-15 minutes.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => executeSearch(query)}
                          className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold flex items-center gap-2"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Check Again
                        </button>
                        <a
                          href={`https://wa.me/918967624619?text=Hello%20OTT%20Mega%202.0!%20My%20Order%20ID%20is%20${order.orderNumber}.%20Can%20you%20please%20check%20my%20credential%20status?`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Expedite on WhatsApp
                        </a>
                      </div>
                    </div>
                  ) : null}

                  {/* Customer Information Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                    <div>
                      <span className="text-zinc-500 block">Customer:</span>
                      <span className="text-white font-semibold">{order.customerName}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">WhatsApp:</span>
                      <span className="text-white font-semibold">{order.customerPhone}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Ordered On:</span>
                      <span className="text-white font-semibold">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Payment Ref:</span>
                      <span className="font-mono text-zinc-300">{order.paymentRef || 'Verified'}</span>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* WhatsApp Help Footer Card */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Need help with your subscription?</h4>
            <p className="text-xs text-zinc-400">Our support engineers are active on WhatsApp 24/7 for instant assistance.</p>
          </div>
        </div>

        <a
          href="https://wa.me/918967624619?text=Hello%20OTT%20Mega%202.0%20Support!%20I%20need%20help%20tracking%20my%20order."
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shrink-0 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Open WhatsApp Support</span>
        </a>
      </div>

    </div>
  );
};
