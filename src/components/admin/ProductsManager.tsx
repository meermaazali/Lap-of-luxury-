import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Sparkles,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  Tag,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../../utils/imageUtils';

export const ProductsManager: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    mediaAssets,
    uploadMediaAsset,
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);

  // View Mode: Grid or Table
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Men',
    subCategory: 'Shirts',
    customSubcategory: '',
    isCustomSubcategory: false,
    price: 1000,
    originalPrice: 1999,
    description: '',
    sizes: '38, 40, 42, 44',
    stockCount: 20,
    image: '',
    secondaryImage: '',
    isFestiveEdit: false,
    isBestSeller: true,
  });

  const [isUploadingPrimary, setIsUploadingPrimary] = useState(false);
  const [isUploadingSecondary, setIsUploadingSecondary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Search & Filter State
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategory, setAdminCategory] = useState('All');
  const [adminSubcategory, setAdminSubcategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Derive dynamic subcategories for the current form category
  const availableSubcategoriesForForm = useMemo(() => {
    const matchedCategory = categories.find(
      (c) =>
        c.slug.toLowerCase() === formData.category.toLowerCase() ||
        c.name.toLowerCase().includes(formData.category.toLowerCase())
    );
    if (matchedCategory?.subcategories && matchedCategory.subcategories.length > 0) {
      return matchedCategory.subcategories;
    }

    // Standard fallbacks if category has not loaded or has no subcategories
    const cat = formData.category.toLowerCase();
    if (cat === 'men') return ['Shirts', 'T-Shirts', 'Trousers', 'Jeans', 'Kurta Sets'];
    if (cat === 'women') return ['Dresses', 'Tops', 'Handbags', 'Banarasi Sarees', 'Co-ord Sets', 'Heels'];
    if (cat === 'jeans') return ['Slim Fit', 'Skinny Fit', 'Raw Denim', 'Relaxed Fit', 'Selvedge'];
    if (cat === 'watches') return ['Chronograph', 'Automatic', 'Dress Watches', 'Gold Editions'];
    if (cat === 'bags') return ['Handbags', 'Shoulder Bags', 'Sling Bags', 'Clutches', 'Totes', 'Wallets'];
    if (cat === 'shoes' || cat === 'footwear') return ['Sneakers', 'Formal Shoes', 'Loafers', 'Sandals', 'Heels', 'Flats'];
    if (cat === 'accessories') return ['Watches and Accessories', 'Sunglasses', 'Belts', 'Wallets'];
    if (cat === 'perfumes') return ['Oud & Extrait', 'Parfum', 'Eau de Parfum', 'Amber Bourbon'];
    return ['Shirts', 'Trousers', 'Dresses', 'Sneakers'];
  }, [categories, formData.category]);

  // Derive all existing subcategories across products for filter dropdown
  const allExistingSubcategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      const sub = p.subCategory || p.subcategory;
      if (sub && sub.trim()) set.add(sub.trim());
    });
    return Array.from(set).sort();
  }, [products]);

  // Filtered products list
  const filteredAdminProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        adminCategory === 'All' || p.category.toLowerCase() === adminCategory.toLowerCase();
      const productSub = (p.subCategory || p.subcategory || '').toLowerCase();
      const matchesSub =
        adminSubcategory === 'All' || productSub === adminSubcategory.toLowerCase();
      const matchesSearch =
        !adminSearch.trim() ||
        p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(adminSearch.toLowerCase()) ||
        productSub.includes(adminSearch.toLowerCase());
      return matchesCat && matchesSub && matchesSearch;
    });
  }, [products, adminCategory, adminSubcategory, adminSearch]);

  const totalPages = Math.ceil(filteredAdminProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredAdminProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormError(null);
    const initialCategory = categories[0]?.slug || 'Men';
    const subcats = categories.find((c) => c.slug === initialCategory)?.subcategories || ['Shirts', 'T-Shirts', 'Trousers'];
    setFormData({
      name: '',
      category: initialCategory,
      subCategory: subcats[0] || 'Shirts',
      customSubcategory: '',
      isCustomSubcategory: false,
      price: 1000,
      originalPrice: 1999,
      description: '',
      sizes: '38, 40, 42, 44',
      stockCount: 20,
      image: mediaAssets[0]?.dataUrl || '/images/hero_luxury_fashion_1791098539165.jpg',
      secondaryImage: '',
      isFestiveEdit: false,
      isBestSeller: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormError(null);
    const pSub = p.subCategory || p.subcategory || '';
    const matchedCategory = categories.find(
      (c) => c.slug.toLowerCase() === p.category.toLowerCase()
    );
    const availableSubs = matchedCategory?.subcategories || [];
    const isCustom = pSub && availableSubs.length > 0 && !availableSubs.includes(pSub);

    setFormData({
      name: p.name,
      category: p.category,
      subCategory: pSub || availableSubs[0] || 'Standard',
      customSubcategory: isCustom ? pSub : '',
      isCustomSubcategory: isCustom,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      description: p.description,
      sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : 'Standard',
      stockCount: p.stockCount,
      image: normalizeImageUrl(p.image, p.category),
      secondaryImage: p.secondaryImage ? normalizeImageUrl(p.secondaryImage, p.category) : '',
      isFestiveEdit: !!p.isFestiveEdit,
      isBestSeller: !!p.isBestSeller,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'primary' | 'secondary'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'primary') setIsUploadingPrimary(true);
    else setIsUploadingSecondary(true);
    setFormError(null);

    try {
      const asset = await uploadMediaAsset(file, 'Products');
      if (type === 'primary') {
        setFormData((prev) => ({ ...prev, image: asset.dataUrl }));
      } else {
        setFormData((prev) => ({ ...prev, secondaryImage: asset.dataUrl }));
      }
      showToast('✓ Image uploaded and optimized successfully!');
    } catch (err: unknown) {
      setFormError('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      if (type === 'primary') setIsUploadingPrimary(false);
      else setIsUploadingSecondary(false);
      e.target.value = '';
    }
  };

  const handleRemovePrimaryImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const handleRemoveSecondaryImage = () => {
    setFormData((prev) => ({ ...prev, secondaryImage: '' }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!formData.image.trim()) {
      setFormError('Primary product image is required. Please upload or enter an image URL.');
      return;
    }

    const sizesArr = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const finalPrimaryImage = normalizeImageUrl(formData.image, formData.category);
    const finalSecondaryImage = formData.secondaryImage
      ? normalizeImageUrl(formData.secondaryImage, formData.category)
      : undefined;

    const chosenSubcategory = formData.isCustomSubcategory
      ? formData.customSubcategory.trim() || 'General'
      : formData.subCategory.trim() || 'General';

    setIsSaving(true);
    setFormError(null);

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name: formData.name,
          category: formData.category,
          subCategory: chosenSubcategory,
          subcategory: chosenSubcategory,
          price: Number(formData.price),
          originalPrice: Number(formData.originalPrice),
          description: formData.description,
          sizes: sizesArr.length > 0 ? sizesArr : ['Standard'],
          stockCount: Number(formData.stockCount),
          inStock: Number(formData.stockCount) > 0,
          image: finalPrimaryImage,
          secondaryImage: finalSecondaryImage,
          isFestiveEdit: formData.isFestiveEdit,
          isBestSeller: formData.isBestSeller,
        });
        showToast(`✓ Product "${formData.name}" updated in Firebase Cloud Firestore!`);
      } else {
        await addProduct({
          name: formData.name,
          category: formData.category,
          subCategory: chosenSubcategory,
          subcategory: chosenSubcategory,
          price: Number(formData.price),
          originalPrice: Number(formData.originalPrice),
          description: formData.description,
          sizes: sizesArr.length > 0 ? sizesArr : ['Standard'],
          stockCount: Number(formData.stockCount),
          inStock: Number(formData.stockCount) > 0,
          rating: 4.9,
          reviewsCount: 1,
          image: finalPrimaryImage,
          secondaryImage: finalSecondaryImage,
          isFestiveEdit: formData.isFestiveEdit,
          isBestSeller: formData.isBestSeller,
          tags: [formData.category, chosenSubcategory, formData.isFestiveEdit ? 'Festive Edit' : ''],
        });
        showToast(`✓ New product "${formData.name}" created and saved to Firebase Cloud Firestore!`);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      setFormError('Cloud save failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmProduct) {
      try {
        await deleteProduct(deleteConfirmProduct.id);
        showToast(`✓ Removed "${deleteConfirmProduct.name}" from Firebase catalog.`);
      } catch (err: unknown) {
        showToast('Delete error: ' + (err instanceof Error ? err.message : String(err)));
      } finally {
        setDeleteConfirmProduct(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-700">Firebase Cloud Authoritative</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="bg-white p-5 rounded-xl border border-[#E0D5C3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#B89758]" />
            PRODUCT CATALOG & MERCHANDISING
          </h2>
          <p className="text-xs text-[#7A6C58] mt-0.5">
            Manage luxury shirts, denim, dresses, watches, and bags with subcategories, multi-angle images, and inventory synchronization across devices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-[#FAF8F5] border border-[#D5C7B0] p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'table' ? 'bg-[#1E1E22] text-[#D4AF37] font-bold shadow-2xs' : 'text-[#7A6C58] hover:text-[#1E1E22]'
              }`}
              title="Table View (Comprehensive details & clear borders)"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'bg-[#1E1E22] text-[#D4AF37] font-bold shadow-2xs' : 'text-[#7A6C58] hover:text-[#1E1E22]'
              }`}
              title="Grid View (Visual cards)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Grid</span>
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-[#B89758]" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Pagination Controls */}
      <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => {
                setAdminSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search product name, description, subcategory..."
              className="pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded-lg text-xs w-full focus:outline-none focus:border-[#B8860B]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#7A6C58] uppercase">Cat:</span>
            <select
              value={adminCategory}
              onChange={(e) => {
                setAdminCategory(e.target.value);
                setAdminSubcategory('All');
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded-lg text-xs focus:outline-none focus:border-[#B8860B] cursor-pointer"
            >
              <option value="All">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-[#7A6C58] uppercase">Sub:</span>
            <select
              value={adminSubcategory}
              onChange={(e) => {
                setAdminSubcategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded-lg text-xs focus:outline-none focus:border-[#B8860B] cursor-pointer"
            >
              <option value="All">All Subcategories</option>
              {allExistingSubcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-3 justify-between lg:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E8DEC8]">
          <span className="text-[#7A6C58]">
            Showing {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, filteredAdminProducts.length)} of {filteredAdminProducts.length} items
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1.5 border border-[#D5C7B0] bg-[#FAF8F5] hover:bg-white rounded hover:border-[#B89758] disabled:opacity-40 cursor-pointer text-xs"
            >
              Prev
            </button>
            <span className="px-2 py-1 font-semibold text-[#111113]">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1.5 border border-[#D5C7B0] bg-[#FAF8F5] hover:bg-white rounded hover:border-[#B89758] disabled:opacity-40 cursor-pointer text-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-[#E0D5C3] text-center text-xs text-[#7A6C58]">
          No products match the selected search or filter criteria.
        </div>
      ) : viewMode === 'table' ? (
        /* RESPONSIVE TABLE VIEW WITH CLEAR BOUNDARIES & HORIZONTAL SCROLL */
        <div className="bg-white rounded-xl border border-[#E0D5C3] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E0D5C3] text-[#4A4033] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 border-r border-[#E0D5C3] w-14">Image</th>
                  <th className="py-3 px-4 border-r border-[#E0D5C3]">Product Name</th>
                  <th className="py-3 px-4 border-r border-[#E0D5C3]">Category</th>
                  <th className="py-3 px-4 border-r border-[#E0D5C3]">Subcategory</th>
                  <th className="py-3 px-4 border-r border-[#E0D5C3]">Price</th>
                  <th className="py-3 px-4 border-r border-[#E0D5C3]">Stock</th>
                  <th className="py-3 px-4 border-r border-[#E0D5C3]">Badges</th>
                  <th className="py-3 px-4 text-right w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8DC]">
                {paginatedProducts.map((p) => {
                  const sub = p.subCategory || p.subcategory || 'General';
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      {/* Image */}
                      <td className="py-2.5 px-4 border-r border-[#EFE8DC]">
                        <div className="w-11 h-11 rounded-lg overflow-hidden border border-[#D5C7B0] bg-[#F5EFE3] shrink-0">
                          <img
                            src={normalizeImageUrl(p.image, p.category)}
                            alt={p.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-2.5 px-4 border-r border-[#EFE8DC]">
                        <div className="font-bold text-[#1E1E22] line-clamp-1">{p.name}</div>
                        <div className="text-[10px] text-[#7A6C58] font-mono mt-0.5 line-clamp-1">
                          ID: {p.id}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-2.5 px-4 border-r border-[#EFE8DC]">
                        <span className="inline-block bg-[#FAF6EE] text-[#8C6D1F] border border-[#D5C2A5] px-2 py-0.5 rounded font-bold uppercase text-[10.5px]">
                          {p.category}
                        </span>
                      </td>

                      {/* Subcategory */}
                      <td className="py-2.5 px-4 border-r border-[#EFE8DC]">
                        <span className="inline-flex items-center gap-1 bg-[#1E1E22] text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                          <Tag className="w-2.5 h-2.5" />
                          <span>{sub}</span>
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-2.5 px-4 border-r border-[#EFE8DC] font-semibold text-[#111113]">
                        <div>₹{p.price.toLocaleString('en-IN')}</div>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <div className="text-[10px] text-gray-400 line-through">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-2.5 px-4 border-r border-[#EFE8DC]">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold ${
                            p.stockCount > 5
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : p.stockCount > 0
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}
                        >
                          {p.stockCount > 0 ? `${p.stockCount} in stock` : 'Out of stock'}
                        </span>
                      </td>

                      {/* Badges */}
                      <td className="py-2.5 px-4 border-r border-[#EFE8DC]">
                        <div className="flex flex-wrap gap-1">
                          {p.isBestSeller && (
                            <span className="bg-[#FAF0D9] text-[#8A671A] text-[9.5px] px-1.5 py-0.5 rounded font-bold">
                              Best Seller
                            </span>
                          )}
                          {p.isFestiveEdit && (
                            <span className="bg-purple-50 text-purple-700 text-[9.5px] px-1.5 py-0.5 rounded font-bold">
                              Festive Edit
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/product/${p.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-500 hover:text-[#B89758] rounded hover:bg-[#FAF8F5] cursor-pointer"
                            title="View product storefront page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-[#1E1E22] hover:text-[#B89758] rounded hover:bg-[#FAF8F5] cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmProduct(p)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW WITH BORDERED CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedProducts.map((p) => {
            const sub = p.subCategory || p.subcategory || 'General';
            return (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-[#E0D5C3] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="relative aspect-square bg-[#F5F2EB] overflow-hidden group">
                  <img
                    src={normalizeImageUrl(p.image, p.category)}
                    alt={p.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    <span className="bg-[#1E1E22]/90 text-[#D4AF37] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-[#D4AF37]/30">
                      {p.category}
                    </span>
                    <span className="bg-black/80 text-white text-[9.5px] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5 text-[#B89758]" />
                      <span>{sub}</span>
                    </span>
                  </div>
                  <span
                    className={`absolute bottom-2 right-2 text-[10px] px-2 py-0.5 rounded font-bold shadow-xs ${
                      p.stockCount > 0 ? 'bg-black/70 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {p.stockCount > 0 ? `${p.stockCount} in stock` : 'Out of stock'}
                  </span>
                </div>

                <div className="p-3.5 space-y-2 bg-[#FAF8F5] border-t border-[#EFE8DC] flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#1E1E22] line-clamp-1">{p.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-sm text-[#111113]">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="text-[11px] text-gray-400 line-through">
                          ₹{p.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E8DEC8] flex items-center justify-between">
                    <a
                      href={`/product/${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#8C6D1F] hover:text-[#B89758] font-bold flex items-center gap-1"
                    >
                      <span>Storefront</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-[#5A4F41] hover:text-[#B89758] bg-white border border-[#D5C7B0] rounded cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmProduct(p)}
                        className="p-1.5 text-gray-400 hover:text-red-600 bg-white border border-[#D5C7B0] rounded cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-sm w-full p-6 rounded-2xl border border-[#D5C2A5] shadow-2xl space-y-4">
            <h4 className="font-bold text-sm text-[#1E1E22] uppercase tracking-wider">
              CONFIRM PRODUCT DELETION
            </h4>
            <p className="text-xs text-[#5A4F41]">
              Are you sure you want to remove <strong>"{deleteConfirmProduct.name}"</strong>? This will permanently remove the record from Firebase Cloud Firestore.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-3 py-1.5 border border-[#D5C7B0] bg-white text-xs font-semibold rounded hover:bg-[#F2ECE1] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-lg shadow cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL (BOUNDED, SPACIOUS & NON-CLIPPED) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#FAF8F5] w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-[#E8DEC8] flex items-center justify-between shrink-0">
              <h3 className="font-display text-base font-bold tracking-wider uppercase text-[#1E1E22] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#B89758]" />
                {editingProduct ? 'EDIT PRODUCT DETAILS' : 'ADD NEW LUXURY PRODUCT'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full border border-[#D5C7B0] flex items-center justify-center text-[#1E1E22] hover:bg-[#F2ECE1] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded-xl flex items-center gap-2 shrink-0">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Modal Form with Scrollable Content & Distinct Cards */}
            <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* SECTION 1: BASIC INFORMATION & CLASSIFICATION */}
              <div className="p-4 bg-white rounded-xl border border-[#D5C7B0] space-y-4">
                <span className="text-[11px] font-bold text-[#8C6D1F] uppercase tracking-wider block">
                  1. Product Identification & Classification
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                      PRODUCT NAME *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Signature Hand-tailored Double-Ply Egyptian Cotton Shirt"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                      PRIMARY CATEGORY *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const newCat = e.target.value;
                        const match = categories.find((c) => c.slug === newCat);
                        const subcats = match?.subcategories || ['Standard'];
                        setFormData({
                          ...formData,
                          category: newCat,
                          subCategory: subcats[0] || 'Standard',
                          isCustomSubcategory: false,
                        });
                      }}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subcategory */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#4A4033]">
                        SUBCATEGORY *
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            isCustomSubcategory: !prev.isCustomSubcategory,
                          }))
                        }
                        className="text-[10px] text-[#B89758] hover:underline font-bold"
                      >
                        {formData.isCustomSubcategory ? '← Select Standard' : '+ Custom Subcategory'}
                      </button>
                    </div>

                    {formData.isCustomSubcategory ? (
                      <input
                        type="text"
                        required
                        value={formData.customSubcategory}
                        onChange={(e) =>
                          setFormData({ ...formData, customSubcategory: e.target.value })
                        }
                        placeholder="Type new custom subcategory (e.g. Denim Shirts)"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                      />
                    ) : (
                      <select
                        value={formData.subCategory}
                        onChange={(e) =>
                          setFormData({ ...formData, subCategory: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none cursor-pointer"
                      >
                        {availableSubcategoriesForForm.map((sub, i) => (
                          <option key={i} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: PRICING & INVENTORY */}
              <div className="p-4 bg-white rounded-xl border border-[#D5C7B0] space-y-4">
                <span className="text-[11px] font-bold text-[#8C6D1F] uppercase tracking-wider block">
                  2. Pricing, Stock & Sizes
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                      SELLING PRICE (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                      MRP / ORIGINAL PRICE (₹)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.originalPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, originalPrice: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                      STOCK QUANTITY *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.stockCount}
                      onChange={(e) =>
                        setFormData({ ...formData, stockCount: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                    AVAILABLE SIZES (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="e.g. 38, 40, 42, 44 or S, M, L, XL or Standard"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                  />
                </div>
              </div>

              {/* SECTION 3: CRAFTSMANSHIP DESCRIPTION */}
              <div className="p-4 bg-white rounded-xl border border-[#D5C7B0] space-y-2">
                <label className="block text-xs font-bold text-[#4A4033] uppercase tracking-wider">
                  3. Product Craftsmanship & Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe material, weave, finish, origin, and styling recommendations..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                />
              </div>

              {/* SECTION 4: IMAGERY & MULTI-ANGLE VIEWS */}
              <div className="p-4 bg-white rounded-xl border border-[#D5C7B0] space-y-4">
                <span className="text-[11px] font-bold text-[#8C6D1F] uppercase tracking-wider block">
                  4. Product Images (Direct Device Upload / URL)
                </span>

                {/* Primary Image */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-semibold text-[#1E1E22] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#B89758]" />
                      <span>Primary Image * (1:1 Square or 4:5 Portrait)</span>
                    </label>

                    <div className="flex items-center gap-2">
                      {formData.image && (
                        <button
                          type="button"
                          onClick={handleRemovePrimaryImage}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded cursor-pointer flex items-center gap-1 font-semibold transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                          <span>Remove</span>
                        </button>
                      )}
                      <label className="text-xs bg-[#FAF6EE] hover:bg-[#EFE8DD] text-[#1E1E22] border border-[#C5B39E] px-3 py-1 rounded cursor-pointer flex items-center gap-1 font-semibold transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[#B89758]" />
                        <span>{isUploadingPrimary ? 'Uploading...' : 'Upload from Device'}</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={(e) => handleFileUpload(e, 'primary')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="e.g. /images/category_mens_fashion_1791290148102.jpg or upload above"
                      className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs font-mono focus:border-[#B89758] focus:outline-none"
                    />
                    {formData.image && (
                      <div className="w-11 h-11 rounded border border-[#C5B39E] overflow-hidden shrink-0 bg-[#F5EFE3]">
                        <img
                          src={normalizeImageUrl(formData.image, formData.category)}
                          alt="Primary Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Secondary Image */}
                <div className="space-y-2 pt-2 border-t border-[#E8DEC8]">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-semibold text-[#1E1E22] flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#B89758]" />
                      <span>Secondary / Detail Angle Image (Optional)</span>
                    </label>

                    <div className="flex items-center gap-2">
                      {formData.secondaryImage && (
                        <button
                          type="button"
                          onClick={handleRemoveSecondaryImage}
                          className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded cursor-pointer flex items-center gap-1 font-semibold transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                          <span>Remove</span>
                        </button>
                      )}
                      <label className="text-xs bg-[#FAF6EE] hover:bg-[#EFE8DD] text-[#1E1E22] border border-[#C5B39E] px-3 py-1 rounded cursor-pointer flex items-center gap-1 font-semibold transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[#B89758]" />
                        <span>{isUploadingSecondary ? 'Uploading...' : 'Upload Angle'}</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={(e) => handleFileUpload(e, 'secondary')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={formData.secondaryImage}
                      onChange={(e) => setFormData({ ...formData, secondaryImage: e.target.value })}
                      placeholder="e.g. /images/category_mens_bw.jpg or upload angle above"
                      className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs font-mono focus:border-[#B89758] focus:outline-none"
                    />
                    {formData.secondaryImage && (
                      <div className="w-11 h-11 rounded border border-[#C5B39E] overflow-hidden shrink-0 bg-[#F5EFE3]">
                        <img
                          src={normalizeImageUrl(formData.secondaryImage, formData.category)}
                          alt="Secondary Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 5: MERCHANDISING FLAGS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-2.5 p-3.5 bg-white border border-[#D5C7B0] rounded-xl cursor-pointer hover:bg-[#FAF8F5]">
                  <input
                    type="checkbox"
                    checked={formData.isFestiveEdit}
                    onChange={(e) => setFormData({ ...formData, isFestiveEdit: e.target.checked })}
                    className="w-4 h-4 text-[#B89758] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1E1E22] block">
                      The Festive Edit Feature
                    </span>
                    <span className="text-[10px] text-[#7A6C58]">
                      Showcase prominently in Festive / Occasion curation
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3.5 bg-white border border-[#D5C7B0] rounded-xl cursor-pointer hover:bg-[#FAF8F5]">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 text-[#B89758] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1E1E22] block">
                      Best Seller Feature
                    </span>
                    <span className="text-[10px] text-[#7A6C58]">
                      Highlights product across top rows & client favorites
                    </span>
                  </div>
                </label>
              </div>

              {/* STICKY FOOTER ACTIONS (GUARANTEED VISIBLE, NEVER CLIPPED) */}
              <div className="pt-4 border-t border-[#E8DEC8] flex items-center justify-between sticky bottom-0 bg-[#FAF8F5] pb-2 z-10 shrink-0">
                <div className="text-[11px] text-[#7A6C58]">
                  * All changes save directly to Firebase Cloud Firestore.
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-[#D5C7B0] bg-white text-xs font-semibold uppercase rounded hover:bg-[#F2ECE1] cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold uppercase tracking-wider rounded shadow cursor-pointer transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving to Firebase...</span>
                      </>
                    ) : (
                      <span>Save Product</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
