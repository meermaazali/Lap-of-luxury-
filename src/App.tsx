/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { SubNav } from './components/SubNav';
import { BestSellersGrid } from './components/BestSellersGrid';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AboutUsModal } from './components/modals/AboutUsModal';
import { PolicyModal } from './components/modals/PolicyModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { FlagshipBoutiqueHero } from './components/FlagshipBoutiqueHero';

const MainLayout: React.FC = () => {
  const { isAdminMode } = useStore();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);

  // If Admin Mode is active via #admin or separate link
  if (isAdminMode) {
    return <AdminPortal />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#111113] relative overflow-x-hidden px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-6">
      {/* MAIN WEBSITE CARD CONTAINER (Clean, ultra-fast luxury container, zero GPU lag) */}
      <div className="relative z-10 w-full max-w-[1540px] mx-auto rounded-2xl sm:rounded-[30px] md:rounded-[36px] overflow-hidden shadow-[0_15px_60px_rgba(184,134,11,0.12)] border border-[#D4AF37]/40 sm:border-2 sm:border-[#D4AF37]/50 bg-white flex flex-col">
        {/* Main Header (Clean desktop navigation + mobile hamburger menu) */}
        <Header
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenAboutUs={() => setIsAboutUsOpen(true)}
          onOpenContactUs={() => setIsContactUsOpen(true)}
        />

        {/* Categories Bar: Visible on Desktop & Laptop */}
        <div className="hidden md:block">
          <SubNav />
        </div>

        {/* Flagship Showcase Hero with Original Uploaded Banner + Shop By Category + Golden Trust Bar */}
        <FlagshipBoutiqueHero />

        {/* Products Collection (Instant loading without delays or pop-in) */}
        <main className="flex-1">
          <BestSellersGrid />
        </main>

        {/* Comprehensive Store Footer with Mahbubnagar Address */}
        <Footer />
      </div>

      {/* Customer Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <ProductDetailModal />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
      <AboutUsModal
        isOpen={isAboutUsOpen}
        onClose={() => setIsAboutUsOpen(false)}
      />
      <PolicyModal
        isOpen={isContactUsOpen}
        initialTab="contact"
        onClose={() => setIsContactUsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
