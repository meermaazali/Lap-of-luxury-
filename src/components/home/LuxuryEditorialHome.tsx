import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Heart,
  Eye,
  Clock,
  Compass,
  Flame,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, BannerSlide } from '../../types';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../../utils/imageUtils';

export const LuxuryEditorialHome: React.FC = () => {
  const {
    products,
    banners,
    categories,
    boutiqueHeroConfig,
    setCurrentView,
    openProductDetail,
    setQuickViewProduct,
    isInWishlist,
    toggleWishlist,
  } = useStore();

  // Active Hero Slide Index
  const [activeSlide, setActiveSlide] = useState(0);

  // Assemble campaign slides
  const campaignSlides = useMemo(() => {
    const list: Array<{
      image: string;
      title: string;
      kicker: string;
      subtitle: string;
      ctaText: string;
      ctaLink: string;
    }> = [];

    // Boutique hero banner
    if (boutiqueHeroConfig?.image) {
      list.push({
        image: normalizeImageUrl(boutiqueHeroConfig.image),
        title: `${boutiqueHeroConfig.titleLine1 || 'Luxury'} ${boutiqueHeroConfig.titleLine2 || 'For Every Moment'}`,
        kicker: boutiqueHeroConfig.kicker || 'EXCLUSIVE ATELIER COLLECTION',
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

    // Default luxury editorial fallbacks if empty
    if (list.length === 0) {
      list.push({
        image: '/images/category_mens_fashion_1791290148102.jpg',
        title: 'LAP OF LUXURY',
        kicker: 'THE FESTIVE & OCCASION ATELIER',
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

  // Curated collections
  const newArrivals = products.slice(0, 4);
  const trendingProducts = products.filter((p) => p.isBestSeller).slice(0, 4);
  const bagCreations = products.filter((p) => (p.category || '').toLowerCase() === 'bags' || (p.department || '').toLowerCase() === 'bags').slice(0, 4);
  const footwearCreations = products.filter((p) => (p.category || '').toLowerCase() === 'shoes' || (p.department || '').toLowerCase() === 'footwear').slice(0, 4);
  const menPicks = products
    .filter((p) => {
      const cat = (p.category || '').toLowerCase();
      const dept = (p.department || '').toLowerCase();
      if (
        cat === 'perfumes' ||
        dept === 'perfumes' ||
        cat === 'watches' ||
        dept === 'watches' ||
        cat === 'shoes' ||
        cat === 'footwear' ||
        dept === 'footwear' ||
        cat === 'bags' ||
        dept === 'bags'
      ) {
        return false;
      }
      return dept === 'men' || cat === 'men' || cat === 'jeans';
    })
    .slice(0, 3);

  return (
    <div className="w-full bg-[#FAF8F5] text-[#111113] space-y-12 sm:space-y-16 pb-16">
      {/* 1. LARGE PREMIUM CAMPAIGN SLIDER */}
      <section className="relative w-full bg-[#111113] overflow-hidden border-b border-[#D4AF37]/30">
        <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/8] max-h-[560px] w-full">
          {campaignSlides.map((slide: any, idx: number) => {
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
                  <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.08em] text-white leading-tight max-w-3xl drop-shadow-md">
                    {slide.title}
                  </h2>
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
                {campaignSlides.map((_: any, i: number) => (
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


      <section className="max-w-[1540px] mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8DEC8] pb-4 gap-2">
          <div>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.24em] text-[#8A671A] uppercase block">
              SEASON PREVIEW
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#111113]">
              NEW ARRIVALS
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('new-arrivals')}
            className="text-xs font-bold uppercase tracking-wider text-[#B8860B] hover:text-[#111113] flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>View All New In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCardItem key={product.id} product={product} />
          ))}
        </div>
      </section>



      {/* 6. BESTSELLING BAGS & LEATHERCRAFT */}
      <section className="max-w-[1540px] mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8DEC8] pb-4 gap-2">
          <div>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.24em] text-[#8A671A] uppercase block">
              ATELIER LEATHERS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#111113]">
              BESTSELLING BAGS & ACCESSORIES
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('bags')}
            className="text-xs font-bold uppercase tracking-wider text-[#B8860B] hover:text-[#111113] flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>Explore Bags</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {bagCreations.map((product) => (
            <ProductCardItem key={product.id} product={product} />
          ))}
        </div>
      </section>



      {/* 8. PREMIUM FOOTWEAR COLLECTION SPOTLIGHT */}
      <section className="max-w-[1540px] mx-auto px-4 sm:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8DEC8] pb-4 gap-2">
          <div>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.24em] text-[#8A671A] uppercase block">
              THE LUXURY STRIDE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#111113]">
              PREMIUM FOOTWEAR COLLECTION
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCurrentView('footwear')}
            className="text-xs font-bold uppercase tracking-wider text-[#B8860B] hover:text-[#111113] flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>Explore Footwear</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {footwearCreations.map((product) => (
            <ProductCardItem key={product.id} product={product} />
          ))}
        </div>
      </section>


    </div>
  );
};

// Reusable 3:4 Luxury Product Card for Homepage Grids
const ProductCardItem: React.FC<{ product: Product }> = ({ product }) => {
  const { openProductDetail, setQuickViewProduct, isInWishlist, toggleWishlist } = useStore();
  const inWish = isInWishlist(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#E8DEC8] hover:border-[#B8860B] hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setQuickViewProduct(product)}
        onKeyDown={(e) => e.key === 'Enter' && setQuickViewProduct(product)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF8F5] cursor-pointer block text-left"
      >
        <img
          src={normalizeImageUrl(product.image, product.category)}
          alt={product.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = FALLBACK_LUXURY_IMAGE;
          }}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            product.secondaryImage ? 'group-hover:opacity-0' : ''
          }`}
        />
        {product.secondaryImage && (
          <img
            src={normalizeImageUrl(product.secondaryImage, product.category)}
            alt={`${product.name} alternate`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent && (
            <span className="bg-[#111113] text-[#D4AF37] text-[9.5px] px-2 py-0.5 rounded-md uppercase tracking-wider border border-[#D4AF37]/40 shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#111113] shadow-md flex items-center justify-center transition-all cursor-pointer z-10 active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              inWish ? 'fill-red-600 text-red-600' : 'text-[#2A241E]'
            }`}
          />
        </button>
      </div>

      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
        <button
          type="button"
          onClick={() => setQuickViewProduct(product)}
          className="cursor-pointer block text-left group-hover:text-[#B8860B] transition-colors w-full"
        >
          <span className="text-[9.5px] tracking-[0.18em] uppercase text-[#8A671A] block">
            {product.brand || 'LAP OF LUXURY'}
          </span>
          <h4 className="text-xs sm:text-sm text-[#111113] line-clamp-1 mt-0.5">
            {product.name}
          </h4>
        </button>

        <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base text-[#111113]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            className="p-1.5 text-xs text-[#8A671A] hover:text-[#111113] flex items-center gap-0.5 cursor-pointer font-semibold"
          >
            <span>View</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
