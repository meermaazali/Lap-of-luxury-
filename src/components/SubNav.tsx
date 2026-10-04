import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const NAV_ITEMS = [
  { name: 'MEN', slug: 'Men' },
  { name: 'WOMEN', slug: 'Women' },
  { name: 'WATCHES', slug: 'Watches' },
  { name: 'BAGS', slug: 'Bags' },
  { name: 'SHOES', slug: 'Shoes' },
  { name: 'ACCESSORIES', slug: 'Accessories' },
  { name: 'PERFUMES', slug: 'Perfumes', hasDropdown: true },
  { name: 'NEW ARRIVALS', slug: 'New Arrivals', hasDropdown: true },
  { name: 'OFFERS', slug: 'Offers' },
];

export const SubNav: React.FC = () => {
  const { selectedCategory, triggerTransition } = useStore();

  const handleNavClick = (slug: string, name: string) => {
    triggerTransition(slug, name);
  };

  return (
    <nav className="bg-[#FAF8F5] border-b border-[#ECE3D2] overflow-x-auto no-scrollbar shadow-xs">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-start md:justify-center gap-6 md:gap-9 py-2.5 whitespace-nowrap min-w-max">
        {NAV_ITEMS.map((item) => {
          const isActive = selectedCategory === item.slug;
          return (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.slug, item.name)}
              className={`flex items-center gap-1 text-[11px] md:text-xs font-semibold tracking-[0.16em] uppercase transition-colors relative py-1 cursor-pointer ${
                isActive
                  ? 'text-[#B89758]'
                  : 'text-[#3E3831] hover:text-[#B89758]'
              }`}
            >
              <span>{item.name}</span>
              {item.hasDropdown && (
                <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B89758] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
