import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';

export const ShopAllPage: React.FC = () => {
  const { products, addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (onlyInStock) {
      list = list.filter((p) => p.inStock && (p.stockCount || 1) > 0);
    }

    list = list.filter((p) => p.price <= priceRange);

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.id > a.id ? 1 : -1));
    }

    return list;
  }, [products, selectedCategory, onlyInStock, priceRange, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header onOpenWishlist={() => setIsWishlistOpen(true)} />
      <LuxuryMegaNav />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Banner & Title */}
        <div className="border-b border-[#E8DEC8] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#8A671A] block">
              Complete Catalogue
            </span>
            <h1 className="text-2xl sm:text-3xl text-[#111113] uppercase tracking-wider">
              Shop All Creations
            </h1>
            <p className="text-xs text-[#7A6C58] mt-1">
              Showing {filteredProducts.length} authentic luxury pieces
            </p>
          </div>

          {/* Sort & Filter controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#D5C7B0]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B8860B]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs text-[#3D3327] bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#111113] text-[#D4AF37]'
                  : 'bg-white border border-[#D5C7B0] text-[#4A4033] hover:border-[#111113]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#E8DEC8] p-8 space-y-3">
            <p className="text-sm text-[#7A6C58]">No products match the selected filters.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setPriceRange(10000);
                setOnlyInStock(false);
              }}
              className="px-5 py-2 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const inWish = isInWishlist(product.id);
              const discountPercent =
                product.originalPrice && product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : null;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-[#E8DEC8] hover:border-[#B8860B] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Product Card Image: opens in NEW browser tab */}
                  <a
                    href={`/product/${product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-[3/4] w-full overflow-hidden bg-white cursor-pointer flex items-center justify-center p-2.5 sm:p-3"
                  >
                    <img
                      src={normalizeImageUrl(product.image, product.category)}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                      }}
                      className="w-[88%] h-[88%] object-contain m-auto transition-transform duration-500 group-hover:scale-102"
                    />

                    {/* Discount badge */}
                    {discountPercent && (
                      <span className="absolute top-2.5 left-2.5 bg-[#111113] text-[#D4AF37] text-[9.5px] px-2 py-0.5 rounded-md uppercase tracking-wider border border-[#D4AF37]/40 shadow-xs">
                        {discountPercent}% OFF
                      </span>
                    )}

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
                        className={`w-4 h-4 ${inWish ? 'fill-red-600 text-red-600' : 'text-[#2A241E]'}`}
                      />
                    </button>
                  </a>

                  {/* Card Details */}
                  <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
                    <a
                      href={`/product/${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer block group-hover:text-[#B8860B] transition-colors"
                    >
                      <span className="text-[9.5px] tracking-[0.18em] uppercase text-[#8A671A] block">
                        {product.brand || 'LAP OF LUXURY'} · {product.category}
                      </span>
                      <h3 className="text-xs sm:text-sm text-[#111113] line-clamp-1 mt-0.5">
                        {product.name}
                      </h3>
                    </a>

                    <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base text-[#111113] tabular-nums">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[11px] text-gray-400 line-through tabular-nums">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <a
                        href={`/product/${product.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-xs text-[#8A671A] hover:text-[#111113] flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
};
