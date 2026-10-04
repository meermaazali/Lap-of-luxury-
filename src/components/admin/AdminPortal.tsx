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
    'orders' | 'inventory' | 'products' | 'banners' | 'categories' | 'media'
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

  // Quick stats
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const lowStockCount = products.filter((p) => p.stockCount <= 5).length;

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1E1E22] flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-[#111113] text-[#F3E7D5] border-b-2 border-[#D4AF37] sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Brand Identity & Back button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsAdminMode(false);
                window.location.hash = '';
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wider transition-colors cursor-pointer"
              title="Return to Customer Storefront"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Back to Store</span>
            </button>

            <div className="h-6 w-[1px] bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <UploadedLogoMark className="w-7 h-7 shrink-0" color="#D4AF37" />
              <span className="font-bodoni font-black tracking-[0.18em] text-sm md:text-base text-white">
                LAP OF LUXURY
              </span>
              <span className="bg-[#D4AF37] text-[#111111] text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded">
                STORE ADMIN
              </span>
            </div>
          </div>

          {/* Right: Sound toggle, Orders alert & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-[#D5C2AA] hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                  <span className="hidden md:inline text-[11px]">Chime On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-gray-400" />
                  <span className="hidden md:inline text-[11px]">Muted</span>
                </>
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                unreadOrdersCount > 0
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-white/10 text-white hover:bg-white/20'
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
              <span className="hidden sm:inline">Lock / Logout</span>
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
                <span className="bg-amber-500 text-[#1E1E22] text-[9px] px-1.5 rounded-full font-bold">
                  {lowStockCount} Low
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
              <span>Products Catalog ({products.length})</span>
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
              <span>Sliding Banners ({banners.length})</span>
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
              <span>Category Slider</span>
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
              <span>Cloud Storage ({mediaAssets.length} Assets)</span>
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
            <span className="text-[10px] text-emerald-700 font-bold">Mahabubnagar Flagship</span>
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
      </main>
    </div>
  );
};
