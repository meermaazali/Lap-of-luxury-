import React, { useState } from 'react';
import { Instagram, Phone, MapPin, Clock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useStore } from '../context/StoreContext';
import { StoreLocationModal } from './modals/StoreLocationModal';
import { AboutUsModal } from './modals/AboutUsModal';
import { PolicyModal } from './modals/PolicyModal';

export const Footer: React.FC = () => {
  const { setSelectedCategory } = useStore();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<string | null>(null);

  const handleCategory = (slug: string) => {
    setSelectedCategory(slug);
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <footer id="contact-footer" className="bg-white/80 backdrop-blur-[2px] border-t border-[#D4AF37]/30 pt-12 sm:pt-16 pb-8 text-[#3A332A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Main Footer Grid with generous width for brand column to prevent clipping on large screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 pb-10 border-b border-[#E8DFC8]">
            {/* Col 1: Brand Info (Spans 2 columns on desktop so logo & tagline never collapse or clip) */}
            <div className="sm:col-span-2 lg:col-span-2 flex flex-col items-start pr-2 sm:pr-4">
              <BrandLogo variant="header" showSubtitle={true} className="items-start text-left w-full max-w-sm" />
              <p className="text-xs text-[#6B5F50] mt-3 leading-relaxed font-normal max-w-sm">
                Experience premium in every touch. Curating luxury double-ply cotton shirts, tailored trousers, precision timepieces, handbags, and lifestyle fashion.
              </p>
            </div>

            {/* Col 2: SHOP */}
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-[#111111] mb-3">
                SHOP
              </h4>
              <ul className="space-y-2 text-xs font-normal text-[#5E5244]">
                {['Men', 'Jeans', 'Watches', 'Bags', 'Shoes', 'Accessories', 'Perfumes'].map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      onClick={() => handleCategory(cat)}
                      className="hover:text-[#B8860B] transition-colors cursor-pointer"
                    >
                      {cat === 'Men' ? 'Shirts & Trousers' : cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3: HELP */}
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-[#111111] mb-3">
                HELP
              </h4>
              <ul className="space-y-2 text-xs font-normal text-[#5E5244]">
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyTab('shipping')}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    Shipping Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyTab('size')}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    Size Guide
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyTab('faq')}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    FAQs
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: COMPANY (Story completely removed per prompt) */}
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-[#111111] mb-3">
                COMPANY
              </h4>
              <ul className="space-y-2 text-xs font-normal text-[#5E5244]">
                <li>
                  <button
                    type="button"
                    onClick={() => setIsAboutUsOpen(true)}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setIsLocationOpen(true)}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    Store Location (Mahabubnagar)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyTab('contact')}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPolicyTab('careers')}
                    className="hover:text-[#B8860B] transition-colors cursor-pointer text-left"
                  >
                    Careers
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 5: STORE LOCATION & TIMINGS */}
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-[#111111] mb-3">
                VISIT STORE
              </h4>
              <div className="flex items-center gap-3 mb-3 text-[#111111]">
                <a
                  href="https://www.instagram.com/_lapofluxury_/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-full border border-[#D4AF37] bg-gradient-to-r from-[#FAF6EE] to-[#F3E7BE] flex items-center gap-2 hover:bg-[#D4AF37] hover:text-[#111111] transition-all cursor-pointer shadow-xs group"
                  aria-label="Instagram Profile @_lapofluxury_"
                >
                  <Instagram className="w-4 h-4 text-[#B8860B] group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-[#111111] tracking-wider">
                    @_lapofluxury_
                  </span>
                </a>
              </div>

              <div className="space-y-1.5 text-xs text-[#5E5244] font-normal">
                <button
                  type="button"
                  onClick={() => setIsLocationOpen(true)}
                  className="flex items-start gap-1.5 text-left hover:text-[#B8860B] cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#B8860B] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">D/6, Kota Complex, Telangana Chowrasta, 2-2-2/2, Beside prashant residency, Mahbubnagar, Telangana 509001</span>
                </button>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                  <span>Store Timings: 9:30 AM – 10:00 PM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#B89758] shrink-0" />
                  <span className="font-semibold text-[#111111]">Cell: 75 7888 7888</span>
                </div>
                <div className="pt-0.5">
                  <a href="mailto:lapofluxurypremium@gmail.com" className="text-[#B8860B] font-medium hover:underline">
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
                  href="https://www.instagram.com/maaz_ali_36/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#967018] hover:text-[#111111] font-bold hover:underline inline-flex items-center gap-1 transition-colors"
                  aria-label="Developer Instagram Profile @maaz_ali_36"
                >
                  <Instagram className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span>maaz_ali_36</span>
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              <button type="button" onClick={() => setPolicyTab('faq')} className="hover:text-[#111111] cursor-pointer">
                Privacy Policy
              </button>
              <span>·</span>
              <button type="button" onClick={() => setIsLocationOpen(true)} className="hover:text-[#111111] cursor-pointer">
                Store Location
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
      <AboutUsModal
        isOpen={isAboutUsOpen}
        onClose={() => setIsAboutUsOpen(false)}
      />
      <PolicyModal
        isOpen={!!policyTab}
        initialTab={policyTab || 'shipping'}
        onClose={() => setPolicyTab(null)}
      />
    </>
  );
};
