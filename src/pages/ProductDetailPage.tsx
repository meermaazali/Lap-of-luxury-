import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Check,
  Truck,
  RotateCcw,
  ZoomIn,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import {
  normalizeImageUrl,
  getProductGallery,
  FALLBACK_LUXURY_IMAGE,
  FALLBACK_CATEGORY_IMAGES,
} from '../utils/imageUtils';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart, toggleWishlist, isInWishlist, setIsCheckoutOpen } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [pincode, setPincode] = useState<string>('509001');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Load product from context or backend
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // Find in context
    const found = products.find(
      (p) => p.id === id || p.slug === id || p.id.toLowerCase() === id.toLowerCase()
    );
    if (found) {
      setProduct(found);
      setSelectedSize(found.sizes?.[0] || 'Standard');
      setSelectedColor(found.colors?.[0] || 'Default');
      setLoading(false);
    } else {
      // Try to fetch single product from API
      fetch(`/api/products?id=${encodeURIComponent(id)}`)
        .then((res) => res.json())
        .then((data) => {
          const item = Array.isArray(data) ? data.find((p: Product) => p.id === id) : data;
          if (item) {
            setProduct(item);
            setSelectedSize(item.sizes?.[0] || 'Standard');
            setSelectedColor(item.colors?.[0] || 'Default');
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, products]);

  // Set document title
  useEffect(() => {
    if (product) {
      document.title = `${product.name} — LAP OF LUXURY`;
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col justify-between">
        <Header onOpenWishlist={() => setIsWishlistOpen(true)} />
        <LuxuryMegaNav />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs text-[#7A6C58] tracking-widest uppercase">
            Loading Product Details...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col justify-between">
        <Header onOpenWishlist={() => setIsWishlistOpen(true)} />
        <LuxuryMegaNav />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-xl text-[#111113]">Product Not Found</p>
          <p className="text-xs text-[#7A6C58] max-w-md">
            The product you are looking for may have been moved or is temporarily unavailable.
          </p>
          <Link
            to="/shop"
            className="px-6 py-2.5 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
          >
            Return to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const galleryImages = getProductGallery(product);
  const activeImage =
    galleryImages[activeImageIndex] || normalizeImageUrl(product.image, product.category);
  const inWish = isInWishlist(product.id);
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    setIsCheckoutOpen(true);
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6) {
      setPincodeStatus('Please enter a valid 6-digit Indian delivery pincode.');
      return;
    }
    setPincodeStatus(`Available! Standard delivery to ${pincode} within 2-4 business days.`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header onOpenWishlist={() => setIsWishlistOpen(true)} />
      <LuxuryMegaNav />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-[#7A6C58] flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-[#B8860B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-[#B8860B] transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#111113] truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Showcase: Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery with Zoom */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Interactive Zoom Box */}
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onClick={() => setZoomScale((prev) => (prev >= 2.5 ? 1 : prev + 0.75))}
              className="relative aspect-square sm:aspect-4/3 w-full rounded-2xl overflow-hidden bg-white border border-[#E8DEC8] cursor-crosshair shadow-sm select-none"
            >
              <img
                src={activeImage}
                alt={product.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    FALLBACK_CATEGORY_IMAGES[product.category] || FALLBACK_LUXURY_IMAGE;
                }}
                className="w-full h-full object-cover transition-transform duration-150"
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              />

              {/* Discount / Festive Badge */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                {discountPercent && (
                  <span className="bg-[#111113] text-[#D4AF37] text-[10px] uppercase px-2.5 py-1 rounded tracking-wider shadow-xs">
                    {discountPercent}% OFF
                  </span>
                )}
                {product.isFestiveEdit && (
                  <span className="bg-[#B8860B] text-white text-[10px] uppercase px-2.5 py-1 rounded tracking-wider shadow-xs">
                    FESTIVE EDIT
                  </span>
                )}
              </div>

              {/* Wishlist & Share buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#111113] shadow-md flex items-center justify-center transition-all cursor-pointer"
                  title="Save to Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${inWish ? 'fill-red-600 text-red-600' : 'text-[#2A241E]'}`}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#111113] shadow-md flex items-center justify-center transition-all cursor-pointer"
                  title="Share Product"
                >
                  <Share2 className="w-4 h-4 text-[#2A241E]" />
                </button>
              </div>

              {/* Zoom hint */}
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
                <ZoomIn className="w-3 h-3 text-[#D4AF37]" />
                <span>
                  {zoomScale > 1
                    ? `${zoomScale}x Zoom Active (Click to reset)`
                    : 'Click or hover to zoom'}
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setZoomScale(1);
                    }}
                    className={`w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#B8860B] ring-2 ring-[#B8860B]/30'
                        : 'border-[#E8DEC8] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & Purchase Flow */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="space-y-2 border-b border-[#E8DEC8] pb-5">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8A671A] block">
                {product.brand || 'LAP OF LUXURY'} · {product.category}
              </span>
              <h1 className="text-xl sm:text-2xl text-[#111113] leading-snug">
                {product.name}
              </h1>

              {/* Price & Discounts */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl text-[#111113] tabular-nums">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through tabular-nums">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent && (
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#7A6C58]">
                Inclusive of all taxes · Express shipping available
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#3D3327] block">
                Description & Craftsmanship
              </span>
              <p className="text-xs text-[#554D42] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Sizes Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#3D3327]">
                    Select Size
                  </span>
                  <span className="text-[11px] text-[#8A671A]">Selected: {selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#111113] text-[#D4AF37] border-[#111113]'
                          : 'bg-white text-[#3D3327] border-[#D5C7B0] hover:border-[#111113]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-[#3D3327] block">
                  Select Color
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c: string) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                        selectedColor === c
                          ? 'bg-[#111113] text-white border-[#111113]'
                          : 'bg-white text-[#3D3327] border-[#D5C7B0] hover:border-[#111113]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Stock Status */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[#3D3327]">Quantity:</span>
                <div className="flex items-center border border-[#D5C7B0] rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs tabular-nums text-center min-w-[28px]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stockCount || 10, q + 1))}
                    className="px-3 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                {product.inStock && (product.stockCount || 1) > 0 ? (
                  <span className="text-xs text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>In Stock ({product.stockCount || 10} units available)</span>
                  </span>
                ) : (
                  <span className="text-xs text-red-600">Currently Out of Stock</span>
                )}
              </div>
            </div>

            {/* Purchase Action Buttons */}
            <div className="space-y-2.5 pt-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full py-3 bg-white border border-[#111113] text-[#111113] hover:bg-[#FAF8F5] text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-[#B8860B]" />
                  <span>{isAdded ? 'Added to Bag ✓' : 'Add to Bag'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="w-full py-3 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {copiedLink && (
                <p className="text-[11px] text-emerald-700 text-center">
                  Product link copied to clipboard!
                </p>
              )}
            </div>

            {/* Delivery Pincode Checker */}
            <div className="p-4 bg-white rounded-2xl border border-[#E8DEC8] space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#3D3327]">
                <Truck className="w-4 h-4 text-[#B8860B]" />
                <span className="uppercase tracking-wider">Estimated Delivery</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 px-3 py-2 text-xs border border-[#D5C7B0] rounded-xl bg-[#FAF8F5] focus:outline-none focus:border-[#B8860B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p className="text-[11px] text-[#554D42]">{pincodeStatus}</p>
              )}
            </div>

            {/* Shopping Benefits */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#554D42]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
                <span>100% Genuine Luxury Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#B8860B]" />
                <span>7-Day Return / Exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-[#E8DEC8] space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#8A671A] block">
                Recommended For You
              </span>
              <h2 className="text-xl sm:text-2xl text-[#111113] uppercase tracking-wider">
                Related {product.category}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <a
                  key={rel.id}
                  href={`/product/${rel.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E8DEC8] hover:border-[#B8860B] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3EFE9]">
                    <img
                      src={normalizeImageUrl(rel.image, rel.category)}
                      alt={rel.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-3.5 space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-[#8A671A] block">
                      {rel.category}
                    </span>
                    <h3 className="text-xs text-[#111113] line-clamp-1 group-hover:text-[#B8860B] transition-colors">
                      {rel.name}
                    </h3>
                    <p className="text-xs text-[#111113] pt-1">
                      ₹{rel.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <CartDrawer />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
};
