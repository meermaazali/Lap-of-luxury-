import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Hand } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FALLBACK_LUXURY_IMAGE, normalizeImageUrl } from '../utils/imageUtils';
import { ThreeClothCanvas, FabricType } from './experience/ThreeClothCanvas';

export const HeroSlider: React.FC = () => {
  const { banners, bannerInterval, triggerTransition } = useStore();
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeFabric, setActiveFabric] = useState<FabricType>('silk');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (isHovered || activeBanners.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, (bannerInterval || 6) * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isHovered, activeBanners.length, bannerInterval]);

  // Synchronize fabric with current slide
  useEffect(() => {
    if (currentIndex === 1) setActiveFabric('gold');
    else if (currentIndex === 2) setActiveFabric('denim');
    else setActiveFabric('silk');
  }, [currentIndex]);

  if (activeBanners.length === 0) return null;

  const currentSlide = activeBanners[currentIndex] || activeBanners[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleCtaClick = (link: string) => {
    triggerTransition(
      link,
      link === 'Men'
        ? "Men's Shirts & Denim"
        : link === 'Festive'
        ? 'The Festive Edit'
        : link
    );
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-transparent border-b border-[#D4AF37]/30 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 2026 Golden & White Luxury Hero Canvas */}
      <div className="relative min-h-[500px] sm:min-h-[560px] md:min-h-[620px] lg:min-h-[660px] xl:min-h-[700px] w-full flex items-center">
        {/* Background Editorial Image Layer */}
        <div className="absolute inset-0">
          <img
            src={normalizeImageUrl(currentSlide.image)}
            alt={currentSlide.title}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== FALLBACK_LUXURY_IMAGE) {
                target.src = FALLBACK_LUXURY_IMAGE;
              }
            }}
            className="w-full h-full object-cover object-center transition-all duration-1000 transform scale-100"
          />
          {/* Luminous Golden-White scrim protecting crisp typography */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-white/75 to-transparent sm:w-3/4 md:w-3/5 lg:w-1/2" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/85 via-transparent to-transparent sm:hidden" />
        </div>

        {/* Live Interactive 3D WebGL Cloth Canvas (David Whyte fluid cloth animation right on the page) */}
        <div className="hidden lg:block absolute right-6 top-6 bottom-6 w-5/12 z-[5] pointer-events-auto rounded-3xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-[0_12px_40px_rgba(212,175,55,0.15)] bg-gradient-to-br from-white/30 to-[#FAF6EE]/20 backdrop-blur-xs group">
          <ThreeClothCanvas
            fabric={activeFabric}
            interactive={true}
            accentText="Drag Cursor · Real-Time 3D Silk Ripple"
          />

          {/* Interactive Fabric Selector Badge on 3D Canvas */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#D4AF37]/50 shadow-md">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#8A671A]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" style={{ animationDuration: '6s' }} />
              <span>3D Tactile Cloth:</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFabric('silk');
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  activeFabric === 'silk'
                    ? 'bg-[#111111] text-[#D4AF37]'
                    : 'bg-white/80 hover:bg-white text-[#555] border border-gray-200'
                }`}
              >
                Silk
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFabric('gold');
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  activeFabric === 'gold'
                    ? 'bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white'
                    : 'bg-white/80 hover:bg-white text-[#555] border border-gray-200'
                }`}
              >
                24K Gold
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveFabric('denim');
                }}
                className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  activeFabric === 'denim'
                    ? 'bg-[#1a2b4c] text-white'
                    : 'bg-white/80 hover:bg-white text-[#555] border border-gray-200'
                }`}
              >
                Denim
              </button>
            </div>
          </div>
        </div>

        {/* Editorial Content Box in 2026 Golden & White Luxury */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16 w-full">
          <div className="max-w-xl">
            {/* Tagline kicker with Gold Emblem */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[1.5px] bg-[#D4AF37]" />
              <p className="font-editorial italic tracking-[0.22em] uppercase text-xs md:text-sm text-[#8A671A] font-semibold">
                {currentSlide.kicker || 'Where Elegance Meets Comfort'}
              </p>
            </div>

            {/* Main Brand Title: LAP OF LUXURY */}
            <h1 className="font-bodoni text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-[0.16em] uppercase text-[#111113] leading-none mb-3">
              {currentSlide.title}
            </h1>

            {/* Subtitle / Categories list */}
            <p className="font-sans text-xs sm:text-sm md:text-base tracking-[0.14em] font-semibold text-[#4A4033] mt-2 mb-6 uppercase">
              {currentSlide.subtitle}
            </p>

            {/* Golden & White Action Buttons (Clean & Modern 2026 - No separate 3D button) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <button
                onClick={() => handleCtaClick(currentSlide.ctaLink || 'Men')}
                className="px-7 sm:px-8 py-3.5 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] text-xs sm:text-sm font-bold tracking-[0.18em] uppercase transition-all shadow-[0_6px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_25px_rgba(212,175,55,0.45)] flex items-center gap-2 cursor-pointer active:scale-95 rounded-lg"
              >
                <span>{currentSlide.ctaText || 'EXPLORE COLLECTION →'}</span>
              </button>

              <button
                onClick={() => handleCtaClick('Festive')}
                className="px-6 sm:px-7 py-3.5 bg-white/95 hover:bg-white text-[#111113] border-2 border-[#D4AF37] hover:border-[#B8860B] text-xs sm:text-sm font-bold tracking-[0.16em] uppercase transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer active:scale-95 rounded-lg"
              >
                <span>THE FESTIVE EDIT →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Navigation Controls */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-[#111113] shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs border border-[#D4AF37]/50"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-[#8A671A]" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-[#111113] shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs border border-[#D4AF37]/50"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-[#8A671A]" />
        </button>

        {/* Slide Indicators with Golden Progress Bar */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {activeBanners.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.6)]'
                  : 'w-2 bg-[#1E1E22]/20 hover:bg-[#1E1E22]/50'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
