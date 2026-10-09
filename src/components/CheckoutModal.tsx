import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Copy,
  Smartphone,
  Info,
  Phone,
  Sparkles,
  Clock,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  GooglePayLogo,
  PhonePeLogo,
  BhimUpiLogo,
  PaytmLogo,
} from './payment/OriginalPaymentLogos';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    cart,
    cartTotal,
    placeOrder,
    paymentConfig,
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Mahbubnagar',
    pincode: '509001',
    paymentMethod: 'COD' as 'COD' | 'UPI' | 'Card',
    transactionRef: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isCheckoutOpen) return null;

  const shippingCost = cartTotal >= 2999 ? 0 : 150;
  const orderTotal = cartTotal + shippingCost;

  const handleBackToCart = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMsg('Please enter your full name, phone number, and delivery address.');
      return;
    }

    if (formData.paymentMethod === 'Card') {
      setErrorMsg('Online card processing is coming soon. Please select UPI (GPay/PhonePe) or Cash on Delivery.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      placeOrder({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
        paymentMethod: formData.paymentMethod,
        transactionRef: formData.transactionRef,
      });
      setIsSubmitting(false);
      setIsCheckoutOpen(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-[#FAF8F5] w-full max-w-xl rounded-2xl border-2 border-[#D5C2A5] shadow-2xl overflow-hidden my-6 sm:my-8 relative">
        {/* Top Control Bar with PROMINENT BACK BUTTON */}
        <div className="px-5 py-3.5 bg-white border-b border-[#E8DEC8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleBackToCart}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#D5C7B0] hover:border-[#1E1E22] text-[#111111] text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-2xs group"
              title="Return to Shopping Bag"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#B89758] group-hover:-translate-x-1 transition-transform" />
              <span>Back to Bag</span>
            </button>

            <div>
              <h2 className="font-bodoni text-sm sm:text-base font-black tracking-[0.14em] uppercase text-[#1E1E22]">
                {paymentConfig.acceptPaymentsOnline ? 'SECURE CHECKOUT & PAYMENT' : 'VIP CHECKOUT & RESERVATION'}
              </h2>
              <span className="text-[10px] text-[#7A6C58] block">
                Lap of Luxury · Mahbubnagar Desk: 75 7888 7888
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full border border-[#D5C7B0] hover:border-[#1E1E22] flex items-center justify-center text-[#1E1E22] hover:bg-[#F2ECE1] transition-all cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* DIRECT FORM (No animation per user instruction) */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs rounded-xl font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Step 1: Customer Details */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-[#3D3327] mb-2.5 flex items-center gap-1.5">
              <span>1. Customer & Delivery Contact</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Reddy"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                  PHONE NUMBER (WhatsApp / Call) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 75 7888 7888"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                EMAIL ADDRESS (For order receipt)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="lapofluxurypremium@gmail.com"
                className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
              />
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="pt-3 border-t border-[#EAE2D2]">
            <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-[#3D3327] mb-2.5 flex items-center gap-1.5">
              <span>2. Delivery Address</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                  STREET ADDRESS / LANDMARK *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House/Flat No, Landmark, Area (e.g. Telangana Chowrasta...)"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                    CITY / TOWN *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                    PINCODE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method Selection */}
          <div className="pt-3 border-t border-[#EAE2D2] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-[#3D3327] flex items-center gap-1.5">
                <span>3. Payment Method</span>
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                <Clock className="w-3 h-3 text-amber-700" />
                <span>Cards Gateway: Coming Soon</span>
              </span>
            </div>

            {/* Official Partner Badges (Google Pay, PhonePe, BHIM UPI Original Logos) */}
            <div className="p-3.5 bg-white rounded-xl border border-[#E0D5C3] shadow-xs">
              <p className="text-[10px] font-bold text-[#7A6C58] uppercase tracking-wider mb-2.5 text-center">
                Accepted Payment Partners & Gateways
              </p>
              <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                <div className="h-9 px-3 py-1 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-xs" title="Google Pay">
                  <GooglePayLogo className="h-5" />
                </div>
                <div className="h-9 px-3 py-1 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-xs" title="PhonePe">
                  <PhonePeLogo className="h-6" />
                </div>
                <div className="h-9 px-3 py-1 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-xs" title="BHIM UPI">
                  <BhimUpiLogo className="h-5" />
                </div>
                <div className="h-9 px-3 py-1 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-xs" title="Paytm">
                  <PaytmLogo className="h-4" />
                </div>
              </div>
            </div>

            {/* Payment Method Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              {/* Option 1: Cash on Delivery (COD) - ACTIVE */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'COD'
                    ? 'border-[#B89758] bg-[#FAF3E6] text-[#1E1E22] ring-2 ring-[#B89758]'
                    : 'border-[#D5C7B0] bg-white text-[#5C5040] hover:bg-[#FBF9F5]'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  className="sr-only"
                  checked={formData.paymentMethod === 'COD'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                />
                <div className="w-8 h-8 rounded-lg bg-[#FAF6EE] border border-[#D4AF37]/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Banknote className="w-4 h-4 text-[#B89758]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111113]">Cash on Delivery (COD)</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded">
                      AVAILABLE
                    </span>
                  </div>
                  <span className="text-[11px] text-[#6B5E4E] block mt-0.5">
                    Pay cash or scan at doorstep upon delivery
                  </span>
                </div>
              </label>

              {/* Option 2: Online UPI & Card Gateway - COMING SOON */}
              <div
                onClick={() => {
                  setErrorMsg('Online gateways (Google Pay, PhonePe, BHIM UPI, Cards) are coming soon. Your order is processed with Cash on Delivery.');
                }}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-dashed border-[#D5C7B0] bg-[#FAF8F5]/90 text-[#7A6C58] cursor-pointer hover:bg-[#F5EFE3] transition-colors relative"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Smartphone className="w-4 h-4 text-[#8C6D1F]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#4A4033]">UPI & Online Cards</span>
                    <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded border border-amber-300">
                      COMING SOON
                    </span>
                  </div>
                  <span className="text-[11px] text-[#7A6C58] block mt-0.5">
                    Google Pay · PhonePe · UPI · Cards
                  </span>
                </div>
              </div>
            </div>

            {/* Coming Soon Notice Banner */}
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center gap-2.5 text-xs text-amber-900">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Note:</strong> Online payment gateways (Google Pay, PhonePe, Cards) are <strong>Coming Soon</strong>. Your order will be confirmed with <strong>Cash on Delivery (Pay at Doorstep)</strong>.
              </span>
            </div>
          </div>

          {/* Order Total Overview */}
            <div className="p-4 bg-white rounded-xl border border-[#E8DFC8] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B5E4E]">
                <span>Items ({cart.length}):</span>
                <span className="font-bold text-[#1E1E22] tabular-nums">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[#6B5E4E]">
                <span>Shipping:</span>
                <span className="font-bold text-emerald-700">
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#F0EAE0] flex justify-between items-baseline font-bold text-sm sm:text-base text-[#1E1E22]">
                <span>Total Amount:</span>
                <span className="text-lg font-black text-[#1E1E22] tabular-nums">
                  ₹{orderTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Bottom Actions with PROMINENT BACK BUTTON */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleBackToCart}
                className="px-4 py-3 border border-[#D5C7B0] bg-white hover:bg-[#FAF8F5] text-[#1E1E22] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 order-2 sm:order-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Bag</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] hover:brightness-105 text-[#111111] font-black text-xs sm:text-sm tracking-[0.16em] uppercase rounded-xl shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 order-1 sm:order-2"
              >
                {isSubmitting ? (
                  <span>RECORDING YOUR ORDER...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>CONFIRM ORDER (₹{orderTotal.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};
