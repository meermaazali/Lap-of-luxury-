import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowLeft,
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
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { normalizeImageUrl } from '../utils/imageUtils';

export const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, placeOrder } = useStore();
  const navigate = useNavigate();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const [currentStep, setCurrentStep] = useState<'address' | 'review'>('address');

  // Customer Delivery Details per requirement 3
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
  const [orderComplete, setOrderComplete] = useState<boolean>(false);
  const [placedOrderId, setPlacedOrderId] = useState<string>('');

  const shippingCost = cartTotal >= 2999 ? 0 : 150;
  const orderTotal = Math.max(0, cartTotal + shippingCost);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrderCOD = async () => {
    if (!validateAddress()) {
      setCurrentStep('address');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your bag is empty.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const generatedOrderId = `LOL-${Date.now().toString().slice(-6)}`;
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
          transactionRef: `COD-${generatedOrderId}`,
        },
        shippingCost
      );

      setPlacedOrderId(generatedOrderId);
      setOrderComplete(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to place order:', err);
      setErrorMessage('Failed to place order. Please try again or contact concierge.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
        <Header onOpenWishlist={() => setIsWishlistOpen(true)} />
        <LuxuryMegaNav />

        <main className="flex-1 w-full max-w-xl mx-auto px-4 py-12 sm:py-16 flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#FAF3E6] border-2 border-[#D4AF37] flex items-center justify-center text-[#B8860B] shadow-md animate-in zoom-in-95">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-[0.24em] font-extrabold text-[#8C6D1F] block">
              ORDER RECEIVED & RESERVED
            </span>
            <h1 className="text-2xl sm:text-3xl text-[#111113] uppercase tracking-wider font-semibold font-serif">
              Thank You for Your Order
            </h1>
            <p className="text-xs text-[#7A6C58]">
              Order Reference: <strong className="font-mono text-[#111113]">{placedOrderId}</strong>
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#E8DEC8] text-xs text-[#554D42] text-left space-y-2.5 w-full shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="font-bold text-[#111113] uppercase tracking-wider">Payment Status</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px] uppercase">
                Payment Pending · Pay on Delivery
              </span>
            </div>
            <p><strong>Customer:</strong> {formData.name}</p>
            <p><strong>Mobile:</strong> +91 {formData.phone}</p>
            <p><strong>Delivery Address:</strong> {formData.houseNo}, {formData.street}, {formData.city}, {formData.state} - {formData.pincode}</p>
            <p><strong>Total Amount to Pay:</strong> ₹{orderTotal.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-[#7A6C58] pt-1 border-t border-gray-100">
              Our Mahbubnagar store concierge (+91 75 7888 7888) will verify dispatch with you. You will pay cash or UPI upon delivery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to="/orders"
              className="px-6 py-3 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors font-bold text-center"
            >
              View Order History
            </Link>
            <Link
              to="/shop"
              className="px-6 py-3 bg-white border border-[#D5C7B0] text-[#111113] text-xs uppercase tracking-wider rounded-xl hover:bg-[#FAF8F5] transition-colors font-bold text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </main>

        <Footer />
        <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
        <Header onOpenWishlist={() => setIsWishlistOpen(true)} />
        <LuxuryMegaNav />
        <div className="flex-1 max-w-md mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white border border-[#D5C7B0] flex items-center justify-center mx-auto text-[#8C8274]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-xl text-[#111113] uppercase tracking-wider font-semibold font-serif">
            Your Bag is Empty
          </h1>
          <p className="text-xs text-[#7A6C58]">
            Please add items to your shopping bag before proceeding to checkout.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
          >
            Explore Collections
          </Link>
        </div>
        <Footer />
        <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header onOpenWishlist={() => setIsWishlistOpen(true)} />
      <LuxuryMegaNav />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#7A6C58]">
          <Link to="/cart" className="hover:text-[#111113] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Bag
          </Link>
          <span>/</span>
          <span className="text-[#111113] font-semibold">Checkout</span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] font-extrabold text-[#8C6D1F] block">
              LAP OF LUXURY · SECURE CHECKOUT
            </span>
            <h1 className="text-xl sm:text-2xl text-[#111113] uppercase tracking-wider font-serif font-semibold">
              {currentStep === 'address' ? '1. Delivery Information' : '2. Review & Payment'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                currentStep === 'address'
                  ? 'bg-[#111113] text-[#D4AF37]'
                  : 'bg-white border border-[#D5C7B0] text-[#7A6C58]'
              }`}
            >
              1. Address
            </span>
            <span className="text-gray-300">→</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                currentStep === 'review'
                  ? 'bg-[#111113] text-[#D4AF37]'
                  : 'bg-white border border-[#D5C7B0] text-[#7A6C58]'
              }`}
            >
              2. Review & Payment
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: ADDRESS ENTRY */}
        {currentStep === 'address' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-8 bg-white p-5 sm:p-7 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-5">
              <form onSubmit={handleProceedToReview} className="space-y-4">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DEC8] flex items-center justify-between text-xs">
                  <span className="text-[#554D42] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#B8860B]" />
                    <span>Dispatched from Mahbubnagar Store</span>
                  </span>
                  <span className="font-bold text-emerald-700">
                    {cartTotal >= 2999 ? 'FREE Shipping' : 'Standard Shipping (₹150)'}
                  </span>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                {/* House/Flat & Street */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                {/* Optional Email */}
                <div>
                  <label className="block text-[11px] font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                    Email Address <span className="text-gray-400 font-normal">(Optional, for dispatch tracking)</span>
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

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] text-xs sm:text-sm font-extrabold uppercase tracking-[0.16em] rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Review & Payment →</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Cart Summary Side Column */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-4 h-fit">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111113] border-b border-gray-100 pb-2 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#B8860B]" />
                <span>Bag Summary ({cart.length} item{cart.length === 1 ? '' : 's'})</span>
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2.5 text-xs">
                    <img
                      src={normalizeImageUrl(item.product.image, item.product.category)}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#111113] truncate">{item.product.name}</p>
                      <p className="text-[10.5px] text-[#7A6C58]">
                        Size: {item.selectedSize || item.size || 'Standard'} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-[#111113] tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-[#554D42]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="tabular-nums">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span>{shippingCost === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingCost}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#111113] pt-1 border-t border-gray-100">
                  <span>Total Amount</span>
                  <span className="text-[#8C6D1F] tabular-nums">₹{orderTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: REVIEW & PAYMENT GATEWAY COMING SOON */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Delivery Address Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DEC8]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111113] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#B8860B]" />
                    <span>Delivery Address</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep('address')}
                    className="text-[11px] text-[#B8860B] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Address
                  </button>
                </div>
                <p className="font-bold text-sm text-[#111113]">{formData.name}</p>
                <p className="text-xs text-[#554D42] leading-relaxed">
                  {formData.houseNo}, {formData.street}, {formData.city}, {formData.state} - {formData.pincode}
                </p>
                <p className="text-xs text-[#554D42]">Mobile: +91 {formData.phone}</p>
                {formData.email && <p className="text-xs text-[#7A6C58]">Email: {formData.email}</p>}
              </div>

              {/* Order Total Breakdown */}
              <div className="bg-white p-5 rounded-2xl border border-[#E8DEC8] shadow-xs space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111113] block pb-2 border-b border-[#E8DEC8]">
                  Order Total Breakdown
                </span>
                <div className="space-y-1.5 text-xs text-[#554D42]">
                  <div className="flex justify-between">
                    <span>Items Total ({cart.length} product{cart.length === 1 ? '' : 's'})</span>
                    <span className="tabular-nums">₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span>{shippingCost === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#111113] pt-2 border-t border-gray-100">
                    <span>Payable on Delivery</span>
                    <span className="text-[#8C6D1F] tabular-nums">₹{orderTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MANDATORY PAYMENT GATEWAY COMING SOON SECTION (Requirement 4) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FAF8F5] via-[#FFFDF9] to-[#FAF6EE] border-2 border-[#D4AF37] p-6 sm:p-8 shadow-sm text-center space-y-3 animate-in fade-in">
              <div className="flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B] animate-ping" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.26em] text-[#8C6D1F]">
                  PAYMENT GATEWAY · COMING SOON
                </span>
              </div>

              {/* EXACT REQUIRED MESSAGE VERBATIM */}
              <p className="font-serif text-base sm:text-lg md:text-xl text-[#111113] leading-relaxed font-semibold italic max-w-2xl mx-auto">
                “We’re crafting a smoother, better, and more seamless shopping experience for you. Online payments are coming soon — stay tuned!”
              </p>

              <p className="text-xs text-[#7A6C58] max-w-lg mx-auto leading-relaxed">
                Our automated online card and UPI processing engine is in final staging. You can reserve and place your luxury order right now with <strong>Cash on Delivery (Doorstep Payment)</strong>.
              </p>
            </div>

            {/* Final Order Confirmation Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('address')}
                className="px-5 py-3.5 rounded-xl border border-[#D5C7B0] bg-white hover:bg-[#FAF8F5] text-[#33333A] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center order-2 sm:order-1"
              >
                ← Back to Address
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrderCOD}
                className="flex-1 py-4 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] hover:brightness-105 text-[#111113] font-black text-xs sm:text-sm tracking-[0.16em] uppercase rounded-xl shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-60"
              >
                <Lock className="w-4 h-4 text-[#111113]" />
                <span>
                  {isSubmitting
                    ? 'CONFIRMING ORDER...'
                    : `CONFIRM ORDER · PAY ON DELIVERY (₹${orderTotal.toLocaleString('en-IN')})`}
                </span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#7A6C58] pt-1">
              <Phone className="w-4 h-4 text-[#B8860B]" />
              <span>For phone assistance or bespoke alterations, contact Mahbubnagar Concierge: +91 75 7888 7888</span>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
};
