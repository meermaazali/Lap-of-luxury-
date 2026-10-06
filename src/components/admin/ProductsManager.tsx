import React, { useState } from 'react';
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
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { normalizeImageUrl, FALLBACK_CATEGORY_IMAGES, FALLBACK_LUXURY_IMAGE } from '../../utils/imageUtils';

export const ProductsManager: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    mediaAssets,
    uploadMediaAsset,
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Men',
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormError(null);
    setFormData({
      name: '',
      category: 'Men',
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
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      description: p.description,
      sizes: p.sizes.join(', '),
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
      showToast('Image uploaded and optimized successfully!');
    } catch (err: unknown) {
      setFormError(
        'Upload failed: ' + (err instanceof Error ? err.message : String(err))
      );
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    if (!formData.image.trim()) {
      setFormError('Primary product image is required.');
      return;
    }

    const sizesArr = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        description: formData.description,
        sizes: sizesArr.length > 0 ? sizesArr : ['Standard'],
        stockCount: Number(formData.stockCount),
        inStock: Number(formData.stockCount) > 0,
        image: formData.image,
        secondaryImage: formData.secondaryImage || undefined,
        isFestiveEdit: formData.isFestiveEdit,
        isBestSeller: formData.isBestSeller,
      });
      showToast('✓ Product updated! Store catalog updated in real-time.');
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        description: formData.description,
        sizes: sizesArr.length > 0 ? sizesArr : ['Standard'],
        stockCount: Number(formData.stockCount),
        inStock: Number(formData.stockCount) > 0,
        rating: 4.9,
        reviewsCount: 1,
        image: formData.image,
        secondaryImage: formData.secondaryImage || undefined,
        isFestiveEdit: formData.isFestiveEdit,
        isBestSeller: formData.isBestSeller,
        tags: [formData.category, formData.isFestiveEdit ? 'Festive Edit' : ''],
      });
      showToast('✓ New product created and published to storefront!');
    }

    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmProduct) {
      deleteProduct(deleteConfirmProduct.id);
      showToast(`✓ Removed "${deleteConfirmProduct.name}" from catalog.`);
      setDeleteConfirmProduct(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-700">Auto-saved to catalog</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-xs flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22]">
            PRODUCT CATALOG & MERCHANDISING
          </h2>
          <p className="text-xs text-[#7A6C58]">
            Manage luxury shirts, jeans, watches, and bags with custom PNG/JPG imagery and multi-angle views.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#B89758]" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-[#E0D5C3] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="relative aspect-square bg-[#F5F2EB] overflow-hidden">
              <img
                src={normalizeImageUrl(p.image, p.category)}
                alt={p.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const fb = FALLBACK_CATEGORY_IMAGES[p.category] || FALLBACK_LUXURY_IMAGE;
                  if (target.src !== fb) target.src = fb;
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                {p.isFestiveEdit && (
                  <span className="bg-[#B89758] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                    FESTIVE
                  </span>
                )}
                {p.stockCount <= 5 && (
                  <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow">
                    LOW: {p.stockCount}
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#7A6C58]">
                  {p.category}
                </span>
                <h3 className="font-bold text-sm text-[#1E1E22] mt-0.5 truncate">
                  {p.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-sm text-[#1E1E22] tabular-nums">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                  {p.originalPrice && p.originalPrice > p.price && (
                    <span className="text-xs text-[#998A77] line-through tabular-nums">
                      ₹{p.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0EAE0] flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D5C7B0] hover:bg-[#F2EDE2] text-[#1E1E22] text-xs font-semibold rounded flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3 h-3 text-[#B89758]" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmProduct(p)}
                  className="p-1.5 text-[#A39280] hover:text-red-600 transition-colors cursor-pointer hover:bg-red-50 rounded"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal (In-App, safe for iFrames) */}
      {deleteConfirmProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-red-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#111111]">
                  Delete "{deleteConfirmProduct.name}"?
                </h3>
                <p className="text-xs text-[#7A6C58]">
                  This product will be permanently removed from your catalog and storefront.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setDeleteConfirmProduct(null)}
                className="px-4 py-2 border border-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase rounded-lg shadow cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-white border-b border-[#E8DEC8] flex items-center justify-between">
              <h3 className="font-display text-base font-bold tracking-wider uppercase text-[#1E1E22]">
                {editingProduct ? 'EDIT PRODUCT' : 'ADD NEW LUXURY PRODUCT'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full border border-[#D5C7B0] flex items-center justify-center text-[#1E1E22] hover:bg-[#F2ECE1] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-300 text-red-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                    PRODUCT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Signature Selvedge Jeans"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                    CATEGORY *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none cursor-pointer"
                  >
                    <option value="Men">Men (Shirts & Tops)</option>
                    <option value="Women">Women's Collection</option>
                    <option value="Jeans">Jeans & Denim</option>
                    <option value="Watches">Watches & Horology</option>
                    <option value="Bags">Handbags & Clutches</option>
                    <option value="Shoes">Footwear & Sneakers</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Perfumes">Perfumes & Fragrances</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                    SELLING PRICE (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                    ORIGINAL / MRP PRICE (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                    STOCK QUANTITY *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
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
                  placeholder="e.g. 30, 32, 34, 36 or S, M, L, XL"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                  PRODUCT DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe craftsmanship, material, origin, and fit..."
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                />
              </div>

              {/* Primary Image Input & Direct Upload / Delete */}
              <div className="p-4 bg-white rounded-xl border border-[#D5C7B0] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1E1E22] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#B89758]" />
                    Primary Product Image (PNG / JPG) *
                  </label>
                  <div className="flex items-center gap-2">
                    {formData.image && (
                      <button
                        type="button"
                        onClick={handleRemovePrimaryImage}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded cursor-pointer flex items-center gap-1 font-semibold transition-colors"
                        title="Delete current primary image"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                        <span>Remove Image</span>
                      </button>
                    )}
                    <label className="text-xs bg-[#FAF6EE] hover:bg-[#EFE8DD] text-[#1E1E22] border border-[#C5B39E] px-3 py-1 rounded cursor-pointer flex items-center gap-1 font-semibold transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#B89758]" />
                      <span>{isUploadingPrimary ? 'Uploading...' : 'Upload PNG/JPG'}</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={(e) => handleFileUpload(e, 'primary')}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Enter image URL or select from media library below"
                    className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                  />
                  {formData.image && (
                    <div className="relative group w-12 h-12 rounded border border-[#C5B39E] overflow-hidden shrink-0 bg-[#F5EFE3]">
                      <img
                        src={normalizeImageUrl(formData.image, formData.category)}
                        alt="Preview"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                        }}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePrimaryImage}
                        className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick picker from Cloud Media Library */}
                {mediaAssets.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] text-[#7A6C58] uppercase font-bold block mb-1">
                      Or pick from Cloud Media Assets:
                    </span>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                      {mediaAssets.map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() => setFormData({ ...formData, image: asset.dataUrl })}
                          className={`w-12 h-12 rounded border cursor-pointer shrink-0 overflow-hidden ${
                            formData.image === asset.dataUrl
                              ? 'border-[#B89758] ring-2 ring-[#B89758]'
                              : 'border-[#D5C7B0] opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={asset.dataUrl}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Secondary / Multi-Angle Image */}
              <div className="p-4 bg-white rounded-xl border border-[#D5C7B0] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1E1E22] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#B89758]" />
                    Secondary / Detail Angle Image (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    {formData.secondaryImage && (
                      <button
                        type="button"
                        onClick={handleRemoveSecondaryImage}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded cursor-pointer flex items-center gap-1 font-semibold transition-colors"
                        title="Delete secondary image"
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

                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={formData.secondaryImage}
                    onChange={(e) => setFormData({ ...formData, secondaryImage: e.target.value })}
                    placeholder="Enter secondary image URL or upload above for multi-angle zoom"
                    className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                  />
                  {formData.secondaryImage && (
                    <div className="relative group w-12 h-12 rounded border border-[#C5B39E] overflow-hidden shrink-0 bg-[#F5EFE3]">
                      <img
                        src={normalizeImageUrl(formData.secondaryImage, formData.category)}
                        alt="Secondary Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveSecondaryImage}
                        className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Merchandising Badges */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-2 p-3 bg-white border border-[#D5C7B0] rounded-xl cursor-pointer hover:bg-[#FAF8F5]">
                  <input
                    type="checkbox"
                    checked={formData.isFestiveEdit}
                    onChange={(e) => setFormData({ ...formData, isFestiveEdit: e.target.checked })}
                    className="w-4 h-4 text-[#B89758] rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1E1E22] block">
                      Festive Edit Badge
                    </span>
                    <span className="text-[10px] text-[#7A6C58]">
                      Showcases in The Festive Edit banner section
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 bg-white border border-[#D5C7B0] rounded-xl cursor-pointer hover:bg-[#FAF8F5]">
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
                      Displays prominently in top rows
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8DEC8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D5C7B0] bg-white text-xs font-semibold uppercase rounded hover:bg-[#F2ECE1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold uppercase tracking-wider rounded shadow cursor-pointer transition-all active:scale-95"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
