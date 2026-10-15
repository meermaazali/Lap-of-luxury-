import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';

interface PolicyPageProps {
  policyType?: 'shipping' | 'returns' | 'privacy' | 'terms';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ policyType: propType }) => {
  const location = useLocation();

  const activeType = (() => {
    if (propType) return propType;
    const path = location.pathname.toLowerCase();
    if (path.includes('shipping')) return 'shipping';
    if (path.includes('returns') || path.includes('refund')) return 'returns';
    if (path.includes('privacy')) return 'privacy';
    if (path.includes('terms')) return 'terms';
    return 'shipping';
  })();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header />
      <LuxuryMegaNav />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#7A6C58] flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#B8860B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#111113] capitalize">{activeType} Policy</span>
        </nav>

        {/* Policy Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#E8DEC8] pb-4">
          <Link
            to="/shipping-policy"
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${
              activeType === 'shipping'
                ? 'bg-[#111113] text-[#D4AF37]'
                : 'bg-white border border-[#D5C7B0] text-[#554D42] hover:border-[#111113]'
            }`}
          >
            Shipping & Delivery
          </Link>
          <Link
            to="/returns-policy"
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${
              activeType === 'returns'
                ? 'bg-[#111113] text-[#D4AF37]'
                : 'bg-white border border-[#D5C7B0] text-[#554D42] hover:border-[#111113]'
            }`}
          >
            Returns & Refunds
          </Link>
          <Link
            to="/privacy-policy"
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${
              activeType === 'privacy'
                ? 'bg-[#111113] text-[#D4AF37]'
                : 'bg-white border border-[#D5C7B0] text-[#554D42] hover:border-[#111113]'
            }`}
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xl transition-all whitespace-nowrap ${
              activeType === 'terms'
                ? 'bg-[#111113] text-[#D4AF37]'
                : 'bg-white border border-[#D5C7B0] text-[#554D42] hover:border-[#111113]'
            }`}
          >
            Terms & Conditions
          </Link>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-[#E8DEC8] p-8 sm:p-10 shadow-sm space-y-6 text-xs sm:text-sm text-[#4E4437] leading-relaxed">
          {activeType === 'shipping' && (
            <div className="space-y-4">
              <h1 className="text-xl sm:text-2xl text-[#111113] uppercase tracking-wider">
                Shipping & Delivery Policy
              </h1>
              <p>
                At <strong>LAP OF LUXURY</strong>, we are dedicated to providing an exceptional delivery experience that reflects the craftsmanship of our fashion creations.
              </p>
              <h2 className="text-sm uppercase tracking-wider text-[#111113] pt-2">
                1. Processing & Dispatch Timeline
              </h2>
              <p>
                All orders placed on our website undergo immediate payment verification via PhonePe and are processed within 24 business hours. Each item is inspected for quality and packaged in our signature luxury presentation box.
              </p>
              <h2 className="text-sm uppercase tracking-wider text-[#111113] pt-2">
                2. Delivery Schedules
              </h2>
              <p>
                Standard delivery within Telangana and major metropolitan regions across India typically arrives in 2 to 4 business days. Regional and rural locations may require 4 to 6 business days.
              </p>
              <h2 className="text-sm uppercase tracking-wider text-[#111113] pt-2">
                3. Shipping Charges
              </h2>
              <p>
                We offer complimentary Free Express Shipping on all orders of ₹2,999 and above. For orders below ₹2,999, a flat shipping fee of ₹150 is applied at checkout.
              </p>
              <h2 className="text-sm uppercase tracking-wider text-[#111113] pt-2">
                4. Live Order Tracking
              </h2>
              <p>
                Once your parcel is handed over to our courier partners (BlueDart / Delhivery / DTDC), you will receive a tracking link via SMS and email. You can also track your shipment status anytime using our Order Tracking page.
              </p>
            </div>
          )}

          {activeType === 'returns' && (
            <div className="space-y-4">
              <h1 className="text-xl sm:text-2xl text-[#111113] uppercase tracking-wider">
                Returns & Refund Policy
              </h1>
              <p>
                We stand behind the uncompromising quality of every piece created for LAP OF LUXURY. If you are not completely satisfied with your selection, our return process is straightforward.
              </p>
              <h2 className="text-sm uppercase tracking-wider text-[#111113] pt-2">
                1. 7-Day Return & Exchange Window
              </h2>
              <p>
                You may request a return or size exchange within 7 calendar days from the date of confirmed delivery.
              </p>
              <h2 className="text-sm uppercase tracking-wider text-[#111113] pt-2">
                2. Condition Requirements
              </h2>
              <p>
                To be eligible for a refund or exchange, items must be unworn, unwashed, unaltered, and accompanied by all original brand tags, dust bags, and packaging intact.
              </p>
              <h2 className="text-sm uppercase tracking-wider text-[#111113] pt-2">
                3. Refund Processing
              </h2>
              <p>
                Approved refunds are credited directly back to the original PhonePe / UPI / Bank account within 5 to 7 business days following receipt and quality inspection at our Mahbubnagar flagship store.
              </p>
            </div>
          )}

          {activeType === 'privacy' && (
            <div className="space-y-4">
              <h1 className="text-xl sm:text-2xl text-[#111113] uppercase tracking-wider">
                Privacy & Data Security Policy
              </h1>
              <p>
                LAP OF LUXURY respects your privacy. We are committed to safeguarding personal information collected through our website (lapofluxury.in).
              </p>
              <h2 className="text-sm uppercase tracking-wider text-[#111113] pt-2">
                1. Information We Collect
              </h2>
              <p>
                We collect your name, phone number, email address, delivery address, and order transaction identifiers necessary to fulfill purchases and provide order updates.
              </p>
              <h2 className="text-sm uppercase tracking-wider text-[#111113] pt-2">
                2. Secure Payment Processing
              </h2>
              <p>
                All financial payments are handled exclusively by PhonePe’s RBI-regulated PCI-DSS compliant payment gateway. LAP OF LUXURY never stores your credit card numbers, debit card PINs, or UPI security credentials on our servers.
              </p>
              <h2 className="text-sm uppercase tracking-wider text-[#111113] pt-2">
                3. Non-Disclosure Commitment
              </h2>
              <p>
                We never sell, rent, or trade your personal information to third-party marketing brokers.
              </p>
            </div>
          )}

          {activeType === 'terms' && (
            <div className="space-y-4">
              <h1 className="text-xl sm:text-2xl text-[#111113] uppercase tracking-wider">
                Terms & Conditions of Service
              </h1>
              <p>
                Welcome to <strong>LAP OF LUXURY</strong>. By browsing or purchasing from lapofluxury.in, you agree to comply with our terms of service.
              </p>
              <h2 className="text-sm uppercase tracking-wider text-[#111113] pt-2">
                1. Product Information & Pricing
              </h2>
              <p>
                Prices for all items are quoted in Indian Rupees (INR) and are inclusive of applicable GST. We reserve the right to correct typographical pricing errors before order fulfillment.
              </p>
              <h2 className="text-sm uppercase tracking-wider text-[#111113] pt-2">
                2. Order Acceptance & Inventory
              </h2>
              <p>
                Orders placed through our website constitute an offer to purchase, subject to verified payment clearance via PhonePe and inventory confirmation.
              </p>
              <h2 className="text-sm uppercase tracking-wider text-[#111113] pt-2">
                3. Governing Law & Jurisdiction
              </h2>
              <p>
                These terms are governed by the laws of India. Any disputes arising in connection with LAP OF LUXURY shall be subject to the exclusive jurisdiction of the courts in Mahbubnagar, Telangana.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
