import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';

export const CategoryPage: React.FC = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory?: string }>();
  const { products, toggleWishlist, isInWishlist } = useStore();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  const catName = category ? decodeURIComponent(category) : 'All';
  const subcatName = subcategory ? decodeURIComponent(subcategory) : null;

  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => {
      const pCat = (p.category || '').toLowerCase();
      const pDept = (p.department || '').toLowerCase();
      const targetCat = catName.toLowerCase();

      let matchCat = false;
      if (targetCat === 'men') {
        if (pDept === 'women' || pCat === 'women') return false;
        matchCat =
          pDept === 'men' ||
          pCat === 'men' ||
          pCat === 'jeans' ||
          pCat === 'shirts';
      } else if (targetCat === 'women') {
        if (pDept === 'men' || pCat === 'men') return false;
        matchCat =
          pDept === 'women' ||
          pCat === 'women' ||
          pCat === 'dresses' ||
          pCat === 'sarees';
      } else if (targetCat === 'bags') {
        matchCat = pDept === 'bags' || pCat.includes('bag') || Boolean(p.subCategory && p.subCategory.toLowerCase().includes('bag'));
      } else if (targetCat === 'footwear' || targetCat === 'shoes') {
        matchCat = pDept === 'footwear' || pCat.includes('shoe') || pCat.includes('footwear');
      } else if (targetCat === 'perfumes') {
        matchCat = pDept === 'perfumes' || pCat === 'perfumes' || Boolean(p.subCategory && (p.subCategory.toLowerCase().includes('perfume') || p.subCategory.toLowerCase().includes('oud')));
      } else if (targetCat === 'watches') {
        matchCat = pDept === 'watches' || pCat === 'watches' || Boolean(p.subCategory && p.subCategory.toLowerCase().includes('watch'));
      } else if (targetCat === 'jeans') {
        matchCat = pDept === 'jeans' || pCat === 'jeans' || Boolean(p.subCategory && p.subCategory.toLowerCase().includes('jean'));
      } else if (targetCat === 'accessories') {
        matchCat = pDept === 'accessories' || pCat === 'accessories' || pCat === 'watches' || pCat === 'perfumes';
      } else {
        matchCat = pCat === targetCat || pCat.includes(targetCat) || pDept === targetCat;
      }

      if (!matchCat) return false;

      if (subcatName) {
        const targetSub = subcatName.toLowerCase();
        const pSub = (p.subCategory || p.subcategory || '').toLowerCase();
        const pBrand = (p.brand || '').toLowerCase();
        const pTags = (p.tags || []).map((t) => t.toLowerCase());
        const pDesc = (p.description || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        return (
          pSub.includes(targetSub) ||
          pBrand.includes(targetSub) ||
          pTags.some((t) => t.includes(targetSub)) ||
          pDesc.includes(targetSub) ||
          pName.includes(targetSub)
        );
      }
      return true;
    });

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, catName, subcatName, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header onOpenWishlist={() => setIsWishlistOpen(true)} />
      <LuxuryMegaNav />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#7A6C58] flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-[#B8860B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to={`/category/${catName.toLowerCase()}`} className="hover:text-[#B8860B] transition-colors capitalize">
            {catName}
          </Link>
          {subcatName && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-[#111113] capitalize">{subcatName}</span>
            </>
          )}
        </nav>

        {/* Title bar */}
        <div className="border-b border-[#E8DEC8] pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl text-[#111113] uppercase tracking-wider capitalize">
              {subcatName ? `${subcatName} — ${catName}` : `${catName} Collection`}
            </h1>
            <p className="text-xs text-[#7A6C58] mt-1">
              {filteredProducts.length} items available
            </p>
          </div>

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
            </select>
          </div>
        </div>

        {/* Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#E8DEC8] p-8 space-y-3">
            <p className="text-sm text-[#7A6C58]">
              No products found in this category yet.
            </p>
            <Link
              to="/shop"
              className="inline-block px-5 py-2 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
            >
              Explore Full Collection
            </Link>
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
                  {/* Image link: Open in NEW browser tab */}
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

                  {/* Card Info */}
                  <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 space-y-2">
                    <a
                      href={`/product/${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer block group-hover:text-[#B8860B] transition-colors"
                    >
                      <span className="text-[9.5px] tracking-[0.18em] uppercase text-[#8A671A] block">
                        {product.brand || 'LAP OF LUXURY'}
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
