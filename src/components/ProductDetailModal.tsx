import React, { useState, useRef } from 'react';
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
import { FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';

export const ProductDetailModal: React.FC = () => {
  const {
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

  if (!quickViewProduct) return null;

  const inWish = isInWishlist(quickViewProduct.id);
  const currentSize = selectedSize || quickViewProduct.sizes[0] || 'Standard';

  // Build gallery images array
  const galleryImages = [
    quickViewProduct.image,
    quickViewProduct.secondaryImage || quickViewProduct.image,
    '/src/assets/images/category_luxury_denim_1791098561162.jpg',
    '/src/assets/images/luxury_gold_watch_1791098572108.jpg',
  ].filter(Boolean);

  const activeImage = galleryImages[activeImageIndex] || quickViewProduct.image;

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
        <div className="px-4 py-2.5 bg-[#FAF8F5] border-b border-[#EAE0CD] flex items-center justify-between">
          <button
            onClick={() => setQuickViewProduct(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D5C7B0] hover:border-[#111111] hover:bg-[#F5EFE3] text-[#111111] text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#B89758]" />
            <span>← Back to Store</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-editorial text-xs italic tracking-[0.2em] text-[#8C6D1F] uppercase font-bold hidden sm:inline">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
          {/* Left Column: Customer-Controlled Product Zoom & Gallery (lg: 7 cols) */}
          <div className="lg:col-span-7 bg-[#F9F7F2] p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#EAE0CD]">
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
              className="relative aspect-square sm:aspect-4/3 w-full rounded-xl overflow-hidden bg-white border border-[#E2D5BE] cursor-crosshair shadow-xs select-none"
            >
              <img
                src={activeImage}
                alt={quickViewProduct.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== FALLBACK_LUXURY_IMAGE) {
                    target.src = FALLBACK_LUXURY_IMAGE;
                  }
                }}
                className="w-full h-full object-cover transition-transform duration-150"
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
                referrerPolicy="no-referrer"
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
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Full Specifications & Purchase Module (lg: 5 cols) */}
          <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between bg-white">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="font-editorial text-xs italic tracking-[0.2em] uppercase text-[#8C6D1F] font-bold">
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
                <p className="text-[11px]">Free delivery on orders above ₹2,999 · Cash on Delivery & UPI accepted.</p>
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
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className="px-3.5 py-3 rounded border border-[#D5C7B0] hover:bg-[#FAF6EE] text-[#111111] transition-colors cursor-pointer"
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${inWish ? 'fill-red-600 text-red-600' : ''}`}
                  />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full py-2.5 bg-[#111111] hover:bg-[#2A2A2E] text-white text-xs font-bold tracking-[0.14em] uppercase rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>BUY NOW (INSTANT CHECKOUT)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
