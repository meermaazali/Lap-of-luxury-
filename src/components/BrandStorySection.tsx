import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Gem, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OurStoryModal } from './modals/OurStoryModal';
import { StoreLocationModal } from './modals/StoreLocationModal';

export const BrandStorySection: React.FC = () => {
  const { setSelectedCategory, setIsExperienceOpen } = useStore();
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const handleGoToWatches = () => {
    setSelectedCategory('Watches');
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGoToBags = () => {
    setSelectedCategory('Bags');
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section className="py-12 sm:py-16 bg-white/65 backdrop-blur-[2px] border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Column: Visual Store / Craftsmanship */}
            <div
              onClick={() => setIsLocationOpen(true)}
              className="lg:col-span-4 relative rounded-3xl overflow-hidden min-h-[280px] sm:min-h-[360px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] group cursor-pointer border border-[#D4AF37]/40"
            >
              <img
                src="/images/hero_luxury_fashion_1791098539165.jpg"
                alt="Luxury Craftsmanship"
                className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="font-editorial italic uppercase tracking-[0.2em] text-xs text-[#D4AF37] font-medium">
                  Flagship Boutique
                </span>
                <p className="font-bodoni text-xl sm:text-2xl font-normal sm:font-medium tracking-wider mt-1">
                  VISIT OUR STORE
                </p>
                <p className="text-xs text-gray-200 mt-1">
                  Mahabubnagar · Tap for directions & boutique hours
                </p>
              </div>
            </div>

            {/* Center Column: Core Manifesto */}
            <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-8 bg-white rounded-3xl border border-[#D4AF37]/40 shadow-[0_8px_30px_rgba(212,175,55,0.08)]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#B89758]" />
                  <span className="font-editorial text-xs italic tracking-[0.2em] uppercase text-[#8C6D1F] font-medium">
                    Our Philosophy
                  </span>
                </div>

                <h2 className="font-bodoni text-xl sm:text-2xl font-normal sm:font-medium tracking-[0.14em] text-[#241F1B] uppercase leading-tight mb-2">
                  MORE THAN A STORE.
                  <br />
                  <span className="text-[#B89758]">IT'S A LIFESTYLE.</span>
                </h2>

                <p className="font-sans text-xs sm:text-sm text-[#4E4437] leading-relaxed mt-3">
                  At <strong className="text-[#241F1B]">LAP OF LUXURY</strong>, we bring together tailored shirts, selvedge denim, precision timepieces, and hand-stitched leather. Discover a world where unmatched quality meets pure elegance.
                </p>

                <div className="grid grid-cols-2 gap-3 my-5 pt-2 border-t border-[#F0E8DC]">
                  <div className="flex items-center gap-2 text-xs text-[#453D32]">
                    <Gem className="w-4 h-4 text-[#B89758] shrink-0" />
                    <span className="font-bold">100% Genuine</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#453D32]">
                    <ShieldCheck className="w-4 h-4 text-[#B89758] shrink-0" />
                    <span className="font-bold">Quality Verified</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setIsStoryOpen(true)}
                  className="w-full py-3 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] text-xs font-bold tracking-[0.18em] uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 rounded-lg"
                >
                  <span>OUR CRAFTSMANSHIP STORY →</span>
                </button>
              </div>
            </div>

            {/* Right Column: Two Luxury Still-Life Cards */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {/* Card 1: Precision Watches */}
              <div
                onClick={handleGoToWatches}
                className="flex-1 relative rounded-2xl overflow-hidden bg-[#111111] text-white p-5 flex flex-col justify-between group cursor-pointer shadow-md hover:shadow-lg border border-[#333339] transition-all min-h-[140px]"
              >
                <div className="absolute inset-0 opacity-40 group-hover:opacity-55 transition-opacity">
                  <img
                    src="/images/luxury_gold_watch_1791098572108.jpg"
                    alt="Precision Watches"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/70 to-transparent" />
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#D4AF37]">
                    Precision Timepieces
                  </span>
                  <h3 className="font-bodoni text-base sm:text-lg font-bold tracking-wider mt-0.5 text-white">
                    Timeless Accessories for Every Moment
                  </h3>
                </div>

                <div className="relative z-10 pt-3 flex items-center gap-1.5 text-xs text-[#D4AF37] font-bold tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                  <span>Explore Watches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 2: Handbags */}
              <div
                onClick={handleGoToBags}
                className="flex-1 relative rounded-2xl overflow-hidden bg-[#111111] text-white p-5 flex flex-col justify-between group cursor-pointer shadow-md hover:shadow-lg border border-[#333339] transition-all min-h-[140px]"
              >
                <div className="absolute inset-0 opacity-40 group-hover:opacity-55 transition-opacity">
                  <img
                    src="/images/category_bags_bw.jpg"
                    alt="Style for Everyone"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/70 to-transparent" />
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#D4AF37]">
                    Leathercraft & Bags
                  </span>
                  <h3 className="font-bodoni text-base sm:text-lg font-bold tracking-wider mt-0.5 text-white">
                    Style for Everyone
                  </h3>
                </div>

                <div className="relative z-10 pt-3 flex items-center gap-1.5 text-xs text-[#D4AF37] font-bold tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                  <span>View Bags & Leather</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OurStoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />
      <StoreLocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />
    </>
  );
};
