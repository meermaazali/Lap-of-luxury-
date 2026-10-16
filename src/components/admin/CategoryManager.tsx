import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  Tag,
  X,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryItem } from '../../types';

const POPULAR_SUBCATEGORY_SUGGESTIONS: Record<string, string[]> = {
  Men: ['Shirts', 'T-Shirts', 'Trousers', 'Jeans', 'Hoodies', 'Kurta Sets'],
  Women: ['Dresses', 'Tops', 'Handbags', 'Banarasi Sarees', 'Co-ord Sets', 'Heels'],
  Jeans: ['Slim Fit', 'Skinny Fit', 'Raw Denim', 'Relaxed Fit', 'Selvedge'],
  Watches: ['Chronograph', 'Automatic', 'Dress Watches', 'Gold Editions', 'Sports Watches'],
  Bags: ['Handbags', 'Shoulder Bags', 'Sling Bags', 'Clutches', 'Totes', 'Wallets', 'Travel Bags'],
  Shoes: ['Sneakers', 'Formal Shoes', 'Loafers', 'Sandals', 'Heels', 'Flats'],
  Footwear: ['Sneakers', 'Formal Shoes', 'Loafers', 'Sandals', 'Heels', 'Flats'],
  Accessories: ['Watches and Accessories', 'Sunglasses', 'Belts', 'Wallets', 'Cufflinks'],
  Perfumes: ['Oud & Extrait', 'Parfum', 'Eau de Parfum', 'Amber Bourbon'],
};

export const CategoryManager: React.FC = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    categoryInterval,
    setCategoryInterval,
    uploadMediaAsset,
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    itemCount: 20,
    subcategories: [] as string[],
  });

  const [newSubcatInput, setNewSubcatInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormError(null);
    setNewSubcatInput('');
    setFormData({
      name: '',
      slug: '',
      image: '',
      itemCount: 15,
      subcategories: ['Shirts', 'T-Shirts', 'Trousers'],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CategoryItem) => {
    setEditingCategory(c);
    setFormError(null);
    setNewSubcatInput('');
    setFormData({
      name: c.name,
      slug: c.slug,
      image: c.image,
      itemCount: c.itemCount || 10,
      subcategories: Array.isArray(c.subcategories) ? [...c.subcategories] : [],
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setFormError(null);
    try {
      const asset = await uploadMediaAsset(file, 'Categories');
      setFormData((prev) => ({ ...prev, image: asset.dataUrl }));
      showToast('✓ Category image uploaded and optimized successfully!');
    } catch (err: unknown) {
      setFormError('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddSubcategory = () => {
    const trimmed = newSubcatInput.trim();
    if (!trimmed) return;
    if (formData.subcategories.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormError(`Subcategory "${trimmed}" already exists.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, trimmed],
    }));
    setNewSubcatInput('');
    setFormError(null);
  };

  const handleRemoveSubcategory = (sub: string) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((s) => s !== sub),
    }));
  };

  const handleAddSuggestion = (sub: string) => {
    if (formData.subcategories.some((s) => s.toLowerCase() === sub.toLowerCase())) return;
    setFormData((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, sub],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.image.trim()) {
      setFormError('Category name and image are required.');
      return;
    }

    const slug = formData.slug.trim() || formData.name.replace(/[^a-zA-Z0-9]/g, '');
    setIsSaving(true);
    setFormError(null);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: formData.name.toUpperCase(),
          slug,
          image: formData.image,
          itemCount: Number(formData.itemCount),
          subcategories: formData.subcategories,
        });
        showToast(`✓ Category "${formData.name.toUpperCase()}" and its subcategories updated in Firebase!`);
      } else {
        await addCategory({
          name: formData.name.toUpperCase(),
          slug,
          image: formData.image,
          itemCount: Number(formData.itemCount),
          subcategories: formData.subcategories,
        });
        showToast(`✓ New category "${formData.name.toUpperCase()}" created and saved to Firebase!`);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      setFormError('Failed to save to Firebase: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSaving(false);
    }
  };

  // Quick category suggestions based on current slug or name
  const currentSuggestions =
    POPULAR_SUBCATEGORY_SUGGESTIONS[formData.slug] ||
    POPULAR_SUBCATEGORY_SUGGESTIONS[formData.name] ||
    Object.entries(POPULAR_SUBCATEGORY_SUGGESTIONS).find(
      ([key]) =>
        formData.name.toLowerCase().includes(key.toLowerCase()) ||
        formData.slug.toLowerCase().includes(key.toLowerCase())
    )?.[1] ||
    ['Shirts', 'T-Shirts', 'Trousers', 'Dresses', 'Sneakers'];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-700">Live on storefront filters</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-xl border border-[#E0D5C3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#B89758]" />
            CATEGORIES & SUBCATEGORIES MANAGEMENT
          </h2>
          <p className="text-xs text-[#7A6C58] mt-0.5">
            Create, edit and organize categories and assign subcategories (e.g. Men → Shirts, T-shirts, Trousers; Women → Dresses, Tops, Handbags; Footwear → Sneakers, Formal Shoes, Sandals).
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#D5C7B0] px-3 py-2 rounded-lg text-xs">
            <Clock className="w-3.5 h-3.5 text-[#B89758]" />
            <span className="font-semibold text-[#4A4033]">Auto Scroll:</span>
            <select
              value={categoryInterval}
              onChange={(e) => setCategoryInterval(Number(e.target.value))}
              className="bg-transparent font-bold focus:outline-none text-[#1E1E22] cursor-pointer"
            >
              <option value={3}>3 Seconds</option>
              <option value={4}>4 Seconds (Default)</option>
              <option value={6}>6 Seconds</option>
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#B89758]" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories & Subcategories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {categories.map((cat) => {
          const subcats = Array.isArray(cat.subcategories) ? cat.subcategories : [];

          return (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-[#E0D5C3] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="relative h-44 bg-[#F2EDE2] overflow-hidden group">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/category_mens_fashion_1791290148102.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  {cat.itemCount || 0} items
                </span>
                <span className="absolute top-2 left-2 bg-[#1E1E22]/90 border border-[#B89758]/50 text-[#D4AF37] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Slug: {cat.slug}
                </span>
              </div>

              <div className="p-4 bg-[#FAF8F5] border-t border-[#EFE8DC] space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-[#1E1E22] truncate">
                      {cat.name}
                    </h4>
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-[#5A4F41] hover:text-[#B89758] bg-white border border-[#D5C7B0] rounded cursor-pointer transition-colors shadow-2xs"
                      title="Edit Category & Subcategories"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subcategories preview tags */}
                  <div className="mt-2.5">
                    <span className="text-[10px] uppercase font-bold text-[#8C6D1F] tracking-wider block mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-[#B89758]" />
                      Subcategories ({subcats.length})
                    </span>

                    {subcats.length === 0 ? (
                      <span className="text-[11px] text-gray-400 italic block">
                        No subcategories assigned yet. Click Edit to add.
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {subcats.map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-white border border-[#D5C7B0] text-[#1E1E22] text-[11px] px-2 py-0.5 rounded font-medium shadow-2xs"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8DEC8] flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="text-[#8C6D1F] hover:text-[#B89758] font-bold text-[11px] uppercase tracking-wider cursor-pointer"
                  >
                    + Manage Subcategories
                  </button>

                  {categories.length > 3 &&
                    (deleteConfirmId === cat.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            deleteCategory(cat.id);
                            setDeleteConfirmId(null);
                            showToast(`✓ Category removed.`);
                          }}
                          className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700 cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1 text-gray-400 hover:text-gray-600 text-[10px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(cat.id)}
                        className="p-1 text-gray-400 hover:text-red-600 cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category & Subcategories Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-xl max-h-[92vh] flex flex-col rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-[#E8DEC8] flex items-center justify-between shrink-0">
              <h3 className="font-display text-base font-bold tracking-wider uppercase text-[#1E1E22] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#B89758]" />
                {editingCategory ? 'EDIT CATEGORY & SUBCATEGORIES' : 'ADD NEW CATEGORY'}
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

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Category Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A4033] mb-1 uppercase tracking-wider">
                    CATEGORY NAME (Uppercase) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. MEN'S COLLECTION"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A4033] mb-1 uppercase tracking-wider">
                    FILTER SLUG *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. Men, Women, Shoes"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                  />
                </div>
              </div>

              {/* Subcategories Management Card */}
              <div className="p-4 bg-white rounded-xl border border-[#D5C7B0] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1E1E22] uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#B89758]" />
                    Subcategories Assigned to this Category ({formData.subcategories.length})
                  </label>
                  <span className="text-[10px] text-[#7A6C58]">
                    Available in storefront filters
                  </span>
                </div>

                {/* Subcategories Tag Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubcatInput}
                    onChange={(e) => setNewSubcatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubcategory();
                      }
                    }}
                    placeholder="Type subcategory name (e.g. Shirts, T-shirts, Trousers) & press Enter"
                    className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategory}
                    className="px-4 py-2 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold uppercase rounded cursor-pointer transition-colors whitespace-nowrap"
                  >
                    + Add
                  </button>
                </div>

                {/* Current Subcategory Chips */}
                <div className="flex flex-wrap gap-2 min-h-10 p-2 bg-[#FAF8F5] border border-[#E8DEC8] rounded-lg">
                  {formData.subcategories.length === 0 ? (
                    <span className="text-xs text-gray-400 italic">
                      No subcategories added yet. Type above or click suggestions below.
                    </span>
                  ) : (
                    formData.subcategories.map((sub, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-white border border-[#D5C7B0] text-[#1E1E22] text-xs px-2.5 py-1 rounded-md shadow-2xs font-medium"
                      >
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(sub)}
                          className="w-3.5 h-3.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600 flex items-center justify-center cursor-pointer"
                          title={`Remove ${sub}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Quick Add Suggestions */}
                <div>
                  <span className="text-[10.5px] uppercase font-bold text-[#8C6D1F] block mb-1">
                    Quick Add Recommendations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSuggestions.map((sug, i) => {
                      const already = formData.subcategories.some(
                        (s) => s.toLowerCase() === sug.toLowerCase()
                      );
                      if (already) return null;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddSuggestion(sug)}
                          className="text-[11px] bg-white border border-[#D5C7B0] hover:border-[#B89758] text-[#5A4F41] hover:text-[#8C6D1F] px-2 py-0.5 rounded cursor-pointer transition-colors"
                        >
                          + {sug}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Category Image */}
              <div className="p-4 bg-white rounded-xl border border-[#D5C7B0] space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#4A4033] uppercase tracking-wider">
                    CATEGORY IMAGE (PNG / JPG) *
                  </label>
                  <label className="text-xs bg-[#FAF6EE] hover:bg-[#EFE8DD] text-[#1E1E22] border border-[#C5B39E] px-3 py-1 rounded cursor-pointer flex items-center gap-1 font-semibold transition-colors">
                    <Upload className="w-3 h-3 text-[#B89758]" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/category_mens_bw.jpg or https://..."
                    className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs font-mono focus:border-[#B89758] focus:outline-none"
                  />
                  {formData.image && (
                    <div className="w-12 h-12 rounded border border-[#C5B39E] overflow-hidden shrink-0 bg-[#F5EFE3]">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/images/category_mens_fashion_1791290148102.jpg';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DEC8] sticky bottom-0 bg-[#FAF8F5] pb-2 z-10 shrink-0">
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
                  className="px-6 py-2 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold uppercase tracking-wider rounded shadow cursor-pointer transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving to Firebase...</span>
                    </>
                  ) : (
                    <span>Save Category</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
