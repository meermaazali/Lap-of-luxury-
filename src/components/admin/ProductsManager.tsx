import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Image, Sparkles, Upload, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const ProductsManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, mediaAssets, uploadMediaAsset } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    isFestiveEdit: false,
    isBestSeller: true,
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Men',
      price: 1000,
      originalPrice: 1999,
      description: '',
      sizes: '38, 40, 42, 44',
      stockCount: 20,
      image: mediaAssets[0]?.dataUrl || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
      isFestiveEdit: false,
      isBestSeller: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      description: p.description,
      sizes: p.sizes.join(', '),
      stockCount: p.stockCount,
      image: p.image,
      isFestiveEdit: !!p.isFestiveEdit,
      isBestSeller: !!p.isBestSeller,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const asset = await uploadMediaAsset(file, 'Products');
      setFormData((prev) => ({ ...prev, image: asset.dataUrl }));
    } catch (err) {
      alert('Upload failed: ' + err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.image.trim()) {
      alert('Product title and image are required.');
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
        isFestiveEdit: formData.isFestiveEdit,
        isBestSeller: formData.isBestSeller,
      });
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
        isFestiveEdit: formData.isFestiveEdit,
        isBestSeller: formData.isBestSeller,
        tags: [formData.category, formData.isFestiveEdit ? 'Festive Edit' : ''],
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-xs flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22]">
            PRODUCT CATALOG & MERCHANDISING
          </h2>
          <p className="text-xs text-[#7A6C58]">
            Add new luxury apparel, watches, jeans, or bags with custom PNG/JPG imagery.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#B89758]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-xl border border-[#E0D5C3] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-square bg-[#F7F4EE]">
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              {p.isFestiveEdit && (
                <span className="absolute top-2 left-2 bg-[#B89758] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs uppercase">
                  Festive Edit
                </span>
              )}
              <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                Stock: {p.stockCount}
              </span>
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
                  className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D5C7B0] hover:bg-[#F2EDE2] text-[#1E1E22] text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3 text-[#B89758]" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to remove "${p.name}"?`)) {
                      deleteProduct(p.id);
                    }
                  }}
                  className="p-1.5 text-[#A39280] hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
                className="w-7 h-7 rounded-full border border-[#D5C7B0] flex items-center justify-center text-[#1E1E22] hover:bg-[#F2ECE1]"
              >
                ✕
              </button>
            </div>

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
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                    CATEGORY *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
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
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
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
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
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
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
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
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
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
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
                />
              </div>

              {/* Image Input & Direct Upload (PNG/JPG unlimited storage) */}
              <div className="p-4 bg-white rounded-xl border border-[#D5C7B0] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1E1E22] uppercase tracking-wider flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-[#B89758]" />
                    Product Image (PNG / JPG)
                  </label>
                  <label className="text-xs bg-[#FAF6EE] hover:bg-[#EFE8DD] text-[#1E1E22] border border-[#C5B39E] px-3 py-1 rounded cursor-pointer flex items-center gap-1 font-semibold">
                    <Upload className="w-3.5 h-3.5 text-[#B89758]" />
                    <span>{isUploading ? 'Uploading...' : 'Upload PNG/JPG File'}</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Enter image URL or select from media library below"
                    className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded border border-[#C5B39E]"
                      referrerPolicy="no-referrer"
                    />
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

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#4A4033]">
                  <input
                    type="checkbox"
                    checked={formData.isFestiveEdit}
                    onChange={(e) => setFormData({ ...formData, isFestiveEdit: e.target.checked })}
                    className="w-4 h-4 rounded text-[#B89758] focus:ring-[#B89758]"
                  />
                  <span>Feature in "Festive Edit" Banner</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#4A4033]">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 rounded text-[#B89758] focus:ring-[#B89758]"
                  />
                  <span>Mark as "Best Seller"</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8DEC8] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D5C7B0] bg-white text-xs font-semibold uppercase rounded hover:bg-[#F2ECE1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold uppercase tracking-wider rounded shadow cursor-pointer"
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
