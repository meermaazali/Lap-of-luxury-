import React, { useState } from 'react';
import { Instagram, Youtube, Phone, MapPin, MessageSquare } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useStore } from '../context/StoreContext';
import { StoreLocationModal } from './modals/StoreLocationModal';
import { OurStoryModal } from './modals/OurStoryModal';
import { PolicyModal } from './modals/PolicyModal';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setIsAdminMode } = useStore();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<string | null>(null);

  const handleCategory = (slug: string) => {
    setSelectedCategory(slug);
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-[#FAF8F5] border-t-2 border-[#D4AF37]/40 pt-10 sm:pt-14 pb-8 text-[#3A332A]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#E8DFC8]">
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-1 flex flex-col items-start">
              <BrandLogo variant="header" showSubtitle={true} className="items-start text-left" />
              <p className="text-xs text-[#6B5F50] mt-3 leading-relaxed">
                Experience premium in every touch. Curating luxury double-ply cotton shirts, raw selvedge denim, precision timepieces, and hand-stitched leather.
              </p>
            </div>

            {/* Col 2: SHOP */}
            <div>
              <h4 className="font-bodoni text-xs sm:text-sm font-black tracking-[0.18em] uppercase text-[#111111] mb-3">
                SHOP
              </h4>
              <ul className="space-y-2 text-xs font-semibold text-[#5E5244]">
                {['Men', 'Jeans', 'Watches', 'Bags', 'Shoes', 'Accessories', 'Perfumes'].map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => handleCategory(cat)}
                      className="hover:text-[#B8860B] transition-colors cursor-pointer"
                    >
                      {cat === 'Men' ? 'Shirts' : cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: HELP (All Functional Modals!) */}
            <div>
              <h4 className="font-bodoni text-xs sm:text-sm font-black tracking-[0.18em] uppercase text-[#111111] mb-3">
                HELP
              </h4>
              <ul className="space-y-2 text-xs font-medium text-[#5E5244]">
                <li>
                  <button
                    onClick={() => {
                      const el = document.getElementById('account-modal-trigger');
                      if (el) el.click();
                      else setPolicyTab('faq');
                    }}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    Track Order
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPolicyTab('shipping')}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    Shipping Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPolicyTab('size')}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    Size Guide
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPolicyTab('faq')}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    FAQs
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: COMPANY (All Functional Modals!) */}
            <div>
              <h4 className="font-bodoni text-xs sm:text-sm font-black tracking-[0.18em] uppercase text-[#111111] mb-3">
                COMPANY
              </h4>
              <ul className="space-y-2 text-xs font-medium text-[#5E5244]">
                <li>
                  <button
                    onClick={() => setIsStoryOpen(true)}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsStoryOpen(true)}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    Our Story
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsLocationOpen(true)}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    Store Location (Mahabubnagar)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPolicyTab('contact')}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPolicyTab('careers')}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    Careers
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 5: STORE LOCATION & FOLLOW */}
            <div>
              <h4 className="font-bodoni text-xs sm:text-sm font-black tracking-[0.18em] uppercase text-[#111111] mb-3">
                FOLLOW US
              </h4>
              <div className="flex items-center gap-3 mb-3 text-[#111111]">
                <a
                  href="https://www.instagram.com/_lapofluxury_/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-full border-2 border-[#D4AF37] bg-gradient-to-r from-[#FAF6EE] to-[#F3E7BE] flex items-center gap-2 hover:bg-[#D4AF37] hover:text-[#111111] transition-all cursor-pointer shadow-sm group"
                  aria-label="Instagram Profile @_lapofluxury_"
                >
                  <Instagram className="w-4 h-4 text-[#B8860B] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-[#111111] tracking-wider">
                    @_lapofluxury_
                  </span>
                </a>
              </div>

              <div className="space-y-1 text-xs text-[#5E5244]">
                <button
                  onClick={() => setIsLocationOpen(true)}
                  className="flex items-start gap-1.5 text-left hover:text-[#B8860B] cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#B8860B] shrink-0 mt-0.5" />
                  <span>Mahabubnagar, Telangana (View Map)</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#B89758] shrink-0" />
                  <span className="font-bold text-[#111111]">Cell: 75 7888 7888</span>
                </div>
                <div className="pt-0.5">
                  <a href="mailto:lapofluxurypremium@gmail.com" className="text-[#B8860B] font-bold hover:underline">
                    lapofluxurypremium@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#7A6C58]">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p>© 2026 LAP OF LUXURY. All Rights Reserved.</p>
              <span className="hidden sm:inline">·</span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#FAF6EE] to-[#F3E7BE] border border-[#D4AF37]/50 shadow-2xs">
                <span className="text-[#55493B] font-medium">Developed by</span>
                <a
                  href="https://www.instagram.com/maaaaz_.786/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#967018] hover:text-[#111111] font-extrabold hover:underline inline-flex items-center gap-1 transition-colors"
                  aria-label="Developer Instagram Profile @maaaaz_.786"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>maaaaz_.786</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              <button onClick={() => setPolicyTab('faq')} className="hover:text-[#111111] cursor-pointer">
                Privacy Policy
              </button>
              <span>·</span>
              <button onClick={() => setPolicyTab('faq')} className="hover:text-[#111111] cursor-pointer">
                Terms & Conditions
              </button>
              <span>·</span>
              <button onClick={() => setIsLocationOpen(true)} className="hover:text-[#111111] cursor-pointer">
                Store Sitemap
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <StoreLocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />
      <OurStoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />
      <PolicyModal
        isOpen={!!policyTab}
        initialTab={policyTab || 'shipping'}
        onClose={() => setPolicyTab(null)}
      />
    </>
  );
};
