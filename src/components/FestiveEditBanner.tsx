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
    <section className="relative overflow-hidden bg-[#FAF8F5] py-5 sm:py-7">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37] bg-[#EFE8DD] shadow-lg">
          {/* Background image & luxury gold atmosphere */}
          <div className="absolute inset-0">
            <img
              src="/src/assets/images/festive_edit_luxury_1791098550195.jpg"
              alt="The Festive Edit"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Scrim to highlight the golden typography */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/98 via-[#FAF8F5]/85 to-[#FAF8F5]/30 md:w-3/4" />
          </div>

          <div className="relative z-10 px-5 sm:px-8 lg:px-14 py-8 sm:py-12 max-w-xl">
            {/* Header kicker */}
            <div className="flex items-center gap-2 mb-1">
              <span className="h-[2px] w-6 sm:w-8 bg-[#D4AF37]" />
              <span className="font-bodoni text-xs md:text-sm tracking-[0.25em] uppercase text-[#8C6D1F] font-bold">
                THE
              </span>
              <span className="h-[2px] w-6 sm:w-8 bg-[#D4AF37]" />
            </div>

            {/* Main Title */}
            <h2 className="font-bodoni text-2xl sm:text-4xl md:text-5xl font-black tracking-[0.14em] text-[#111111] uppercase mb-3">
              FESTIVE EDIT
            </h2>

            {/* Feature Pricing Block */}
            <div className="grid grid-cols-2 gap-3 sm:gap-5 my-3 max-w-sm sm:max-w-md bg-[#FAF8F5]/95 backdrop-blur-xs p-3 sm:p-4 rounded-xl border border-[#D4AF37]/60 shadow-xs">
              <div
                onClick={handleShopShirts}
                className="cursor-pointer group hover:bg-white/80 p-1.5 sm:p-2 rounded-lg transition-colors"
              >
                <p className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-[#8C6D1F]">
                  PREMIUM SHIRTS
                </p>
                <p className="text-lg sm:text-2xl font-black font-bodoni text-[#111111] group-hover:text-[#B8860B] transition-colors tabular-nums">
                  ₹1,000
                </p>
                <span className="text-[10px] text-[#A3927B] line-through">₹1,999</span>
              </div>

              <div
                onClick={handleShopJeans}
                className="cursor-pointer group hover:bg-white/80 p-1.5 sm:p-2 rounded-lg transition-colors border-l border-[#D4AF37]/30 pl-3 sm:pl-4"
              >
                <p className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-[#8C6D1F]">
                  PREMIUM JEANS
                </p>
                <p className="text-lg sm:text-2xl font-black font-bodoni text-[#111111] group-hover:text-[#B8860B] transition-colors tabular-nums">
                  ₹1,200
                </p>
                <span className="text-[10px] text-[#A3927B] line-through">₹2,499</span>
              </div>
            </div>

            <p className="font-bodoni italic tracking-wider text-[11px] sm:text-xs uppercase text-[#6C5420] mb-5 font-semibold">
              LIMITED-TIME COLLECTION · EXCLUSIVE TO MAHABUBNAGAR FLAGSHIP & ONLINE
            </p>

            {/* Golden Shop button matching mockup */}
            <button
              onClick={handleShopFestive}
              className="px-7 py-3 bg-[#B89758] hover:bg-[#A58448] text-white text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase rounded-none transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Up to 50% Off Circular Gold Badge */}
          <div className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-[#1E1E22] text-[#F3E7D5] border-4 border-[#C5A880] shadow-xl rotate-3">
            <div className="flex flex-col items-center text-center p-1 sm:p-2">
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-bold text-[#C5A880]">
                UP TO
              </span>
              <span className="font-bodoni text-xl sm:text-3xl font-bold leading-none text-white my-0.5">
                50%
              </span>
              <span className="font-bodoni text-[10px] sm:text-xs tracking-widest uppercase text-[#C5A880] font-bold">
                OFF
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
