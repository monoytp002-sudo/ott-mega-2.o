import React, { useState } from 'react';
import { 
  Tv, 
  ShoppingCart, 
  ShieldCheck, 
  Menu, 
  X, 
  Flame, 
  Search, 
  PhoneCall,
  Sparkles,
  Lock
} from 'lucide-react';
import { OTTPlan } from '../types.ts';
import { OttLogo } from './OttLogo.tsx';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  cart: OTTPlan[];
  openCart: () => void;
  isAdminLoggedIn: boolean;
  openAdminModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  cart,
  openCart,
  isAdminLoggedIn,
  openAdminModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'plans', label: 'Plans' },
    { id: 'how-to-work', label: 'How to Work' },
    { id: 'track-order', label: 'Track Order' },
    { id: 'contact-us', label: 'Contact Us' },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#09090b]/95 backdrop-blur-md border-b border-pink-500/20 transition-all">
      {/* Top micro ticker banner */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 text-white text-xs font-semibold py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>MEGA SALE: Flat 80% OFF on All OTT Annual Subscriptions. Instant WhatsApp Delivery!</span>
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-pink-600 via-rose-400 to-pink-300 shadow-lg shadow-pink-500/30 group-hover:shadow-pink-500/60 group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                <OttLogo size={46} showTextLabel={false} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Outfit']">
                  OTT MEGA
                </span>
                <span className="text-xs font-extrabold px-1.5 py-0.5 rounded bg-pink-500 text-white shadow-sm shadow-pink-500/50">
                  2.0
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 tracking-wider uppercase font-medium">
                Premium Streaming Store
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'text-pink-400 bg-pink-500/10 shadow-[inset_0_0_12px_rgba(236,72,153,0.15)] border border-pink-500/30'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-pink-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-pink-500/50 transition-all group"
              title="View Cart"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-pink-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-md shadow-pink-500/50">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Admin Panel Button */}
            <button
              id="header-admin-btn"
              onClick={() => {
                handleNavClick('admin');
                openAdminModal();
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                currentPage === 'admin'
                  ? 'bg-pink-500 text-white border-pink-400 shadow-lg shadow-pink-500/25'
                  : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-pink-500/40 hover:text-pink-400'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">Admin Panel</span>
              {isAdminLoggedIn && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-zinc-900 text-zinc-300 border border-zinc-800 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#09090b] border-b border-zinc-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold flex items-center justify-between ${
                  isActive 
                    ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30' 
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-pink-500" />}
              </button>
            );
          })}

          <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                handleNavClick('admin');
                openAdminModal();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-pink-500/30 text-pink-400 font-bold text-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Admin Dashboard Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
