import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, LogOut, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useStore } from '../context/StoreContext';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { Footer } from '../components/Footer';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, wishlist } = useStore();

  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
  }>({
    name: 'Customer Account',
    email: 'customer@lapofluxury.in',
    phone: '+91 75 7888 7888',
    address: 'Mahbubnagar, Telangana 509001',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserProfile((prev) => ({
          ...prev,
          email: user.email || prev.email,
          name: user.displayName || user.email?.split('@')[0] || prev.name,
          phone: user.phoneNumber || prev.phone,
        }));
      } else {
        try {
          const saved = localStorage.getItem('lol_customer_session');
          if (saved) {
            const parsed = JSON.parse(saved);
            setUserProfile((prev) => ({
              ...prev,
              email: parsed.email || prev.email,
              name: parsed.name || prev.name,
              phone: parsed.phone || prev.phone,
            }));
          }
        } catch (e) {}
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    localStorage.removeItem('lol_customer_session');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header />
      <LuxuryMegaNav />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-[#E8DEC8] pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#8A671A] block">
              Member Profile
            </span>
            <h1 className="text-2xl sm:text-3xl text-[#111113] uppercase tracking-wider">
              My Account
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 border border-[#D5C7B0] hover:border-red-400 text-xs text-[#554D42] hover:text-red-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Profile Details */}
          <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#E8DEC8] pb-3">
              <div className="w-10 h-10 rounded-full bg-[#111113] text-[#D4AF37] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm text-[#111113]">{userProfile.name}</h2>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Verified Member
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-[#554D42]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>{userProfile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>{userProfile.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>{userProfile.address}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Orders Summary */}
          <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-[#111113] border-b border-[#E8DEC8] pb-3">
                <Package className="w-4 h-4 text-[#B8860B]" />
                <h2>Order History</h2>
              </div>
              <p className="text-xs text-[#554D42]">
                You have <strong>{orders.length}</strong> placed orders in your account.
              </p>
            </div>

            <Link
              to="/orders"
              className="w-full py-2.5 bg-[#111113] text-[#D4AF37] text-xs uppercase tracking-wider rounded-xl hover:bg-black transition-colors text-center block"
            >
              View Order History & Details
            </Link>
          </div>

          {/* Card 3: Wishlist Summary */}
          <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-[#111113] border-b border-[#E8DEC8] pb-3">
                <Heart className="w-4 h-4 text-[#B8860B]" />
                <h2>Saved Wishlist</h2>
              </div>
              <p className="text-xs text-[#554D42]">
                You have <strong>{wishlist.length}</strong> luxury items saved in your wishlist.
              </p>
            </div>

            <Link
              to="/wishlist"
              className="w-full py-2.5 bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] text-[#111113] text-xs uppercase tracking-wider rounded-xl hover:brightness-105 transition-all text-center block"
            >
              Open Wishlist
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
