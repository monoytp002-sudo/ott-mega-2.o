import React, { useState, useMemo } from 'react';
import { 
  Tv, 
  Search, 
  Filter, 
  Check, 
  ArrowRight, 
  Monitor, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Flame,
  CheckCircle2
} from 'lucide-react';
import { OTTPlan, OTTPlatform, PlanDuration } from '../types.ts';

interface PlansViewProps {
  plans: OTTPlan[];
  onSelectPlan: (plan: OTTPlan) => void;
  onAddToCart: (plan: OTTPlan) => void;
  onNavigateToProduct?: (slug: string) => void;
}

export const PlansView: React.FC<PlansViewProps> = ({
  plans,
  onSelectPlan,
  onAddToCart,
  onNavigateToProduct,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedAlert, setAddedAlert] = useState<string | null>(null);

  const platformTabs = [
    'All',
    'Netflix',
    'Amazon Prime',
    'Disney+ Hotstar',
    'SonyLIV',
    'Zee5',
    'JioCinema',
    'Crunchyroll',
    'YouTube Premium',
    'Combo Pack',
  ];

  const durationTabs = ['All', '1 Month', '3 Months', '1 Year'];

  // Filter plans based on platform, duration, and search
  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const matchPlatform =
        selectedPlatform === 'All' || plan.platform === selectedPlatform;
      const matchDuration =
        selectedDuration === 'All' || plan.duration === selectedDuration;
      const matchSearch =
        searchQuery === '' ||
        plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchPlatform && matchDuration && matchSearch;
    });
  }, [plans, selectedPlatform, selectedDuration, searchQuery]);

  const handleAddToCartWithToast = (plan: OTTPlan) => {
    onAddToCart(plan);
    setAddedAlert(plan.title);
    setTimeout(() => setAddedAlert(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title & Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Pricing & Instant Activation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">
          OTT Subscription Packages
        </h1>
        <p className="text-sm sm:text-base text-zinc-400">
          Select single OTT platforms or bundle them together with our all-in-one combo packs. All plans include 100% replacement warranty and private screen PINs.
        </p>
      </div>

      {/* Floating Add to Cart Toast */}
      {addedAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14141c] border border-pink-500 text-white px-5 py-3 rounded-xl shadow-2xl shadow-pink-500/30 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" />
          <span className="text-xs font-bold">Added <span className="text-pink-400 font-extrabold">{addedAlert}</span> to your cart!</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#121217] border border-zinc-800 p-4 sm:p-6 rounded-2xl space-y-4">
        
        {/* Search & Duration row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Netflix, Prime, 4K, 1 Year..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          {/* Duration Selector */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
              Duration:
            </span>
            {durationTabs.map((dur) => (
              <button
                key={dur}
                onClick={() => setSelectedDuration(dur)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedDuration === dur
                    ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {dur}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Tabs row */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {platformTabs.map((platform) => {
            const isSelected = selectedPlatform === platform;
            return (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-black font-extrabold shadow-md'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {platform === 'Combo Pack' && <Flame className="w-3.5 h-3.5 text-pink-500" />}
                <span>{platform}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Results Count & Quick Help */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>Showing <strong className="text-white">{filteredPlans.length}</strong> subscription plans</span>
        <span className="flex items-center gap-1.5 text-pink-400 font-semibold">
          <Zap className="w-3.5 h-3.5" />
          Credentials Delivered in 5-15 Mins
        </span>
      </div>

      {/* Pricing Tables / Cards Grid */}
      {filteredPlans.length === 0 ? (
        <div className="text-center py-16 bg-[#111116] rounded-2xl border border-zinc-800 space-y-3">
          <Tv className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No subscription plans found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try resetting your platform or duration filters to see all available subscriptions.
          </p>
          <button
            onClick={() => {
              setSelectedPlatform('All');
              setSelectedDuration('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-pink-500 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => {
            // Determine starting from price from durationOptions or discountedPrice
            const hasOptions = Array.isArray(plan.durationOptions) && plan.durationOptions.length > 0;
            const startPrice = hasOptions
              ? Math.min(...plan.durationOptions!.map(o => o.discountedPrice))
              : plan.discountedPrice;
            const maxRetailPrice = hasOptions
              ? Math.max(...plan.durationOptions!.map(o => o.originalPrice))
              : plan.originalPrice;
            const discountPercent = Math.round(
              ((maxRetailPrice - startPrice) / maxRetailPrice) * 100
            );

            const productSlug = plan.slug || plan.id;

            return (
              <div
                key={plan.id}
                className="group relative rounded-2xl bg-[#111116] border border-zinc-800 hover:border-pink-500/50 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10 hover:-translate-y-1"
              >
                {/* Badge if present */}
                {plan.badge && (
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-extrabold uppercase tracking-wide shadow-md shadow-pink-500/30">
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Platform & Duration Header */}
                  <div className="flex items-center justify-between mb-3 pt-1">
                    <span className="text-xs font-black text-pink-400 tracking-wider uppercase">
                      {plan.platform}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {hasOptions ? `${plan.durationOptions!.length} Duration Options` : plan.duration}
                    </span>
                  </div>

                  {/* Enlarged Prominent Product Image Box */}
                  <div 
                    onClick={() => onNavigateToProduct && onNavigateToProduct(productSlug)}
                    className="w-full h-36 sm:h-40 rounded-xl bg-gradient-to-b from-zinc-900/95 to-zinc-950/95 border border-zinc-800/90 group-hover:border-pink-500/50 p-4 flex items-center justify-center relative overflow-hidden transition-all duration-300 cursor-pointer mb-3.5 group/img shadow-inner"
                  >
                    <div className="absolute inset-0 bg-radial-gradient from-white/[0.03] to-transparent pointer-events-none" />
                    {plan.imageUrl ? (
                      <img 
                        src={plan.imageUrl} 
                        alt={plan.title}
                        className="w-full h-full max-h-28 sm:max-h-32 object-contain transition-transform duration-300 group-hover/img:scale-105 drop-shadow-md"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-zinc-500 gap-1.5">
                        <Tv className="w-10 h-10 text-pink-400/80" />
                        <span className="text-xs font-semibold text-zinc-400">{plan.platform}</span>
                      </div>
                    )}
                  </div>

                  {/* Title Section (Clickable) */}
                  <div 
                    onClick={() => onNavigateToProduct && onNavigateToProduct(productSlug)}
                    className="mb-2 cursor-pointer group/title"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover/title:text-pink-400 transition-colors font-['Outfit'] leading-snug line-clamp-1">
                        {plan.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-pink-400/90 font-semibold shrink-0">
                        <span>Plans</span>
                        <ArrowRight className="w-3 h-3 group-hover/title:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 mb-3.5">
                    {plan.description}
                  </p>

                  {/* Price Box with "Starting from ₹X" */}
                  <div 
                    onClick={() => onNavigateToProduct && onNavigateToProduct(productSlug)}
                    className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800/80 hover:border-pink-500/30 mb-5 cursor-pointer transition-colors"
                  >
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                      Starting From
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white font-['Outfit']">
                        ₹{startPrice}
                      </span>
                      <span className="text-sm text-zinc-500 line-through">
                        ₹{maxRetailPrice}
                      </span>
                      <span className="text-xs font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded">
                        UP TO {discountPercent}% OFF
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2.5 pt-2 border-t border-zinc-800">
                      <span className="flex items-center gap-1 text-zinc-300 font-medium">
                        <Monitor className="w-3.5 h-3.5 text-pink-400" />
                        {plan.resolution}
                      </span>
                      <span>•</span>
                      <span className="text-zinc-300 font-medium">
                        {plan.screens} {plan.screens === 1 ? 'Private Screen' : 'Screens'}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mb-6">
                    <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                      Included with this package:
                    </div>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {plan.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                {/* Card Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                  <button
                    onClick={() => onNavigateToProduct ? onNavigateToProduct(productSlug) : onSelectPlan(plan)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                  >
                    <span>View Details & Duration Options</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectPlan(plan)}
                      className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Quick Buy</span>
                    </button>
                    <button
                      onClick={() => handleAddToCartWithToast(plan)}
                      className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      )}

      {/* Bottom Guarantee Banner */}
      <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Need a Custom Bundle or Bulk Order?</h4>
            <p>We provide tailor-made OTT packs for hostels, families, and businesses at even deeper discounts.</p>
          </div>
        </div>

        <a
          href="https://wa.me/918967624619?text=Hello%20OTT%20Mega%202.0!%20I%20want%20to%20inquire%20about%20a%20custom%20bundle."
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-pink-500/30 text-pink-400 hover:bg-pink-500/10 font-bold shrink-0 transition-colors"
        >
          Request Custom Bundle
        </a>
      </div>

    </div>
  );
};
