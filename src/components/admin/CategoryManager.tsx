import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Clock,
  Link as LinkIcon,
  Image as ImageIcon,
  Tag,
  FolderTree,
  X,
  CheckCircle,
  Filter,
  ArrowUp,
  ArrowDown,
  Award,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryItem } from '../../types';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../../utils/imageUtils';

const PARENT_CATEGORY_OPTIONS = [
  { value: 'Men', label: "Men (Men's Fashion & Sartorial)" },
  { value: 'Footwear', label: 'Footwear (Shoes, Sneakers, Loafers, Crocs)' },
  { value: 'Bags', label: 'Bags (Bags, Luggage & Leather)' },
  { value: 'Perfumes', label: 'Perfumes (Royal Scents & Parfums)' },
  { value: 'Watches', label: 'Watches (Timepieces & Horology)' },
  { value: 'Jeans', label: 'Jeans (Denim Collection)' },
  { value: 'Accessories', label: 'Accessories (Luxury Accessories)' },
  { value: 'Collections', label: 'Collections (Festive & Wedding Collection)' },
  { value: 'None', label: 'None (Top-Level Main Category)' },
];

export const CategoryManager: React.FC = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    categoryInterval,
    setCategoryInterval,
    uploadMediaAsset,
    mediaAssets,
  } = useStore();

  const [filterDepartment, setFilterDepartment] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [categoryImageTab, setCategoryImageTab] = useState<'url' | 'upload' | 'media'>('url');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentCategory: 'Men',
    department: 'men',
    image: '',
    itemCount: 20,
    subcategories: [] as string[],
    brands: [] as string[],
  });

  const [newSubcategoryInput, setNewSubcategoryInput] = useState('');
  const [newBrandInput, setNewBrandInput] = useState('');
  const [inlineNewSubInput, setInlineNewSubInput] = useState<{ [catId: string]: string }>({});
  const [inlineInputOpen, setInlineInputOpen] = useState<{ [catId: string]: boolean }>({});
  const [inlineNewBrandInput, setInlineNewBrandInput] = useState<{ [catId: string]: string }>({});
  const [inlineBrandInputOpen, setInlineBrandInputOpen] = useState<{ [catId: string]: boolean }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormError(null);
    setNewSubcategoryInput('');
    setNewBrandInput('');
    setFormData({
      name: '',
      slug: '',
      parentCategory: filterDepartment !== 'All' ? filterDepartment : 'Men',
      department: (filterDepartment !== 'All' ? filterDepartment : 'Men').toLowerCase(),
      image: '',
      itemCount: 15,
      subcategories: [],
      brands: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CategoryItem) => {
    setEditingCategory(c);
    setFormError(null);
    setNewSubcategoryInput('');
    setNewBrandInput('');
    setFormData({
      name: c.name,
      slug: c.slug,
      parentCategory: c.parentCategory || 'Men',
      department: (c.department || c.parentCategory || 'Men').toLowerCase(),
      image: c.image,
      itemCount: c.itemCount || 10,
      subcategories: Array.isArray(c.subcategories) ? [...c.subcategories] : [],
      brands: Array.isArray(c.brands) ? [...c.brands] : [],
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
      showToast('Image uploaded and synced to cloud successfully.');
    } catch (err: unknown) {
      setFormError('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSubcategoryToForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSubcategoryInput.trim();
    if (!trimmed) return;
    if (formData.subcategories.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormError(`Subcategory "${trimmed}" already exists.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, trimmed],
    }));
    setNewSubcategoryInput('');
    setFormError(null);
  };

  const handleRemoveSubcategoryFromForm = (subToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((s) => s !== subToRemove),
    }));
  };

  const handleAddBrandToForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newBrandInput.trim();
    if (!trimmed) return;
    if (formData.brands.some((b) => b.toLowerCase() === trimmed.toLowerCase())) {
      setFormError(`Brand "${trimmed}" already exists.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      brands: [...prev.brands, trimmed],
    }));
    setNewBrandInput('');
    setFormError(null);
  };

  const handleRemoveBrandFromForm = (brandToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      brands: prev.brands.filter((b) => b !== brandToRemove),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.image.trim()) {
      setFormError('Category name and category image are required.');
      return;
    }

    const slug = formData.slug.trim() || formData.name.replace(/[^a-zA-Z0-9]/g, '');
    const cleanImg = normalizeImageUrl(formData.image.trim());
    const parentCategory = formData.parentCategory;
    const department = parentCategory !== 'None' ? parentCategory.toLowerCase() : 'all';

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formData.name.toUpperCase(),
        slug,
        parentCategory,
        department,
        image: cleanImg,
        itemCount: Number(formData.itemCount) || (formData.subcategories.length + formData.brands.length) * 4,
        subcategories: formData.subcategories,
        brands: formData.brands,
      });
      showToast(`Category "${formData.name.toUpperCase()}" updated successfully.`);
    } else {
      addCategory({
        name: formData.name.toUpperCase(),
        slug,
        parentCategory,
        department,
        image: cleanImg,
        itemCount: Number(formData.itemCount) || (formData.subcategories.length + formData.brands.length) * 4,
        subcategories: formData.subcategories,
        brands: formData.brands,
        order: categories.length + 1,
        active: true,
      });
      showToast(`Category "${formData.name.toUpperCase()}" created and synced to Cloud Firestore.`);
    }

    setIsModalOpen(false);
  };

  // Reorder categories
  const handleMoveOrder = async (cat: CategoryItem, direction: 'up' | 'down') => {
    const sorted = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const currentIndex = sorted.findIndex((c) => c.id === cat.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const currentOrder = sorted[currentIndex].order ?? currentIndex + 1;
    const targetOrder = sorted[targetIndex].order ?? targetIndex + 1;

    await updateCategory(sorted[currentIndex].id, { order: targetOrder });
    await updateCategory(sorted[targetIndex].id, { order: currentOrder });
    showToast(`Reordered "${cat.name}".`);
  };

  // Inline Subcategory Operations (directly from card)
  const handleAddInlineSubcategory = (cat: CategoryItem) => {
    const inputVal = (inlineNewSubInput[cat.id] || '').trim();
    if (!inputVal) return;

    const currentSubs = Array.isArray(cat.subcategories) ? [...cat.subcategories] : [];
    if (currentSubs.some((s) => s.toLowerCase() === inputVal.toLowerCase())) {
      showToast(`Subcategory "${inputVal}" already exists in ${cat.name}.`);
      return;
    }

    const updatedSubs = [...currentSubs, inputVal];
    updateCategory(cat.id, {
      subcategories: updatedSubs,
      itemCount: Math.max(cat.itemCount || 0, updatedSubs.length * 4),
    });

    setInlineNewSubInput((prev) => ({ ...prev, [cat.id]: '' }));
    setInlineInputOpen((prev) => ({ ...prev, [cat.id]: false }));
    showToast(`Added "${inputVal}" to ${cat.name}.`);
  };

  const handleRemoveInlineSubcategory = (cat: CategoryItem, subToRemove: string) => {
    const currentSubs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
    const updatedSubs = currentSubs.filter((s) => s !== subToRemove);
    updateCategory(cat.id, {
      subcategories: updatedSubs,
    });
    showToast(`Removed "${subToRemove}" from ${cat.name}.`);
  };

  // Inline Brand Operations
  const handleAddInlineBrand = (cat: CategoryItem) => {
    const inputVal = (inlineNewBrandInput[cat.id] || '').trim();
    if (!inputVal) return;

    const currentBrands = Array.isArray(cat.brands) ? [...cat.brands] : [];
    if (currentBrands.some((b) => b.toLowerCase() === inputVal.toLowerCase())) {
      showToast(`Brand "${inputVal}" already exists in ${cat.name}.`);
      return;
    }

    const updatedBrands = [...currentBrands, inputVal];
    updateCategory(cat.id, { brands: updatedBrands });
    setInlineNewBrandInput((prev) => ({ ...prev, [cat.id]: '' }));
    setInlineBrandInputOpen((prev) => ({ ...prev, [cat.id]: false }));
    showToast(`Added brand "${inputVal}" to ${cat.name}.`);
  };

  const handleRemoveInlineBrand = (cat: CategoryItem, brandToRemove: string) => {
    const currentBrands = Array.isArray(cat.brands) ? cat.brands : [];
    const updatedBrands = currentBrands.filter((b) => b !== brandToRemove);
    updateCategory(cat.id, { brands: updatedBrands });
    showToast(`Removed brand "${brandToRemove}" from ${cat.name}.`);
  };

  // Filter Categories by Department and sort by order
  const filteredCategories = categories
    .filter((cat) => {
      if (filterDepartment === 'All') return true;
      const parent = cat.parentCategory || cat.department || '';
      if (filterDepartment === 'Top-Level') {
        return !parent || parent === 'None' || parent === 'Root';
      }
      return parent.toLowerCase() === filterDepartment.toLowerCase();
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1E22] text-[#D4AF37] px-4 py-3 rounded-xl border border-[#D4AF37]/50 shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar with Title and Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0D5C3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#B89758]" />
            CATEGORY & SUBCATEGORY ARCHITECTURE
          </h2>
          <p className="text-xs text-[#7A6C58] mt-0.5">
            Manage main categories, subcategories, parent-department assignments, and banner images synced in live real-time with Cloud Firestore.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#D5C7B0] px-3 py-1.5 rounded-xl text-xs">
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
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-[#B89758]" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {['All', 'Men', 'Women', 'Bags', 'Footwear', 'Accessories', 'Collections', 'Top-Level'].map(
          (dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setFilterDepartment(dept)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                filterDepartment === dept
                  ? 'bg-[#1E1E22] text-[#D4AF37] shadow-xs ring-1 ring-[#D4AF37]/50'
                  : 'bg-white text-[#6B5E4F] hover:bg-[#FAF8F5] hover:text-[#1E1E22] border border-[#E0D5C3]'
              }`}
            >
              {dept} {dept === 'All' ? `(${categories.length})` : ''}
            </button>
          )
        )}
      </div>

      {/* Categories & Subcategories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => {
          const subs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
          const parentName = cat.parentCategory || cat.department || 'Top-Level';

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-[#E0D5C3] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              {/* Category Image Header */}
              <div className="relative h-44 bg-[#F2EDE2] overflow-hidden group">
                <img
                  src={normalizeImageUrl(cat.image)}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                {/* Parent Category Badge */}
                <span className="absolute top-3 left-3 bg-[#1E1E22]/85 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#D4AF37]/40 backdrop-blur-xs flex items-center gap-1">
                  <FolderTree className="w-3 h-3 text-[#B89758]" />
                  <span>Parent: {parentName}</span>
                </span>

                {/* Item Count */}
                <span className="absolute top-3 right-3 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full font-semibold backdrop-blur-xs">
                  {cat.itemCount || subs.length * 4} items
                </span>

                {/* Title & Slug on overlay */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-sm tracking-wide uppercase drop-shadow-sm truncate">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-[#E8DEC8] font-medium">
                    Filter Slug: <code className="bg-black/40 px-1 py-0.5 rounded text-[10px] font-mono">{cat.slug}</code>
                  </span>
                </div>
              </div>

              {/* Subcategories Management Section */}
              <div className="p-4 space-y-3 bg-[#FAF8F5] flex-1 border-t border-[#EFE8DC]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1E1E22] uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#B89758]" />
                    <span>Subcategories ({subs.length})</span>
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setInlineInputOpen((prev) => ({
                        ...prev,
                        [cat.id]: !prev[cat.id],
                      }))
                    }
                    className="text-[11px] text-[#8A671A] hover:text-[#1E1E22] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Subcategory</span>
                  </button>
                </div>

                {/* Inline Add Input */}
                {inlineInputOpen[cat.id] && (
                  <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-[#D5C7B0]">
                    <input
                      type="text"
                      value={inlineNewSubInput[cat.id] || ''}
                      onChange={(e) =>
                        setInlineNewSubInput((prev) => ({
                          ...prev,
                          [cat.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddInlineSubcategory(cat);
                        }
                      }}
                      placeholder="e.g. Silk Sarees, Tuxedos..."
                      className="flex-1 text-xs px-2 py-1 bg-transparent focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleAddInlineSubcategory(cat)}
                      className="px-2.5 py-1 bg-[#1E1E22] text-[#D4AF37] rounded-lg text-xs font-bold hover:bg-black cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setInlineInputOpen((prev) => ({
                          ...prev,
                          [cat.id]: false,
                        }))
                      }
                      className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Subcategory Chips */}
                {subs.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto no-scrollbar py-0.5">
                    {subs.map((sub, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#D5C7B0] text-[#3D3327] rounded-lg text-[11px] font-semibold shadow-2xs group"
                      >
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInlineSubcategory(cat, sub)}
                          className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                          title={`Delete subcategory "${sub}"`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-[#8C7E6C] italic">
                    No subcategories added yet. Click &quot;Add Subcategory&quot; to assign.
                  </p>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="p-3 bg-white border-t border-[#EFE8DC] flex items-center justify-between">
                <span className="text-[10px] text-[#7A6C58]">
                  Cloud Synced
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-[#5A4F41] hover:text-[#B89758] rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                    title="Edit Category & Subcategories"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {deleteConfirmId === cat.id ? (
                    <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                      <span className="text-[10px] text-red-700 font-bold px-1">Delete?</span>
                      <button
                        type="button"
                        onClick={() => {
                          deleteCategory(cat.id);
                          setDeleteConfirmId(null);
                          showToast(`Category "${cat.name}" deleted.`);
                        }}
                        className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700 cursor-pointer"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-1 text-gray-500 hover:text-gray-700 text-[10px] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(cat.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl border border-[#D5C2A5] shadow-2xl p-6 my-auto overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8] shrink-0">
              <h3 className="font-display text-base font-bold tracking-wider uppercase text-[#1E1E22] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#B89758]" />
                {editingCategory ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-[#1E1E22] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 overflow-y-auto flex-1 py-4 pr-1">
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-300 text-red-700 text-xs rounded-xl font-semibold">
                  {formError}
                </div>
              )}

              {/* Category Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A4033] mb-1 uppercase tracking-wider">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. FORMAL SUITS & TUXEDOS"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded-xl text-xs font-medium focus:border-[#B89758] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A4033] mb-1 uppercase tracking-wider">
                    Filter Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. Suits, Men, Watches"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded-xl text-xs font-medium focus:border-[#B89758] focus:outline-none"
                  />
                </div>
              </div>

              {/* Parent Category / Department Assignment */}
              <div>
                <label className="block text-xs font-bold text-[#4A4033] mb-1 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderTree className="w-3.5 h-3.5 text-[#B89758]" />
                  <span>Parent Department Assignment *</span>
                </label>
                <select
                  value={formData.parentCategory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      parentCategory: e.target.value,
                      department: e.target.value !== 'None' ? e.target.value.toLowerCase() : 'all',
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded-xl text-xs font-semibold focus:border-[#B89758] focus:outline-none cursor-pointer"
                >
                  {PARENT_CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-[#7A6C58] block mt-1">
                  When customers click this department (e.g. Men or Women), this category and its subcategories will display cleanly.
                </span>
              </div>

              {/* Category Image 3-Way Selector */}
              <div className="p-3.5 bg-white rounded-xl border border-[#D5C7B0] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1E1E22] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#B89758]" />
                    <span>Category Image *</span>
                  </label>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-lg cursor-pointer font-semibold transition-colors"
                      title="Clear image"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Segmented Selector Tabs */}
                <div className="grid grid-cols-3 gap-1 bg-[#EFE8DC] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setCategoryImageTab('url')}
                    className={`py-1.5 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      categoryImageTab === 'url'
                        ? 'bg-white text-[#1E1E22] shadow-xs'
                        : 'text-[#6B5E4F] hover:text-[#1E1E22]'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-[#B89758]" />
                    <span>Paste URL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategoryImageTab('upload')}
                    className={`py-1.5 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      categoryImageTab === 'upload'
                        ? 'bg-white text-[#1E1E22] shadow-xs'
                        : 'text-[#6B5E4F] hover:text-[#1E1E22]'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5 text-[#B89758]" />
                    <span>Upload File</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategoryImageTab('media')}
                    className={`py-1.5 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      categoryImageTab === 'media'
                        ? 'bg-white text-[#1E1E22] shadow-xs'
                        : 'text-[#6B5E4F] hover:text-[#1E1E22]'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#B89758]" />
                    <span>Media Library</span>
                  </button>
                </div>

                {/* Tab 1: Paste URL */}
                {categoryImageTab === 'url' && (
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Paste image link (Unsplash, Imgur, any CDN, WebP, JPG, PNG...)"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded-xl text-xs font-medium focus:border-[#B89758] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#7A6C58] block">
                      Accepts any image URL. Persisted permanently to Cloud Firestore.
                    </span>
                  </div>
                )}

                {/* Tab 2: Upload File */}
                {categoryImageTab === 'upload' && (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-dashed border-[#D5C7B0] text-center space-y-1.5">
                    <label className="inline-flex px-4 py-2 bg-[#FAF6EE] hover:bg-[#EFE8DD] text-[#1E1E22] border border-[#C5B39E] rounded-xl cursor-pointer items-center gap-1.5 text-xs font-bold transition-all active:scale-95 shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-[#B89758]" />
                      <span>{isUploading ? 'Uploading & Optimizing...' : 'Upload Category Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </label>
                    <span className="text-[10px] text-[#7A6C58] block">
                      Instant compression and Cloud Firestore sync across all devices.
                    </span>
                  </div>
                )}

                {/* Tab 3: Cloud Media Library */}
                {categoryImageTab === 'media' && (
                  <div>
                    {mediaAssets && mediaAssets.length > 0 ? (
                      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                        {mediaAssets.map((asset) => (
                          <div
                            key={asset.id}
                            onClick={() => setFormData({ ...formData, image: asset.dataUrl })}
                            className={`w-14 h-12 rounded-lg border cursor-pointer shrink-0 overflow-hidden ${
                              formData.image === asset.dataUrl
                                ? 'border-[#B89758] ring-2 ring-[#B89758]'
                                : 'border-[#D5C7B0] opacity-80 hover:opacity-100'
                            }`}
                            title={asset.name}
                          >
                            <img
                              src={normalizeImageUrl(asset.dataUrl)}
                              alt={asset.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-[#7A6C58]">No media assets found in library.</span>
                    )}
                  </div>
                )}

                {/* Live Preview */}
                {formData.image && (
                  <div className="relative h-28 rounded-xl overflow-hidden border border-[#D5C7B0] bg-[#F5EFE3]">
                    <img
                      src={normalizeImageUrl(formData.image)}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Subcategories Management in Modal */}
              <div className="p-3.5 bg-white rounded-xl border border-[#D5C7B0] space-y-3">
                <label className="text-xs font-bold text-[#1E1E22] uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#B89758]" />
                  <span>Assign Subcategories</span>
                </label>

                {/* Input for adding new subcategory */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubcategoryInput}
                    onChange={(e) => setNewSubcategoryInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSubcategoryToForm();
                      }
                    }}
                    placeholder="e.g. Shirts, Blazers, Kurtas..."
                    className="flex-1 px-3 py-1.5 bg-[#FAF8F5] border border-[#D5C7B0] rounded-xl text-xs font-medium focus:border-[#B89758] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategoryToForm}
                    className="px-3 py-1.5 bg-[#1E1E22] text-[#D4AF37] text-xs font-bold uppercase rounded-xl hover:bg-black transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {/* Subcategory Tags list */}
                {formData.subcategories.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto no-scrollbar pt-1">
                    {formData.subcategories.map((sub, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF8F5] border border-[#D5C7B0] text-[#3D3327] rounded-lg text-xs font-semibold shadow-2xs"
                      >
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategoryFromForm(sub)}
                          className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-[#7A6C58] block italic">
                    No subcategories added yet. Type a name above and click &quot;Add&quot;.
                  </span>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#E8DEC8] sticky bottom-0 bg-[#FAF8F5] pb-1 z-10 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D5C7B0] text-xs font-semibold uppercase rounded-xl hover:bg-[#F2ECE1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E1E22] text-[#D4AF37] hover:bg-black text-xs font-bold uppercase rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
