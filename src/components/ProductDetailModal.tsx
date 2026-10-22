import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  Heart,
  Star,
  ShoppingBag,
  ShoppingCart,
  ShieldCheck,
  Check,
  Truck,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Ruler,
  RotateCcw as ResetIcon,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  FALLBACK_LUXURY_IMAGE,
  FALLBACK_CATEGORY_IMAGES,
  normalizeImageUrl,
  getProductGallery,
} from '../utils/imageUtils';

export const ProductDetailModal: React.FC = () => {
  const {
    products,
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCheckoutOpen,
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Customer-Controlled Zoom State (1x to 4x)
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Reset image index, zoom and selections whenever a new product is selected
  useEffect(() => {
    if (quickViewProduct) {
      setActiveImageIndex(0);
      setZoomScale(1);
      setSelectedSize(quickViewProduct.sizes[0] || 'Standard');
      setQuantity(1);
    }
  }, [quickViewProduct?.id]);

  // Related products from same category/department (strictly adhering to Men filtering if Men's apparel)
  const relatedProducts = useMemo(() => {
    if (!quickViewProduct) return [];
    const cat = (quickViewProduct.category || '').toLowerCase();
    const dept = (quickViewProduct.department || '').toLowerCase();
    const isMen = cat === 'men' || dept === 'men' || cat === 'jeans';

    let list = products.filter((p) => {
      if (p.id === quickViewProduct.id) return false;
      const pCat = (p.category || '').toLowerCase();
      const pDept = (p.department || '').toLowerCase();

      // If viewing Men's collection, strictly exclude perfumes, watches, bags, shoes
      if (isMen) {
        if (
          pCat === 'perfumes' ||
          pDept === 'perfumes' ||
          pCat === 'watches' ||
          pDept === 'watches' ||
          pCat === 'shoes' ||
          pCat === 'footwear' ||
          pDept === 'footwear' ||
          pCat === 'bags' ||
          pDept === 'bags' ||
          pCat === 'accessories' ||
          pDept === 'accessories'
        ) {
          return false;
        }
        return pDept === 'men' || pCat === 'men' || pCat === 'jeans';
      }

      return pCat === cat || pDept === dept;
    });

    if (list.length < 4) {
      const fillers = products.filter((p) => {
        if (p.id === quickViewProduct.id || list.some((item) => item.id === p.id)) return false;
        const pCat = (p.category || '').toLowerCase();
        const pDept = (p.department || '').toLowerCase();
        if (isMen) {
          if (
            pCat === 'perfumes' ||
            pDept === 'perfumes' ||
            pCat === 'watches' ||
            pDept === 'watches' ||
            pCat === 'shoes' ||
            pCat === 'footwear' ||
            pDept === 'footwear' ||
            pCat === 'bags' ||
            pDept === 'bags' ||
            pCat === 'accessories' ||
            pDept === 'accessories'
          ) {
            return false;
          }
          return pDept === 'men' || pCat === 'men' || pCat === 'jeans';
        }
        return true;
      });
      list = [...list, ...fillers];
    }

    return list.slice(0, 4);
  }, [quickViewProduct, products]);

  if (!quickViewProduct) return null;

  const inWish = isInWishlist(quickViewProduct.id);
  const currentSize = selectedSize || quickViewProduct.sizes[0] || 'Standard';

  // Build authentic multi-angle gallery images array for this specific product
  const galleryImages = getProductGallery(quickViewProduct);

  const safeImageIndex =
    activeImageIndex >= galleryImages.length ? 0 : activeImageIndex;
  const activeImage =
    galleryImages[safeImageIndex] ||
    normalizeImageUrl(quickViewProduct.image, quickViewProduct.category);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - left) / width) * 100;
    const y = ((touch.clientY - top) / height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleAddToCart = () => {
    addToCart(quickViewProduct, currentSize, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleBuyNow = () => {
    addToCart(quickViewProduct, currentSize, quantity);
    setQuickViewProduct(null);
    setIsCheckoutOpen(true);
  };

  const zoomPresets = [1, 1.5, 2, 2.5, 3.5];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden my-4 sm:my-8 relative">
        {/* Top Control Bar with Back Button & Close */}
        <div className="px-3 sm:px-4 py-2.5 bg-[#FAF8F5] border-b border-[#EAE0CD] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setQuickViewProduct(null)}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D5C7B0] hover:border-[#111111] hover:bg-[#F5EFE3] text-[#111111] text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-xs"
            title="Back to products collection"
          >
            <ArrowLeft className="w-4 h-4 text-[#B89758]" />
            <span className="hidden xs:inline">← Back to Store</span>
            <span className="xs:hidden">← Back</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-sans text-xs tracking-[0.14em] text-[#8C6D1F] uppercase font-semibold hidden sm:inline">
              Lap of Luxury Details
            </span>
            <button
              onClick={() => setQuickViewProduct(null)}
              className="w-8 h-8 rounded-full bg-white hover:bg-[#F2ECE1] border border-[#D5C7B0] flex items-center justify-center text-[#111111] transition-all cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={modalContentRef} className="max-h-[84vh] overflow-y-auto divide-y divide-[#EAE0CD]">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Customer-Controlled Product Zoom & Gallery (lg: 6 cols) */}
          <div className="lg:col-span-6 bg-[#F9F7F2] p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EAE0CD]">
            {/* Customer Zoom Controls Bar */}
            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-[#E2D5BE] mb-3 shadow-xs">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#4A4033] flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-[#B89758]" />
                  <span>Zoom:</span>
                </span>

                {zoomPresets.map((scale) => (
                  <button
                    key={scale}
                    onClick={() => setZoomScale(scale)}
                    className={`px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded transition-colors cursor-pointer ${
                      zoomScale === scale
                        ? 'bg-[#111111] text-[#E5C07B]'
                        : 'bg-[#FAF8F5] text-[#554B3E] hover:bg-[#EFE8DB]'
                    }`}
                  >
                    {scale}x
                  </button>
                ))}
              </div>

              {zoomScale > 1 && (
                <button
                  onClick={() => setZoomScale(1)}
                  className="text-[10px] font-bold text-[#8A7966] hover:text-[#111111] flex items-center gap-1 cursor-pointer"
                >
                  <ResetIcon className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Main Interactive Zoom Container */}
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onClick={() => setZoomScale((prev) => (prev >= 2.5 ? 1 : prev + 0.75))}
              className="relative aspect-square w-full max-w-[320px] sm:max-w-[360px] max-h-[320px] sm:max-h-[360px] mx-auto rounded-xl overflow-hidden bg-white border border-[#E2D5BE] cursor-crosshair shadow-xs select-none flex items-center justify-center p-2"
            >
              <img
                src={activeImage}
                alt={quickViewProduct.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = FALLBACK_LUXURY_IMAGE;
                }}
                className="max-w-full max-h-full object-contain transition-transform duration-150"
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              />

              {/* Live Zoom Status Hint */}
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
                <ZoomIn className="w-3 h-3 text-[#D4AF37]" />
                <span>
                  {zoomScale > 1
                    ? `${zoomScale}x Zoom Active (Move / Drag to inspect)`
                    : 'Click image or use controls to Zoom'}
                </span>
              </div>

              {quickViewProduct.isFestiveEdit && (
                <span className="absolute top-3 left-3 bg-[#B89758] text-white text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded shadow-xs">
                  THE FESTIVE EDIT
                </span>
              )}
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex items-center gap-2.5 mt-3 overflow-x-auto no-scrollbar py-1">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setZoomScale(1);
                  }}
                  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#B89758] ring-2 ring-[#B89758]/40 shadow-xs'
                      : 'border-[#E2D5BE] opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const fallback =
                        FALLBACK_CATEGORY_IMAGES[quickViewProduct.category] ||
                        FALLBACK_LUXURY_IMAGE;
                      if (target.src !== fallback) {
                        target.src = fallback;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Full Specifications & Purchase Module (lg: 6 cols) */}
          <div className="lg:col-span-6 p-4 sm:p-6 flex flex-col justify-between bg-white">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs tracking-[0.14em] uppercase text-[#8C6D1F] font-semibold">
                  {quickViewProduct.category} · Mahbubnagar
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{quickViewProduct.rating}</span>
                  <span className="text-[#8A7C6B]">({quickViewProduct.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-bodoni text-xl sm:text-2xl font-black tracking-wide uppercase text-[#111111] leading-snug">
                {quickViewProduct.name}
              </h1>

              {/* Pricing in clean luxury format */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-sans text-2xl sm:text-3xl font-extrabold text-[#111111] tabular-nums">
                  ₹{quickViewProduct.price.toLocaleString('en-IN')}
                </span>
                {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-sm sm:text-base text-[#948574] line-through tabular-nums font-medium">
                    MRP ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {quickViewProduct.originalPrice && (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Save {Math.round(((quickViewProduct.originalPrice - quickViewProduct.price) / quickViewProduct.originalPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-[#52483C] leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Size Selector */}
              {quickViewProduct.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-bold text-[#111111] uppercase tracking-wider">
                      SELECT SIZE:
                    </span>
                    <span className="text-[#B89758] font-semibold text-[11px] flex items-center gap-1">
                      <Ruler className="w-3 h-3" /> Standard Luxury Fit
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickViewProduct.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-2 text-xs font-bold rounded border transition-all cursor-pointer ${
                          currentSize === s
                            ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                            : 'border-[#D5C7B0] bg-white text-[#4A4033] hover:border-[#B89758]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Stock */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#111111] uppercase">QTY:</span>
                  <div className="flex items-center border border-[#D5C7B0] rounded bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-base hover:bg-[#F2EDE2]"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold text-[#111111] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-base hover:bg-[#F2EDE2]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[#2E6B3B] font-semibold">
                  <Check className="w-4 h-4" />
                  <span>In Stock at Mahbubnagar ({quickViewProduct.stockCount} left)</span>
                </div>
              </div>

              {/* Delivery Promise */}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8DFC8] space-y-1 text-xs text-[#5C5040]">
                <p className="flex items-center gap-1.5 text-[#111111] font-bold">
                  <Truck className="w-3.5 h-3.5 text-[#B89758]" />
                  <span>Express Dispatch Available</span>
                </p>
                <p className="text-[11px]">Free delivery on orders above ₹2,999 · Online payments coming soon.</p>
              </div>
            </div>

            {/* Actions: Add to Cart & Buy Now */}
            <div className="pt-4 border-t border-[#EAE2D2] space-y-2.5">
              <div className="flex gap-2.5">
                <button
                  onClick={handleAddToCart}
                  disabled={!quickViewProduct.inStock}
                  className={`flex-1 py-3 px-3 text-xs sm:text-sm font-extrabold tracking-[0.14em] uppercase rounded transition-all cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-2 ${
                    isAdded
                      ? 'bg-[#111111] text-[#F3D78E]'
                      : 'bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B8860B] hover:brightness-105 text-[#111111]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> ADDED TO CART!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> ADD TO CART
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className="px-3 sm:px-3.5 py-3 rounded border border-[#D5C7B0] hover:bg-[#FAF6EE] text-[#111111] transition-colors cursor-pointer shrink-0"
                  aria-label="Wishlist"
                  title={inWish ? 'In Wishlist' : 'Add to Wishlist'}
                >
                  <Heart
                    className={`w-4 h-4 ${inWish ? 'fill-red-600 text-red-600' : ''}`}
                  />
                </button>

                <a
                  href={`https://wa.me/917578887888?text=${encodeURIComponent(
                    `Hello Lap of Luxury, I am inquiring about ${quickViewProduct.name} (₹${quickViewProduct.price}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 sm:px-3.5 py-3 rounded border border-[#25D366] bg-[#25D366] hover:bg-[#1faa53] text-white transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                  aria-label="Chat on WhatsApp"
                  title="Inquire on WhatsApp"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.677.15-.2.301-.777.979-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.27-.468-2.42-1.492-.895-.798-1.5-1.785-1.675-2.086-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.233-.244-.587-.493-.507-.677-.517-.175-.01-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.111c.15.2 2.123 3.242 5.143 4.547.719.31 1.28.496 1.718.636.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.031-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zm-5.467 7.618c-2.07 0-4.015-.558-5.71-1.53l-.409-.236-4.249 1.114 1.134-4.141-.267-.424C1.61 14.996 1 12.981 1 10.875 1 5.43 5.43 1 10.875 1S20.75 5.43 20.75 10.875 16.32 20.75 10.875 20.75zm0-20.75C4.879 0 0 4.879 0 10.875c0 2.14.61 4.14 1.667 5.845L0 24l7.464-1.636c1.644.975 3.565 1.511 5.541 1.511 5.996 0 10.875-4.879 10.875-10.875S16.871 0 10.875 0z" />
                  </svg>
                </a>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full py-2.5 bg-[#111111] hover:bg-[#2A2A2E] text-white text-xs font-bold tracking-[0.14em] uppercase rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>BUY NOW (INSTANT CHECKOUT)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section in Modal */}
        {relatedProducts.length > 0 && (
          <div className="p-4 sm:p-6 bg-[#FAF8F5]">
            <div className="flex items-center justify-between mb-3.5">
              <div>
                <span className="text-[9px] uppercase tracking-[0.24em] font-extrabold text-[#8C6D1F] block">
                  RECOMMENDED CURATION
                </span>
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#111113] uppercase tracking-wider">
                  Related {quickViewProduct.category} Pieces
                </h3>
              </div>
              <span className="text-[11px] text-[#7A6C58]">
                {relatedProducts.length} Recommended
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => {
                    setQuickViewProduct(rel);
                    setActiveImageIndex(0);
                    setZoomScale(1);
                    if (modalContentRef.current) {
                      modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="group text-left bg-white rounded-xl border border-[#E8DEC8] hover:border-[#B8860B] hover:shadow-md transition-all p-2.5 flex flex-col justify-between cursor-pointer"
                >
                  <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#FAF8F5] mb-2 relative">
                    <img
                      src={normalizeImageUrl(rel.image, rel.category)}
                      alt={rel.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[8px] uppercase tracking-wider text-[#8C6D1F] block">
                      {rel.category}
                    </span>
                    <p className="text-xs font-semibold text-[#111113] line-clamp-1 group-hover:text-[#B8860B] transition-colors">
                      {rel.name}
                    </p>
                    <p className="text-xs font-bold text-[#111113] pt-0.5">
                      ₹{rel.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
