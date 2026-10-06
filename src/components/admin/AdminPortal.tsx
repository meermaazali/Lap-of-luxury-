import React, { useState, useEffect } from 'react';
import {
  Bell,
  Package,
  Layers,
  ShoppingBag,
  Sliders,
  Cloud,
  ArrowLeft,
  Volume2,
  VolumeX,
  LogOut,
  QrCode,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { UploadedLogoMark } from '../UploadedLogoMark';
import { AdminAuthGate } from './AdminAuthGate';
import { OrdersManager } from './OrdersManager';
import { InventoryManager } from './InventoryManager';
import { ProductsManager } from './ProductsManager';
import { BannerManager } from './BannerManager';
import { CategoryManager } from './CategoryManager';
import { MediaStorageManager } from './MediaStorageManager';
import { PaymentSetupManager } from './PaymentSetupManager';

export const AdminPortal: React.FC = () => {
  const {
    setIsAdminMode,
    orders,
    unreadOrdersCount,
    products,
    banners,
    mediaAssets,
  } = useStore();

  // Check if authenticated with password 7878
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('lol_admin_authed') === 'true';
  });

  const [activeTab, setActiveTab] = useState<
    'orders' | 'inventory' | 'products' | 'banners' | 'categories' | 'media' | 'payments'
  >('orders');

  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleLogout = () => {
    sessionStorage.removeItem('lol_admin_authed');
    setIsAuthenticated(false);
    setIsAdminMode(false);
    window.location.hash = '';
  };

  // If not authenticated, show password screen requiring 7878
  if (!isAuthenticated) {
    return (
      <AdminAuthGate
        onSuccess={() => setIsAuthenticated(true)}
        onCancel={() => {
          setIsAdminMode(false);
          window.location.hash = '';
        }}
      />
    );
  }

  const lowStockCount = products.filter((p) => p.stockCount <= 5).length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1E1E22] flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-[#111113] text-white border-b-2 border-[#D4AF37] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Brand & Return to Store */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setIsAdminMode(false);
                window.location.hash = '';
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#444] hover:border-[#D4AF37] text-xs font-semibold text-[#D4AF37] hover:bg-white/5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Storefront</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1A1A1E] border border-[#D4AF37] p-1 flex items-center justify-center">
                <UploadedLogoMark className="w-full h-full" color="#D4AF37" />
              </div>
              <div>
                <span className="font-bodoni font-black tracking-widest uppercase text-sm sm:text-base text-white">
                  LAP OF LUXURY
                </span>
                <span className="text-[10px] text-[#A8987E] block uppercase tracking-wider font-semibold">
                  Mahbubnagar Portal (PIN: 7878)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick actions & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10'
                  : 'border-gray-700 text-gray-500 hover:text-gray-300'
              }`}
              title={soundEnabled ? 'Order sound alert ON' : 'Order sound alert OFF'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                unreadOrdersCount > 0
                  ? 'bg-red-600/90 text-white border-red-500 animate-pulse'
                  : 'border-gray-700 hover:border-[#D4AF37] text-xs'
              }`}
            >
              <Bell className="w-4 h-4 text-[#D4AF37]" />
              <span className="hidden sm:inline">Orders</span>
              {unreadOrdersCount > 0 && (
                <span className="bg-white text-red-600 text-[10px] font-bold px-1.5 rounded-full">
                  {unreadOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-red-950/60 border border-red-800/80 hover:bg-red-900 text-red-200 text-xs font-semibold cursor-pointer"
              title="Lock Admin Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock (7878)</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="bg-[#17171A] border-t border-[#2B2B32] overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B8860B] text-[#111111]'
                  : 'text-[#A09A8F] hover:text-white hover:bg-white/5'
              }`}
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
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B8860B] text-[#111111]'
                  : 'text-[#A09A8F] hover:text-white hover:bg-white/5'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Inventory & Stock</span>
              {lowStockCount > 0 && (
                <span className="bg-amber-500 text-black text-[9px] px-1.5 rounded-full font-bold">
                  {lowStockCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B8860B] text-[#111111]'
                  : 'text-[#A09A8F] hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'banners'
                  ? 'bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B8860B] text-[#111111]'
                  : 'text-[#A09A8F] hover:text-white hover:bg-white/5'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Banners & Slider ({banners.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B8860B] text-[#111111]'
                  : 'text-[#A09A8F] hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B8860B] text-[#111111]'
                  : 'text-[#A09A8F] hover:text-white hover:bg-white/5'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Media Storage ({mediaAssets.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold tracking-wider uppercase rounded-md transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#B8860B] text-[#111111]'
                  : 'text-[#A09A8F] hover:text-white hover:bg-white/5'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Payment Setup</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-xs">
            <p className="text-[11px] font-bold text-[#7A6C58] uppercase tracking-wider">
              Total Store Revenue
            </p>
            <p className="text-xl sm:text-2xl font-black font-bodoni text-[#111111] mt-1 tabular-nums">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-700 font-bold">Mahbubnagar Store</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-xs">
            <p className="text-[11px] font-bold text-[#7A6C58] uppercase tracking-wider">
              Total Customer Orders
            </p>
            <p className="text-xl sm:text-2xl font-black font-bodoni text-[#111111] mt-1 tabular-nums">
              {orders.length}
            </p>
            <span className="text-[10px] text-[#B8860B] font-bold">{unreadOrdersCount} unread</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-xs">
            <p className="text-[11px] font-bold text-[#7A6C58] uppercase tracking-wider">
              Active Products
            </p>
            <p className="text-xl sm:text-2xl font-black font-bodoni text-[#111111] mt-1 tabular-nums">
              {products.length}
            </p>
            <span className="text-[10px] text-[#5C5040] font-medium">In catalog</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-xs">
            <p className="text-[11px] font-bold text-[#7A6C58] uppercase tracking-wider">
              Low Stock Warning
            </p>
            <p className={`text-xl sm:text-2xl font-black font-bodoni mt-1 tabular-nums ${lowStockCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {lowStockCount}
            </p>
            <span className="text-[10px] text-[#5C5040] font-medium">&le; 5 units remaining</span>
          </div>
        </div>

        {/* Tab Modules */}
        {activeTab === 'orders' && <OrdersManager />}
        {activeTab === 'inventory' && <InventoryManager />}
        {activeTab === 'products' && <ProductsManager />}
        {activeTab === 'banners' && <BannerManager />}
        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'media' && <MediaStorageManager />}
        {activeTab === 'payments' && <PaymentSetupManager />}
      </main>
    </div>
  );
};
