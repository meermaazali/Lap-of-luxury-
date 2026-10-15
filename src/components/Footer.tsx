import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, MapPin, Clock, Mail, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer id="contact-footer" className="bg-white/80 backdrop-blur-[2px] border-t border-[#D4AF37]/30 pt-12 sm:pt-16 pb-8 text-[#3A332A] font-normal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-[#E8DFC8]">
          {/* Col 1 & 2: Brand Info */}
          <div className="sm:col-span-2 lg:col-span-2 flex flex-col items-start pr-2 sm:pr-4">
            <BrandLogo variant="header" showSubtitle={true} className="items-start text-left w-full max-w-sm" />
            <p className="text-xs text-[#6B5F50] mt-3 leading-relaxed font-normal max-w-sm">
              LAP OF LUXURY is a premium fashion and lifestyle brand. Experience premium in every touch. Curating luxury clothing, tailored trousers, footwear, precision timepieces, handbags, and lifestyle accessories.
            </p>
          </div>

          {/* Col 3: SHOP */}
          <div>
            <h2 className="text-xs sm:text-sm tracking-[0.16em] uppercase text-[#111111] mb-3">
              SHOP
            </h2>
            <ul className="space-y-2 text-xs text-[#5E5244]">
              <li><Link to="/men" className="hover:text-[#B8860B] transition-colors">Men's Fashion</Link></li>
              <li><Link to="/women" className="hover:text-[#B8860B] transition-colors">Women's Fashion</Link></li>
              <li><Link to="/bags" className="hover:text-[#B8860B] transition-colors">Handbags &amp; Totes</Link></li>
              <li><Link to="/footwear" className="hover:text-[#B8860B] transition-colors">Footwear &amp; Sneakers</Link></li>
              <li><Link to="/category/watches" className="hover:text-[#B8860B] transition-colors">Watches &amp; Timepieces</Link></li>
              <li><Link to="/category/jeans" className="hover:text-[#B8860B] transition-colors">Jeans &amp; Raw Denim</Link></li>
              <li><Link to="/shop" className="hover:text-[#B8860B] transition-colors">Shop All Creations</Link></li>
            </ul>
          </div>

          {/* Col 4: COMPANY */}
          <div>
            <h2 className="text-xs sm:text-sm tracking-[0.16em] uppercase text-[#111111] mb-3">
              COMPANY
            </h2>
            <ul className="space-y-2 text-xs text-[#5E5244]">
              <li><Link to="/about" className="hover:text-[#B8860B] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#B8860B] transition-colors">Contact Us</Link></li>
              <li><Link to="/wishlist" className="hover:text-[#B8860B] transition-colors">Wishlist</Link></li>
            </ul>
          </div>

          {/* Col 5: STORE LOCATION & TIMINGS */}
          <div>
            <h2 className="text-xs sm:text-sm tracking-[0.16em] uppercase text-[#111111] mb-3">
              VISIT OUR STORE
            </h2>
            <div className="flex items-center gap-3 mb-3 text-[#111111]">
              <a
                href="https://www.instagram.com/_lapofluxury_/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-full border border-[#D4AF37] bg-gradient-to-r from-[#FAF6EE] to-[#F3E7BE] flex items-center gap-2 hover:bg-[#D4AF37] hover:text-[#111113] transition-all cursor-pointer shadow-xs group"
                aria-label="Instagram Profile @_lapofluxury_"
              >
                <Instagram className="w-4 h-4 text-[#B8860B]" />
                <span className="text-xs text-[#111111] tracking-wider">@_lapofluxury_</span>
              </a>
            </div>

            <div className="space-y-2 text-xs text-[#5E5244]">
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B8860B] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  D/6, Kota Complex, Telangana Chowrasta, 2-2-2/2, beside Prashant Residency, Mahbubnagar, Telangana 509001.
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                <span>Store Timings: 9:30 AM–10:00 PM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                <a href="tel:+917578887888" className="hover:text-[#B8860B] transition-colors">Phone: +91 75 7888 7888</a>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                <a href="mailto:lapofluxurypremium@gmail.com" className="text-[#8A671A] hover:underline">lapofluxurypremium@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A6C58] gap-3">
          <p>© {new Date().getFullYear()} LAP OF LUXURY. All rights reserved.</p>
          <p>
            Developed by{' '}
            <a
              href="https://www.instagram.com/maaz_ali_36/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8A671A] hover:text-[#B8860B] hover:underline transition-colors"
              aria-label="Instagram profile @maaz_ali_36"
            >
              @maaz_ali_36
            </a>
          </p>
          <div className="flex items-center gap-2 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Official PhonePe Verified Payment Gateway</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
