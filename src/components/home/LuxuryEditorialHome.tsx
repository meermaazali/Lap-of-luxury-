import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Clock,
  Award,
  Crown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { normalizeImageUrl } from '../../utils/imageUtils';
import { CategorySliderSection } from './CategorySliderSection';
import { CustomerEnquirySection } from './CustomerEnquirySection';

export const LuxuryEditorialHome: React.FC = () => {
  const {
    banners,
    categories,
    boutiqueHeroConfig,
    setCurrentView,
  } = useStore();

  // Active Hero Slide Index
  const [activeSlide, setActiveSlide] = useState(0);

  // Assemble campaign slides from Cloud Firestore / Boutique Hero Config
  const campaignSlides = useMemo(() => {
    const list: Array<{
      image: string;
      title: string;
      kicker: string;
      subtitle: string;
      ctaText: string;
      ctaLink: string;
    }> = [];

    // Hero showcase banner
    if (boutiqueHeroConfig?.image) {
      list.push({
        image: normalizeImageUrl(boutiqueHeroConfig.image),
        title: `${boutiqueHeroConfig.titleLine1 || 'Luxury'} ${boutiqueHeroConfig.titleLine2 || 'For Every Moment'}`,
        kicker: boutiqueHeroConfig.kicker || 'EXCLUSIVE COLLECTION',
        subtitle: (boutiqueHeroConfig.subtitleItems || []).join(' · ') || 'Premium Fashion, Handbags & Timepieces',
        ctaText: boutiqueHeroConfig.ctaText || 'Explore Collections',
        ctaLink: 'collections',
      });
    }

    // Existing banners from Cloud Firestore (preserving exact ordering, active only)
    if (banners && banners.length > 0) {
      banners.forEach((b) => {
        if (b.active === false) return;
        list.push({
          image: normalizeImageUrl(b.image),
          title: b.title,
          kicker: b.kicker || 'HAUTE COUTURE EDIT',
          subtitle: b.subtitle,
          ctaText: b.ctaText || 'Shop Collection',
          ctaLink: b.ctaLink?.toLowerCase() || 'men',
        });
      });
    }

    // Default luxury editorial fallback if empty
    if (list.length === 0) {
      list.push({
        image: '/images/category_mens_fashion_1791290148102.jpg',
        title: 'LAP OF LUXURY',
        kicker: 'THE FESTIVE & OCCASION COLLECTION',
        subtitle: 'Premium Shirts, Denim, Fine Leathers & Timepieces',
        ctaText: 'Discover The Curation',
        ctaLink: 'men',
      });
    }

    return list;
  }, [boutiqueHeroConfig, banners]);

  // Auto-play Campaign Slider
  useEffect(() => {
    if (campaignSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % campaignSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [campaignSlides.length]);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111113]">
      {/* 1. PREMIUM HERO CAMPAIGN SLIDER */}
      <section className="relative w-full bg-[#111113] overflow-hidden border-b border-[#D4AF37]/30">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/8] max-h-[560px] w-full">
          {campaignSlides.map((slide, idx) => {
            const isCurrent = idx === activeSlide;

            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/category_mens_fashion_1791290148102.jpg';
                  }}
                  className="w-full h-full object-cover object-center brightness-[0.72] contrast-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

                {/* Editorial Slide Content */}
                <div className="absolute inset-0 max-w-[1540px] mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-center items-start text-left">
                  <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.28em] uppercase text-[#D4AF37] mb-2 drop-shadow-sm">
                    {slide.kicker}
                  </span>
                  <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.08em] text-white leading-tight max-w-3xl drop-shadow-md">
                    {slide.title}
                  </h1>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-[#E0D5C3] mt-3 max-w-xl font-light leading-relaxed drop-shadow-sm hidden sm:block">
                    {slide.subtitle}
                  </p>

                  <div className="mt-5 sm:mt-7 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentView(slide.ctaLink || 'men')}
                      className="px-6 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] font-bold text-xs sm:text-sm uppercase tracking-[0.16em] rounded-full shadow-xl transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <span>{slide.ctaText}</span>
                      <ArrowRight className="w-4 h-4 text-[#111113]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentView('collections')}
                      className="px-5 py-3 sm:px-7 sm:py-3.5 border border-white/60 hover:border-[#D4AF37] bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm uppercase tracking-[0.14em] rounded-full backdrop-blur-xs transition-all cursor-pointer hidden md:flex items-center gap-1.5"
                    >
                      <span>View Lookbook</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Slider Prev / Next Controls */}
          {campaignSlides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveSlide(
                    (prev) => (prev - 1 + campaignSlides.length) % campaignSlides.length
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/30 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                aria-label="Previous Campaign Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveSlide((prev) => (prev + 1) % campaignSlides.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/30 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
                aria-label="Next Campaign Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Slider Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {campaignSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === activeSlide ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* 2. SMOOTH AUTOMATICALLY SLIDING CATEGORY SECTION */}
      <CategorySliderSection />

      {/* 3. VALUE PROPOSITIONS & REASSURANCE */}
      <section className="w-full bg-white border-b border-[#E8DEC8] py-8 sm:py-10">
        <div className="max-w-[1540px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF6EE] border border-[#D4AF37]/50 flex items-center justify-center text-[#B8860B] shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider text-[#111113]">
                  100% GENUINE
                </h4>
                <p className="text-[11px] text-[#7A6C58]">Handcrafted premium luxury collections</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF6EE] border border-[#D4AF37]/50 flex items-center justify-center text-[#B8860B] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider text-[#111113]">
                  EXPRESS DISPATCH
                </h4>
                <p className="text-[11px] text-[#7A6C58]">Doorstep delivery across India</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF6EE] border border-[#D4AF37]/50 flex items-center justify-center text-[#B8860B] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider text-[#111113]">
                  STORE ASSISTANCE
                </h4>
                <p className="text-[11px] text-[#7A6C58]">Direct stylist fitting &amp; support</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FAF6EE] border border-[#D4AF37]/50 flex items-center justify-center text-[#B8860B] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bodoni font-bold text-xs sm:text-sm uppercase tracking-wider text-[#111113]">
                  DOORSTEP VERIFICATION
                </h4>
                <p className="text-[11px] text-[#7A6C58]">Inspect upon delivery with ease</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FULLY FUNCTIONAL CUSTOMER ENQUIRY FORM */}
      <CustomerEnquirySection />
    </div>
  );
};
