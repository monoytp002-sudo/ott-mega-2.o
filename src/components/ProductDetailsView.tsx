import React, { useState, useEffect, useMemo } from 'react';
import { 
  Tv, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Zap, 
  Monitor, 
  Sparkles, 
  Clock, 
  Headphones, 
  RefreshCw, 
  Share2, 
  CheckCircle2, 
  Lock,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';
import { OTTPlan, PlanDurationOption } from '../types.ts';

interface ProductDetailsViewProps {
  slug: string;
  plans: OTTPlan[];
  onBackToPlans: () => void;
  onSelectPlanForBuy: (plan: OTTPlan, selectedDuration?: string, selectedPrice?: number) => void;
  onAddToCart: (plan: OTTPlan, selectedDuration?: string, selectedPrice?: number) => void;
  onSelectOtherProduct: (slug: string) => void;
}

export const ProductDetailsView: React.FC<ProductDetailsViewProps> = ({
  slug,
  plans,
  onBackToPlans,
  onSelectPlanForBuy,
  onAddToCart,
  onSelectOtherProduct,
}) => {
  // Find product by slug or id or generate match
  const product = useMemo(() => {
    return plans.find(
      (p) => 
        p.slug === slug || 
        p.id === slug ||
        p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') === slug
    ) || plans[0] || null;
  }, [slug, plans]);

  // Duration options fallback
  const durationOptions: PlanDurationOption[] = useMemo(() => {
    if (!product) return [];
    if (product.durationOptions && product.durationOptions.length > 0) {
      return product.durationOptions;
    }
    return [
      {
        duration: product.duration || '1 Month',
        originalPrice: product.originalPrice || 299,
        discountedPrice: product.discountedPrice || 99,
        badge: product.badge || 'Popular'
      }
    ];
  }, [product]);

  const [selectedDurationIndex, setSelectedDurationIndex] = useState<number>(0);
  const [copiedLinkToast, setCopiedLinkToast] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  // Reset selected duration index when slug/product changes
  useEffect(() => {
    setSelectedDurationIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-zinc-400">The OTT subscription you are looking for does not exist or has been removed.</p>
        <button
          onClick={onBackToPlans}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Plans</span>
        </button>
      </div>
    );
  }

  const currentOption = durationOptions[selectedDurationIndex] || durationOptions[0];
  const currentDiscountPercent = Math.round(
    ((currentOption.originalPrice - currentOption.discountedPrice) / currentOption.originalPrice) * 100
  );

  // Related products
  const relatedProducts = plans
    .filter((p) => p.id !== product.id && p.slug !== product.slug)
    .slice(0, 3);

  const handleCopyShare = () => {
    const shareUrl = `${window.location.origin}/product/${product.slug || product.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLinkToast(true);
    setTimeout(() => setCopiedLinkToast(false), 2500);
  };

  const handleBuyNow = () => {
    onSelectPlanForBuy(
      {
        ...product,
        duration: currentOption.duration,
        originalPrice: currentOption.originalPrice,
        discountedPrice: currentOption.discountedPrice
      },
      currentOption.duration,
      currentOption.discountedPrice
    );
  };

  const handleAddToCartClick = () => {
    onAddToCart(
      {
        ...product,
        duration: currentOption.duration,
        originalPrice: currentOption.originalPrice,
        discountedPrice: currentOption.discountedPrice
      },
      currentOption.duration,
      currentOption.discountedPrice
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 bg-[#09090b] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Back navigation & Share bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToPlans}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121217] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-pink-400" />
            <span>Back to All Plans</span>
          </button>

          <div className="flex items-center gap-3">
            {copiedLinkToast && (
              <span className="text-xs text-pink-400 font-bold animate-fade-in">
                Link copied to clipboard!
              </span>
            )}
            <button
              onClick={handleCopyShare}
              title="Share this plan"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#121217] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-xs font-semibold"
            >
              <Share2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Share Plan</span>
            </button>
          </div>
        </div>

        {/* Floating Added to Cart Alert */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#14141c] border border-pink-500 text-white px-5 py-3 rounded-xl shadow-2xl shadow-pink-500/30 flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" />
            <span className="text-xs font-bold">
              Added <span className="text-pink-400">{product.title} ({currentOption.duration})</span> to cart!
            </span>
          </div>
        )}

        {/* Main Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Visual Showcase & Specifications (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Main Product Hero Card with Glowing Backdrop */}
            <div className="relative rounded-3xl bg-gradient-to-b from-[#181822] to-[#101016] border border-pink-500/30 p-6 sm:p-10 overflow-hidden shadow-2xl shadow-pink-500/10">
              
              {/* Glowing decorative backdrop circles */}
              <div 
                className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none"
                style={{ backgroundColor: product.iconColor || '#ec4899' }}
              />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Badges & Stock Status */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-pink-500 text-white text-[11px] font-black uppercase tracking-wider shadow-md shadow-pink-500/30">
                    {product.platform}
                  </span>
                  {product.badge && (
                    <span className="px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-pink-300 text-[11px] font-bold uppercase">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-400">
                    {product.inStock ? 'Instant Auto-Delivery Active' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Product Logo / Header Image */}
              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 mb-6">
                {product.imageUrl ? (
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-zinc-900 border-2 border-pink-500/40 p-3 shrink-0 flex items-center justify-center shadow-xl shadow-pink-500/20 overflow-hidden group">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
                      onError={(e) => {
                        // Fallback if image fails
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-pink-500/20 to-zinc-900 border-2 border-pink-500/40 flex items-center justify-center shrink-0 shadow-xl shadow-pink-500/20">
                    <Tv className="w-14 h-14 text-pink-400" />
                  </div>
                )}

                <div className="text-center sm:text-left space-y-2">
                  <h1 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] tracking-tight">
                    {product.title}
                  </h1>
                  <p className="text-sm text-zinc-300 leading-relaxed max-w-xl">
                    {product.description || `Official premium subscription with private credentials, 4K HDR streaming, and full replacement guarantee.`}
                  </p>
                </div>
              </div>

              {/* Quick Tech Specs Bar */}
              <div className="relative z-10 grid grid-cols-3 gap-3 p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 text-center">
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Resolution</div>
                  <div className="text-sm font-black text-white mt-0.5">{product.resolution || '4K UHD'}</div>
                </div>
                <div className="border-x border-zinc-800">
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Allowed Screens</div>
                  <div className="text-sm font-black text-white mt-0.5">{product.screens} {product.screens === 1 ? 'Private Screen' : 'Screens'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Device Support</div>
                  <div className="text-sm font-black text-white mt-0.5 truncate">{product.deviceSupport || 'TV, Mobile, PC'}</div>
                </div>
              </div>

            </div>

            {/* Features & What You Get */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121217] border border-zinc-800 space-y-4">
              <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Everything Included in this Subscription</span>
              </div>
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Key Features & Security Benefits
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {product.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800/60"
                  >
                    <div className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-200 leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust & Guarantee Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#121217] border border-zinc-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Replacement Warranty</h4>
                  <p className="text-[11px] text-zinc-400">100% replacement in case of issues</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121217] border border-zinc-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Instant Activation</h4>
                  <p className="text-[11px] text-zinc-400">Direct WhatsApp & Track Order sync</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121217] border border-zinc-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">24/7 VIP Support</h4>
                  <p className="text-[11px] text-zinc-400">Dedicated assistance anytime</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Pricing & Duration Selector (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="sticky top-24 rounded-3xl bg-[#121217] border-2 border-pink-500/30 p-6 sm:p-8 space-y-6 shadow-2xl shadow-pink-500/10">
              
              {/* Header */}
              <div className="border-b border-zinc-800 pb-4">
                <div className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-1">
                  Select Subscription Validity
                </div>
                <h2 className="text-2xl font-black text-white font-['Outfit']">
                  Choose Your Plan Duration
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Pick from flexible validity tiers. Higher duration gives you greater savings!
                </p>
              </div>

              {/* Dynamic Duration Selector Cards / Radio Pills */}
              <div className="space-y-3">
                {durationOptions.map((option, index) => {
                  const isSelected = selectedDurationIndex === index;
                  const discount = Math.round(
                    ((option.originalPrice - option.discountedPrice) / option.originalPrice) * 100
                  );

                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedDurationIndex(index)}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-pink-500/10 border-pink-500 shadow-lg shadow-pink-500/20'
                          : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                      }`}
                    >
                      {/* Badge if available */}
                      {option.badge && (
                        <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow">
                          {option.badge}
                        </span>
                      )}

                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected ? 'border-pink-500 bg-pink-500' : 'border-zinc-600 bg-zinc-800'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="text-sm font-black text-white">{option.duration}</div>
                          <div className="text-[11px] text-zinc-400">
                            {option.duration === '1 Year' ? '12 Full Months Access' : `${option.duration} uninterrupted`}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-white">
                          ₹{option.discountedPrice}
                        </div>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-xs text-zinc-500 line-through">₹{option.originalPrice}</span>
                          <span className="text-[10px] font-extrabold text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded">
                            {discount}% OFF
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Price Summary Box */}
              <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Selected Duration</span>
                  <span className="font-bold text-white">{currentOption.duration}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Standard Retail Price</span>
                  <span className="line-through text-zinc-500">₹{currentOption.originalPrice}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Instant Festival Discount</span>
                  <span className="text-emerald-400 font-bold">
                    -₹{currentOption.originalPrice - currentOption.discountedPrice} ({currentDiscountPercent}% OFF)
                  </span>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-baseline justify-between">
                  <div>
                    <div className="text-xs font-semibold text-zinc-400">Total Payable Amount</div>
                    <div className="text-[10px] text-zinc-500">Inclusive of all taxes & warranty</div>
                  </div>
                  <div className="text-3xl font-black text-pink-400 font-['Outfit']">
                    ₹{currentOption.discountedPrice}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Buy Now & Add to Cart */}
              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:to-rose-700 text-white font-black text-sm tracking-wide shadow-xl shadow-pink-500/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Buy Now for ₹{currentOption.discountedPrice}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleAddToCartClick}
                  className="w-full py-3.5 px-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-pink-400" />
                  <span>Add to Cart ({currentOption.duration})</span>
                </button>
              </div>

              {/* Security badge note */}
              <div className="text-center pt-2 text-[11px] text-zinc-500 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Encrypted 256-bit Secure Razorpay Checkout</span>
              </div>

            </div>

          </div>

        </div>

        {/* Related / Other Popular Plans Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-zinc-800/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white font-['Outfit']">
                  Other Popular OTT Subscriptions
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Explore other trending streaming packages loved by our customers
                </p>
              </div>
              <button
                onClick={onBackToPlans}
                className="text-xs font-bold text-pink-400 hover:text-pink-300 underline"
              >
                View All Plans
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => {
                const startPrice = rel.durationOptions && rel.durationOptions.length > 0
                  ? Math.min(...rel.durationOptions.map(o => o.discountedPrice))
                  : rel.discountedPrice;

                return (
                  <div
                    key={rel.id}
                    onClick={() => onSelectOtherProduct(rel.slug || rel.id)}
                    className="p-5 rounded-2xl bg-[#121217] border border-zinc-800 hover:border-pink-500/50 transition-all cursor-pointer group hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-black text-pink-400 uppercase tracking-wider">
                          {rel.platform}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-bold">
                          {rel.resolution}
                        </span>
                      </div>

                      {/* Enlarged prominent product image box */}
                      <div className="w-full h-28 sm:h-32 rounded-xl bg-zinc-900/90 border border-zinc-800 group-hover:border-pink-500/40 p-3 flex items-center justify-center mb-3 relative overflow-hidden">
                        {rel.imageUrl ? (
                          <img
                            src={rel.imageUrl}
                            alt={rel.title}
                            className="w-full h-full object-contain max-h-24 transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                            <Tv className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      <h4 className="font-bold text-white text-sm group-hover:text-pink-400 transition-colors mb-1 line-clamp-1">
                        {rel.title}
                      </h4>
                      <div className="text-[11px] text-zinc-500 mb-3">
                        Starting from <span className="text-white font-bold">₹{startPrice}</span>
                      </div>
                    </div>

                    <button className="w-full py-2 rounded-xl bg-zinc-900 group-hover:bg-pink-500 text-zinc-300 group-hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 mt-2">
                      <span>View Duration Options</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
