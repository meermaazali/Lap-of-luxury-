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
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryItem } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUtils';

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [categoryImageTab, setCategoryImageTab] = useState<'url' | 'upload' | 'media'>('url');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    itemCount: 20,
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormError(null);
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
    setFormError(null);
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
    setFormError(null);
    try {
      const asset = await uploadMediaAsset(file, 'Categories');
      setFormData((prev) => ({ ...prev, image: asset.dataUrl }));
    } catch (err: unknown) {
      setFormError('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.image.trim()) {
      setFormError('Name and category image are required.');
      return;
    }

    const slug = formData.slug.trim() || formData.name.replace(/[^a-zA-Z0-9]/g, '');
    const cleanImg = normalizeImageUrl(formData.image.trim());

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formData.name.toUpperCase(),
        slug,
        image: cleanImg,
        itemCount: Number(formData.itemCount),
      });
    } else {
      addCategory({
        name: formData.name.toUpperCase(),
        slug,
        image: cleanImg,
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
                  deleteConfirmId === cat.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          deleteCategory(cat.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700 cursor-pointer"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-1 text-gray-400 hover:text-gray-600 text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(cat.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-md max-h-[90vh] flex flex-col rounded-2xl border border-[#D5C2A5] shadow-2xl p-6 my-auto overflow-hidden">
            <h3 className="font-display text-base font-bold tracking-wider uppercase text-[#1E1E22] mb-4 shrink-0">
              {editingCategory ? 'EDIT CATEGORY' : 'ADD NEW CATEGORY'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 overflow-y-auto flex-1">
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-300 text-red-700 text-xs rounded-lg font-semibold">
                  {formError}
                </div>
              )}
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

              {/* Category Image: 3-Way Choice (Paste URL / Upload File / Media Library) */}
              <div className="p-3.5 bg-white rounded-xl border border-[#D5C7B0] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1E1E22] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#B89758]" />
                    Category Image *
                  </label>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                      className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded cursor-pointer font-semibold transition-colors"
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
                    <span>Media</span>
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
                      placeholder="Paste image URL (Unsplash, Imgur, any CDN, WebP, JPG, PNG...)"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded-lg text-xs font-medium focus:border-[#B89758] focus:outline-none"
                    />
                    <span className="text-[10px] text-[#7A6C58] block">
                      Accepts any image URL. Saved permanently to Cloud Firestore.
                    </span>
                  </div>
                )}

                {/* Tab 2: Upload File */}
                {categoryImageTab === 'upload' && (
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-dashed border-[#D5C7B0] text-center space-y-1.5">
                    <label className="inline-flex px-4 py-2 bg-[#FAF6EE] hover:bg-[#EFE8DD] text-[#1E1E22] border border-[#C5B39E] rounded-xl cursor-pointer items-center gap-1.5 text-xs font-bold transition-all active:scale-95 shadow-xs">
                      <Upload className="w-3.5 h-3.5 text-[#B89758]" />
                      <span>{isUploading ? 'Uploading & Optimizing...' : 'Select Category Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </label>
                    <span className="text-[10px] text-[#7A6C58] block">
                      Instant compression and Cloud Firestore sync.
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
                            className={`w-12 h-10 rounded-lg border cursor-pointer shrink-0 overflow-hidden ${
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
                  <div className="relative h-28 rounded-lg overflow-hidden border border-[#D5C7B0] bg-[#F5EFE3]">
                    <img
                      src={normalizeImageUrl(formData.image)}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/category_mens_fashion_1791290148102.jpg';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E8DEC8] sticky bottom-0 bg-[#FAF8F5] pb-1 z-10 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D5C7B0] text-xs font-semibold uppercase rounded hover:bg-[#F2ECE1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1E1E22] text-white text-xs font-bold uppercase rounded shadow cursor-pointer transition-all active:scale-95"
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
