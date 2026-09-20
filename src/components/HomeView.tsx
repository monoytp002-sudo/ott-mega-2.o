import React from 'react';
import { 
  Tv, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Headphones, 
  Lock, 
  CreditCard, 
  ArrowRight, 
  Check, 
  Star, 
  TrendingUp, 
  Flame, 
  Search, 
  Play,
  Monitor,
  Users
} from 'lucide-react';
import { OTTPlan } from '../types.ts';
import { CherryBlossomEffect } from './CherryBlossomEffect.tsx';
import { ThunderEffect } from './ThunderEffect.tsx';
import { HeroAppsAnimation } from './HeroAppsAnimation.tsx';

interface HomeViewProps {
  plans: OTTPlan[];
  onSelectPlan: (plan: OTTPlan) => void;
  onAddToCart: (plan: OTTPlan) => void;
  setCurrentPage: (page: string) => void;
  onNavigateToProduct?: (slug: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  plans,
  onSelectPlan,
  onAddToCart,
  setCurrentPage,
  onNavigateToProduct,
}) => {
  // Platforms for the dynamic marquee
  const platforms = [
    { name: 'Netflix', color: '#E50914', tag: '4K UHD', iconBg: 'bg-red-950/40 text-red-500 border-red-500/30' },
    { name: 'Amazon Prime', color: '#00A8E1', tag: 'Ad-Free', iconBg: 'bg-sky-950/40 text-sky-400 border-sky-500/30' },
    { name: 'Disney+ Hotstar', color: '#113CCF', tag: 'Cricket & 4K', iconBg: 'bg-blue-950/40 text-blue-400 border-blue-500/30' },
    { name: 'SonyLIV', color: '#FFFFFF', tag: 'Live Sports', iconBg: 'bg-zinc-900 text-white border-zinc-700' },
    { name: 'Zee5', color: '#800080', tag: 'Regional VIP', iconBg: 'bg-purple-950/40 text-purple-400 border-purple-500/30' },
    { name: 'JioCinema', color: '#E11D48', tag: 'HBO & 4K', iconBg: 'bg-rose-950/40 text-rose-400 border-rose-500/30' },
    { name: 'Crunchyroll', color: '#F47521', tag: 'Mega Fan Anime', iconBg: 'bg-orange-950/40 text-orange-400 border-orange-500/30' },
    { name: 'Apple TV+', color: '#A3A3A3', tag: '4K HDR Cinema', iconBg: 'bg-zinc-900 text-zinc-300 border-zinc-700' },
    { name: 'YouTube Premium', color: '#FF0000', tag: 'No Ads + Music', iconBg: 'bg-red-950/40 text-red-400 border-red-500/30' },
  ];

  // Top selling plans
  const topSellingPlans = plans.filter(p => p.isPopular).slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      
      {/* Background Weather & Atmospheric Effects */}
      <CherryBlossomEffect />
      <ThunderEffect />

      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-10 overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-pink-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-rose-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-5">
              
              {/* Top pill badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold shadow-sm shadow-pink-500/20">
                <Flame className="w-3.5 h-3.5 text-pink-500 animate-bounce" />
                <span>25,000+ ACTIVE SUBSCRIBERS</span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                <span className="text-white font-medium">99.8% Uptime</span>
              </div>

              {/* Main Headline - Shortened & Reduced Size as requested */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight font-['Outfit']">
                Buy <span className="text-pink-500 underline decoration-pink-500/40 underline-offset-4">OTT Subscription</span> Now
              </h1>

              {/* Subheading - Shortened in text and smaller size as requested */}
              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto lg:mx-0 font-normal leading-relaxed">
                Get genuine 4K streaming accounts for Netflix, Prime, Hotstar & more at up to 80% off. Instant WhatsApp delivery.
              </p>

              {/* Action Button - Track Order button removed as requested */}
              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  id="hero-explore-plans-btn"
                  onClick={() => setCurrentPage('plans')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Tv className="w-4 h-4" />
                  <span>Explore All Plans</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Highlights */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-[11px] text-zinc-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-pink-400" />
                  <span>5-15 Min Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                  <span>Replacement Warranty</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-pink-400" />
                  <span>PIN Protected</span>
                </div>
              </div>

            </div>

            {/* Right Column: Animated OTT Apps Showcase on the side as requested */}
            <div className="lg:col-span-6 flex justify-center">
              <HeroAppsAnimation onExplorePlans={() => setCurrentPage('plans')} />
            </div>

          </div>
        </div>
      </section>

      {/* 2. DYNAMIC MARQUEE TICKER OF POPULAR OTT PLATFORMS */}
      <section className="relative overflow-hidden py-4 border-y border-zinc-800/80 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Supported OTT Platforms Available Now</span>
          </div>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">Hover to pause</span>
        </div>

        {/* Dynamic Infinite Animated Marquee */}
        <div className="flex overflow-hidden select-none">
          <div className="animate-marquee flex items-center gap-4">
            {[...platforms, ...platforms].map((plat, idx) => (
              <div
                key={`${plat.name}-${idx}`}
                onClick={() => setCurrentPage('plans')}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border bg-zinc-900/90 hover:border-pink-500 cursor-pointer transition-all hover:scale-105 shrink-0 ${plat.iconBg}`}
              >
                <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center font-bold text-sm">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{plat.name}</div>
                  <div className="text-[10px] text-zinc-400 font-semibold">{plat.tag}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TOP SELLING PLANS OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-pink-400" />
              <span>Trending Today</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
              Top-Selling Subscriptions
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Our most popular packages with guaranteed lowest price & instant access.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('plans')}
            className="self-start sm:self-auto flex items-center gap-2 text-sm font-bold text-pink-400 hover:text-pink-300 group"
          >
            <span>View All {plans.length} Plans</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topSellingPlans.map((plan) => {
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
                className="group relative rounded-2xl bg-[#111116] border border-zinc-800 hover:border-pink-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 hover:-translate-y-1"
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[11px] font-extrabold tracking-wide uppercase shadow-md shadow-pink-500/30">
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Platform & Duration */}
                  <div className="flex items-center justify-between mb-3 pt-1">
                    <span className="text-xs font-black text-pink-400 tracking-wider uppercase">
                      {plan.platform}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      {hasOptions ? `${plan.durationOptions!.length} Options` : plan.duration}
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
                        <span className="text-[11px] font-semibold text-zinc-400">{plan.platform}</span>
                      </div>
                    )}
                  </div>

                  {/* Plan Title */}
                  <div 
                    onClick={() => onNavigateToProduct && onNavigateToProduct(productSlug)}
                    className="mb-3 cursor-pointer group/cardtitle"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover/cardtitle:text-pink-400 transition-colors font-['Outfit'] leading-snug line-clamp-1">
                      {plan.title}
                    </h3>
                  </div>

                  {/* Pricing */}
                  <div 
                    onClick={() => onNavigateToProduct && onNavigateToProduct(productSlug)}
                    className="mb-4 pb-4 border-b border-zinc-800/80 cursor-pointer"
                  >
                    <div className="text-[10px] uppercase font-semibold text-zinc-400 mb-0.5">Starting From</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white font-['Outfit']">
                        ₹{startPrice}
                      </span>
                      <span className="text-xs text-zinc-500 line-through">
                        ₹{maxRetailPrice}
                      </span>
                      <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded">
                        {discountPercent}% OFF
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Monitor className="w-3.5 h-3.5 text-zinc-500" />
                        {plan.resolution}
                      </span>
                      <span>•</span>
                      <span>{plan.screens} {plan.screens === 1 ? 'Screen' : 'Screens'}</span>
                    </div>
                  </div>

                  {/* Feature Highlights */}
                  <ul className="space-y-2 mb-6 text-xs text-zinc-300">
                    {plan.features.slice(0, 2).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => onNavigateToProduct ? onNavigateToProduct(productSlug) : onSelectPlan(plan)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-pink-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Plan Options</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onAddToCart(plan)}
                    className="w-full py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 font-semibold text-xs transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WHY CHOOSE US SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#14141c] to-[#0d0d12] border border-pink-500/20 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4" />
              The OTT Mega 2.0 Advantage
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-['Outfit']">
              Why Choose OTT Mega 2.0?
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2">
              We provide the most reliable, cost-effective digital streaming subscription experience with zero hassle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-pink-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Credential Delivery</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Receive your account email, password, and personal screen PIN within 5-15 minutes on WhatsApp and live on our Track Order system.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-pink-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">100% Replacement Warranty</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If an account faces any disruption, our automated support immediately issues a fresh verified replacement. Full validity guaranteed.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-pink-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">256-Bit Secure Payments</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pay with ease and complete peace of mind using Google Pay, PhonePe, Paytm, standard UPI QR, or debit/credit cards.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-pink-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Private Profile with PIN</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Your viewing history, watchlists, and recommendations stay 100% private with custom 4-digit PIN locks on Netflix & Prime.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-pink-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                <Tv className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">4K Ultra HD & Dolby Atmos</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Enjoy maximum resolution streaming on 4K Smart TVs, Apple TV, Fire TV sticks, laptops, iPads, and smartphones.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-pink-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">24/7 Human WhatsApp Help</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No endless automated bots. Real human customer support team ready to assist you via WhatsApp chat and Telegram in under 5 minutes.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS QUICK BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white font-['Outfit']">
              New to OTT Mega 2.0? Learn how simple it is.
            </h3>
            <p className="text-sm text-zinc-400">
              Only 3 steps: Choose your plan, make instant payment, and start streaming in 5 minutes!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentPage('how-to-work')}
              className="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm shadow-md shadow-pink-500/25 flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>See 3-Step Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
