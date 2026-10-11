/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { PageTransitionOverlay } from './components/common/PageTransitionOverlay';
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
import { AdminPortal } from './components/admin/AdminPortal';
import { OrderNotificationBanner } from './components/admin/OrderNotificationBanner';
import { Global3DClothBackground } from './components/experience/Global3DClothBackground';
import { InteractiveLuxuryLightGlow } from './components/common/InteractiveLuxuryLightGlow';
import { FlagshipBoutiqueHero } from './components/FlagshipBoutiqueHero';

const MainLayout: React.FC = () => {
  const { isAdminMode } = useStore();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);

  // If Admin Mode is active via #admin or separate link
  if (isAdminMode) {
    return (
      <>
        <AdminPortal />
        <OrderNotificationBanner />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-[#111113] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#111113] relative overflow-x-hidden px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-6">
      {/* 3D WebGL Cloth Background (Living golden silk background framing the entire website) */}
      <Global3DClothBackground />

      {/* Interactive Cursor Light & Touch Glow across total website */}
      <InteractiveLuxuryLightGlow />

      {/* Dynamic White Screen Transition Overlay (On Category Click) */}
      <PageTransitionOverlay />

      {/* MAIN WEBSITE CARD CONTAINER (Framed with golden border matching uploaded image) */}
      <div className="relative z-10 w-full max-w-[1540px] mx-auto rounded-2xl sm:rounded-[30px] md:rounded-[36px] overflow-hidden shadow-[0_25px_90px_rgba(184,134,11,0.28)] border border-[#D4AF37]/50 sm:border-2 sm:border-[#D4AF37]/60 bg-white flex flex-col">
        {/* Main Header (All interactive buttons, Categories dropdown, Wishlist, Cart, Mobile Menu) */}
        <Header
          onOpenWishlist={() => setIsWishlistOpen(true)}
          onOpenAboutUs={() => setIsAboutUsOpen(true)}
        />

        {/* Categories Bar: Visible on Desktop & Laptop, Hidden on Mobile */}
        <div className="hidden md:block">
          <SubNav />
        </div>

        {/* Flagship Showcase Hero + Shop By Category + Golden Trust Bar (Updated with Shirts & Pants Banner) */}
        <FlagshipBoutiqueHero />

        {/* Products Collection (Best Sellers & All Products with Category Tabs) */}
        <main className="flex-1">
          <BestSellersGrid />
        </main>

        {/* Comprehensive Store Footer (Story removed per prompt) */}
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
      <OrderNotificationBanner />
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
