import React, { useState } from 'react';
import { X, Truck, RotateCcw, Ruler, HelpCircle, Phone, Briefcase } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  initialTab?: string;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  initialTab = 'shipping',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden relative my-6">
        {/* Header with Back button */}
        <div className="px-5 sm:px-6 py-4 bg-[#FAF8F5] border-b border-[#E8DFC8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#111111] hover:text-[#B89758] border border-[#D5C7B0] rounded-lg hover:bg-white transition-colors cursor-pointer"
            >
              ← Back
            </button>
            <span className="font-bodoni font-extrabold tracking-wider uppercase text-sm sm:text-base text-[#111111]">
              CUSTOMER CONCIERGE & POLICIES
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-[#D5C7B0] hover:bg-[#F2EDE2] flex items-center justify-center text-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#E8DEC8] bg-[#F7F4EC] overflow-x-auto no-scrollbar">
          {[
            { id: 'shipping', label: 'Shipping Policy', icon: Truck },
            { id: 'size', label: 'Size Guide', icon: Ruler },
            { id: 'faq', label: 'FAQs', icon: HelpCircle },
            { id: 'contact', label: 'Contact Us', icon: Phone },
            { id: 'careers', label: 'Careers', icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-[#B89758] bg-white text-[#111111]'
                    : 'border-transparent text-[#6B5F50] hover:text-[#111111]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#B89758]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body content based on tab */}
        <div className="p-6 text-xs sm:text-sm text-[#4A3E2F] space-y-4 max-h-[60vh] overflow-y-auto">
          {activeTab === 'shipping' && (
            <div className="space-y-3">
              <h3 className="font-bodoni font-bold text-base text-[#111111] uppercase tracking-wider">
                COMPLIMENTARY SHIPPING & EXPRESS DISPATCH
              </h3>
              <p className="leading-relaxed">
                We provide <strong>FREE express delivery</strong> on all orders above <strong>₹2,999</strong> across Telangana and all states across India. For orders below ₹2,999, a nominal flat express shipping charge of ₹150 applies.
              </p>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8DEC8] space-y-2">
                <p><strong>• Mahabubnagar & Hyderabad:</strong> Same-day or next-day direct courier (24 – 48 Hours).</p>
                <p><strong>• South India Metro:</strong> 2 to 3 Business Days.</p>
                <p><strong>• Rest of India:</strong> 3 to 5 Business Days with live tracking SMS & WhatsApp updates.</p>
              </div>
              <p className="text-[#6B5F50]">
                Every order is hand-inspected and shipped in sealed, tamper-evident luxury presentation packaging.
              </p>
            </div>
          )}

          {activeTab === 'size' && (
            <div className="space-y-3">
              <h3 className="font-bodoni font-bold text-base text-[#111111] uppercase tracking-wider">
                PRECISION SIZE & FIT GUIDE
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#E5DAC8] rounded-lg overflow-hidden">
                  <thead className="bg-[#FAF8F5] text-[#111111] font-bold border-b border-[#E5DAC8]">
                    <tr>
                      <th className="p-2.5">Category</th>
                      <th className="p-2.5">Size / Spec</th>
                      <th className="p-2.5">Chest / Waist</th>
                      <th className="p-2.5">Recommended Fit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE8DC]">
                    <tr>
                      <td className="p-2.5 font-bold">Premium Shirts</td>
                      <td className="p-2.5">38 (S) / 40 (M)</td>
                      <td className="p-2.5">38" - 41" Chest</td>
                      <td className="p-2.5">Tailored Regular</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Premium Shirts</td>
                      <td className="p-2.5">42 (L) / 44 (XL)</td>
                      <td className="p-2.5">42" - 45" Chest</td>
                      <td className="p-2.5">Comfort Classic</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Selvedge Jeans</td>
                      <td className="p-2.5">30, 32, 34, 36, 38</td>
                      <td className="p-2.5">True to Waist Size</td>
                      <td className="p-2.5">Slim Straight Contour</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Men's Watches</td>
                      <td className="p-2.5">41mm Diameter</td>
                      <td className="p-2.5">Standard Wrist</td>
                      <td className="p-2.5">Adjustable Gold Links</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3">
              <h3 className="font-bodoni font-bold text-base text-[#111111] uppercase tracking-wider">
                FREQUENTLY ASKED QUESTIONS
              </h3>
              <div className="space-y-2">
                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8DEC8]">
                  <strong className="block text-[#111111]">Is Cash on Delivery (COD) supported?</strong>
                  <p className="mt-1 text-[#6B5F50]">Yes, Cash on Delivery is supported for all orders across Mahabubnagar, Telangana and pan-India with zero extra fees.</p>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8DEC8]">
                  <strong className="block text-[#111111]">Are all items 100% genuine and verified?</strong>
                  <p className="mt-1 text-[#6B5F50]">Absolutely. Every shirt, watch, handbag, and denim item is original and inspected at our boutique in Mahbubnagar.</p>
                </div>
                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8DEC8]">
                  <strong className="block text-[#111111]">Can I visit the store in person to try on outfits?</strong>
                  <p className="mt-1 text-[#6B5F50]">Yes! Visit our boutique at Clock Tower Road, Mahabubnagar from 10:00 AM to 9:30 PM daily.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-3">
              <h3 className="font-bodoni font-bold text-base text-[#111111] uppercase tracking-wider">
                GET IN TOUCH WITH VIP CONCIERGE
              </h3>
              <p className="leading-relaxed">
                Whether you need styling advice, sizing verification, or custom delivery requests, our concierge team is available daily.
              </p>
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8DEC8] space-y-2">
                <p><strong>Direct Cell Line:</strong> 75 7888 7888</p>
                <p><strong>Support Email:</strong> <a href="mailto:lapofluxurypremium@gmail.com" className="text-[#B89758] font-bold underline">lapofluxurypremium@gmail.com</a></p>
                <p><strong>Store Address:</strong> D/6, Kota Complex, Telangana Chowrasta, 2-2-2/2, Boyapalle Rural, Mahbubnagar, Telangana 509001</p>
                <p><strong>Instagram:</strong> @_lapofluxury_</p>
              </div>
            </div>
          )}

          {activeTab === 'careers' && (
            <div className="space-y-3">
              <h3 className="font-bodoni font-bold text-base text-[#111111] uppercase tracking-wider">
                JOIN THE LAP OF LUXURY TEAM
              </h3>
              <p className="leading-relaxed">
                We are actively looking for passionate retail stylists, inventory coordinators, and luxury brand specialists for our Mahabubnagar boutique and online growth.
              </p>
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8DEC8]">
                <p>Send your profile or resume via WhatsApp to <strong>75 7888 7888</strong> with the subject <em>"Career Application"</em>.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
