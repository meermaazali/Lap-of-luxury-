import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'How do I place an order with LAP OF LUXURY?',
    a: 'Browse our collections across Men, Women, Bags, and Footwear. Click on any product to view its dedicated details page. Select your size and click "Add to Bag" or "Buy Now". You will be guided through our secure PhonePe checkout flow.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept payments exclusively through our official PhonePe Payment Gateway. You can pay seamlessly via PhonePe App, Google Pay, Paytm, any UPI ID, Debit Card, Credit Card, or NetBanking. We do not offer Cash on Delivery to guarantee authenticity and contactless handling.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Orders are processed and dispatched within 24 hours of payment verification. Standard delivery across India takes 2 to 4 business days. You will receive a tracking link to monitor your order in real time.',
  },
  {
    q: 'What is your return and exchange policy?',
    a: 'We offer an easy 7-day return and exchange policy on all unworn items with original tags and packaging intact. You can initiate a return or exchange request through our Contact page or by reaching out to our concierge at +91 75 7888 7888.',
  },
  {
    q: 'Are all products authentic?',
    a: 'Yes, 100% of the products featured on LAP OF LUXURY are guaranteed genuine and crafted from authentic high-grade materials, including double-ply Egyptian cotton, raw selvedge denim, genuine calfskin leathers, and precision movements.',
  },
  {
    q: 'Where is your physical flagship store located?',
    a: 'Our flagship store is located at D/6, Kota Complex, Telangana Chowrasta, 2-2-2/2, beside Prashant Residency, Mahbubnagar, Telangana 509001. We are open daily from 9:30 AM to 10:00 PM.',
  },
];

export const FaqsPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
          <span className="text-[#111113]">Frequently Asked Questions</span>
        </nav>

        <div className="border-b border-[#E8DEC8] pb-4">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#8A671A] block">
            Customer Assistance
          </span>
          <h1 className="text-2xl sm:text-3xl text-[#111113] uppercase tracking-wider">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-[#7A6C58] mt-1">
            Everything you need to know about our products, shipping, orders, and payment.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8DEC8] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5] transition-colors"
                >
                  <span className="text-sm text-[#111113]">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8A671A] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#554D42] leading-relaxed border-t border-[#F0EAE1]">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-white rounded-2xl border border-[#E8DEC8] text-center space-y-2">
          <h2 className="text-sm text-[#111113] uppercase tracking-wider">
            Still Have Questions?
          </h2>
          <p className="text-xs text-[#7A6C58]">
            Our styling concierge is available daily from 9:30 AM to 10:00 PM.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-block px-5 py-2 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors"
            >
              Contact Our Concierge
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
