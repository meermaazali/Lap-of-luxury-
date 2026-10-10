import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Clock,
  Sparkles,
  Phone,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  GooglePayLogo,
  PhonePeLogo,
  BhimUpiLogo,
  PoweredByUpiBadge,
  PaytmLogo,
  RuPayLogo,
} from './payment/OriginalPaymentLogos';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    cart,
    cartTotal,
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Mahbubnagar',
    pincode: '509001',
  });

  const [comingSoonNotice, setComingSoonNotice] = useState(false);

  if (!isCheckoutOpen) return null;

  const shippingCost = cartTotal >= 2999 ? 0 : 150;
  const orderTotal = cartTotal + shippingCost;

  const handleBackToCart = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const handleAttemptCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setComingSoonNotice(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
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
                PAYMENT & CHECKOUT
              </h2>
              <span className="text-[10px] text-[#7A6C58] block">
                Lap of Luxury · Flagship Concierge
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

        {/* Informative Status Banner: Online Payment Gateways Coming Soon (COD Removed per user instruction) */}
        <div className="bg-gradient-to-r from-[#FAF3E0] via-[#F5ECD5] to-[#EFE2C2] border-b border-[#D8C7A5] px-5 py-3 flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#8A671A] shrink-0 mt-0.5" />
          <div className="text-xs text-[#4A3D28]">
            <p className="font-bold uppercase tracking-wider text-[#1F1708] flex items-center gap-2">
              <span>Online Payments & Checkout Coming Soon</span>
              <span className="bg-[#B8860B] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                Notice
              </span>
            </p>
            <p className="mt-0.5 leading-relaxed text-[11.5px]">
              We are currently integrating certified payment gateways for Google Pay, PhonePe, and UPI. Online orders and payments are temporarily paused while setup completes.
            </p>
          </div>
        </div>

        {/* DIRECT FORM (No animations per user instruction) */}
        <form onSubmit={handleAttemptCheckout} className="p-5 sm:p-6 space-y-5">
          {comingSoonNotice && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-950 uppercase tracking-wide">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Orders Are Paused For Gateway Integration</span>
              </div>
              <p className="leading-relaxed">
                Thank you for your interest! Online checkout and order placement are temporarily on hold while Google Pay, PhonePe, and UPI gateway integrations are finalized. No orders can be placed at this time.
              </p>
              <p className="font-bold pt-1 text-[#8A671A] flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>For urgent inquiries, call our desk: +91 75 7888 7888</span>
              </p>
            </div>
          )}

          {/* Step 1: Customer Details */}
          <div>
            <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-[#3D3327] mb-2.5 flex items-center justify-between">
              <span>1. Customer & Delivery Information</span>
              <span className="text-[10px] text-[#7A6C58] font-normal lowercase">(preview)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Reddy"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 75 7888 7888"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1">
                DELIVERY ADDRESS
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="House/Apartment, Landmark, Street address..."
                className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:outline-none focus:border-[#B89758]"
              />
            </div>
          </div>

          {/* Step 2: Payment Method Section (All Real Logos + Coming Soon Badge, COD Removed) */}
          <div className="pt-3 border-t border-[#EAE2D2] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-[#3D3327] flex items-center gap-1.5">
                <span>2. Payment Gateway Integration</span>
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300">
                <Clock className="w-3 h-3 text-amber-700" />
                <span>COMING SOON</span>
              </span>
            </div>

            {/* Official Real Payment Partner Logos Showcase */}
            <div className="p-4 bg-white rounded-xl border border-[#E0D5C3] shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-2">
                <span className="text-[10.5px] font-bold text-[#5A4F41] uppercase tracking-wider">
                  Real Payment Partners & Gateways
                </span>
                <PoweredByUpiBadge className="scale-90 origin-right" />
              </div>

              {/* Real Official Logos: Google Pay, PhonePe, BHIM UPI, Paytm, RuPay */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {/* Google Pay Official Logo */}
                <div
                  className="p-2.5 bg-[#FAFAFA] rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-gray-300 transition-colors shadow-2xs"
                  title="Google Pay (GPay) Official Integration"
                >
                  <GooglePayLogo className="h-6 w-auto" />
                  <span className="text-[9px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    COMING SOON
                  </span>
                </div>

                {/* PhonePe Official Logo */}
                <div
                  className="p-2.5 bg-[#FAFAFA] rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-gray-300 transition-colors shadow-2xs"
                  title="PhonePe Official Integration"
                >
                  <PhonePeLogo className="h-6 w-auto" />
                  <span className="text-[9px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    COMING SOON
                  </span>
                </div>

                {/* BHIM UPI Official Logo */}
                <div
                  className="p-2.5 bg-[#FAFAFA] rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-gray-300 transition-colors shadow-2xs"
                  title="BHIM UPI Official Integration"
                >
                  <BhimUpiLogo className="h-5.5 w-auto" />
                  <span className="text-[9px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    COMING SOON
                  </span>
                </div>

                {/* Paytm & RuPay Cards */}
                <div
                  className="p-2.5 bg-[#FAFAFA] rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-gray-300 transition-colors shadow-2xs"
                  title="Paytm & Instant Cards Integration"
                >
                  <div className="flex items-center gap-1.5">
                    <PaytmLogo className="h-4.5 w-auto" />
                    <RuPayLogo className="h-3.5 w-auto" />
                  </div>
                  <span className="text-[9px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    COMING SOON
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#FAF7F0] rounded-lg border border-[#E8DFC8] text-[11px] text-[#5C4F3C] flex items-center justify-between">
                <span className="font-semibold">
                  Zero commission UPI & encrypted bank authorization
                </span>
                <span className="text-[9px] font-bold bg-[#E8DEC8] px-2 py-0.5 rounded text-[#382F24]">
                  PCI-DSS READY
                </span>
              </div>
            </div>

            {/* Note on COD Removal & Order Status */}
            <div className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-[#8A671A] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>Cash on Delivery (COD) is removed.</strong> All orders require verified online payment gateway authorization (Google Pay, PhonePe, BHIM UPI). Order placement will automatically activate once gateway provisioning is live.
              </div>
            </div>
          </div>

          {/* Order Summary Overview */}
          <div className="p-4 bg-white rounded-xl border border-[#E8DFC8] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#6B5E4E]">
              <span>Selected Items ({cart.length}):</span>
              <span className="font-bold text-[#1E1E22] tabular-nums">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-[#6B5E4E]">
              <span>Delivery:</span>
              <span className="font-bold text-emerald-700">
                {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
              </span>
            </div>
            <div className="pt-2 border-t border-[#F0EAE0] flex justify-between items-baseline font-bold text-sm sm:text-base text-[#1E1E22]">
              <span>Cart Value:</span>
              <span className="text-lg font-black text-[#1E1E22] tabular-nums">
                ₹{orderTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Bottom Actions: Disabled / Informative button so NO order can come for now */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleBackToCart}
              className="px-4 py-3.5 border border-[#D5C7B0] bg-white hover:bg-[#FAF8F5] text-[#1E1E22] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 order-2 sm:order-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Bag</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3.5 bg-gradient-to-r from-[#D5C2A5] via-[#C9B18F] to-[#BBA07B] text-[#332A1F] font-black text-xs sm:text-sm tracking-[0.14em] uppercase rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 order-1 sm:order-2 hover:brightness-105 active:scale-98"
            >
              <Lock className="w-4 h-4 text-[#332A1F]" />
              <span>PAYMENTS COMING SOON · NO ORDERS FOR NOW</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
