import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FestiveEditBanner: React.FC = () => {
  const { triggerTransition } = useStore();

  const handleShopFestive = () => {
    triggerTransition('Festive', 'The Festive Edit');
  };

  const handleShopJeans = () => {
    triggerTransition('Jeans', 'Premium Selvedge Jeans');
  };

  const handleShopShirts = () => {
    triggerTransition('Men', 'Premium Luxury Shirts');
  };

  return (
    <section className="relative overflow-hidden bg-transparent py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 bg-[#FBF9F5] shadow-[0_12px_40px_rgba(212,175,55,0.14)]">
          {/* Background image & luxury gold atmosphere */}
          <div className="absolute inset-0">
            <img
              src="/images/festive_edit_luxury_1791098550195.jpg"
              alt="The Festive Edit"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop';
              }}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Scrim to highlight the golden typography */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-white/85 to-transparent md:w-3/4" />
          </div>

          <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-10 sm:py-14 max-w-xl">
            {/* Header kicker */}
            <div className="flex items-center gap-2 mb-2">
              <span className="h-[2px] w-6 sm:w-8 bg-[#D4AF37]" />
              <span className="font-bodoni text-xs md:text-sm tracking-[0.25em] uppercase text-[#8C6D1F] font-bold">
                THE 2026 CURATION
              </span>
              <span className="h-[2px] w-6 sm:w-8 bg-[#D4AF37]" />
            </div>

            {/* Main Title */}
            <h2 className="font-bodoni text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.15em] text-[#111113] uppercase mb-4 leading-none">
              FESTIVE EDIT
            </h2>

            {/* Feature Pricing Block in White & Gold */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5 my-4 max-w-sm sm:max-w-md bg-white/95 backdrop-blur-xs p-4 rounded-2xl border border-[#D4AF37]/50 shadow-sm">
              <div
                onClick={handleShopShirts}
                className="cursor-pointer group hover:bg-[#FAF6EE] p-2 rounded-xl transition-colors"
              >
                <p className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-[#8C6D1F]">
                  PREMIUM SHIRTS
                </p>
                <p className="text-xl sm:text-2xl font-black font-bodoni text-[#111113] group-hover:text-[#B8860B] transition-colors tabular-nums mt-0.5">
                  ₹1,000
                </p>
                <span className="text-[10px] text-[#A3927B] line-through">₹1,999</span>
              </div>

              <div
                onClick={handleShopJeans}
                className="cursor-pointer group hover:bg-[#FAF6EE] p-2 rounded-xl transition-colors border-l border-[#D4AF37]/30 pl-3 sm:pl-4"
              >
                <p className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-[#8C6D1F]">
                  PREMIUM JEANS
                </p>
                <p className="text-xl sm:text-2xl font-black font-bodoni text-[#111113] group-hover:text-[#B8860B] transition-colors tabular-nums mt-0.5">
                  ₹1,200
                </p>
                <span className="text-[10px] text-[#A3927B] line-through">₹2,499</span>
              </div>
            </div>

            <p className="font-bodoni italic tracking-wider text-[11px] sm:text-xs uppercase text-[#8A671A] mb-6 font-semibold">
              LIMITED-TIME COLLECTION · EXCLUSIVE TO MAHABUBNAGAR BOUTIQUE & ONLINE
            </p>

            {/* Golden Action Button */}
            <button
              onClick={handleShopFestive}
              className="px-8 py-3.5 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] text-xs sm:text-sm font-bold tracking-[0.18em] uppercase rounded-xl transition-all shadow-[0_6px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_25px_rgba(212,175,55,0.45)] flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>SHOP FESTIVE NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Up to 50% Off Circular Gold Emblem */}
          <div className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#111113] to-[#25252B] text-white border-4 border-[#D4AF37] shadow-[0_10px_30px_rgba(212,175,55,0.4)] rotate-3">
            <div className="flex flex-col items-center text-center p-1 sm:p-2">
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-bold text-[#F4E09E]">
                UP TO
              </span>
              <span className="font-bodoni text-xl sm:text-3xl font-black leading-none text-white my-0.5">
                50%
              </span>
              <span className="font-bodoni text-[10px] sm:text-xs tracking-widest uppercase text-[#F4E09E] font-bold">
                OFF
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
