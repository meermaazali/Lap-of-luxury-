import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Upload, Clock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryItem } from '../../types';

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

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    itemCount: 20,
  });

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      image: '',
      itemCount: 15,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CategoryItem) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      image: c.image,
      itemCount: c.itemCount || 10,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const asset = await uploadMediaAsset(file, 'Categories');
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
      alert('Name and category image are required.');
      return;
    }

    const slug = formData.slug.trim() || formData.name.replace(/[^a-zA-Z0-9]/g, '');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formData.name.toUpperCase(),
        slug,
        image: formData.image,
        itemCount: Number(formData.itemCount),
      });
    } else {
      addCategory({
        name: formData.name.toUpperCase(),
        slug,
        image: formData.image,
        itemCount: Number(formData.itemCount),
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#B89758]" />
            AUTOMATIC CATEGORY SLIDER CONFIG
          </h2>
          <p className="text-xs text-[#7A6C58]">
            Configure category cards displayed in the homepage auto-scroll carousel.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#D5C7B0] px-3 py-1.5 rounded-lg text-xs">
            <Clock className="w-3.5 h-3.5 text-[#B89758]" />
            <span className="font-semibold text-[#4A4033]">Auto Scroll:</span>
            <select
              value={categoryInterval}
              onChange={(e) => setCategoryInterval(Number(e.target.value))}
              className="bg-transparent font-bold focus:outline-none text-[#1E1E22]"
            >
              <option value={3}>3 Seconds</option>
              <option value={4}>4 Seconds (Default)</option>
              <option value={6}>6 Seconds</option>
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#B89758]" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-xl border border-[#E0D5C3] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="relative h-44 bg-[#F2EDE2]">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                {cat.itemCount || 0} items
              </span>
            </div>

            <div className="p-3 bg-[#FAF8F5] border-t border-[#EFE8DC] flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-[#1E1E22] truncate max-w-[130px]">
                  {cat.name}
                </h4>
                <span className="text-[10px] text-[#7A6C58]">Filter: {cat.slug}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 text-[#5A4F41] hover:text-[#B89758]"
                  title="Edit Category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {categories.length > 3 && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove category "${cat.name}"?`)) {
                        deleteCategory(cat.id);
                      }
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-md rounded-2xl border border-[#D5C2A5] shadow-2xl p-6">
            <h3 className="font-display text-base font-bold tracking-wider uppercase text-[#1E1E22] mb-4">
              {editingCategory ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                  CATEGORY NAME (Uppercase) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. PREMIUM JEANS & DENIM"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                  FILTER SLUG (e.g. Jeans, Men, Watches)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. Jeans"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#4A4033]">
                    CATEGORY IMAGE (PNG / JPG) *
                  </label>
                  <label className="text-[11px] text-[#B89758] font-bold hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Paste URL or upload image above"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E8DEC8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D5C7B0] text-xs font-semibold uppercase rounded hover:bg-[#F2ECE1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E1E22] text-white text-xs font-bold uppercase rounded shadow"
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
