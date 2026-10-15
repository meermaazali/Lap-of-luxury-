/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { HomePage } from './pages/HomePage';
import { ShopAllPage } from './pages/ShopAllPage';
import { DepartmentPage } from './pages/DepartmentPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchPage } from './pages/SearchPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthPage } from './pages/AuthPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { FaqsPage } from './pages/FaqsPage';
import { PolicyPage } from './pages/PolicyPage';
import { AdminPortal } from './components/admin/AdminPortal';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const RootRoutes: React.FC = () => {
  const { isAdminMode } = useStore();

  if (isAdminMode) {
    return <AdminPortal />;
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Core Main Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopAllPage />} />

        {/* Dedicated Department Pages */}
        <Route path="/men" element={<DepartmentPage department="men" />} />
        <Route path="/women" element={<DepartmentPage department="women" />} />
        <Route path="/bags" element={<DepartmentPage department="bags" />} />
        <Route path="/footwear" element={<DepartmentPage department="footwear" />} />
        <Route path="/shoes" element={<Navigate to="/footwear" replace />} />
        <Route path="/accessories" element={<DepartmentPage department="accessories" />} />
        <Route path="/collections" element={<DepartmentPage department="collections" />} />
        <Route path="/bestsellers" element={<DepartmentPage department="bestsellers" />} />
        <Route path="/sale" element={<DepartmentPage department="sale" />} />
        <Route path="/new-arrivals" element={<DepartmentPage department="new-arrivals" />} />

        {/* Dynamic Department, Category & Subcategory Pages */}
        <Route path="/department/:dept" element={<DepartmentPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/category/:category/:subcategory" element={<CategoryPage />} />

        {/* Individual Product Detail Pages */}
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/p/:id" element={<ProductDetailPage />} />

        {/* Search */}
        <Route path="/search" element={<SearchPage />} />

        {/* Shopping Cart & Checkout */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Auth & Account */}
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="signup" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/my-account" element={<Navigate to="/account" replace />} />
        <Route path="/wishlist" element={<WishlistPage />} />

        {/* Orders & Tracking */}
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrdersPage />} />
        <Route path="/order-history" element={<Navigate to="/orders" replace />} />
        <Route path="/track-order" element={<OrderTrackingPage />} />
        <Route path="/order-tracking" element={<OrderTrackingPage />} />

        {/* Informational Pages */}
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/about" element={<Navigate to="/about-us" replace />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/faq" element={<Navigate to="/faqs" replace />} />

        {/* Policies */}
        <Route path="/shipping-policy" element={<PolicyPage policyType="shipping" />} />
        <Route path="/shipping-delivery-policy" element={<PolicyPage policyType="shipping" />} />
        <Route path="/returns-policy" element={<PolicyPage policyType="returns" />} />
        <Route path="/returns-refund-policy" element={<PolicyPage policyType="returns" />} />
        <Route path="/privacy-policy" element={<PolicyPage policyType="privacy" />} />
        <Route path="/terms-conditions" element={<PolicyPage policyType="terms" />} />
        <Route path="/terms" element={<PolicyPage policyType="terms" />} />

        {/* Admin Portal */}
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/admin/*" element={<AdminPortal />} />

        {/* Catch-all fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <RootRoutes />
      </StoreProvider>
    </BrowserRouter>
  );
}
