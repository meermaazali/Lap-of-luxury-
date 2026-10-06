import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FALLBACK_LUXURY_IMAGE, normalizeImageUrl } from '../utils/imageUtils';

export const HeroSlider: React.FC = () => {
  const { banners, bannerInterval, triggerTransition } = useStore();
  const activeBanners = banners.filter((b) => b.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (isHovered || activeBanners.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, (bannerInterval || 5) * 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isHovered, activeBanners.length, bannerInterval]);

  if (activeBanners.length === 0) return null;

  const currentSlide = activeBanners[currentIndex] || activeBanners[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleCtaClick = (link: string) => {
    triggerTransition(link, link === 'Men' ? "Men's Shirts & Denim" : link === 'Festive' ? 'The Festive Edit' : link);
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E2D5BE] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Grand, Generous Banner Height for Mobile, Desktop, and 4K TV */}
      <div className="relative min-h-[460px] sm:min-h-[540px] md:min-h-[620px] lg:min-h-[680px] xl:min-h-[720px] w-full flex items-center">
        {/* Background Image: Full bleed, grand size */}
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
          {/* Subtle soft white & warm champagne gradient scrim ensuring crisp legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/98 via-[#FAF8F5]/85 to-transparent sm:w-3/4 md:w-3/5 lg:w-1/2" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/90 via-transparent to-transparent sm:hidden" />
        </div>

        {/* Content Box with Simple Golden & White Editorial Aesthetics matching mockup */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16 w-full">
          <div className="max-w-xl">
            {/* Tagline kicker */}
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[1.5px] bg-[#B89758]" />
              <p className="font-editorial italic tracking-[0.2em] uppercase text-xs md:text-sm text-[#7D6B55]">
                {currentSlide.kicker || 'Experience premium in every touch'}
              </p>
            </div>

            {/* Main Title: LAP OF LUXURY */}
            <h1 className="font-bodoni text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold tracking-[0.16em] uppercase text-[#1E1E22] leading-none mb-3">
              {currentSlide.title}
            </h1>

            {/* Delicate Diamond Divider */}
            <div className="flex items-center gap-3 my-2.5 opacity-80">
              <span className="w-12 h-[1px] bg-[#B89758]" />
              <span className="w-1.5 h-1.5 rotate-45 bg-[#B89758]" />
              <span className="w-12 h-[1px] bg-[#B89758]" />
            </div>

            {/* Subtitle / Categories list */}
            <p className="font-sans text-xs sm:text-sm md:text-base tracking-[0.14em] font-semibold text-[#4A4033] mt-2 mb-6 uppercase">
              {currentSlide.subtitle}
            </p>

            {/* Solid, Elegant Action Buttons (Matching Mockup exactly: Black + White) */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
              <button
                onClick={() => handleCtaClick(currentSlide.ctaLink || 'Men')}
                className="px-6 sm:px-7 py-3 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{currentSlide.ctaText || 'SHOP MEN →'}</span>
              </button>

              {currentSlide.secondaryCtaText && (
                <button
                  onClick={() => handleCtaClick(currentSlide.secondaryCtaLink || 'Women')}
                  className="px-6 sm:px-7 py-3 bg-white/95 hover:bg-white text-[#1E1E22] border border-[#C5B396] text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{currentSlide.secondaryCtaText}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Navigation Controls */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-[#1E1E22] shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs border border-[#E0D8C8]"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 hover:bg-white text-[#1E1E22] shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs border border-[#E0D8C8]"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Slide Indicators with Progress Bar */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {activeBanners.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                idx === currentIndex
                  ? 'w-8 bg-[#B89758]'
                  : 'w-2 bg-[#1E1E22]/30 hover:bg-[#1E1E22]/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
