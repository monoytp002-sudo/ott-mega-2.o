import React from 'react';

interface HeroAppsAnimationProps {
  onExplorePlans: () => void;
}

export const HeroAppsAnimation: React.FC<HeroAppsAnimationProps> = ({ onExplorePlans }) => {
  return (
    <div id="hero-floating-apps" className="relative w-full max-w-lg mx-auto lg:max-w-none flex items-center justify-center p-4">
      {/* Background Soft Glow Nebula */}
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/20 via-purple-600/15 to-transparent blur-3xl rounded-full pointer-events-none" />

      {/* Main Container of Overlapping Animated OTT Logo Cards */}
      <div className="relative w-full h-[360px] sm:h-[400px] flex items-center justify-center">
        
        {/* Floating Logo Badge 1 (Top Left) - YouTube */}
        <div 
          id="floating-youtube-badge"
          onClick={onExplorePlans}
          className="absolute -top-3 sm:-top-2 left-4 sm:left-8 z-30 p-2.5 sm:p-3 rounded-2xl bg-zinc-950/90 border border-red-500/40 shadow-xl shadow-red-500/20 flex items-center justify-center cursor-pointer hover:scale-110 hover:border-red-500 transition-all duration-300 animate-float-slow backdrop-blur-md"
          title="YouTube"
        >
          <img 
            src="/logos/youtube.svg" 
            alt="YouTube" 
            className="h-6 sm:h-7 w-auto object-contain drop-shadow-[0_2px_12px_rgba(255,0,0,0.5)]"
          />
        </div>

        {/* Floating Logo Badge 2 (Bottom Right) - Crunchyroll */}
        <div 
          id="floating-crunchyroll-badge"
          onClick={onExplorePlans}
          className="absolute -bottom-2 sm:-bottom-1 right-4 sm:right-6 z-30 p-2.5 sm:p-3 rounded-2xl bg-zinc-950/90 border border-orange-500/40 shadow-xl shadow-orange-500/20 flex items-center justify-center cursor-pointer hover:scale-110 hover:border-orange-500 transition-all duration-300 animate-float-reverse backdrop-blur-md"
          title="Crunchyroll"
        >
          <img 
            src="/logos/crunchyroll.svg" 
            alt="Crunchyroll" 
            className="h-7 sm:h-8 w-auto object-contain drop-shadow-[0_2px_12px_rgba(244,117,33,0.5)]"
          />
        </div>

        {/* CARD 1: BACK / TOP CARD - JioHotstar (Floating tilted) */}
        <div 
          id="floating-jiohotstar-card"
          onClick={onExplorePlans}
          className="absolute top-3 sm:top-5 w-[84%] sm:w-[320px] h-24 sm:h-28 rounded-2xl bg-gradient-to-br from-[#0c1633]/90 via-[#0a1128]/90 to-[#080d1a]/90 border border-indigo-500/40 shadow-2xl shadow-indigo-500/15 cursor-pointer transform -rotate-3 hover:rotate-0 hover:scale-105 hover:border-indigo-400 transition-all duration-300 z-10 animate-float-reverse backdrop-blur-md flex items-center justify-center px-6 py-4"
          title="JioHotstar"
        >
          <img 
            src="/logos/jiohotstar-white.png" 
            alt="JioHotstar" 
            className="h-9 sm:h-11 w-auto max-w-[85%] object-contain drop-shadow-[0_2px_14px_rgba(99,102,241,0.4)]"
          />
        </div>

        {/* CARD 2: MAIN HERO CENTER CARD - Netflix */}
        <div 
          id="floating-netflix-card"
          onClick={onExplorePlans}
          className="relative w-[92%] sm:w-[350px] h-32 sm:h-36 rounded-2xl bg-gradient-to-br from-[#1c080e]/95 via-[#12080d]/95 to-[#0d070a]/95 border-2 border-pink-500 shadow-2xl shadow-pink-500/25 cursor-pointer transform hover:scale-105 hover:border-red-500 transition-all duration-300 z-20 animate-float-slow backdrop-blur-md flex items-center justify-center px-8 py-5"
          title="Netflix"
        >
          <img 
            src="/logos/netflix.svg" 
            alt="Netflix" 
            className="h-10 sm:h-12 w-auto max-w-[80%] object-contain drop-shadow-[0_2px_16px_rgba(229,9,20,0.5)]"
          />
        </div>

        {/* CARD 3: BOTTOM / RIGHT CARD - Amazon Prime */}
        <div 
          id="floating-amazon-prime-card"
          onClick={onExplorePlans}
          className="absolute bottom-4 sm:bottom-6 w-[84%] sm:w-[320px] h-24 sm:h-28 rounded-2xl bg-gradient-to-br from-[#061c28]/90 via-[#04121b]/90 to-[#040e14]/90 border border-sky-500/40 shadow-2xl shadow-sky-500/15 cursor-pointer transform rotate-3 hover:rotate-0 hover:scale-105 hover:border-sky-400 transition-all duration-300 z-10 animate-float-reverse backdrop-blur-md flex items-center justify-center px-6 py-4"
          title="Amazon Prime"
        >
          <img 
            src="/logos/amazon-prime.svg" 
            alt="Amazon Prime" 
            className="h-8 sm:h-10 w-auto max-w-[80%] object-contain drop-shadow-[0_2px_14px_rgba(0,168,225,0.5)]"
          />
        </div>

      </div>
    </div>
  );
};
