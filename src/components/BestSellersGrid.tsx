import React, { useState } from 'react';
import { Heart, Eye, ArrowRight, Check, ShoppingCart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ScrollReveal } from './common/ScrollReveal';
import { FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';

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
    { label: 'Shirts', value: 'Men' },
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
    <section id="catalog-section" className="py-8 sm:py-12 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-3 border-b border-[#E0D3BC]">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rotate-45 bg-[#B89758]" />
              <span className="font-editorial italic uppercase tracking-[0.2em] text-[11px] sm:text-xs text-[#8C6D1F] font-semibold">
                Curated Luxury Selections
              </span>
            </div>
            <h2 className="font-bodoni text-xl sm:text-3xl font-black tracking-[0.16em] uppercase text-[#111111]">
              BEST SELLERS
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerTransition('All', 'Complete Collection')}
              className="text-xs font-bold tracking-wider uppercase text-[#111111] hover:text-[#B8860B] flex items-center gap-1 group transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-5">
          {categoriesTab.map((tab) => {
            const isActive = selectedCategory === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => triggerTransition(tab.value, tab.label)}
                className={`px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all rounded cursor-pointer ${
                  isActive
                    ? 'bg-[#111111] text-[#F3D78E] shadow-xs'
                    : 'bg-white border border-[#D5C7B0] text-[#4A4237] hover:border-[#B89758] hover:text-[#111111]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Products Grid (2 columns on mobile, 3 on sm, 6 on lg) */}
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-[#E8DFCF] p-8">
            <p className="text-sm text-[#6E6457] mb-3">
              No products found in "{selectedCategory}".
            </p>
            <button
              onClick={() => triggerTransition('All', 'Complete Collection')}
              className="px-5 py-2 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer"
            >
              View Full Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {filteredProducts.map((product, idx) => {
              const inWish = isInWishlist(product.id);
              const isAdded = addedProductId === product.id;

              return (
                <ScrollReveal key={product.id} delay={idx * 60}>
                  <div
                    onClick={() => openProductDetail(product)}
                    className="h-full group bg-white rounded-xl border border-[#E0D5BE] overflow-hidden flex flex-col justify-between hover:border-[#B89758] hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    {/* Image container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-[#F6F3EE] p-1.5 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== FALLBACK_LUXURY_IMAGE) {
                            target.src = FALLBACK_LUXURY_IMAGE;
                          }
                        }}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-lg"
                        referrerPolicy="no-referrer"
                      />

                      {/* Wishlist toggle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        className="absolute top-2.5 right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/95 hover:bg-white flex items-center justify-center shadow-xs transition-all cursor-pointer z-10"
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            inWish
                              ? 'fill-red-600 text-red-600'
                              : 'text-[#5C5244] hover:text-red-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Details Area */}
                    <div className="p-2.5 sm:p-3 text-center flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-sans text-xs sm:text-sm font-bold text-[#111111] truncate hover:text-[#B8860B] transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-center gap-1.5 mt-0.5 mb-2">
                          <span className="font-sans text-xs sm:text-sm font-extrabold text-[#111111] tabular-nums">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[10px] sm:text-xs text-[#9E9080] line-through tabular-nums">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Sleek Warm Gold Add to Cart Button */}
                      <button
                        onClick={(e) => handleAdd(e, product)}
                        disabled={!product.inStock}
                        className={`w-full py-2 px-2 text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase transition-all rounded shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                          !product.inStock
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : isAdded
                            ? 'bg-[#1E1E22] text-[#E5C07B]'
                            : 'bg-[#C5A880] hover:bg-[#B89758] text-white'
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
                            <ShoppingCart className="w-3 h-3 text-white" />
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
