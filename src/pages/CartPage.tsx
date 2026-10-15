import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../utils/imageUtils';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';
import { WishlistDrawer } from '../components/WishlistDrawer';

export const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, setIsCheckoutOpen } = useStore();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const navigate = useNavigate();

  const shippingCost = cartTotal >= 2999 ? 0 : 150;
  const finalTotal = cartTotal + (cart.length > 0 ? shippingCost : 0);

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header onOpenWishlist={() => setIsWishlistOpen(true)} />
      <LuxuryMegaNav />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#7A6C58] flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#B8860B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#111113]">Shopping Bag</span>
        </nav>

        <div className="border-b border-[#E8DEC8] pb-4 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl text-[#111113] uppercase tracking-wider">
            Your Shopping Bag
          </h1>
          <span className="text-xs text-[#7A6C58]">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
          </span>
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-[#E8DEC8] p-8 space-y-4 max-w-lg mx-auto">
            <ShoppingBag className="w-12 h-12 text-[#B8860B] mx-auto stroke-1" />
            <h2 className="text-lg text-[#111113]">Your Shopping Bag is Empty</h2>
            <p className="text-xs text-[#7A6C58]">
              Explore our curated collections of shirts, denim, leather bags, timepieces, and accessories.
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-2.5 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => {
                const itemSize = item.selectedSize || item.size || 'Standard';
                const itemColor = item.color || '';
                return (
                  <div
                    key={`${item.product.id}-${itemSize}-${itemColor}`}
                    className="bg-white rounded-2xl border border-[#E8DEC8] p-4 sm:p-5 flex gap-4 items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-4">
                      {/* Item Image with link opening in a new tab */}
                      <a
                        href={`/product/${item.product.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#FAF8F5] shrink-0 border border-[#E8DEC8] block"
                      >
                        <img
                          src={normalizeImageUrl(item.product.image, item.product.category)}
                          alt={item.product.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </a>

                      {/* Details */}
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-[#8A671A] block">
                          {item.product.category}
                        </span>
                        <a
                          href={`/product/${item.product.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-[#111113] hover:text-[#B8860B] transition-colors block line-clamp-1"
                        >
                          {item.product.name}
                        </a>
                        <p className="text-[11px] text-[#7A6C58]">
                          Size: {itemSize} {itemColor ? `· Color: ${itemColor}` : ''}
                        </p>
                        <p className="text-xs text-[#111113] pt-1 tabular-nums">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Quantity and Remove */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                      <div className="flex items-center border border-[#D5C7B0] rounded-lg bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              itemSize,
                              Math.max(1, item.quantity - 1),
                              itemColor
                            )
                          }
                          className="px-2.5 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 text-xs tabular-nums min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              itemSize,
                              item.quantity + 1,
                              itemColor
                            )
                          }
                          className="px-2.5 py-1 text-xs hover:bg-gray-100 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id, itemSize, itemColor)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-[#E8DEC8] p-5 sm:p-6 space-y-5 shadow-sm">
              <h2 className="text-sm uppercase tracking-wider text-[#111113] border-b border-[#E8DEC8] pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs text-[#554D42]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Charges</span>
                  <span className="tabular-nums">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700">FREE</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-[10px] text-[#8A671A]">
                    Add ₹{(2999 - cartTotal).toLocaleString('en-IN')} more to unlock Free Express Delivery!
                  </p>
                )}
                <div className="border-t border-[#E8DEC8] pt-3 flex justify-between text-sm text-[#111113]">
                  <span>Total Payable</span>
                  <span className="tabular-nums">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 text-[11px] text-[#7A6C58] space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>PhonePe Verified Secure Payment</span>
                </div>
                <p>Delivery in 2-4 business days. Official GST invoice provided.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
};
