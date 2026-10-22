import React, { useState } from 'react';
import {
  X,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShoppingBag,
  Sparkles,
  Lock,
  Phone,
  Edit2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { normalizeImageUrl } from '../utils/imageUtils';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    placeOrder,
    setIsCartOpen,
  } = useStore();

  const [currentStep, setCurrentStep] = useState<'address' | 'review'>('address');

  // Customer Delivery Details per requirement 3:
  // Full Name, Mobile Number, House/Flat Number, Street or Locality, City, State, and PIN code.
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    houseNo: '',
    street: '',
    city: 'Mahbubnagar',
    state: 'Telangana',
    pincode: '509001',
    email: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isCheckoutOpen) return null;

  const shippingCost = cartTotal >= 2999 ? 0 : 150;
  const orderTotal = Math.max(0, cartTotal + shippingCost);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    setErrorMessage(null);
  };

  const validateAddress = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please enter your full name.';
    }

    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.houseNo.trim()) {
      errors.houseNo = 'House / Flat / Building number is required.';
    }

    if (!formData.street.trim() || formData.street.trim().length < 3) {
      errors.street = 'Street or locality name is required.';
    }

    if (!formData.city.trim()) {
      errors.city = 'City / Town name is required.';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required.';
    }

    const cleanPincode = formData.pincode.trim().replace(/\D/g, '');
    if (!cleanPincode || cleanPincode.length !== 6) {
      errors.pincode = 'Please enter a valid 6-digit PIN code.';
    }

    if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address or leave blank.';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setErrorMessage('Please fill in all required delivery address fields correctly.');
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setCurrentStep('review');
    }
  };

  const handlePlaceOrderCOD = async () => {
    if (!validateAddress()) {
      setCurrentStep('address');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your bag is empty. Please add items before placing an order.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const fullFormattedAddress = `${formData.houseNo.trim()}, ${formData.street.trim()}, ${formData.city.trim()}, ${formData.state.trim()} - ${formData.pincode.trim()}`;

    try {
      placeOrder(
        {
          name: formData.name.trim(),
          phone: formData.phone.trim().replace(/\D/g, ''),
          email: formData.email.trim() || undefined,
          houseNo: formData.houseNo.trim(),
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          address: fullFormattedAddress,
          paymentMethod: 'Cash on Delivery',
          transactionRef: `COD-${Date.now().toString().slice(-6)}`,
        },
        shippingCost
      );

      // Close modal; the OrderSuccessModal will now trigger from StoreContext
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
    } catch (err) {
      console.error('Failed to place order:', err);
      setErrorMessage('Failed to place order. Please try again or contact concierge.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 xs:p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl border-2 border-[#D4AF37]/50 shadow-2xl overflow-hidden my-4 relative flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-4 py-3.5 bg-[#FAF8F5] border-b border-[#E8DEC8] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {currentStep === 'review' && (
              <button
                type="button"
                onClick={() => setCurrentStep('address')}
                className="w-8 h-8 rounded-full border border-[#D5C7B0] hover:bg-white flex items-center justify-center text-[#111113] transition-colors cursor-pointer mr-1"
                title="Back to delivery address"
              >
                <ArrowLeft className="w-4 h-4 text-[#B8860B]" />
              </button>
            )}
            <div>
              <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-extrabold text-[#8C6D1F] block">
                LAP OF LUXURY · CHECKOUT
              </span>
              <h2 className="font-serif text-base sm:text-lg text-[#111113] uppercase tracking-wider font-semibold">
                {currentStep === 'address' ? 'Delivery Address' : 'Review & Payment Staging'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#7A6C58] hidden xs:inline">
              Step {currentStep === 'address' ? '1 of 2' : '2 of 2'}
            </span>
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="w-8 h-8 rounded-full border border-[#D5C7B0] hover:bg-[#F2ECE1] flex items-center justify-center text-[#111113] transition-all cursor-pointer"
              aria-label="Close checkout"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-[#FAF6EE] h-1.5 flex shrink-0">
          <div
            className={`h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transition-all duration-300 ${
              currentStep === 'address' ? 'w-1/2' : 'w-full'
            }`}
          />
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: DELIVERY ADDRESS */}
          {currentStep === 'address' && (
            <form onSubmit={handleProceedToReview} className="space-y-4">
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E8DEC8] flex items-center justify-between text-xs">
                <span className="text-[#554D42] flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#B8860B]" />
                  <span>Express Dispatch from Mahbubnagar Store</span>
                </span>
                <span className="font-bold text-emerald-700">
                  {cartTotal >= 2999 ? 'FREE Shipping' : 'Standard Shipping (₹150)'}
                </span>
              </div>

              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border rounded-xl focus:outline-none focus:bg-white text-[#111113] transition-colors ${
                      fieldErrors.name
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#D5C7B0] focus:border-[#B8860B]'
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="text-[10px] text-red-600 mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                    Mobile Number (10 Digits) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A6C58] font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className={`w-full pl-12 pr-3.5 py-2.5 text-xs bg-[#FAF8F5] border rounded-xl focus:outline-none focus:bg-white text-[#111113] transition-colors ${
                        fieldErrors.phone
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-[#D5C7B0] focus:border-[#B8860B]'
                      }`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-[10px] text-red-600 mt-1">{fieldErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* House/Flat No & Street/Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                    House / Flat / Apartment No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="houseNo"
                    value={formData.houseNo}
                    onChange={handleInputChange}
                    placeholder="e.g. Flat 402, Royal Residency"
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border rounded-xl focus:outline-none focus:bg-white text-[#111113] transition-colors ${
                      fieldErrors.houseNo
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#D5C7B0] focus:border-[#B8860B]'
                    }`}
                  />
                  {fieldErrors.houseNo && (
                    <p className="text-[10px] text-red-600 mt-1">{fieldErrors.houseNo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                    Street / Locality / Landmark <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="e.g. Near Clock Tower, Station Road"
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border rounded-xl focus:outline-none focus:bg-white text-[#111113] transition-colors ${
                      fieldErrors.street
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#D5C7B0] focus:border-[#B8860B]'
                    }`}
                  />
                  {fieldErrors.street && (
                    <p className="text-[10px] text-red-600 mt-1">{fieldErrors.street}</p>
                  )}
                </div>
              </div>

              {/* City, State & PIN code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Mahbubnagar"
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border rounded-xl focus:outline-none focus:bg-white text-[#111113] transition-colors ${
                      fieldErrors.city
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#D5C7B0] focus:border-[#B8860B]'
                    }`}
                  />
                  {fieldErrors.city && (
                    <p className="text-[10px] text-red-600 mt-1">{fieldErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Telangana"
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border rounded-xl focus:outline-none focus:bg-white text-[#111113] transition-colors ${
                      fieldErrors.state
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#D5C7B0] focus:border-[#B8860B]'
                    }`}
                  />
                  {fieldErrors.state && (
                    <p className="text-[10px] text-red-600 mt-1">{fieldErrors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                    PIN Code (6 Digits) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="509001"
                    className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border rounded-xl focus:outline-none focus:bg-white text-[#111113] transition-colors ${
                      fieldErrors.pincode
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#D5C7B0] focus:border-[#B8860B]'
                    }`}
                  />
                  {fieldErrors.pincode && (
                    <p className="text-[10px] text-red-600 mt-1">{fieldErrors.pincode}</p>
                  )}
                </div>
              </div>

              {/* Optional Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                  Email Address <span className="text-gray-400 font-normal">(Optional, for dispatch notifications)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="client@example.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F5] border border-[#D5C7B0] rounded-xl focus:outline-none focus:bg-white focus:border-[#B8860B] text-[#111113] transition-colors"
                />
                {fieldErrors.email && (
                  <p className="text-[10px] text-red-600 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between gap-3 border-t border-[#E8DEC8]">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-[#554D42] hover:text-[#111113] uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] text-xs sm:text-sm font-extrabold uppercase tracking-[0.16em] rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Review Order & Payment →</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: REVIEW ORDER & PAYMENT COMING SOON NOTICE */}
          {currentStep === 'review' && (
            <div className="space-y-4">
              {/* Delivery Address Summary Card */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E8DEC8] space-y-1 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E8DEC8]">
                  <span className="font-bold text-[#111113] uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>Delivery Details</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('address')}
                    className="text-[11px] text-[#B8860B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Address
                  </button>
                </div>
                <p className="font-semibold text-[#111113] pt-1">{formData.name} · +91 {formData.phone}</p>
                <p className="text-[#554D42]">
                  {formData.houseNo}, {formData.street}, {formData.city}, {formData.state} - {formData.pincode}
                </p>
                {formData.email && (
                  <p className="text-[11px] text-[#7A6C58]">Email: {formData.email}</p>
                )}
              </div>

              {/* Items in Cart Summary */}
              <div className="bg-white rounded-xl border border-[#E8DEC8] p-3.5 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#111113] border-b border-gray-100 pb-2">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>Your Bag ({cart.length} item{cart.length === 1 ? '' : 's'})</span>
                  </span>
                  <span className="text-[11px] text-[#7A6C58]">
                    Subtotal: ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={normalizeImageUrl(item.product.image, item.product.category)}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-[#111113] truncate">{item.product.name}</p>
                          <p className="text-[10.5px] text-[#7A6C58]">
                            Size: {item.selectedSize || item.size || 'Standard'} · Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[#111113] tabular-nums shrink-0">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-100 text-xs space-y-1">
                  <div className="flex justify-between text-[#7A6C58]">
                    <span>Shipping Charges</span>
                    <span>{shippingCost === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#111113] pt-1">
                    <span>Total Amount Payable</span>
                    <span className="text-[#8C6D1F] tabular-nums">₹{orderTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* PAYMENT GATEWAY — COMING SOON MESSAGE (Pure Coming Soon Mode per User Instruction) */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FAF8F5] via-[#FFFDF9] to-[#FAF6EE] border-2 border-[#D4AF37] p-5 sm:p-6 shadow-sm text-center space-y-3 animate-in fade-in">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B] animate-ping" />
                  <span className="text-[10.5px] font-extrabold uppercase tracking-[0.24em] text-[#8C6D1F]">
                    PAYMENT GATEWAY · COMING SOON
                  </span>
                </div>

                {/* EXACT REQUIRED MESSAGE */}
                <p className="font-serif text-sm sm:text-base md:text-lg text-[#111113] leading-relaxed font-semibold italic max-w-lg mx-auto">
                  “We’re crafting a smoother, better, and more seamless shopping experience for you. Online payments are coming soon — stay tuned!”
                </p>

                <p className="text-[11px] text-[#7A6C58] max-w-md mx-auto leading-relaxed">
                  Online order placement and payments are temporarily on hold while we integrate our seamless gateway. To purchase or reserve items in your bag today, please connect with our personal shopping concierge.
                </p>
              </div>

              {/* Actions: Inquire via WhatsApp / Edit Address / Return to Store */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setCurrentStep('address')}
                  className="px-4 py-3 rounded-xl border border-[#D5C7B0] bg-white hover:bg-[#FAF8F5] text-[#33333A] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center order-2 sm:order-1"
                >
                  ← Edit Address
                </button>

                <a
                  href={`https://wa.me/917578887888?text=${encodeURIComponent(
                    `Hello Lap of Luxury Concierge, I have ${cart.length} item(s) in my bag (Total: ₹${orderTotal.toLocaleString('en-IN')}) for delivery to ${formData.name}, ${formData.city}, ${formData.state} (${formData.pincode}). Please assist with my order reservation.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] hover:brightness-105 text-[#111113] font-black text-xs sm:text-sm tracking-[0.16em] uppercase rounded-xl shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.677.15-.2.301-.777.979-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.27-.468-2.42-1.492-.895-.798-1.5-1.785-1.675-2.086-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.233-.244-.587-.493-.507-.677-.517-.175-.01-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.029-1.054 2.509 1.079 2.91 1.23 3.111c.15.2 2.123 3.242 5.143 4.547.719.31 1.28.496 1.718.636.721.23 1.378.197 1.897.12.578-.087 1.78-.727 2.031-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zm-5.467 7.618c-2.07 0-4.015-.558-5.71-1.53l-.409-.236-4.249 1.114 1.134-4.141-.267-.424C1.61 14.996 1 12.981 1 10.875 1 5.43 5.43 1 10.875 1S20.75 5.43 20.75 10.875 16.32 20.75 10.875 20.75zm0-20.75C4.879 0 0 4.879 0 10.875c0 2.14.61 4.14 1.667 5.845L0 24l7.464-1.636c1.644.975 3.565 1.511 5.541 1.511 5.996 0 10.875-4.879 10.875-10.875S16.871 0 10.875 0z" />
                  </svg>
                  <span>Inquire via WhatsApp Concierge</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#7A6C58] pt-1">
                <Phone className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Mahbubnagar Store Concierge: +91 75 7888 7888</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
