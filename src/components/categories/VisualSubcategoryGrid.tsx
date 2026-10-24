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

// Featured brand logo renderers for Watches and Sunglasses with unified Golden Theme
export const BrandLogos = {
  // Watches
  rolex: (
    <div className="flex flex-col items-center justify-center">
      <svg className="w-8 h-5 text-[#B8860B]" viewBox="0 0 100 60" fill="currentColor">
        <path d="M50 8 L58 24 L72 16 L68 34 L82 32 L70 46 L30 46 L18 32 L32 34 L28 16 L42 24 Z" fill="#D4AF37" />
        <circle cx="50" cy="5" r="3" fill="#D4AF37" />
        <circle cx="28" cy="13" r="3" fill="#D4AF37" />
        <circle cx="72" cy="13" r="3" fill="#D4AF37" />
        <circle cx="16" cy="29" r="3" fill="#D4AF37" />
        <circle cx="84" cy="29" r="3" fill="#D4AF37" />
      </svg>
      <span className="font-serif text-[11px] font-bold tracking-[0.2em] text-[#9A7416]">ROLEX</span>
    </div>
  ),
  rado: (
    <div className="flex flex-col items-center justify-center">
      <span className="font-sans text-xs font-black tracking-[0.22em] text-[#B8860B]">RADO</span>
      <span className="text-[7.5px] tracking-widest text-[#8A671A]">SWITZERLAND</span>
    </div>
  ),
  omega: (
    <div className="flex flex-col items-center justify-center">
      <span className="font-serif text-sm font-bold text-[#D4AF37]">Ω</span>
      <span className="font-sans text-[10.5px] font-bold tracking-[0.18em] text-[#B8860B]">OMEGA</span>
    </div>
  ),
  tissot: (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center gap-1">
        <span className="font-sans text-[11px] font-black tracking-widest text-[#B8860B]">TISSOT</span>
        <span className="bg-[#B8860B] text-white text-[8px] font-bold px-1 rounded-2xs">1853</span>
      </div>
    </div>
  ),
  casio: (
    <div className="flex flex-col items-center justify-center">
      <span className="font-sans text-[12px] font-black tracking-[0.14em] text-[#B8860B]">CASIO</span>
    </div>
  ),
  seiko: (
    <div className="flex flex-col items-center justify-center">
      <span className="font-serif text-[11.5px] font-bold tracking-[0.18em] text-[#B8860B]">SEIKO</span>
    </div>
  ),
  titan: (
    <div className="flex flex-col items-center justify-center">
      <span className="font-sans text-[11px] font-bold tracking-[0.22em] text-[#B8860B]">TITAN</span>
    </div>
  ),
  fossil: (
    <div className="flex flex-col items-center justify-center border border-[#B8860B]/50 rounded-full px-2 py-0.5 bg-[#FAF6EE]">
      <span className="font-serif text-[10px] font-bold tracking-[0.12em] text-[#8A671A]">FOSSIL</span>
    </div>
  ),

  // Sunglasses
  rayban: (
    <div className="flex flex-col items-center justify-center">
      <span className="bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white font-serif font-black italic text-xs px-2.5 py-0.5 rounded-sm shadow-xs tracking-tight">
        Ray•Ban
      </span>
    </div>
  ),
  oakley: (
    <div className="flex flex-col items-center justify-center">
      <svg className="w-8 h-4 text-[#B8860B]" viewBox="0 0 100 50" fill="currentColor">
        <path d="M50 0 C22 0 0 11 0 25 C0 39 22 50 50 50 C78 50 100 39 100 25 C100 11 78 0 50 0 Z M50 36 C30 36 14 31 14 25 C14 19 30 14 50 14 C70 14 86 19 86 25 C86 31 70 36 50 36 Z" />
      </svg>
      <span className="font-sans text-[8.5px] font-bold tracking-widest text-[#8A671A]">OAKLEY</span>
    </div>
  ),
  gucci: (
    <div className="flex flex-col items-center justify-center">
      <span className="font-serif text-[11.5px] font-bold tracking-[0.28em] text-[#B8860B]">GUCCI</span>
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
  const { categories } = useStore();
  const rawDept = departmentKey.toLowerCase().trim();
  let normDept = rawDept;
  if ((rawDept.includes('men') || rawDept === 'mens' || rawDept === "men's") && !rawDept.includes('women')) normDept = 'men';
  else if (rawDept.includes('women') || rawDept === 'womens' || rawDept === "women's") normDept = 'women';
  else if (rawDept.includes('shoe') || rawDept.includes('footwear')) normDept = 'footwear';
  else if (rawDept.includes('bag')) normDept = 'bags';
  else if (rawDept.includes('perfume')) normDept = 'perfumes';
  else if (rawDept.includes('watch')) normDept = 'watches';
  else if (rawDept.includes('jean') || rawDept.includes('denim')) normDept = 'jeans';
  else if (rawDept.includes('sunglass') || rawDept.includes('eyewear') || rawDept.includes('glasses')) normDept = 'sunglasses';
  else if (rawDept.includes('accessor')) normDept = 'accessories';

  const isWatchesDept = normDept === 'watches' || (normDept === 'accessories' && activeSubcategory?.toLowerCase().includes('watch'));
  const isSunglassesDept = normDept === 'sunglasses' || normDept === 'eyewear';

  // Specific Subcategory & Brand Lists per department
  const subcategoryList: SubcategoryItem[] = (() => {
    // 1. Check if Firestore categories has explicit dynamic subcategories for this department
    const matchingCat = categories.find((c) => {
      const slugLower = (c.slug || c.name || '').toLowerCase();
      const catDept = (c.department || c.parentCategory || '').toLowerCase();
      return (
        slugLower === normDept ||
        catDept === normDept ||
        (normDept === 'footwear' && (slugLower === 'shoes' || slugLower === 'footwear')) ||
        (normDept === 'men' && (slugLower === 'men' || slugLower === 'mens')) ||
        (normDept === 'women' && (slugLower === 'women' || slugLower === 'womens')) ||
        (normDept === 'jeans' && slugLower === 'jeans') ||
        (normDept === 'bags' && slugLower === 'bags') ||
        (normDept === 'perfumes' && slugLower === 'perfumes') ||
        (normDept === 'watches' && slugLower === 'watches')
      );
    });

    if (isWatchesDept) {
      const base: SubcategoryItem[] = [
        { id: 'watches-collection', name: 'Watches', iconType: 'all' },
        { id: 'rolex', name: 'Rolex', isBrand: true, brandLogo: BrandLogos.rolex },
        { id: 'rado', name: 'Rado', isBrand: true, brandLogo: BrandLogos.rado },
        { id: 'omega', name: 'Omega', isBrand: true, brandLogo: BrandLogos.omega },
        { id: 'tissot', name: 'Tissot', isBrand: true, brandLogo: BrandLogos.tissot },
        { id: 'casio', name: 'Casio', isBrand: true, brandLogo: BrandLogos.casio },
        { id: 'seiko', name: 'Seiko', isBrand: true, brandLogo: BrandLogos.seiko },
        { id: 'titan', name: 'Titan', isBrand: true, brandLogo: BrandLogos.titan },
        { id: 'fossil', name: 'Fossil', isBrand: true, brandLogo: BrandLogos.fossil },
      ];
      if (matchingCat?.subcategories) {
        matchingCat.subcategories.forEach((sub) => {
          if (!base.some((b) => b.name.toLowerCase() === sub.toLowerCase())) {
            base.push({ id: sub.toLowerCase().replace(/\s+/g, '-'), name: sub, iconType: 'watches' });
          }
        });
      }
      return base;
    }

    if (isSunglassesDept) {
      return [
        { id: 'sunglasses-collection', name: 'Sunglasses', iconType: 'all' },
        { id: 'ray-ban', name: 'Ray-Ban', isBrand: true, brandLogo: BrandLogos.rayban },
        { id: 'oakley', name: 'Oakley', isBrand: true, brandLogo: BrandLogos.oakley },
        { id: 'gucci', name: 'Gucci', isBrand: true, brandLogo: BrandLogos.gucci },
        { id: 'aviator', name: 'Aviator', iconType: 'aviator' },
        { id: 'polarized', name: 'Polarized', iconType: 'sunglasses' },
      ];
    }

    if (normDept === 'men') {
      const menList: SubcategoryItem[] = [
        { id: 'men-collection', name: "Men's Collection", iconType: 'all' },
        { id: 'shirts', name: 'Shirts', iconType: 'shirts' },
        { id: 't-shirts', name: 'T-Shirts', iconType: 't-shirts' },
        { id: 'hoodies', name: 'Hoodies', iconType: 'hoodies' },
        { id: 'full-sleeve-t-shirts', name: 'Full-sleeve T-shirts', iconType: 't-shirts' },
        { id: 'polo-t-shirts', name: 'Polo T-shirts', iconType: 't-shirts' },
        { id: 'trousers', name: 'Trousers', iconType: 'trousers' },
        { id: 'kurta-sets', name: 'Kurta Sets', iconType: 'sarees' },
      ];
      if (matchingCat?.subcategories) {
        matchingCat.subcategories.forEach((sub) => {
          const sLower = sub.toLowerCase();
          if (
            sLower.includes('sunglass') ||
            sLower.includes('glasses') ||
            sLower.includes('eyewear') ||
            sLower.includes('perfume') ||
            sLower.includes('watch') ||
            sLower.includes('bag') ||
            sLower.includes('saree') ||
            sLower.includes('lehenga') ||
            sLower.includes('gown') ||
            sLower.includes('women')
          ) {
            return;
          }
          if (!menList.some((m) => m.name.toLowerCase() === sub.toLowerCase())) {
            menList.push({ id: sub.toLowerCase().replace(/\s+/g, '-'), name: sub, iconType: 'shirts' });
          }
        });
      }
      return menList;
    }

    if (normDept === 'women') {
      const womenList: SubcategoryItem[] = [
        { id: 'women-collection', name: "Women's Collection", iconType: 'all' },
        { id: 'sarees', name: 'Sarees', iconType: 'sarees' },
        { id: 'dresses', name: 'Dresses & Gowns', iconType: 'sarees' },
        { id: 'blouses', name: 'Blouses', iconType: 'shirts' },
        { id: 'co-ord-sets', name: 'Co-ord Sets', iconType: 'sarees' },
      ];
      if (matchingCat?.subcategories) {
        matchingCat.subcategories.forEach((sub) => {
          const sLower = sub.toLowerCase();
          if (
            sLower.includes('men') ||
            sLower.includes('sunglass') ||
            sLower.includes('perfume') ||
            sLower.includes('watch')
          ) {
            return;
          }
          if (!womenList.some((w) => w.name.toLowerCase() === sub.toLowerCase())) {
            womenList.push({ id: sub.toLowerCase().replace(/\s+/g, '-'), name: sub, iconType: 'sarees' });
          }
        });
      }
      return womenList;
    }

    if (normDept === 'jeans') {
      const jeansList: SubcategoryItem[] = [
        { id: 'jeans-collection', name: 'Jeans & Denim', iconType: 'all' },
        { id: 'slim-fit', name: 'Slim Fit', iconType: 'jeans' },
        { id: 'regular-fit', name: 'Regular Fit', iconType: 'jeans' },
        { id: 'baggy-fit', name: 'Baggy Fit', iconType: 'jeans' },
        { id: 'raw-denim', name: 'Raw Denim', iconType: 'jeans' },
        { id: 'relaxed-fit', name: 'Relaxed Fit', iconType: 'jeans' },
      ];
      if (matchingCat?.subcategories) {
        matchingCat.subcategories.forEach((sub) => {
          if (!jeansList.some((j) => j.name.toLowerCase() === sub.toLowerCase())) {
            jeansList.push({ id: sub.toLowerCase().replace(/\s+/g, '-'), name: sub, iconType: 'jeans' });
          }
        });
      }
      return jeansList;
    }

    if (normDept === 'bags') {
      return [
        { id: 'bags-collection', name: 'Bags & Luggage', iconType: 'all' },
        { id: 'handbags', name: 'Handbags', iconType: 'handbags' },
        { id: 'shoulder-bags', name: 'Shoulder Bags', iconType: 'handbags' },
        { id: 'crossbody-bags', name: 'Crossbody Bags', iconType: 'handbags' },
        { id: 'clutches', name: 'Evening Clutches', iconType: 'handbags' },
        { id: 'backpacks', name: 'Backpacks', iconType: 'backpacks' },
        { id: 'travel-bags', name: 'Travel Bags', iconType: 'handbags' },
        { id: 'wallets', name: 'Wallets', iconType: 'wallets' },
      ];
    }

    if (normDept === 'footwear') {
      return [
        { id: 'footwear-collection', name: 'Footwear Collection', iconType: 'all' },
        { id: 'sneakers', name: 'Sneakers', iconType: 'sneakers' },
        { id: 'crocs', name: 'Crocs & Clogs', iconType: 'sandals' },
        { id: 'loafers', name: 'Penny Loafers', iconType: 'loafers' },
        { id: 'formal-shoes', name: 'Formal Shoes', iconType: 'formal-shoes' },
        { id: 'casual-shoes', name: 'Casual Shoes', iconType: 'casual-shoes' },
        { id: 'sandals', name: 'Sandals', iconType: 'sandals' },
      ];
    }

    if (normDept === 'perfumes') {
      return [
        { id: 'perfumes-collection', name: 'Perfumes Collection', iconType: 'all' },
        { id: 'oud', name: 'Oud & Extrait', iconType: 'perfumes' },
        { id: 'eau-de-parfum', name: 'Eau de Parfum', iconType: 'perfumes' },
        { id: 'parfum', name: 'Parfum', iconType: 'perfumes' },
        { id: 'attar', name: 'Attar & Oils', iconType: 'perfumes' },
      ];
    }

    if (normDept === 'accessories') {
      return [
        { id: 'accessories-collection', name: 'Accessories', iconType: 'all' },
        { id: 'sunglasses', name: 'Sunglasses', iconType: 'sunglasses' },
        { id: 'belts', name: 'Belts & Buckles', iconType: 'belts' },
        { id: 'wallets', name: 'Wallets', iconType: 'wallets' },
      ];
    }

    return [
      { id: 'all', name: `All ${departmentKey.toUpperCase()}`, iconType: 'all' },
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
                ? 'LUXURY WATCH BRANDS'
                : isSunglassesDept
                ? 'LUXURY EYEWEAR BRANDS'
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
            const isAll = item.name.toLowerCase().startsWith('all') || item.id.includes('collection') || item.name.toLowerCase() === departmentKey.toLowerCase();
            const isSelected =
              (isAll && (!activeSubcategory || activeSubcategory.toLowerCase().startsWith('all') || activeSubcategory.toLowerCase() === departmentKey.toLowerCase() || activeSubcategory.toLowerCase() === item.name.toLowerCase())) ||
              (activeSubcategory &&
                (activeSubcategory.toLowerCase() === item.name.toLowerCase() ||
                  activeSubcategory.toLowerCase() === item.id.toLowerCase()));

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSubcategory(isAll ? 'All' : item.name)}
                className={`group flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer relative min-h-[96px] text-center ${
                  isSelected
                    ? 'bg-white border-[#B8860B] ring-2 ring-[#B8860B]/40 shadow-md scale-[1.02]'
                    : 'bg-white/90 hover:bg-white border-[#E8DEC8] hover:border-[#B8860B] hover:shadow-sm'
                }`}
              >
                {/* Visual Icon or Brand Logo */}
                <div className="h-10 w-full flex items-center justify-center mb-1.5">
                  {item.isBrand && item.brandLogo ? (
                    <div className="transition-transform duration-200 group-hover:scale-105">
                      {item.brandLogo}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#FAF6EE] border border-[#D4AF37]/30 flex items-center justify-center group-hover:bg-[#F3E7BE] transition-colors shadow-2xs">
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
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#B8860B] text-white flex items-center justify-center shadow-xs">
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
