import React, { useState, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { LuxuryMegaNav } from '../components/navigation/LuxuryMegaNav';
import { DepartmentLandingPage } from '../components/departments/DepartmentLandingPage';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { OrderSuccessModal } from '../components/OrderSuccessModal';

interface DepartmentPageProps {
  department?: string;
}

export const DepartmentPage: React.FC<DepartmentPageProps> = ({ department: propDept }) => {
  const { dept } = useParams<{ dept: string }>();
  const location = useLocation();
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const activeDepartment = useMemo(() => {
    if (propDept) return propDept.toLowerCase();
    if (dept) return dept.toLowerCase();
    const pathname = location.pathname.toLowerCase().replace('/', '');
    if (pathname.includes('men') && !pathname.includes('women')) return 'men';
    if (pathname.includes('women')) return 'women';
    if (pathname.includes('bag')) return 'bags';
    if (pathname.includes('footwear') || pathname.includes('shoes')) return 'footwear';
    if (pathname.includes('accessories')) return 'accessories';
    if (pathname.includes('collections')) return 'collections';
    if (pathname.includes('bestsellers')) return 'bestsellers';
    if (pathname.includes('sale')) return 'sale';
    if (pathname.includes('new-arrivals')) return 'new-arrivals';
    return pathname || 'men';
  }, [propDept, dept, location.pathname]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111113] flex flex-col font-normal">
      <Header onOpenWishlist={() => setIsWishlistOpen(true)} />
      <LuxuryMegaNav />

      <main className="flex-1 w-full">
        <DepartmentLandingPage departmentKey={activeDepartment} />
      </main>

      <Footer />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
};
