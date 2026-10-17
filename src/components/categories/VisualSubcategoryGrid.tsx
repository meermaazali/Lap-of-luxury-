import React from 'react';
import {
  Shirt,
  ShoppingBag,
  Footprints,
  Watch,
  Glasses,
  Sparkles,
  Layers,
  CreditCard,
  Droplets,
  Grid,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface SubcategoryItem {
  id: string;
  name: string;
  count?: number;
  iconType?: string;
  isBrand?: boolean;
  brandLogo?: React.ReactNode;
}

interface VisualSubcategoryGridProps {
  departmentKey: string;
  activeSubcategory: string | null;
  onSelectSubcategory: (sub: string) => void;
  onViewAllCategories?: () => void;
}

// Authentic brand logo renderers for Watches and Sunglasses (Step 12)
export const BrandLogos = {
  // Watches
  rolex: (
    <div className="flex flex-col items-center justify-center">
      <svg className="w-9 h-6 text-[#1A472A]" viewBox="0 0 100 60" fill="currentColor">
        <path d="M50 8 L58 24 L72 16 L68 34 L82 32 L70 46 L30 46 L18 32 L32 34 L28 16 L42 24 Z" fill="#C5A059" />
        <circle cx="50" cy="5" r="3" fill="#C5A059" />
        <circle cx="28" cy="13" r="3" fill="#C5A059" />
        <circle cx="72" cy="13" r="3" fill="#C5A059" />
        <circle cx="16" cy="29" r="3" fill="#C5A059" />
        <circle cx="84" cy="29" r="3" fill="#C5A059" />
      </svg>
      <span className="font-serif text-[11px] font-bold tracking-[0.2em] text-[#006039]">ROLEX</span>
    </div>
  ),
  rado: (
    <div className="flex flex-col items-center justify-center">
      <span className="font-sans text-xs font-black tracking-[0.22em] text-[#111113]">RADO</span>
      <span className="text-[7.5px] tracking-widest text-[#7A6C58]">SWITZERLAND</span>
    </div>
  ),
  omega: (
    <div className="flex flex-col items-center justify-center">
      <span className="font-serif text-sm font-bold text-[#9E1B32]">Ω</span>
      <span className="font-sans text-[10.5px] font-bold tracking-[0.18em] text-[#111113]">OMEGA</span>
    </div>
  ),
  tissot: (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center gap-1">
        <span className="font-sans text-[11px] font-black tracking-widest text-[#111113]">TISSOT</span>
        <span className="bg-[#E31B23] text-white text-[8px] font-bold px-1 rounded-2xs">1853</span>
      </div>
    </div>
  ),
  casio: (
    <div className="flex flex-col items-center justify-center">
      <span className="font-sans text-[12px] font-black tracking-[0.14em] text-[#003B7A]">CASIO</span>
    </div>
  ),
  seiko: (
    <div className="flex flex-col items-center justify-center">
      <span className="font-serif text-[11.5px] font-bold tracking-[0.18em] text-[#0B2341]">SEIKO</span>
    </div>
  ),
  titan: (
    <div className="flex flex-col items-center justify-center">
      <span className="font-sans text-[11px] font-bold tracking-[0.22em] text-[#B8860B]">TITAN</span>
    </div>
  ),
  fossil: (
    <div className="flex flex-col items-center justify-center border border-[#3C2415]/40 rounded-full px-2 py-0.5 bg-[#FAF6EE]">
      <span className="font-serif text-[10px] font-bold tracking-[0.12em] text-[#3C2415]">FOSSIL</span>
    </div>
  ),

  // Sunglasses
  rayban: (
    <div className="flex flex-col items-center justify-center">
      <span className="bg-[#E31B23] text-white font-serif font-black italic text-xs px-2.5 py-0.5 rounded-sm shadow-xs tracking-tight">
        Ray•Ban
      </span>
    </div>
  ),
  oakley: (
    <div className="flex flex-col items-center justify-center">
      <svg className="w-8 h-4 text-[#111113]" viewBox="0 0 100 50" fill="currentColor">
        <path d="M50 0 C22 0 0 11 0 25 C0 39 22 50 50 50 C78 50 100 39 100 25 C100 11 78 0 50 0 Z M50 36 C30 36 14 31 14 25 C14 19 30 14 50 14 C70 14 86 19 86 25 C86 31 70 36 50 36 Z" />
      </svg>
      <span className="font-sans text-[8.5px] font-bold tracking-widest text-[#111113]">OAKLEY</span>
    </div>
  ),
  gucci: (
    <div className="flex flex-col items-center justify-center">
      <span className="font-serif text-[11.5px] font-bold tracking-[0.28em] text-[#111113]">GUCCI</span>
    </div>
  ),
};

// Generic Luxury Theme Subcategory Icon Resolver (Step 11-C & 11-D)
const renderCategoryIcon = (subName: string, dept: string) => {
  const norm = subName.toLowerCase();
  const iconProps = { className: 'w-5 h-5 text-[#B8860B]' };

  if (norm.includes('shirt') && !norm.includes('t-shirt')) return <Shirt {...iconProps} />;
  if (norm.includes('t-shirt') || norm.includes('tee')) {
    return (
      <svg className="w-5 h-5 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6l3-2h10l3 2v4l-3-1v11H7V9L4 10V6z" />
      </svg>
    );
  }
  if (norm.includes('hoodie')) {
    return (
      <svg className="w-5 h-5 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 8l3-4h8l3 4v3l-3-1v10H8V10L5 11V8z M12 4v4" />
      </svg>
    );
  }
  if (norm.includes('jeans') || norm.includes('denim')) {
    return (
      <svg className="w-5 h-5 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 3h12l1 18-5-1-2-9-2 9-5 1 1-18z M9 3v4 M15 3v4" />
      </svg>
    );
  }
  if (norm.includes('trouser') || norm.includes('chino') || norm.includes('pant')) return <Layers {...iconProps} />;
  if (norm.includes('shoe') || norm.includes('sneaker') || norm.includes('loafer') || norm.includes('footwear') || norm.includes('sandal') || norm.includes('heel') || norm.includes('flat')) return <Footprints {...iconProps} />;
  if (norm.includes('bag') || norm.includes('tote') || norm.includes('clutch') || norm.includes('sling') || norm.includes('backpack')) return <ShoppingBag {...iconProps} />;
  if (norm.includes('wallet') || norm.includes('card')) return <CreditCard {...iconProps} />;
  if (norm.includes('watch') || norm.includes('chronograph')) return <Watch {...iconProps} />;
  if (norm.includes('sunglass') || norm.includes('aviator') || norm.includes('eyewear') || norm.includes('goggle')) return <Glasses {...iconProps} />;
  if (norm.includes('perfume') || norm.includes('fragrance') || norm.includes('oud') || norm.includes('amber')) return <Droplets {...iconProps} />;
  if (norm.includes('saree') || norm.includes('dress') || norm.includes('lehenga') || norm.includes('co-ord') || norm.includes('top')) return <Sparkles {...iconProps} />;
  if (norm.includes('belt')) {
    return (
      <svg className="w-5 h-5 text-[#B8860B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="10" rx="2" strokeWidth={1.75} />
        <rect x="5" y="9" width="6" height="6" rx="1" strokeWidth={1.75} />
      </svg>
    );
  }
  if (norm.startsWith('all')) return <Grid {...iconProps} />;
  return <Sparkles {...iconProps} />;
};

export const VisualSubcategoryGrid: React.FC<VisualSubcategoryGridProps> = ({
  departmentKey,
  activeSubcategory,
  onSelectSubcategory,
  onViewAllCategories,
}) => {
  const normDept = departmentKey.toLowerCase();
  const isWatchesDept = normDept === 'watches' || (normDept === 'accessories' && activeSubcategory?.toLowerCase().includes('watch'));
  const isSunglassesDept = normDept === 'sunglasses' || normDept === 'eyewear';

  // Specific Subcategory & Brand Lists per department
  const subcategoryList: SubcategoryItem[] = (() => {
    if (isWatchesDept) {
      return [
        { id: 'all-watches', name: 'All Watches', iconType: 'all' },
        { id: 'rolex', name: 'Rolex', isBrand: true, brandLogo: BrandLogos.rolex },
        { id: 'rado', name: 'Rado', isBrand: true, brandLogo: BrandLogos.rado },
        { id: 'omega', name: 'Omega', isBrand: true, brandLogo: BrandLogos.omega },
        { id: 'tissot', name: 'Tissot', isBrand: true, brandLogo: BrandLogos.tissot },
        { id: 'casio', name: 'Casio', isBrand: true, brandLogo: BrandLogos.casio },
        { id: 'seiko', name: 'Seiko', isBrand: true, brandLogo: BrandLogos.seiko },
        { id: 'titan', name: 'Titan', isBrand: true, brandLogo: BrandLogos.titan },
        { id: 'fossil', name: 'Fossil', isBrand: true, brandLogo: BrandLogos.fossil },
      ];
    }

    if (isSunglassesDept) {
      return [
        { id: 'all-sunglasses', name: 'All Sunglasses', iconType: 'all' },
        { id: 'ray-ban', name: 'Ray-Ban', isBrand: true, brandLogo: BrandLogos.rayban },
        { id: 'oakley', name: 'Oakley', isBrand: true, brandLogo: BrandLogos.oakley },
        { id: 'gucci', name: 'Gucci', isBrand: true, brandLogo: BrandLogos.gucci },
        { id: 'aviator', name: 'Aviator', iconType: 'aviator' },
        { id: 'polarized', name: 'Polarized', iconType: 'sunglasses' },
      ];
    }

    if (normDept === 'men') {
      return [
        { id: 'all-men', name: 'All Men', iconType: 'all' },
        { id: 'shirts', name: 'Shirts', iconType: 'shirts' },
        { id: 't-shirts', name: 'T-Shirts', iconType: 't-shirts' },
        { id: 'hoodies', name: 'Hoodies', iconType: 'hoodies' },
        { id: 'jeans', name: 'Denim Jeans', iconType: 'jeans' },
        { id: 'trousers', name: 'Trousers', iconType: 'trousers' },
        { id: 'sneakers', name: 'Sneakers', iconType: 'sneakers' },
        { id: 'loafers', name: 'Loafers', iconType: 'loafers' },
        { id: 'watches', name: 'Watches', iconType: 'watches' },
        { id: 'sunglasses', name: 'Sunglasses', iconType: 'sunglasses' },
        { id: 'perfumes', name: 'Perfumes', iconType: 'perfumes' },
        { id: 'belts', name: 'Belts & Wallets', iconType: 'belts' },
      ];
    }

    if (normDept === 'women') {
      return [
        { id: 'all-women', name: 'All Women', iconType: 'all' },
        { id: 'sarees', name: 'Banarasi Sarees', iconType: 'sarees' },
        { id: 'dresses', name: 'Dresses & Gowns', iconType: 'dresses' },
        { id: 'tops', name: 'Tops & Shirts', iconType: 'tops' },
        { id: 't-shirts', name: 'T-Shirts', iconType: 't-shirts' },
        { id: 'jeans', name: 'Jeans & Denim', iconType: 'jeans' },
        { id: 'co-ords', name: 'Co-ord Sets', iconType: 'co-ords' },
        { id: 'handbags', name: 'Handbags', iconType: 'handbags' },
        { id: 'heels', name: 'Stiletto Heels', iconType: 'heels' },
        { id: 'flats', name: 'Sandals & Flats', iconType: 'flats' },
      ];
    }

    if (normDept === 'bags') {
      return [
        { id: 'all-bags', name: 'All Bags', iconType: 'all' },
        { id: 'handbags', name: 'Handbags', iconType: 'handbags' },
        { id: 'shoulder-bags', name: 'Shoulder Bags', iconType: 'handbags' },
        { id: 'sling-bags', name: 'Sling Bags', iconType: 'handbags' },
        { id: 'clutches', name: 'Evening Clutches', iconType: 'handbags' },
        { id: 'totes', name: 'Leather Totes', iconType: 'handbags' },
        { id: 'backpacks', name: 'Backpacks', iconType: 'backpacks' },
        { id: 'wallets', name: 'Wallets', iconType: 'wallets' },
      ];
    }

    if (normDept === 'footwear') {
      return [
        { id: 'all-footwear', name: 'All Footwear', iconType: 'all' },
        { id: 'sneakers', name: 'Luxury Sneakers', iconType: 'sneakers' },
        { id: 'loafers', name: 'Loafers', iconType: 'loafers' },
        { id: 'formal-shoes', name: 'Formal Shoes', iconType: 'formal-shoes' },
        { id: 'casual-shoes', name: 'Casual Shoes', iconType: 'casual-shoes' },
        { id: 'sandals', name: 'Leather Sandals', iconType: 'sandals' },
        { id: 'heels', name: 'Heels', iconType: 'heels' },
      ];
    }

    if (normDept === 'perfumes') {
      return [
        { id: 'all-perfumes', name: 'All Perfumes', iconType: 'all' },
        { id: 'oud', name: 'Royal Oud', iconType: 'perfumes' },
        { id: 'amber', name: 'Amber Bourbon', iconType: 'perfumes' },
        { id: 'floral', name: 'French Floral', iconType: 'perfumes' },
        { id: 'eau-de-parfum', name: 'Eau de Parfum', iconType: 'perfumes' },
      ];
    }

    return [
      { id: 'all', name: `All ${departmentKey}`, iconType: 'all' },
      { id: 'watches', name: 'Watches', iconType: 'watches' },
      { id: 'belts', name: 'Belts', iconType: 'belts' },
      { id: 'sunglasses', name: 'Sunglasses', iconType: 'sunglasses' },
      { id: 'perfumes', name: 'Perfumes', iconType: 'perfumes' },
    ];
  })();

  return (
    <div className="w-full bg-[#FAF8F5] border-y border-[#E8DEC8] py-5 px-4 sm:px-8">
      <div className="max-w-[1540px] mx-auto">
        {/* Header row with Title & 'View All Categories' action */}
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-[#E8DEC8]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B8860B]" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111113]">
              {isWatchesDept
                ? 'AUTHENTIC HOROLOGY BRANDS'
                : isSunglassesDept
                ? 'AUTHENTIC EYEWEAR BRANDS'
                : 'EXPLORE BY CATEGORY'}
            </h3>
          </div>
          {onViewAllCategories && (
            <button
              type="button"
              onClick={onViewAllCategories}
              className="text-xs text-[#8A671A] hover:text-[#111113] hover:underline font-semibold cursor-pointer flex items-center gap-1"
            >
              <Grid className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>View All Categories</span>
            </button>
          )}
        </div>

        {/* Visual Icons Grid (Responsive: 3 cols mobile, 4-6 cols desktop) */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-2.5 sm:gap-3.5">
          {subcategoryList.map((item) => {
            const isAll = item.name.toLowerCase().startsWith('all');
            const isSelected =
              (isAll && (!activeSubcategory || activeSubcategory.toLowerCase().startsWith('all'))) ||
              (activeSubcategory &&
                (activeSubcategory.toLowerCase() === item.name.toLowerCase() ||
                  activeSubcategory.toLowerCase() === item.id.toLowerCase()));

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSubcategory(item.name)}
                className={`group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer relative min-h-[92px] text-center ${
                  isSelected
                    ? 'bg-white border-[#B8860B] ring-2 ring-[#B8860B]/40 shadow-md'
                    : 'bg-white/80 hover:bg-white border-[#E8DEC8] hover:border-[#B8860B] hover:shadow-sm'
                }`}
              >
                {/* Visual Icon or Authentic Brand Logo */}
                <div className="h-10 w-full flex items-center justify-center mb-1.5">
                  {item.isBrand && item.brandLogo ? (
                    <div className="transition-transform duration-200 group-hover:scale-105">
                      {item.brandLogo}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#E8DEC8] flex items-center justify-center group-hover:bg-[#F3E7BE] transition-colors">
                      {renderCategoryIcon(item.name, departmentKey)}
                    </div>
                  )}
                </div>

                {/* Subcategory Name Label */}
                <span
                  className={`text-[11px] leading-tight transition-colors line-clamp-1 ${
                    isSelected
                      ? 'text-[#111113] font-bold'
                      : 'text-[#4A4033] group-hover:text-[#B8860B]'
                  }`}
                >
                  {item.name}
                </span>

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#B8860B] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-3" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
