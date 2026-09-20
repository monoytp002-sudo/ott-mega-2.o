import React from 'react';
import { 
  Tv, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  MessageSquare, 
  Send, 
  Heart,
  Lock,
  ExternalLink
} from 'lucide-react';
import { OttLogo } from './OttLogo.tsx';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  openAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, openAdminModal }) => {
  const handleNav = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050507] border-t border-zinc-800 text-zinc-400 text-sm">
      {/* Top Highlights Banner */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Instant Delivery</h4>
                <p className="text-xs text-zinc-500">Credentials delivered in 5-15 mins</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">100% Replacement Warranty</h4>
                <p className="text-xs text-zinc-500">Full term uninterrupted streaming</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">24/7 WhatsApp Support</h4>
                <p className="text-xs text-zinc-500">Real human chat assistance</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                <Tv className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Ultra HD 4K Support</h4>
                <p className="text-xs text-zinc-500">Dolby Vision & Dolby Atmos audio</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Col 1 & 2: Brand & About */}
          <div className="md:col-span-2 space-y-4">
            <div 
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 cursor-pointer inline-block group"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-pink-600 via-rose-400 to-pink-300 shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <OttLogo size={42} showTextLabel={false} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight font-['Outfit']">
                  OTT MEGA <span className="text-pink-500">2.0</span>
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              India's premier high-speed digital OTT subscription platform. Get verified, high-quality, ad-free streaming packages for Netflix, Amazon Prime, Disney+ Hotstar, and 10+ platforms with guaranteed private profiles.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/918967624619?text=Hello%20OTT%20Mega%202.0%20Support!%20I%20need%20help%20with%20subscriptions."
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                WhatsApp Chat
              </a>
              <a
                href="https://t.me/ottmegaofficial"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 text-xs font-bold transition-all"
              >
                <Send className="w-4 h-4 text-sky-400" />
                Telegram Channel
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-pink-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('plans')} className="hover:text-pink-400 transition-colors">
                  All Plans & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-to-work')} className="hover:text-pink-400 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('track-order')} className="hover:text-pink-400 transition-colors">
                  Track Order Credentials
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact-us')} className="hover:text-pink-400 transition-colors">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Top Platforms */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Popular OTTs</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                Netflix Premium 4K UHD
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                Amazon Prime Video Ad-Free
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                Disney+ Hotstar 4K Dolby
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                SonyLIV & Zee5 VIP
              </li>
              <li className="flex items-center gap-2 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                OTT Mega 8-in-1 Combo
              </li>
            </ul>
          </div>

          {/* Col 5: Admin & Security */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Staff & Security</h4>
            <p className="text-xs text-zinc-500 mb-3">
              Authorized administrators can manage active plans, assign login credentials, and view sales.
            </p>
            <button
              onClick={() => {
                handleNav('admin');
                openAdminModal();
              }}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-pink-500/30 text-pink-400 hover:bg-pink-500/10 text-xs font-bold transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              Admin Portal
            </button>
            <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SSL 256-Bit Encrypted Platform</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright & disclaimers */}
        <div className="mt-12 pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 OTT Mega 2.0. All rights reserved. Designed with Pink, White, and Black theme.</p>
          <p className="flex items-center gap-1">
            Built for ultra-fast, premium streaming entertainment.
          </p>
        </div>
      </div>
    </footer>
  );
};
