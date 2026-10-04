/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { IntroSplashScreen } from './components/IntroSplashScreen';
import { PageTransitionOverlay } from './components/common/PageTransitionOverlay';
import { ScrollReveal } from './components/common/ScrollReveal';
import { Header } from './components/Header';
import { SubNav } from './components/SubNav';
import { HeroSlider } from './components/HeroSlider';
import { CategoryAutoSlider } from './components/CategoryAutoSlider';
import { FestiveEditBanner } from './components/FestiveEditBanner';
import { BestSellersGrid } from './components/BestSellersGrid';
import { BrandStorySection } from './components/BrandStorySection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AccountModal } from './components/AccountModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { OrderNotificationBanner } from './components/admin/OrderNotificationBanner';

const MainLayout: React.FC = () => {
  const { isAdminMode } = useStore();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // If Admin Mode is active via #admin or separate link
  if (isAdminMode) {
    return (
      <>
        <AdminPortal />
        <OrderNotificationBanner />
      </>
    );
  }

  // Customer Storefront
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1E1E22] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-white">
      {/* 1. White Intro Splash Screen with Black Bodoni "LAP OF LUXURY" */}
      {showSplash && <IntroSplashScreen onFinish={() => setShowSplash(false)} />}

      {/* 2. Dynamic White Screen Transition Overlay (On Category Click) */}
      <PageTransitionOverlay />

      {/* 3. Main Header with Cart Beside Tagline */}
      <Header
        onOpenAccountModal={() => setIsAccountOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* 4. Sub-Navigation */}
      <SubNav />

      {/* 6. Main Content with Scroll-Down Reveal Animations */}
      <main className="flex-1">
        {/* Automatic Sliding Hero Banner */}
        <HeroSlider />

        {/* Automatic Sliding Category Carousel */}
        <ScrollReveal>
          <CategoryAutoSlider />
        </ScrollReveal>

        {/* The Festive Edit Promo Showcase */}
        <ScrollReveal>
          <FestiveEditBanner />
        </ScrollReveal>

        {/* Best Sellers Grid with Scroll-Down Animation per product */}
        <BestSellersGrid />

        {/* Lifestyle & Brand Story Section */}
        <ScrollReveal>
          <BrandStorySection />
        </ScrollReveal>
      </main>

      {/* 7. Comprehensive Store Footer */}
      <Footer />

      {/* Customer Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <ProductDetailModal />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
      {isAccountOpen && <AccountModal onClose={() => setIsAccountOpen(false)} />}
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
