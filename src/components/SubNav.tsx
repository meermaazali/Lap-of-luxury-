import React from 'react';
import { useStore } from '../context/StoreContext';

const NAV_ITEMS = [
  { name: "MEN'S FASHION", slug: 'Men' },
  { name: "WOMEN'S FASHION", slug: 'Women' },
  { name: 'JEANS & DENIM', slug: 'Jeans' },
  { name: 'WATCHES', slug: 'Watches' },
  { name: 'BAGS & WALLETS', slug: 'Bags' },
  { name: 'SHOES & FOOTWEAR', slug: 'Shoes' },
  { name: 'ACCESSORIES', slug: 'Accessories' },
  { name: 'PERFUMES', slug: 'Perfumes' },
  { name: 'THE FESTIVE EDIT', slug: 'Festive' },
];

export const SubNav: React.FC = () => {
  const { selectedCategory, triggerTransition } = useStore();

  const handleNavClick = (slug: string, name: string) => {
    triggerTransition(slug, name);
  };

  return (
    <nav className="bg-white/95 border-b border-[#E8DEC8] overflow-x-auto no-scrollbar shadow-xs backdrop-blur-sm select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-5 lg:gap-8 py-2.5 whitespace-nowrap min-w-max">
        {NAV_ITEMS.map((item) => {
          const isActive = selectedCategory === item.slug;
          return (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.slug, item.name)}
              className={`flex items-center gap-1 text-[11px] lg:text-[12px] font-bold tracking-[0.14em] uppercase transition-colors relative py-1 cursor-pointer ${
                isActive
                  ? 'text-[#B8860B]'
                  : 'text-[#111113] hover:text-[#B8860B]'
              }`}
            >
              <span>{item.name}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
