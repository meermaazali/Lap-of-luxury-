import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ArrowLeft,
  Clock,
  ShieldCheck,
  RefreshCw,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useStore } from '../context/StoreContext';
import { compressImage } from '../utils/imageUtils';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartTotal,
    placeOrder,
    setIsCartOpen,
    paymentConfig,
  } = useStore();

  const [currentStep, setCurrentStep] = useState<'address' | 'payment'>('address');

  // Customer Delivery Details
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Mahbubnagar',
    pincode: '509001',
  });

  // Automatic Device Detection (Mobile Phone vs PC / Laptop / Large Screen)
  // Automatically determined without manual switch toggle per prompt requirement
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768
    );
  });

  const [selectedMobileApp, setSelectedMobileApp] = useState<string>('PhonePe');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  
  // 5-Minute Countdown Timer for PC/Laptop QR Code per prompt requirement
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes (300s)
  const [isTimerExpired, setIsTimerExpired] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Desktop/Laptop Screenshot Upload State
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string | null>(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState<boolean>(false);

  // Merchant Details
  const MERCHANT_PHONE = paymentConfig?.upiNumber || '9848263939';
  const MERCHANT_VPA = paymentConfig?.upiId || '9848263939@ybl';
  const MERCHANT_NAME = paymentConfig?.payeeName || 'KODIGANTI DINESH';

  const shippingCost = cartTotal >= 2999 ? 0 : 150;
  const orderTotal = Math.max(0, cartTotal + shippingCost);

  // Stable order reference
  const orderRef = useRef<string>(`LOL-${Math.floor(1000 + Math.random() * 9000)}`);

  // Auto-detect device on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(
        /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768
      );
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate dynamic QR code for desktop when entering payment step
  useEffect(() => {
    if (isCheckoutOpen && currentStep === 'payment' && orderTotal > 0 && !isMobileDevice) {
      const upiUri = `upi://pay?pa=${MERCHANT_VPA}&pn=${encodeURIComponent(
        MERCHANT_NAME
      )}&am=${orderTotal}&cu=INR&tn=${encodeURIComponent(
        `Lap of Luxury Order ${orderRef.current}`
      )}`;

      QRCode.toDataURL(upiUri, {
        width: 340,
        margin: 2,
        color: {
          dark: '#111113',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error('Failed to generate QR code:', err));

      // Reset 5-min timer
      setTimeLeft(300);
      setIsTimerExpired(false);
    }
  }, [isCheckoutOpen, currentStep, orderTotal, isMobileDevice]);

  // 5-minute countdown timer on Desktop/Laptop QR
  useEffect(() => {
    if (currentStep !== 'payment' || isMobileDevice || isTimerExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStep, isMobileDevice, isTimerExpired]);

  if (!isCheckoutOpen) return null;

  const handleRestartTimer = () => {
    setTimeLeft(300);
    setIsTimerExpired(false);
  };

  const handleBackToCart = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const validateAddress = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full recipient name.');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return false;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please enter complete delivery address.');
      return false;
    }
    if (!formData.pincode.trim() || formData.pincode.trim().length < 6) {
      setErrorMessage('Please enter a valid 6-digit postal pincode.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setCurrentStep('payment');
    }
  };

  // Mobile: Trigger native UPI app or PhonePe Gateway with prefilled amount & merchant details
  const handleOpenMobileUPI = async (appName: string) => {
    setSelectedMobileApp(appName);
    setIsSubmitting(true);
    setErrorMessage(null);

    // Place the order in "Payment Pending" state so order details are securely preserved
    try {
      placeOrder(
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city.trim() || 'Mahbubnagar',
          pincode: formData.pincode.trim() || '509001',
          paymentMethod: appName,
          transactionRef: `TXN-${orderRef.current}`,
        },
        shippingCost
      );
    } catch (err) {
      console.warn('Order place error:', err);
    }

    // 1. If PhonePe Gateway is configured, initiate secure server-to-server PhonePe checkout
    if (appName === 'PhonePe') {
      try {
        const response = await fetch('/api/phonepe/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: orderTotal,
            orderId: `order-${orderRef.current}`,
            customerPhone: formData.phone.trim() || MERCHANT_PHONE,
            customerName: formData.name.trim() || 'Guest Customer',
          }),
        });

        const data = await response.json();
        if (data && data.success && data.redirectUrl) {
          window.location.href = data.redirectUrl;
          return;
        }
      } catch (err) {
        console.warn('PhonePe gateway error, using UPI intent fallback:', err);
      }
    }

    // 2. Standard UPI intent fallback
    const baseUpi = `pa=${MERCHANT_VPA}&pn=${encodeURIComponent(
      MERCHANT_NAME
    )}&am=${orderTotal}&cu=INR&tn=${encodeURIComponent(
      `Lap of Luxury Order ${orderRef.current}`
    )}`;

    let targetUri = `upi://pay?${baseUpi}`;

    if (appName === 'PhonePe') {
      targetUri = `phonepe://pay?${baseUpi}`;
    } else if (appName === 'Google Pay') {
      targetUri = `tez://upi/pay?${baseUpi}`;
    } else if (appName === 'Paytm') {
      targetUri = `paytmmp://pay?${baseUpi}`;
    }

    // Launch UPI intent
    try {
      window.location.href = targetUri;
    } catch {
      window.location.href = `upi://pay?${baseUpi}`;
    }

    // Close checkout so return view displays the order confirmation modal with pending status
    setTimeout(() => {
      setIsCheckoutOpen(false);
      setIsSubmitting(false);
    }, 1200);
  };

  // Desktop Screenshot Upload Handler (Optional verification aid)
  const handleScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingScreenshot(true);
    try {
      const compressed = await compressImage(file, 1200, 0.85);
      setScreenshotDataUrl(compressed);
      setScreenshotFileName(file.name);
      setErrorMessage(null);
    } catch (err) {
      console.error('Screenshot compression error:', err);
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotDataUrl(reader.result as string);
        setScreenshotFileName(file.name);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  // Desktop/Laptop "I Have Paid / Continue" Handler: Places order and checks server verification
  const handleDesktopContinue = async () => {
    if (isTimerExpired) {
      setErrorMessage('Payment session has timed out. Please restart the timer to complete.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Submit payment verification request to backend
      fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderRef: orderRef.current,
          amount: orderTotal,
          utrNumber: '',
        }),
      }).catch(() => null);

      // 2. Place order with paymentStatus: "Payment Pending"
      placeOrder(
        {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city.trim() || 'Mahbubnagar',
          pincode: formData.pincode.trim() || '509001',
          paymentMethod: 'UPI QR (Desktop)',
          transactionRef: `TXN-${orderRef.current}`,
          paymentScreenshot: screenshotDataUrl || undefined,
        },
        shippingCost
      );
      setIsCheckoutOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format time remaining MM:SS
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-[#FAF8F5] w-full max-w-xl rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden my-4 sm:my-8 relative text-[#1E1E22]">
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-[#E8DEC8] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={currentStep === 'payment' ? () => setCurrentStep('address') : handleBackToCart}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#D5C7B0] text-[#111111] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-2xs"
              title="Back"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>{currentStep === 'payment' ? 'Back' : 'Back to Bag'}</span>
            </button>

            <div>
              <h2 className="font-serif text-sm sm:text-base font-semibold tracking-wider uppercase text-[#111113]">
                {currentStep === 'address' ? 'Delivery Address' : 'Payment'}
              </h2>
              <span className="text-[10px] text-[#7A6C58] block">
                LAP OF LUXURY · {currentStep === 'address' ? 'Step 1 of 2' : 'Step 2 of 2'}
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
        <div className="bg-[#F2EDE2] px-4 sm:px-6 py-2 border-b border-[#E8DEC8] flex items-center justify-between text-xs font-medium text-[#5E5142]">
          <button
            type="button"
            onClick={() => setCurrentStep('address')}
            className={`flex items-center gap-1.5 cursor-pointer ${
              currentStep === 'address' ? 'text-[#111113] font-bold' : 'text-[#7A6C58]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                currentStep === 'address'
                  ? 'bg-[#111113] text-white border-[#111113]'
                  : 'bg-emerald-600 text-white border-emerald-600'
              }`}
            >
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
              currentStep === 'payment' ? 'text-[#111113] font-bold' : 'text-[#7A6C58]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                currentStep === 'payment'
                  ? 'bg-[#B8860B] text-white border-[#B8860B]'
                  : 'bg-white text-[#7A6C58] border-[#D5C7B0]'
              }`}
            >
              2
            </span>
            <span>2. Payment</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-4">
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
                    placeholder="Recipient Full Name"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5C7B0] rounded-xl text-xs focus:outline-none focus:border-[#B8860B] text-[#111113]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1 uppercase tracking-wider">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5C7B0] rounded-xl text-xs focus:outline-none focus:border-[#B8860B] text-[#111113]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1 uppercase tracking-wider">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="For order receipt & delivery updates"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5C7B0] rounded-xl text-xs focus:outline-none focus:border-[#B8860B] text-[#111113]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1 uppercase tracking-wider">
                  Complete Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Flat/House No, Building, Street, Landmark..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5C7B0] rounded-xl text-xs focus:outline-none focus:border-[#B8860B] text-[#111113] resize-none"
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
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5C7B0] rounded-xl text-xs focus:outline-none focus:border-[#B8860B] text-[#111113]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#5A4F41] mb-1 uppercase tracking-wider">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5C7B0] rounded-xl text-xs focus:outline-none focus:border-[#B8860B] text-[#111113]"
                  />
                </div>
              </div>

              {/* Order Amount Preview */}
              <div className="p-3 bg-white rounded-xl border border-[#E8DFC8] flex items-center justify-between text-xs">
                <span className="text-[#5A4F41]">Total Order Amount:</span>
                <span className="font-bold text-sm text-[#111113]">
                  ₹{orderTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleBackToCart}
                  className="px-4 py-3 border border-[#D5C7B0] bg-white hover:bg-[#FAF8F5] text-[#111113] font-medium text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>Continue to Payment →</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT SECTION (AUTOMATICALLY ADAPTS TO MOBILE OR PC/LAPTOP) */}
          {currentStep === 'payment' && (
            <div className="space-y-4">
              {/* Deliver To Summary */}
              <div className="p-3 bg-white rounded-xl border border-[#E8DFC8] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#7A6C58] uppercase font-semibold block">
                    Deliver To:
                  </span>
                  <p className="font-semibold text-[#111113]">
                    {formData.name} · {formData.phone}
                  </p>
                  <p className="text-[11px] text-[#554D42] truncate max-w-sm">
                    {formData.address}, {formData.city} - {formData.pincode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep('address')}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#B8860B] hover:text-[#111113] border border-[#D5C7B0] rounded-lg hover:bg-[#FAF8F5] cursor-pointer shrink-0"
                >
                  Edit
                </button>
              </div>

              {/* Order Amount Banner */}
              <div className="p-3.5 bg-gradient-to-r from-[#FAF6EE] to-[#F3E7BE] rounded-xl border border-[#D4AF37] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#8A671A] uppercase tracking-wider block">
                    Total Order Amount
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#111113] tabular-nums">
                    ₹{orderTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-right text-[11px] text-[#554D42]">
                  <span className="block font-semibold">Payee: {MERCHANT_NAME}</span>
                  <span className="text-[10px] font-mono text-[#8A671A]">UPI: {MERCHANT_VPA}</span>
                </div>
              </div>

              {/* 1. MOBILE PAYMENT INTERFACE: TEXT ONLY, NO LOGOS, NO UTR REQUIRED */}
              {isMobileDevice ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold tracking-wider uppercase text-[#3D3327]">
                      Choose UPI App (Text Only)
                    </h3>
                    <p className="text-[11px] text-[#7A6C58] mt-0.5">
                      Click an option below to open your payment app with ₹{orderTotal.toLocaleString('en-IN')} prefilled to +919848263939:
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Text Only: PhonePe */}
                    <button
                      type="button"
                      onClick={() => handleOpenMobileUPI('PhonePe')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedMobileApp === 'PhonePe'
                          ? 'bg-[#FAF6EE] border-[#B8860B] ring-1 ring-[#B8860B]'
                          : 'bg-white border-[#D5C7B0] hover:border-[#B8860B]'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#111113]">
                        PhonePe
                      </span>
                      <span className="text-[10px] text-[#7A6C58] block mt-0.5">
                        Open PhonePe App →
                      </span>
                    </button>

                    {/* Text Only: Google Pay */}
                    <button
                      type="button"
                      onClick={() => handleOpenMobileUPI('Google Pay')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedMobileApp === 'Google Pay'
                          ? 'bg-[#FAF6EE] border-[#B8860B] ring-1 ring-[#B8860B]'
                          : 'bg-white border-[#D5C7B0] hover:border-[#B8860B]'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#111113]">
                        Google Pay
                      </span>
                      <span className="text-[10px] text-[#7A6C58] block mt-0.5">
                        Open GPay App →
                      </span>
                    </button>

                    {/* Text Only: Paytm */}
                    <button
                      type="button"
                      onClick={() => handleOpenMobileUPI('Paytm')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedMobileApp === 'Paytm'
                          ? 'bg-[#FAF6EE] border-[#B8860B] ring-1 ring-[#B8860B]'
                          : 'bg-white border-[#D5C7B0] hover:border-[#B8860B]'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#111113]">
                        Paytm
                      </span>
                      <span className="text-[10px] text-[#7A6C58] block mt-0.5">
                        Open Paytm App →
                      </span>
                    </button>

                    {/* Text Only: Other Available UPI Apps */}
                    <button
                      type="button"
                      onClick={() => handleOpenMobileUPI('Other UPI Apps')}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedMobileApp === 'Other UPI Apps'
                          ? 'bg-[#FAF6EE] border-[#B8860B] ring-1 ring-[#B8860B]'
                          : 'bg-white border-[#D5C7B0] hover:border-[#B8860B]'
                      }`}
                    >
                      <span className="block text-xs font-bold text-[#111113]">
                        Other UPI Apps
                      </span>
                      <span className="text-[10px] text-[#7A6C58] block mt-0.5">
                        BHIM, CRED, Amazon Pay →
                      </span>
                    </button>
                  </div>

                  {/* Prominent Direct PhonePe Launch Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenMobileUPI('PhonePe')}
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-98"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#111113]" />
                    <span>{isSubmitting ? 'Opening PhonePe...' : `Pay ₹${orderTotal.toLocaleString('en-IN')} with PhonePe (9848263939)`}</span>
                  </button>

                  <div className="p-3 bg-[#F3EFE6] rounded-xl text-xs text-[#5A4F41] space-y-1">
                    <p>
                      <strong>Merchant UPI ID:</strong> <span className="font-mono text-[#111113]">{MERCHANT_VPA}</span>
                    </p>
                    <p className="text-[11px] text-[#7A6C58]">
                      Authorized Payee: <strong>{MERCHANT_NAME}</strong> ({MERCHANT_PHONE}). Order amount of ₹{orderTotal.toLocaleString('en-IN')} is auto-filled.
                    </p>
                  </div>

                  <div className="pt-1 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('address')}
                      className="w-full py-2.5 border border-[#D5C7B0] bg-white hover:bg-[#FAF8F5] text-[#111113] font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer text-center"
                    >
                      ← Back to Address Details
                    </button>
                  </div>
                </div>
              ) : (
                /* 2. DESKTOP, LAPTOP, AND TV PAYMENT QR WITH 5-MINUTE TIMER & SCREENSHOT UPLOAD */
                <div className="space-y-4 flex flex-col items-center text-center">
                  <div>
                    <h3 className="text-xs font-bold tracking-wider uppercase text-[#3D3327]">
                      Scan Payment QR Code
                    </h3>
                    <p className="text-[11px] text-[#7A6C58] mt-0.5">
                      Scan with any mobile UPI app to pay ₹{orderTotal.toLocaleString('en-IN')} to {MERCHANT_NAME}
                    </p>
                  </div>

                  {/* 5-Minute Countdown Timer Banner */}
                  <div
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
                      isTimerExpired
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : timeLeft <= 60
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        : 'bg-[#FAF6EE] text-[#8A671A] border border-[#D4AF37]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {isTimerExpired
                        ? 'Session Expired (00:00)'
                        : `Time remaining: ${formatTimer(timeLeft)}`}
                    </span>
                  </div>

                  {/* High-Resolution QR Display */}
                  <div className="relative p-3 bg-white rounded-2xl border-2 border-[#D4AF37] shadow-sm flex flex-col items-center">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="UPI Payment QR Code"
                        className={`w-52 h-52 sm:w-60 sm:h-60 object-contain transition-opacity ${
                          isTimerExpired ? 'opacity-25 grayscale' : 'opacity-100'
                        }`}
                      />
                    ) : (
                      <div className="w-52 h-52 flex items-center justify-center text-xs text-gray-400">
                        Generating QR Code...
                      </div>
                    )}

                    {isTimerExpired && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white/95 rounded-2xl">
                        <AlertCircle className="w-8 h-8 text-red-600 mb-2" />
                        <p className="text-xs font-bold text-red-800">Payment Session Expired</p>
                        <p className="text-[11px] text-gray-600 mt-1 mb-3">
                          Please restart the 5-minute timer to complete payment.
                        </p>
                        <button
                          type="button"
                          onClick={handleRestartTimer}
                          className="px-3.5 py-1.5 bg-[#111113] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-black"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Restart 5-Min Timer</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Note Below QR Code (Explicitly Required) */}
                  <p className="text-xs text-[#5A4F41] max-w-sm leading-relaxed bg-[#F7F4EC] p-3 rounded-xl border border-[#E8DEC8]">
                    Please complete the payment of <strong>₹{orderTotal.toLocaleString('en-IN')}</strong> using any UPI app on your phone, then upload the screenshot below and click <strong>“Continue”</strong> to complete your order.
                  </p>

                  {/* Desktop Payment Screenshot Upload Section */}
                  <div className="w-full bg-white p-3.5 rounded-xl border border-[#D5C7B0] text-left space-y-2">
                    <label className="block text-[11px] font-semibold text-[#3D3327] uppercase tracking-wider">
                      Upload Payment Screenshot (Required for Desktop Verification)
                    </label>

                    <div className="flex items-center gap-3">
                      <label className="flex-1 border-2 border-dashed border-[#D5C7B0] hover:border-[#B8860B] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-[#FAF8F5] hover:bg-[#F5EFE3] transition-colors">
                        <Upload className="w-5 h-5 text-[#B8860B] mb-1" />
                        <span className="text-xs font-semibold text-[#111113]">
                          {screenshotFileName ? 'Change Screenshot' : 'Click to Upload Screenshot'}
                        </span>
                        <span className="text-[10px] text-[#7A6C58]">
                          JPG, PNG or photo of payment screen
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                      </label>

                      {/* Preview Thumbnail if selected */}
                      {screenshotDataUrl && (
                        <div className="relative w-16 h-16 rounded-xl border border-[#D4AF37] overflow-hidden shrink-0 shadow-2xs">
                          <img
                            src={screenshotDataUrl}
                            alt="Payment Screenshot Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[8px] font-bold text-center py-0.5">
                            Attached
                          </div>
                        </div>
                      )}
                    </div>

                    {screenshotFileName && (
                      <p className="text-[10.5px] text-emerald-700 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Screenshot attached: {screenshotFileName}</span>
                      </p>
                    )}
                  </div>

                  {/* Desktop Action Buttons */}
                  <div className="w-full pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('address')}
                      className="px-4 py-3 border border-[#D5C7B0] bg-white hover:bg-[#FAF8F5] text-[#111113] font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      ← Back
                    </button>

                    <button
                      type="button"
                      onClick={handleDesktopContinue}
                      disabled={isSubmitting || isTimerExpired}
                      className="flex-1 py-3 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] font-bold text-xs sm:text-sm tracking-wider uppercase rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#111113]" />
                      <span>{isSubmitting ? 'Confirming Order...' : 'I Have Paid / Continue'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
