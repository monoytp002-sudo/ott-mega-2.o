import React, { useState } from 'react';
import { 
  Tv, 
  CreditCard, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Smartphone, 
  Zap, 
  Clock, 
  MessageSquare
} from 'lucide-react';

interface HowToWorkViewProps {
  setCurrentPage: (page: string) => void;
}

export const HowToWorkView: React.FC<HowToWorkViewProps> = ({ setCurrentPage }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      number: '01',
      title: 'Choose Plan',
      subtitle: 'Select your OTT platform and duration',
      description:
        'Browse our wide selection of popular streaming packages (Netflix 4K, Amazon Prime, Hotstar, SonyLIV, Zee5, or Mega Combos). Select whether you need 1 Month, 3 Months, or 1 Year access.',
      icon: Tv,
      color: 'from-pink-500 to-rose-500',
      badge: 'Step 1'
    },
    {
      number: '02',
      title: 'Make Payment',
      subtitle: 'Instant, secure UPI QR or Card checkout',
      description:
        'Scan the instant UPI QR code using Google Pay, PhonePe, Paytm, or standard UPI. Enter your WhatsApp number during checkout so our system knows where to dispatch your login details.',
      icon: CreditCard,
      color: 'from-rose-500 to-pink-600',
      badge: 'Step 2'
    },
    {
      number: '03',
      title: 'Get Credentials',
      subtitle: 'Login ID, Password & PIN delivered in 5-15 mins',
      description:
        'Your verified streaming credentials (Account Email, Password, Assigned Screen Profile & PIN) are sent straight to your WhatsApp and updated live on the Track Order page. Simply log in and enjoy!',
      icon: KeyRound,
      color: 'from-pink-600 to-fuchsia-600',
      badge: 'Step 3'
    },
  ];

  const faqs = [
    {
      q: 'How fast will I receive my login credentials after payment?',
      a: 'Orders are processed immediately. Our automated system and admin team dispatch your credentials to your registered WhatsApp number and Track Order page typically within 5 to 15 minutes.'
    },
    {
      q: 'Can I watch on my Smart TV and Mobile phone?',
      a: 'Yes! All our premium plans support Smart TVs (Android TV, LG WebOS, Samsung Tizen, Apple TV), Amazon Firesticks, laptops, iPads, tablets, and smartphones in crisp 4K UHD or Full HD.'
    },
    {
      q: 'Will other people interfere with my watch history?',
      a: 'No. You are assigned a private, designated screen profile with your own custom 4-digit PIN lock. Your watchlists, history, and recommendations are 100% private to you.'
    },
    {
      q: 'What if my credentials stop working before the subscription ends?',
      a: 'We offer a 100% Replacement Warranty for the entire duration of your plan. If any account encounters an issue, message our WhatsApp support and we provide a fresh verified replacement immediately at zero extra cost.'
    },
    {
      q: 'Can I change the account email or master password?',
      a: 'No. Changing account credentials or billing settings will void your warranty. You should only use the designated profile assigned to you.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Google Pay, PhonePe, Paytm, BHIM, Bank UPI transfer, and all major Debit/Credit cards.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-bold uppercase tracking-wider">
          <Zap className="w-4 h-4" />
          <span>Simple, Fast & Transparent Process</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Outfit']">
          How OTT Mega 2.0 Works
        </h1>
        <p className="text-sm sm:text-base text-zinc-400">
          Getting your favorite OTT subscriptions has never been this effortless. Follow these 3 simple steps to start streaming in minutes.
        </p>
      </div>

      {/* 3-Step Process Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="relative rounded-2xl bg-[#121217] border border-zinc-800 hover:border-pink-500/50 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 group"
            >
              {/* Step indicator top */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl font-black text-zinc-800 group-hover:text-pink-500/30 transition-colors font-['Outfit']">
                  {step.number}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  {step.badge}
                </span>
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-pink-500/25 group-hover:scale-110 transition-transform">
                <Icon className="w-7 h-7" />
              </div>

              {/* Title & description */}
              <div className="space-y-2 mb-6">
                <h3 className="text-2xl font-bold text-white font-['Outfit'] group-hover:text-pink-400 transition-colors">
                  {step.title}
                </h3>
                <h4 className="text-xs font-semibold text-pink-400">
                  {step.subtitle}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed pt-2">
                  {step.description}
                </p>
              </div>

              {/* Progress arrow on mobile/tablet */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-pink-400" />
                <span>Verified in real time</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Banner Callout */}
      <div className="rounded-3xl bg-gradient-to-r from-pink-950/30 via-zinc-900 to-zinc-900 border border-pink-500/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-pink-400 text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Guaranteed Fast Turnaround</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Ready to start streaming your favorite shows?
          </h3>
          <p className="text-sm text-zinc-400 max-w-xl">
            Choose from over 10+ OTT platforms with discounts up to 80% and receive instant access right away.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentPage('plans')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Choose a Plan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage('track-order')}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-sm transition-all"
          >
            Track Existing Order
          </button>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Got questions about delivery, device compatibility, or account management? Here are quick answers.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl bg-[#121217] border border-zinc-800 transition-all overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-pink-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-pink-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-zinc-400 border-t border-zinc-850 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions? */}
        <div className="text-center pt-4">
          <p className="text-xs text-zinc-400 mb-3">
            Still have queries? Our live support team is active 24/7 on WhatsApp.
          </p>
          <a
            href="https://wa.me/918967624619?text=Hello%20OTT%20Mega%202.0!%20I%20have%20a%20question%20before%20ordering."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat With Live Support</span>
          </a>
        </div>
      </div>

    </div>
  );
};
