import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    setIsCheckoutOpen,
    paymentConfig,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2999;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const progressPercent = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'FESTIVE50' || couponCode.trim().toUpperCase() === 'LUXURY') {
      const disc = Math.round(cartTotal * 0.15); // 15% off
      setCouponDiscount(disc);
      setCouponApplied(true);
    } else {
      alert('Coupon code invalid. Try "FESTIVE50" for 15% off!');
    }
  };

  const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD || cartTotal === 0 ? 0 : 150;
  const finalTotal = Math.max(0, cartTotal - couponDiscount + shippingCost);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer panel (Fixed width with no cutoff on mobile or desktop) */}
      <div className="fixed inset-y-0 right-0 w-full max-w-[100vw] sm:max-w-md bg-[#FAF8F5] border-l border-[#E2D7C5] shadow-2xl flex flex-col z-50 overscroll-contain">
        {/* Header with Back Button */}
        <div className="px-4 sm:px-6 py-4 bg-[#FAF8F5] border-b border-[#E8DFC8] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCartOpen(false)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#111111] hover:text-[#B89758] border border-[#D5C7B0] rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <div>
              <h2 className="font-bodoni text-sm sm:text-base font-bold tracking-[0.16em] uppercase text-[#111111]">
                SHOPPING CART
              </h2>
              <p className="text-[11px] text-[#7A6C58]">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full border border-[#D5C7B0] hover:border-[#111111] flex items-center justify-center text-[#111111] hover:bg-[#F2ECE1] transition-all cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#F2EDE2] border-b border-[#E2D7C5] text-xs shrink-0">
          {remainingForFreeShipping > 0 ? (
            <p className="text-[#5C5040] mb-1 font-medium">
              Add <strong className="text-[#111111]">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for <span className="text-[#B8860B] font-bold">FREE SHIPPING</span>
            </p>
          ) : (
            <p className="text-[#2F6B38] font-bold flex items-center gap-1.5">
              <span>🎉</span> You unlocked FREE Express Delivery!
            </p>
          )}
          <div className="w-full bg-[#DFD6C6] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#D4AF37] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 space-y-3 divide-y divide-[#EFE8DC]">
          {cart.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#EFEBE4] flex items-center justify-center text-2xl">
                🛍️
              </div>
              <h3 className="font-bodoni text-sm sm:text-base font-bold text-[#111111] tracking-wider uppercase">
                YOUR BAG IS EMPTY
              </h3>
              <p className="text-xs text-[#7A6D5C] mt-1 max-w-xs mx-auto">
                Explore our festive shirts, raw selvedge denim, Swiss chronographs, and Italian leather accessories.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-5 px-6 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-wider rounded cursor-pointer"
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.product.id}-${item.selectedSize}`} className="pt-3 first:pt-0 flex gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg border border-[#E5DAC8] bg-[#F2EDE2] shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs sm:text-sm font-bold text-[#111111] truncate">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                      className="text-[#998A77] hover:text-red-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-[#7A6C58]">
                    Size: <span className="font-bold text-[#111111]">{item.selectedSize}</span>
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-[#D5C7B0] rounded bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                        className="px-2 py-0.5 text-[#4A4033] hover:bg-[#F2EDE2]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold tabular-nums text-[#111111]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                        className="px-2 py-0.5 text-[#4A4033] hover:bg-[#F2EDE2]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-extrabold text-[#111111] tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#E5DAC8] shadow-lg space-y-3 shrink-0">
            {/* Promo code input */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-[#9E907E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Code (e.g. FESTIVE50)"
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#D5C7B0] rounded focus:outline-none focus:border-[#D4AF37] uppercase"
                />
              </div>
              <button
                onClick={applyCoupon}
                className="px-3 py-1.5 bg-[#FAF6EE] border border-[#C5B59C] text-[#2C241B] text-xs font-bold rounded hover:bg-[#EFE8DD] transition-colors"
              >
                Apply
              </button>
            </div>

            {couponApplied && (
              <div className="flex justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <span>Festive Coupon (15% OFF)</span>
                <span>- ₹{couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1 text-xs text-[#5C5040] pt-1 border-t border-[#EFE8DC]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#111111] tabular-nums">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery (Mahabubnagar / Nationwide)</span>
                <span className="font-bold tabular-nums">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `₹${shippingCost}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-[#111111] pt-1.5 border-t border-[#E5DAC8]">
                <span className="font-bodoni uppercase">Total</span>
                <span className="text-[#B8860B] tabular-nums">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout CTA or Payment Coming Soon */}
            {!paymentConfig.acceptPaymentsOnline ? (
              <div className="space-y-2">
                <div className="p-3 bg-gradient-to-r from-[#FAF6EE] to-[#F3E7BE] border-2 border-[#D4AF37] rounded-xl text-center space-y-1">
                  <span className="text-[10px] tracking-[0.2em] font-extrabold uppercase text-[#B8860B] block">
                    ONLINE PAYMENT COMING SOON
                  </span>
                  <p className="text-xs text-[#2C241B] font-semibold">
                    Catalog ordering active. Direct boutique phone & WhatsApp orders:
                  </p>
                  <a
                    href="tel:7578887888"
                    className="inline-block text-xs font-black text-[#111111] bg-white px-3 py-1 rounded-full border border-[#D4AF37] hover:bg-[#D4AF37] transition-colors"
                  >
                    📞 75 7888 7888
                  </a>
                </div>

                <a
                  href={`https://wa.me/917578887888?text=${encodeURIComponent(
                    `Hello Lap of Luxury, I would like to order my cart items:\n${cart
                      .map((i) => `• ${i.product.name} (${i.selectedSize}) x${i.quantity} = ₹${i.product.price * i.quantity}`)
                      .join('\n')}\nTotal: ₹${finalTotal}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#111111] hover:bg-[#2A2A2E] text-[#E5C07B] text-xs font-extrabold tracking-[0.16em] uppercase rounded shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]"
                >
                  <span>ORDER VIA WHATSAPP / CALL (75 7888 7888)</span>
                </a>
              </div>
            ) : (
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B8860B] hover:brightness-105 text-[#111111] text-xs sm:text-sm font-extrabold tracking-[0.16em] uppercase rounded shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#7A6C58]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Encrypted Checkout · Cash on Delivery (COD) & UPI Accepted</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
