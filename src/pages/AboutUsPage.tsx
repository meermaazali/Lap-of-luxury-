import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Gem, ShieldCheck, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header />
      <LuxuryMegaNav />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#7A6C58] flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#B8860B] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-[#111113]">About Us</span>
        </nav>

        {/* Hero Card */}
        <div className="relative rounded-3xl overflow-hidden bg-[#111113] text-white p-8 sm:p-12 border border-[#D4AF37]/50 shadow-xl">
          <div className="absolute inset-0 opacity-25">
            <img
              src="/images/luxury_products_hero_1791099185940.jpg"
              alt="LAP OF LUXURY"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 space-y-3 max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.26em] text-[#D4AF37] block">
              Our Identity
            </span>
            <h1 className="text-2xl sm:text-4xl text-white uppercase tracking-wider">
              About LAP OF LUXURY
            </h1>
            <p className="text-xs sm:text-sm text-[#D5C7B0] tracking-wide">
              Experience Premium in Every Touch.
            </p>
          </div>
        </div>

        {/* Official Exact Content Mandated by Prompt */}
        <div className="bg-white rounded-3xl border border-[#E8DEC8] p-8 sm:p-12 shadow-sm space-y-6 text-[#241F1B] leading-relaxed text-sm sm:text-base">
          <p>
            LAP OF LUXURY is a premium fashion and lifestyle brand created for those who believe style is more than what you wear—it is an expression of who you are.
          </p>

          <p>
            We bring together carefully selected premium clothing, footwear, watches, handbags, perfumes and lifestyle accessories, combining contemporary trends with timeless elegance.
          </p>

          <p>
            Our philosophy is simple: quality, sophistication and individuality. Every product is selected to deliver a refined experience, from the first look to the final touch.
          </p>

          <p>
            At LAP OF LUXURY, we believe everyone deserves to experience premium fashion.
          </p>

          <div className="pt-6 border-t border-[#F0EAE1] space-y-1 text-center sm:text-left">
            <p className="text-base sm:text-lg text-[#111113] uppercase tracking-wider">
              LAP OF LUXURY
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-[#8A671A]">
              Experience Premium in Every Touch.
            </p>
          </div>
        </div>

        {/* Three Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-[#E8DEC8] space-y-2 text-center">
            <Gem className="w-6 h-6 text-[#B8860B] mx-auto" />
            <h2 className="text-xs uppercase tracking-wider text-[#111113]">Uncompromising Quality</h2>
            <p className="text-xs text-[#7A6C58]">Selected premium materials and artisanal standards.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-[#E8DEC8] space-y-2 text-center">
            <Sparkles className="w-6 h-6 text-[#B8860B] mx-auto" />
            <h2 className="text-xs uppercase tracking-wider text-[#111113]">Timeless Sophistication</h2>
            <p className="text-xs text-[#7A6C58]">Contemporary silhouettes refined for enduring style.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-[#E8DEC8] space-y-2 text-center">
            <ShieldCheck className="w-6 h-6 text-[#B8860B] mx-auto" />
            <h2 className="text-xs uppercase tracking-wider text-[#111113]">Authenticity Guaranteed</h2>
            <p className="text-xs text-[#7A6C58]">100% genuine products with verified craftsmanship.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
