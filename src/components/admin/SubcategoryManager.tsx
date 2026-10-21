import React, { useState, useMemo } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
  Layers,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryItem } from '../../types';

interface SubcategoryEntry {
  id: string; // unique key: categoryId-subName
  name: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  productCount: number;
}

export const SubcategoryManager: React.FC = () => {
  const { categories, updateCategory, products, updateProduct } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParentFilter, setSelectedParentFilter] = useState('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmSub, setDeleteConfirmSub] = useState<SubcategoryEntry | null>(null);
  const [editingSub, setEditingSub] = useState<SubcategoryEntry | null>(null);

  // Form states
  const [formCategory, setFormCategory] = useState<string>('');
  const [formName, setFormName] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Build organized flat list of all subcategories across categories
  const allSubcategories: SubcategoryEntry[] = useMemo(() => {
    const list: SubcategoryEntry[] = [];

    categories.forEach((cat) => {
      const subs = Array.isArray(cat.subcategories) ? cat.subcategories : [];
      subs.forEach((subName) => {
        if (!subName || typeof subName !== 'string') return;
        const trimmed = subName.trim();
        if (!trimmed) return;

        // Count matching products
        const count = products.filter(
          (p) =>
            (p.subCategory && p.subCategory.toLowerCase() === trimmed.toLowerCase()) ||
            (p.tags && p.tags.some((t) => t.toLowerCase() === trimmed.toLowerCase()))
        ).length;

        list.push({
          id: `${cat.id}-${trimmed.toLowerCase()}`,
          name: trimmed,
          categoryId: cat.id,
          categoryName: cat.name,
          categorySlug: cat.slug || cat.name,
          productCount: count,
        });
      });
    });

    return list;
  }, [categories, products]);

  // Filtered subcategories
  const filteredSubcategories = useMemo(() => {
    return allSubcategories.filter((sub) => {
      const matchesSearch =
        !searchTerm.trim() ||
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.categoryName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesParent =
        selectedParentFilter === 'All' ||
        sub.categoryId === selectedParentFilter ||
        sub.categoryName.toLowerCase() === selectedParentFilter.toLowerCase() ||
        sub.categorySlug.toLowerCase() === selectedParentFilter.toLowerCase();

      return matchesSearch && matchesParent;
    });
  }, [allSubcategories, searchTerm, selectedParentFilter]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormError(null);
    setFormName('');
    const defaultCat = categories.length > 0 ? categories[0].id : '';
    setFormCategory(defaultCat);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (entry: SubcategoryEntry) => {
    setEditingSub(entry);
    setFormError(null);
    setFormName(entry.name);
    setFormCategory(entry.categoryId);
    setIsEditModalOpen(true);
  };

  // Save New Subcategory
  const handleSaveNewSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = formName.trim();
    if (!trimmed) {
      setFormError('Please enter a subcategory name.');
      return;
    }
    const targetCat = categories.find((c) => c.id === formCategory);
    if (!targetCat) {
      setFormError('Please select a parent category.');
      return;
    }

    const currentSubs = Array.isArray(targetCat.subcategories) ? targetCat.subcategories : [];
    if (currentSubs.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormError(`Subcategory "${trimmed}" already exists under ${targetCat.name}.`);
      return;
    }

    setIsSaving(true);
    try {
      const updatedSubs = [...currentSubs, trimmed];
      await updateCategory(targetCat.id, {
        subcategories: updatedSubs,
      });

      showToast(`✓ Subcategory "${trimmed}" added to ${targetCat.name} and synced to Cloud!`);
      setIsAddModalOpen(false);
      setFormName('');
    } catch (err) {
      setFormError('Failed to save subcategory. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Save Edited Subcategory
  const handleSaveEditSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;
    const trimmed = formName.trim();
    if (!trimmed) {
      setFormError('Subcategory name cannot be empty.');
      return;
    }

    setIsSaving(true);
    try {
      const oldName = editingSub.name;
      const oldCat = categories.find((c) => c.id === editingSub.categoryId);
      const newCat = categories.find((c) => c.id === formCategory);

      if (!oldCat || !newCat) {
        setFormError('Category not found.');
        return;
      }

      // Check if same category reassignment
      if (oldCat.id === newCat.id) {
        const oldSubs = Array.isArray(oldCat.subcategories) ? oldCat.subcategories : [];
        const nextSubs = oldSubs.map((s) => (s === oldName ? trimmed : s));
        await updateCategory(oldCat.id, { subcategories: nextSubs });
      } else {
        // Move from old category to new category
        const oldSubs = (oldCat.subcategories || []).filter((s) => s !== oldName);
        const newSubs = Array.from(new Set([...(newCat.subcategories || []), trimmed]));
        await updateCategory(oldCat.id, { subcategories: oldSubs });
        await updateCategory(newCat.id, { subcategories: newSubs });
      }

      // Update matching products in store if name changed
      if (oldName !== trimmed) {
        const affectedProducts = products.filter(
          (p) => p.subCategory && p.subCategory.toLowerCase() === oldName.toLowerCase()
        );
        for (const prod of affectedProducts) {
          await updateProduct(prod.id, {
            subCategory: trimmed,
            category: newCat.slug || newCat.name,
          });
        }
      }

      showToast(`✓ Subcategory "${trimmed}" updated and synced across store!`);
      setIsEditModalOpen(false);
      setEditingSub(null);
    } catch (err) {
      setFormError('Failed to update subcategory.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Subcategory
  const handleConfirmDelete = async () => {
    if (!deleteConfirmSub) return;
    const { name, categoryId } = deleteConfirmSub;

    try {
      const cat = categories.find((c) => c.id === categoryId);
      if (cat) {
        const nextSubs = (cat.subcategories || []).filter((s) => s !== name);
        await updateCategory(cat.id, { subcategories: nextSubs });
        showToast(`✓ Subcategory "${name}" removed from ${cat.name}.`);
      }
    } catch (err) {
      showToast('Error removing subcategory.');
    } finally {
      setDeleteConfirmSub(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111113] border border-[#D4AF37] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Actions Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-lg bg-[#FAF5E8] border border-[#D4AF37]/30 text-[#8A671A]">
              <FolderTree className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-[#111113] tracking-wide">
              Subcategory Management
            </h2>
          </div>
          <p className="text-xs text-gray-500 max-w-xl">
            Create, edit, rename, and assign subcategories to parent departments (Men's, Footwear, Bags, Perfumes, Watches, Jeans). All changes sync instantly to Cloud Firestore.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#111113] hover:bg-[#25201A] text-[#E5C07B] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Add New Subcategory</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search subcategory or department..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#B8860B] transition-colors"
          />
        </div>

        {/* Filter by Parent Category */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-gray-500 shrink-0" />
          <select
            value={selectedParentFilter}
            onChange={(e) => setSelectedParentFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-[#B8860B] cursor-pointer"
          >
            <option value="All">All Parent Categories ({allSubcategories.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({(cat.subcategories || []).length} subs)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subcategory Table / List */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600">
            Configured Subcategories ({filteredSubcategories.length})
          </span>
          <span className="text-[11px] text-gray-400">
            Click edit to rename or reassign parent category
          </span>
        </div>

        {filteredSubcategories.length === 0 ? (
          <div className="py-16 text-center text-gray-500 space-y-2">
            <FolderTree className="w-8 h-8 text-gray-300 mx-auto" />
            <p className="text-xs font-medium">No subcategories match your search or filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredSubcategories.map((sub) => (
              <div
                key={sub.id}
                className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF5E8] border border-[#D4AF37]/30 flex items-center justify-center text-[#8A671A] shrink-0 font-bold text-xs">
                    {sub.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111113] flex items-center gap-2">
                      <span>{sub.name}</span>
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-medium text-gray-600 uppercase">
                        {sub.categoryName}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3 text-gray-400" />
                        <span>{sub.productCount} {sub.productCount === 1 ? 'product' : 'products'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(sub)}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#D4AF37] hover:bg-[#FAF5E8] text-[#8A671A] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    title="Edit Name / Reassign Category"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmSub(sub)}
                    className="p-1.5 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 text-red-600 text-xs transition-all cursor-pointer"
                    title="Delete Subcategory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#B8860B]" />
                <span>Add Subcategory</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewSubcategory} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Parent Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#B8860B]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Slim-Fit Shirts, Oud & Extrait, Loafers"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#B8860B]"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#111113] hover:bg-[#25201A] text-[#E5C07B] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Add Subcategory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingSub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#B8860B]" />
                <span>Edit Subcategory: {editingSub.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSubcategory} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Assign to Parent Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#B8860B]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Reassigning parent category automatically migrates it to the selected category.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#B8860B]"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#111113] hover:bg-[#25201A] text-[#E5C07B] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmSub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-sm w-full p-5 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Delete Subcategory?
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to remove <strong>"{deleteConfirmSub.name}"</strong> from <strong>{deleteConfirmSub.categoryName}</strong>?
              </p>
              {deleteConfirmSub.productCount > 0 && (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-2">
                  Notice: {deleteConfirmSub.productCount} product(s) currently reference this subcategory.
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmSub(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
