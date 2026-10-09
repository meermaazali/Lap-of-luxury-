import React, { useState } from 'react';
import { Heart, Eye, ArrowRight, Check, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ScrollReveal } from './common/ScrollReveal';
import {
  FALLBACK_LUXURY_IMAGE,
  FALLBACK_CATEGORY_IMAGES,
  normalizeImageUrl,
} from '../utils/imageUtils';

export const BestSellersGrid: React.FC = () => {
  const {
    products,
    selectedCategory,
    triggerTransition,
    addToCart,
    wishlist,
    toggleWishlist,
    isInWishlist,
    openProductDetail,
  } = useStore();

  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Filter products based on selectedCategory
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Festive') return p.isFestiveEdit;
    if (selectedCategory === 'Offers') return p.originalPrice && p.originalPrice > p.price;
    if (selectedCategory === 'New Arrivals') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const categoriesTab = [
    { label: 'All Collection', value: 'All' },
    { label: 'Festive Edit', value: 'Festive' },
    { label: "Men's Shirts", value: 'Men' },
    { label: "Women's Collection", value: 'Women' },
    { label: 'Jeans & Denim', value: 'Jeans' },
    { label: 'Watches', value: 'Watches' },
    { label: 'Handbags', value: 'Bags' },
    { label: 'Footwear', value: 'Shoes' },
    { label: 'Accessories', value: 'Accessories' },
    { label: 'Perfumes', value: 'Perfumes' },
  ];

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0] || 'Standard', 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  return (
    <section id="catalog-section" className="py-10 sm:py-14 bg-white/65 backdrop-blur-[2px] border-b border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-3 border-b border-[#D4AF37]/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rotate-45 bg-[#D4AF37]" />
              <span className="font-editorial italic uppercase tracking-[0.22em] text-[11px] sm:text-xs text-[#8A671A] font-medium">
                Hand-Finished Masterpieces
              </span>
            </div>
            <h2 className="font-bodoni text-2xl sm:text-3xl md:text-4xl font-normal sm:font-medium tracking-[0.14em] uppercase text-[#241F1B]">
              BEST SELLERS & NEW ARRIVALS
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerTransition('All', 'Complete Collection')}
              className="text-xs font-medium tracking-[0.16em] uppercase text-[#8A671A] hover:text-[#B8860B] flex items-center gap-1.5 group transition-colors cursor-pointer py-1"
            >
              <span>View All Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Category Tabs in Golden & White */}
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-3 mb-6">
          {categoriesTab.map((tab) => {
            const isActive = selectedCategory === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => triggerTransition(tab.value, tab.label)}
                className={`px-4 py-2 text-xs font-bold tracking-[0.14em] uppercase whitespace-nowrap transition-all rounded-full cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] text-[#111113] shadow-[0_4px_16px_rgba(212,175,55,0.35)] ring-2 ring-[#D4AF37]'
                    : 'bg-white border border-[#D4AF37]/40 text-[#4A4237] hover:border-[#D4AF37] hover:text-[#111113]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-[#FAF8F5] rounded-3xl border border-[#D4AF37]/40 p-8">
            <p className="text-sm font-semibold text-[#6E6457] mb-4">
              No products found in "{selectedCategory}".
            </p>
            <button
              onClick={() => triggerTransition('All', 'Complete Collection')}
              className="px-6 py-2.5 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] text-[#111113] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
            >
              View Full Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
            {filteredProducts.map((product, idx) => {
              const inWish = isInWishlist(product.id);
              const isAdded = addedProductId === product.id;

              return (
                <ScrollReveal key={product.id} delay={idx * 50}>
                  <div
                    onClick={() => openProductDetail(product)}
                    className="h-full group bg-white rounded-2xl border border-[#D4AF37]/30 overflow-hidden flex flex-col justify-between hover:border-[#D4AF37] hover:shadow-[0_12px_32px_rgba(212,175,55,0.18)] transition-all duration-500 cursor-pointer"
                  >
                    {/* Image container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-[#FAF8F5] p-2 flex items-center justify-center">
                      <img
                        src={normalizeImageUrl(product.image, product.category)}
                        alt={product.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const fallback = FALLBACK_CATEGORY_IMAGES[product.category] || FALLBACK_LUXURY_IMAGE;
                          if (target.src !== fallback) {
                            target.src = fallback;
                          }
                        }}
                        className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 rounded-xl"
                      />

                      {/* Floating Gold Quality Tag */}
                      <div className="absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded bg-white/90 backdrop-blur-xs border border-[#D4AF37]/50 text-[9px] font-bold tracking-wider uppercase text-[#8A671A]">
                        ★ 4.9
                      </div>

                      {/* Wishlist toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className="absolute top-3 right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-xs transition-all cursor-pointer z-10 border border-[#D4AF37]/40"
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            inWish
                              ? 'fill-red-600 text-red-600'
                              : 'text-[#6C604F] hover:text-red-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Details Area */}
                    <div className="p-3 sm:p-3.5 text-center flex flex-col flex-1 justify-between bg-white">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#8A671A] mb-0.5">
                          {product.category}
                        </p>
                        <h3 className="font-bodoni text-xs sm:text-sm font-normal sm:font-medium text-[#241F1B] truncate group-hover:text-[#B8860B] transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-center gap-1.5 mt-1 mb-2.5">
                          <span className="font-sans text-xs sm:text-sm font-semibold text-[#241F1B] tabular-nums">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[10px] sm:text-xs text-[#A09382] line-through tabular-nums">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Golden Add to Cart Button */}
                      <button
                        onClick={(e) => handleAdd(e, product)}
                        disabled={!product.inStock}
                        className={`w-full py-2.5 px-2 text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase transition-all rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                          !product.inStock
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : isAdded
                            ? 'bg-[#111113] text-[#F4E09E]'
                            : 'bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> ADDED
                          </>
                        ) : !product.inStock ? (
                          'OUT OF STOCK'
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5 text-[#111113]" />
                            <span>ADD TO CART</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
