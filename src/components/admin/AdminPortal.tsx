import React, { useState } from 'react';
import {
  Bell,
  MessageSquare,
  Package,
  Layers,
  FolderTree,
  ShoppingBag,
  Sliders,
  Cloud,
  ArrowLeft,
  LogOut,
  QrCode,
  BookOpen,
  X,
} from 'lucide-react';

import { useStore } from '../../context/StoreContext';
import { UploadedLogoMark } from '../UploadedLogoMark';
import { AdminAuthGate } from './AdminAuthGate';
import { OrdersManager } from './OrdersManager';
import { EnquiriesManager } from './EnquiriesManager';
import { InventoryManager } from './InventoryManager';
import { ProductsManager } from './ProductsManager';
import { BannerManager } from './BannerManager';
import { CategoryManager } from './CategoryManager';
import { SubcategoryManager } from './SubcategoryManager';
import { MediaStorageManager } from './MediaStorageManager';
import { PaymentSetupManager } from './PaymentSetupManager';
import { ClientPhotoGuide } from './ClientPhotoGuide';

type AdminTab =
  | 'orders'
  | 'enquiries'
  | 'inventory'
  | 'products'
  | 'banners'
  | 'categories'
  | 'subcategories'
  | 'media'
  | 'payments'
  | 'guide';

export const AdminPortal: React.FC = () => {
  const {
    setIsAdminMode,
    orders,
    unreadOrdersCount,
    enquiries,
    unreadEnquiriesCount,
    latestEnquiryNotification,
    dismissEnquiryNotification,
    products,
    banners,
    mediaAssets,
  } = useStore();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('lol_admin_authed') === 'true';
  });

  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  const goToStorefront = () => {
    setIsAdminMode(false);

    try {
      window.history.pushState(null, '', '/');
    } catch {
      window.location.hash = '';
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('lol_admin_authed');
    setIsAuthenticated(false);
    setIsAdminMode(false);

    try {
      window.history.pushState(null, '', '/');
    } catch {
      window.location.hash = '';
    }
  };

  if (!isAuthenticated) {
    return (
      <AdminAuthGate
        onSuccess={() => setIsAuthenticated(true)}
        onCancel={goToStorefront}
      />
    );
  }

  const lowStockCount = products.filter(
    (product) => product.stockCount <= 5
  ).length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  const tabClass = (tab: AdminTab) =>
    `flex items-center gap-2 px-3.5 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all whitespace-nowrap cursor-pointer ${
      activeTab === tab
        ? 'bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B8860B] text-[#111111]'
        : 'text-[#625A4F] hover:text-[#111111] hover:bg-[#F5F0E5]'
    }`;

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1E1E22] flex flex-col font-sans">
      {/* White Admin Header */}
      <header className="bg-white text-[#1E1E22] border-b-2 border-[#D4AF37] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
          {/* Brand and Storefront Button */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={goToStorefront}
              className="shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#D4AF37] bg-white text-xs font-semibold text-[#6B5010] hover:bg-[#D4AF37] hover:text-white transition-all cursor-pointer shadow-sm"
              title="Return to customer storefront"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Storefront</span>
              <span className="sm:hidden">Store</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-[#D4AF37] p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                <UploadedLogoMark
                  className="w-full h-full object-contain"
                  color="#D4AF37"
                />
              </div>

              <div className="min-w-0">
                <span className="font-bodoni font-black tracking-widest uppercase text-xs sm:text-base text-[#1E1E22] block truncate">
                  LAP OF LUXURY
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#9A7416] block uppercase tracking-wider font-bold truncate">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Enquiries, Orders, and Logout */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setActiveTab('enquiries')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all cursor-pointer text-xs font-semibold ${
                unreadEnquiriesCount > 0
                  ? 'bg-amber-600 text-white border-amber-600 animate-pulse shadow-sm'
                  : 'bg-white border-[#D4AF37] text-[#4B4030] hover:bg-[#F5F0E5]'
              }`}
              title="Customer Inquiries"
            >
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Enquiries</span>
              {unreadEnquiriesCount > 0 && (
                <span className="bg-white text-amber-700 text-[10px] font-bold px-1.5 rounded-full">
                  {unreadEnquiriesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all cursor-pointer text-xs font-semibold ${
                unreadOrdersCount > 0
                  ? 'bg-red-600 text-white border-red-600 animate-pulse shadow-sm'
                  : 'bg-white border-[#D4AF37] text-[#4B4030] hover:bg-[#F5F0E5]'
              }`}
              title="Customer Orders"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
              {unreadOrdersCount > 0 && (
                <span className="bg-white text-red-600 text-[10px] font-bold px-1.5 rounded-full">
                  {unreadOrdersCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-red-300 hover:bg-red-50 text-red-700 text-xs font-semibold cursor-pointer"
              title="Lock Admin Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>

        {/* White Admin Navigation */}
        <div className="bg-white border-t border-[#E8DFC9] overflow-x-auto">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-2">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={tabClass('orders')}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Orders ({orders.length})</span>
              {unreadOrdersCount > 0 && (
                <span className="bg-red-600 text-white text-[9px] px-1.5 rounded-full font-bold">
                  {unreadOrdersCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('enquiries')}
              className={tabClass('enquiries')}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Enquiries ({enquiries.length})</span>
              {unreadEnquiriesCount > 0 && (
                <span className="bg-amber-600 text-white text-[9px] px-1.5 rounded-full font-bold animate-pulse">
                  {unreadEnquiriesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('inventory')}
              className={tabClass('inventory')}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Inventory &amp; Stock</span>
              {lowStockCount > 0 && (
                <span className="bg-amber-500 text-black text-[9px] px-1.5 rounded-full font-bold">
                  {lowStockCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={tabClass('products')}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('banners')}
              className={tabClass('banners')}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Banners &amp; Slider ({banners.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={tabClass('categories')}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categories</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('subcategories')}
              className={tabClass('subcategories')}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Edit Subcategories</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={tabClass('media')}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Media Storage ({mediaAssets.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('payments')}
              className={tabClass('payments')}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Payment Setup</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={tabClass('guide')}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Client Photo Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Real-time Notification Banner for Incoming Enquiries */}
      {latestEnquiryNotification && (
        <aside
          role="region"
          aria-label="Real-time notification"
          className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-[#111113] text-white p-4 rounded-xl shadow-2xl border-2 border-[#D4AF37] animate-bounce-once"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0 text-[#D4AF37]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                  New Customer Enquiry
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-sm font-bold text-white mt-0.5 truncate">
                {latestEnquiryNotification.name}
              </p>
              <p className="text-xs text-[#C5B89F] truncate">
                {latestEnquiryNotification.phone} • {latestEnquiryNotification.email}
              </p>
              <p className="text-xs text-[#FAF8F5]/80 mt-1 line-clamp-2 italic bg-[#1E1E22] p-2 rounded">
                &quot;{latestEnquiryNotification.message}&quot;
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('enquiries');
                  dismissEnquiryNotification();
                }}
                className="mt-2 text-xs font-bold text-[#D4AF37] hover:underline cursor-pointer"
              >
                View Enquiry in Portal &rarr;
              </button>
            </div>
            <button
              type="button"
              onClick={dismissEnquiryNotification}
              className="text-[#888890] hover:text-white p-1 rounded-md"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
          <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-sm">
            <p className="text-[10px] font-bold text-[#7A6C58] uppercase tracking-wider">
              Store Revenue
            </p>
            <p className="text-xl sm:text-2xl font-black font-bodoni text-[#111111] mt-1 tabular-nums">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-700 font-bold">
              Mahbubnagar Store
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-sm">
            <p className="text-[10px] font-bold text-[#7A6C58] uppercase tracking-wider">
              Customer Orders
            </p>
            <p className="text-xl sm:text-2xl font-black font-bodoni text-[#111111] mt-1 tabular-nums">
              {orders.length}
            </p>
            <span className="text-[10px] text-[#B8860B] font-bold">
              {unreadOrdersCount} unread
            </span>
          </div>

          <div
            onClick={() => setActiveTab('enquiries')}
            className="bg-white p-4 rounded-xl border border-[#D4AF37]/50 shadow-sm cursor-pointer hover:border-[#D4AF37] transition-all"
          >
            <p className="text-[10px] font-bold text-[#7A6C58] uppercase tracking-wider flex items-center justify-between">
              <span>Customer Enquiries</span>
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
            </p>
            <p className="text-xl sm:text-2xl font-black font-bodoni text-[#111111] mt-1 tabular-nums">
              {enquiries.length}
            </p>
            <span className={`text-[10px] font-bold ${unreadEnquiriesCount > 0 ? 'text-amber-600' : 'text-emerald-700'}`}>
              {unreadEnquiriesCount > 0 ? `${unreadEnquiriesCount} new / unread` : 'All reviewed'}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-sm">
            <p className="text-[10px] font-bold text-[#7A6C58] uppercase tracking-wider">
              Active Products
            </p>
            <p className="text-xl sm:text-2xl font-black font-bodoni text-[#111111] mt-1 tabular-nums">
              {products.length}
            </p>
            <span className="text-[10px] text-[#5C5040] font-medium">
              In catalog
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-sm">
            <p className="text-[10px] font-bold text-[#7A6C58] uppercase tracking-wider">
              Low Stock Alert
            </p>
            <p
              className={`text-xl sm:text-2xl font-black font-bodoni mt-1 tabular-nums ${
                lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {lowStockCount}
            </p>
            <span className="text-[10px] text-[#5C5040] font-medium">
              &le; 5 units remaining
            </span>
          </div>
        </div>

        {/* Existing Admin Modules & Enquiries Module */}
        {activeTab === 'orders' && <OrdersManager />}
        {activeTab === 'enquiries' && <EnquiriesManager />}
        {activeTab === 'inventory' && <InventoryManager />}
        {activeTab === 'products' && <ProductsManager />}
        {activeTab === 'banners' && <BannerManager />}
        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'subcategories' && <SubcategoryManager />}
        {activeTab === 'media' && <MediaStorageManager />}
        {activeTab === 'payments' && <PaymentSetupManager />}
        {activeTab === 'guide' && <ClientPhotoGuide />}
      </main>
    </div>
  );
};