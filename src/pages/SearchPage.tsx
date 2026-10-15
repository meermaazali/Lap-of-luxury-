import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Heart, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const { products, toggleWishlist, isInWishlist } = useStore();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchTerm.trim() ? { q: searchTerm.trim() } : {});
  };

  const results = useMemo(() => {
    const q = queryParam.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      const matchSub = (p.subCategory || p.subcategory || '').toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchTags = (p.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchName || matchCat || matchSub || matchDesc || matchTags;
    });
  }, [products, queryParam]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header onOpenWishlist={() => setIsWishlistOpen(true)} />
      <LuxuryMegaNav />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Input Box */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#8A671A] block">
            Product Search
          </span>
          <h1 className="text-2xl sm:text-3xl text-[#111113] uppercase tracking-wider">
            Find Your Next Luxury Piece
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search shirts, jeans, handbags, watches, sneakers..."
              className="w-full px-4 py-3.5 pl-11 text-xs border border-[#D5C7B0] rounded-2xl bg-white focus:outline-none focus:border-[#B8860B] shadow-sm"
            />
            <SearchIcon className="w-4 h-4 text-[#8A671A] absolute left-4 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {queryParam && (
            <p className="text-xs text-[#7A6C58]">
              Found {results.length} result{results.length === 1 ? '' : 's'} for "{queryParam}"
            </p>
          )}
        </div>

        {/* Results Grid */}
        {results.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#E8DEC8] p-8 space-y-3 max-w-md mx-auto">
            <p className="text-sm text-[#7A6C58]">No products matched your search.</p>
            <p className="text-xs text-[#A09382]">
              Try searching with general keywords like "shirt", "denim", "bag", or "watch".
            </p>
            <Link
              to="/shop"
              className="inline-block px-5 py-2 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {results.map((product) => {
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
                  {/* Product Image: Opens in NEW browser tab */}
                  <a
                    href={`/product/${product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3EFE9] cursor-pointer block"
                  >
                    <img
                      src={normalizeImageUrl(product.image, product.category)}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {discountPercent && (
                      <span className="absolute top-2.5 left-2.5 bg-[#111113] text-[#D4AF37] text-[9.5px] px-2 py-0.5 rounded-md uppercase tracking-wider border border-[#D4AF37]/40 shadow-xs">
                        {discountPercent}% OFF
                      </span>
                    )}

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
