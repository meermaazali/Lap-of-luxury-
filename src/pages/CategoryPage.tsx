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

      const pSub = (p.subCategory || p.subcategory || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      const isPerfume =
        pDept === 'perfumes' ||
        pCat === 'perfumes' ||
        pSub.includes('perfume') ||
        pSub.includes('oud') ||
        pSub.includes('parfum') ||
        pSub.includes('fragrance') ||
        pName.includes('perfume') ||
        pName.includes('parfum') ||
        pName.includes('extrait') ||
        pName.includes('oud');

      const isWatch =
        !isPerfume &&
        !pSub.includes('glasses') &&
        !pName.includes('sunglasses') &&
        !pCat.includes('bag') &&
        (pDept === 'watches' ||
          pCat === 'watches' ||
          pName.includes('watch') ||
          pName.includes('chronograph') ||
          pSub.includes('watch') ||
          pSub.includes('chronograph') ||
          pSub.includes('automatic'));

      const isBag =
        !isPerfume &&
        !isWatch &&
        (pDept === 'bags' ||
          pCat === 'bags' ||
          pSub.includes('bag') ||
          pSub.includes('tote') ||
          pSub.includes('clutch') ||
          pSub.includes('briefcase') ||
          pSub.includes('backpack') ||
          pSub.includes('wallet') ||
          pName.includes('bag') ||
          pName.includes('tote') ||
          pName.includes('clutch'));

      const isFootwear =
        !isPerfume &&
        !isWatch &&
        !isBag &&
        (pDept === 'footwear' ||
          pCat === 'footwear' ||
          pCat === 'shoes' ||
          pSub.includes('sneaker') ||
          pSub.includes('loafer') ||
          pSub.includes('crocs') ||
          pSub.includes('shoe') ||
          pSub.includes('sandal') ||
          pName.includes('sneaker') ||
          pName.includes('loafer') ||
          pName.includes('shoe'));

      const isJeans =
        !isPerfume &&
        !isWatch &&
        !isBag &&
        !isFootwear &&
        (pDept === 'jeans' ||
          pCat === 'jeans' ||
          pSub.includes('jean') ||
          pSub.includes('denim') ||
          pName.includes('jean') ||
          pName.includes('denim'));

      const isEyewear =
        (pCat === 'accessories' && (pSub.includes('glasses') || pSub.includes('eyewear'))) ||
        pName.includes('sunglasses') ||
        pName.includes('glasses') ||
        pName.includes('eyewear') ||
        pName.includes('aviator') ||
        pSub.includes('glasses') ||
        pSub.includes('sunglasses') ||
        pSub.includes('eyewear') ||
        pSub.includes('aviator') ||
        (p.tags || []).some((t) => {
          const tl = String(t).toLowerCase();
          return tl.includes('sunglass') || tl.includes('glasses') || tl.includes('eyewear');
        });

      const isAccessory =
        pCat === 'accessories' ||
        pDept === 'accessories' ||
        isEyewear ||
        pSub.includes('belt') ||
        pSub.includes('glasses') ||
        pName.includes('belt') ||
        pName.includes('buckle');

      let matchCat = false;
      const normTarget = targetCat.trim().toLowerCase();
      const isTargetMen = normTarget === 'men' || normTarget === 'mens' || normTarget === "men's" || normTarget === 'men-fashion';
      const isTargetWomen = normTarget === 'women' || normTarget === 'womens' || normTarget === "women's" || normTarget === 'women-fashion';
      const isTargetWatches = normTarget === 'watches' || normTarget === 'watch';
      const isTargetPerfumes = normTarget === 'perfumes' || normTarget === 'perfume';
      const isTargetBags = normTarget === 'bags' || normTarget === 'bag';
      const isTargetFootwear = normTarget === 'footwear' || normTarget === 'shoes' || normTarget === 'shoe';
      const isTargetJeans = normTarget === 'jeans' || normTarget === 'denim';
      const isTargetAccessories = normTarget === 'accessories' || normTarget === 'sunglasses' || normTarget === 'eyewear';

      if (isTargetWatches) {
        matchCat = isWatch && !isPerfume && !isBag && !isEyewear;
      } else if (isTargetPerfumes) {
        matchCat = isPerfume && !isWatch && !isBag && !isEyewear && !isFootwear;
      } else if (isTargetBags) {
        matchCat = isBag && !isPerfume && !isWatch && !isEyewear;
      } else if (isTargetFootwear) {
        matchCat = isFootwear && !isPerfume && !isWatch && !isBag && !isEyewear;
      } else if (isTargetJeans) {
        matchCat = isJeans && !isPerfume && !isWatch && !isBag && !isFootwear && !isEyewear;
      } else if (isTargetMen) {
        // STRICT: Only Men's clothing/apparel. ABSOLUTELY NEVER sunglasses, accessories, watches, perfumes, bags, footwear, or women's
        if (
          isPerfume ||
          isWatch ||
          isBag ||
          isFootwear ||
          isEyewear ||
          isAccessory ||
          pDept === 'women' ||
          pCat === 'women' ||
          pDept === 'accessories' ||
          pCat === 'accessories' ||
          (p.tags || []).some((t) => {
            const tl = String(t).toLowerCase();
            return tl.includes('women') || tl.includes('sunglass') || tl.includes('eyewear');
          })
        ) {
          return false;
        }
        matchCat =
          (pDept === 'men' || pCat === 'men' || pCat === 'jeans') &&
          !pName.includes('sunglass') &&
          !pName.includes('glasses') &&
          !pSub.includes('glasses');
      } else if (isTargetAccessories) {
        if (isPerfume || isWatch || isBag || isFootwear) return false;
        matchCat = isAccessory || isEyewear;
      } else if (isTargetWomen) {
        // STRICT: Only Women's fashion. ABSOLUTELY NEVER men's clothing, sunglasses, perfumes, watches
        if (
          isPerfume ||
          isWatch ||
          isEyewear ||
          pDept === 'men' ||
          pCat === 'men' ||
          (p.tags || []).some((t) => String(t).toLowerCase() === 'men')
        ) {
          return false;
        }
        matchCat =
          pDept === 'women' ||
          pCat === 'women' ||
          pCat === 'dresses' ||
          pCat === 'sarees' ||
          pSub.includes('saree') ||
          pSub.includes('dress') ||
          pSub.includes('gown') ||
          pSub.includes('lehenga');
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
                    className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF8F5] cursor-pointer block"
                  >
                    <img
                      src={normalizeImageUrl(product.image, product.category)}
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
