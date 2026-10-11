import React, { useState } from 'react';
import {
  X,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import {
  GooglePayLogo,
  PhonePeLogo,
  BhimUpiLogo,
  PaytmLogo,
  PoweredByUpiBadge,
} from './payment/OriginalPaymentLogos';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsCartOpen,
    cart,
    cartTotal,
    placeOrder,
  } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Mahbubnagar',
    pincode: '509001',
  });

  const [currentStep, setCurrentStep] = useState<'address' | 'payment'>('address');
  const [selectedMethod, setSelectedMethod] = useState<'PhonePe' | 'GooglePay' | 'Paytm' | 'UPI'>('PhonePe');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentClicked, setPaymentClicked] = useState(false);

  if (!isCheckoutOpen) return null;

  const shippingCost = cartTotal >= 2999 ? 0 : 150;
  const orderTotal = cartTotal + shippingCost;
  const upiId = '7578887888@ybl';
  const payeeBrand = 'Lap of Luxury';

  const productDetailsList = cart
    .map((item) => `${item.product.name} (${item.selectedSize}) x${item.quantity}`)
    .join(', ');
  const upiTransactionNote = `Lap of Luxury Mahbubnagar - ${productDetailsList}`.slice(0, 100);

  const handleBackToCart = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const validateAddress = (): boolean => {
    setErrorMessage('');
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please enter your complete delivery address.');
      return false;
    }
    return true;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setCurrentStep('payment');
    }
  };

  // Direct 1-click open with amount pre-filled and product details in note
  const handleDirectAppPayment = (method: 'PhonePe' | 'GooglePay' | 'Paytm' | 'UPI') => {
    if (!validateAddress()) {
      setCurrentStep('address');
      return;
    }

    setSelectedMethod(method);
    setPaymentClicked(true);
    setErrorMessage('');

    const genericUpiIntent = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      payeeBrand
    )}&am=${orderTotal}&cu=INR&tn=${encodeURIComponent(upiTransactionNote)}`;

    let deepLinkUrl = genericUpiIntent;

    if (method === 'PhonePe') {
      deepLinkUrl = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(
        payeeBrand
      )}&am=${orderTotal}&cu=INR&tn=${encodeURIComponent(upiTransactionNote)}`;
    } else if (method === 'GooglePay') {
      deepLinkUrl = `tez://upi/pay?pa=${upiId}&pn=${encodeURIComponent(
        payeeBrand
      )}&am=${orderTotal}&cu=INR&tn=${encodeURIComponent(upiTransactionNote)}`;
    } else if (method === 'Paytm') {
      deepLinkUrl = `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(
        payeeBrand
      )}&am=${orderTotal}&cu=INR&tn=${encodeURIComponent(upiTransactionNote)}`;
    }

    // Direct 1-click open of the chosen payment app
    try {
      window.location.href = deepLinkUrl;
    } catch {
      window.location.href = genericUpiIntent;
    }

    // Fallback to standard UPI protocol if device requires default handler
    setTimeout(() => {
      try {
        window.location.href = genericUpiIntent;
      } catch {
        // safe
      }
    }, 850);
  };

  // Place order confirmation
  const handleConfirmOrder = () => {
    if (!validateAddress()) {
      setCurrentStep('address');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      placeOrder(
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city.trim() || 'Mahbubnagar',
          pincode: formData.pincode.trim() || '509001',
          paymentMethod: 'UPI',
          transactionRef: `${selectedMethod}-TXN-${Date.now().toString().slice(-6)}`,
        },
        0
      );

      setIsCheckoutOpen(false);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-[#FAF8F5] w-full max-w-xl rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden my-6 sm:my-8 relative text-[#1E1E22]">
        {/* Top Header Bar with Bordered Back Button */}
        <div className="px-5 py-3.5 bg-white border-b border-[#E8DEC8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={currentStep === 'payment' ? () => setCurrentStep('address') : handleBackToCart}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#D5C7B0] text-[#111111] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-2xs group"
              title="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#B8860B] group-hover:-translate-x-0.5 transition-transform" />
              <span>{currentStep === 'payment' ? 'Back to Address' : 'Back'}</span>
            </button>

            <div>
              <h2 className="font-serif text-sm sm:text-base font-semibold tracking-wider uppercase text-[#111113]">
                {currentStep === 'address' ? 'Delivery Address' : 'Direct Payment'}
              </h2>
              <span className="text-[10px] text-[#7A6C58] block">
                Lap of Luxury · {currentStep === 'address' ? 'Step 1 of 2' : 'Step 2 of 2'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCheckoutOpen(false)}
            className="w-8 h-8 rounded-full border border-[#D5C7B0] hover:border-[#1E1E22] flex items-center justify-center text-[#1E1E22] hover:bg-[#F2ECE1] transition-all cursor-pointer shrink-0"
            aria-label="Close Checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-[#F2EDE2] px-5 py-2 border-b border-[#E8DEC8] flex items-center justify-between text-xs font-medium text-[#5E5142]">
          <button
            type="button"
            onClick={() => setCurrentStep('address')}
            className={`flex items-center gap-1.5 cursor-pointer ${
              currentStep === 'address' ? 'text-[#111113] font-bold' : 'text-[#7A6C58] hover:text-[#111113]'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
              currentStep === 'address' ? 'bg-[#111113] text-white border-[#111113]' : 'bg-emerald-600 text-white border-emerald-600'
            }`}>
              1
            </span>
            <span>1. Delivery Address</span>
          </button>

          <span className="text-[#B89758]">→</span>

          <button
            type="button"
            onClick={() => {
              if (validateAddress()) setCurrentStep('payment');
            }}
            className={`flex items-center gap-1.5 cursor-pointer ${
              currentStep === 'payment' ? 'text-[#111113] font-bold' : 'text-[#7A6C58] hover:text-[#111113]'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
              currentStep === 'payment' ? 'bg-[#B8860B] text-white border-[#B8860B]' : 'bg-white text-[#7A6C58] border-[#D5C7B0]'
            }`}>
              2
            </span>
            <span>2. Payment (PhonePe / GPay)</span>
          </button>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="mx-5 sm:mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-5">
          {/* STEP 1: Address Details Form */}
          {currentStep === 'address' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikram Reddy"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded-lg text-xs focus:outline-none focus:border-[#B89758] font-normal"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1 uppercase tracking-wider">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 75 7888 7888"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded-lg text-xs focus:outline-none focus:border-[#B89758] font-normal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1 uppercase tracking-wider">
                  Complete Delivery Address *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House / Flat No, Apartment / Street, Landmark..."
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded-lg text-xs focus:outline-none focus:border-[#B89758] font-normal leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1 uppercase tracking-wider">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Mahbubnagar"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded-lg text-xs focus:outline-none focus:border-[#B89758] font-normal"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1 uppercase tracking-wider">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="509001"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded-lg text-xs focus:outline-none focus:border-[#B89758] font-normal"
                  />
                </div>
              </div>

              {/* Order Total Overview in Step 1 */}
              <div className="p-3 bg-white rounded-xl border border-[#E8DFC8] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#6B5E4E]">Total Amount ({cart.length} items):</span>
                  <p className="font-serif text-base font-bold text-[#111113]">
                    ₹{orderTotal.toLocaleString('en-IN')}
                  </p>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  {shippingCost === 0 ? 'FREE Express Delivery' : `+ ₹${shippingCost} Shipping`}
                </span>
              </div>

              {/* Step 1 Actions */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleBackToCart}
                  className="px-4 py-3 border border-[#D5C7B0] bg-white hover:bg-[#FAF8F5] text-[#111113] font-medium text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  ← Back to Bag
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#C29748] via-[#B8860B] to-[#996D19] hover:brightness-105 text-[#111113] font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Proceed to Payment (PhonePe / GPay) →</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Direct Payment Buttons (Requirement: Direct 1-Click Open, No QR Code, No Personal Details) */}
          {currentStep === 'payment' && (
            <div className="space-y-4">
              {/* Delivery Address Summary Bar */}
              <div className="p-3 bg-white rounded-xl border border-[#E8DFC8] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10.5px] text-[#7A6C58] uppercase font-semibold block">Deliver To:</span>
                  <p className="font-semibold text-[#111113]">{formData.name} · {formData.phone}</p>
                  <p className="text-[11px] text-[#554D42] truncate max-w-sm">{formData.address}, {formData.city} - {formData.pincode}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep('address')}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#B8860B] hover:text-[#111113] border border-[#D5C7B0] rounded-lg hover:bg-[#FAF8F5] cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {/* Direct App Selection Notice */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-xs font-semibold tracking-wider uppercase text-[#3D3327]">
                    Select Your Payment App (1-Click Open)
                  </h3>
                  <p className="text-[11px] text-[#7A6C58] mt-0.5">
                    Click to open your app with ₹{orderTotal.toLocaleString('en-IN')} & product details pre-filled:
                  </p>
                </div>
                <PoweredByUpiBadge className="scale-85 origin-right shrink-0" />
              </div>

              {/* Clean Direct Payment App Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. PhonePe Direct 1-Click Button */}
                <button
                  type="button"
                  onClick={() => handleDirectAppPayment('PhonePe')}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-97 text-center group ${
                    selectedMethod === 'PhonePe'
                      ? 'bg-purple-50/80 border-[#5F259F] ring-2 ring-[#5F259F]/30'
                      : 'bg-white border-gray-200 hover:border-[#5F259F]'
                  }`}
                >
                  <div className="h-7 flex items-center justify-center">
                    <PhonePeLogo className="h-6 w-auto" />
                  </div>
                  <span className="text-xs font-bold text-[#111113] group-hover:text-[#5F259F] transition-colors">
                    Pay with PhonePe
                  </span>
                  <span className="text-[10px] text-purple-700 font-semibold bg-purple-100/70 px-2 py-0.5 rounded-full">
                    1-Click Open
                  </span>
                </button>

                {/* 2. Google Pay Direct 1-Click Button */}
                <button
                  type="button"
                  onClick={() => handleDirectAppPayment('GooglePay')}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-97 text-center group ${
                    selectedMethod === 'GooglePay'
                      ? 'bg-blue-50/80 border-[#4285F4] ring-2 ring-[#4285F4]/30'
                      : 'bg-white border-gray-200 hover:border-[#4285F4]'
                  }`}
                >
                  <div className="h-7 flex items-center justify-center">
                    <GooglePayLogo className="h-6 w-auto" />
                  </div>
                  <span className="text-xs font-bold text-[#111113] group-hover:text-[#4285F4] transition-colors">
                    Pay with Google Pay
                  </span>
                  <span className="text-[10px] text-blue-700 font-semibold bg-blue-100/70 px-2 py-0.5 rounded-full">
                    Direct GPay Intent
                  </span>
                </button>

                {/* 3. Paytm / Any UPI App Direct Button */}
                <button
                  type="button"
                  onClick={() => handleDirectAppPayment('Paytm')}
                  className={`p-3.5 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-97 text-center group ${
                    selectedMethod === 'Paytm' || selectedMethod === 'UPI'
                      ? 'bg-amber-50/80 border-[#B8860B] ring-2 ring-[#B8860B]/30'
                      : 'bg-white border-gray-200 hover:border-[#B8860B]'
                  }`}
                >
                  <div className="h-7 flex items-center justify-center gap-1.5">
                    <PaytmLogo className="h-4.5 w-auto" />
                    <BhimUpiLogo className="h-4.5 w-auto" />
                  </div>
                  <span className="text-xs font-bold text-[#111113] group-hover:text-[#B8860B] transition-colors">
                    Paytm / BHIM UPI
                  </span>
                  <span className="text-[10px] text-[#8C6D1F] font-semibold bg-amber-100/70 px-2 py-0.5 rounded-full">
                    Any UPI App
                  </span>
                </button>
              </div>

              {/* Bill Details Summary Card */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E8DFC8] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6B5E4E]">
                  <span>Items Subtotal:</span>
                  <span className="font-semibold text-[#111113]">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#6B5E4E]">
                  <span>Delivery Charges:</span>
                  <span className="font-semibold text-emerald-700">
                    {shippingCost === 0 ? 'FREE EXPRESS' : `₹${shippingCost}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#F0EAE0] flex justify-between items-baseline text-sm text-[#111113]">
                  <span className="font-semibold">Total Payable Bill:</span>
                  <span className="text-base font-bold text-[#111113] tabular-nums">
                    ₹{orderTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Order Status Helper */}
              {paymentClicked && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Payment intent initiated for ₹{orderTotal.toLocaleString('en-IN')}. Once sent in your app, click confirm below to place your order!
                  </span>
                </div>
              )}

              {/* Step 2 Action Buttons */}
              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep('address')}
                  className="px-4 py-3 border border-[#D5C7B0] bg-white hover:bg-[#FAF8F5] text-[#111111] font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  ← Back to Address
                </button>

                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={isVerifying}
                  className="flex-1 py-3 bg-gradient-to-r from-[#C29748] via-[#B8860B] to-[#996D19] hover:brightness-105 text-[#111113] font-semibold text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-[#111113]" />
                      <span>CONFIRM & PLACE ORDER</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
