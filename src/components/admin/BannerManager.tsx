import React, { useState } from 'react';
import { Sliders, Plus, Edit2, Trash2, Eye, Upload, Clock, Image } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BannerSlide } from '../../types';

export const BannerManager: React.FC = () => {
  const {
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    bannerInterval,
    setBannerInterval,
    mediaAssets,
    uploadMediaAsset,
  } = useStore();

  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    kicker: '',
    ctaText: 'SHOP NOW →',
    ctaLink: 'Men',
    secondaryCtaText: 'VIEW MORE →',
    secondaryCtaLink: 'Women',
    image: '',
    active: true,
  });

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      title: 'LAP OF LUXURY',
      subtitle: 'PREMIUM FASHION · WATCHES · ACCESSORIES',
      kicker: 'Experience premium in every touch',
      ctaText: 'SHOP MEN →',
      ctaLink: 'Men',
      secondaryCtaText: 'SHOP WOMEN →',
      secondaryCtaLink: 'Women',
      image: mediaAssets[0]?.dataUrl || '/src/assets/images/hero_luxury_fashion_1791098539165.jpg',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BannerSlide) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle,
      kicker: b.kicker || '',
      ctaText: b.ctaText,
      ctaLink: b.ctaLink,
      secondaryCtaText: b.secondaryCtaText || '',
      secondaryCtaLink: b.secondaryCtaLink || '',
      image: b.image,
      active: b.active,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const asset = await uploadMediaAsset(file, 'Banners');
      setFormData((prev) => ({ ...prev, image: asset.dataUrl }));
    } catch (err) {
      alert('Upload failed: ' + err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image.trim()) {
      alert('Title and banner image are required.');
      return;
    }

    if (editingBanner) {
      updateBanner(editingBanner.id, {
        title: formData.title,
        subtitle: formData.subtitle,
        kicker: formData.kicker,
        ctaText: formData.ctaText,
        ctaLink: formData.ctaLink,
        secondaryCtaText: formData.secondaryCtaText,
        secondaryCtaLink: formData.secondaryCtaLink,
        image: formData.image,
        active: formData.active,
      });
    } else {
      addBanner({
        title: formData.title,
        subtitle: formData.subtitle,
        kicker: formData.kicker,
        ctaText: formData.ctaText,
        ctaLink: formData.ctaLink,
        secondaryCtaText: formData.secondaryCtaText,
        secondaryCtaLink: formData.secondaryCtaLink,
        image: formData.image,
        active: formData.active,
        order: banners.length + 1,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#B89758]" />
            AUTOMATIC SLIDING BANNER SYSTEM
          </h2>
          <p className="text-xs text-[#7A6C58]">
            Configure homepage hero slider images, typography, CTA buttons and slide timer.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Automatic slide interval changer */}
          <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#D5C7B0] px-3 py-1.5 rounded-lg text-xs">
            <Clock className="w-3.5 h-3.5 text-[#B89758]" />
            <span className="font-semibold text-[#4A4033]">Slide Interval:</span>
            <select
              value={bannerInterval}
              onChange={(e) => setBannerInterval(Number(e.target.value))}
              className="bg-transparent font-bold focus:outline-none text-[#1E1E22]"
            >
              <option value={3}>3 Seconds</option>
              <option value={4}>4 Seconds</option>
              <option value={5}>5 Seconds (Default)</option>
              <option value={7}>7 Seconds</option>
              <option value={10}>10 Seconds</option>
            </select>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#B89758]" />
            <span>Add Slide</span>
          </button>
        </div>
      </div>

      {/* Banner Slides List */}
      <div className="space-y-4">
        {banners.map((slide, index) => (
          <div
            key={slide.id}
            className="bg-white rounded-xl border border-[#E0D5C3] overflow-hidden flex flex-col md:flex-row items-stretch shadow-xs hover:shadow-md transition-shadow"
          >
            {/* Slide Preview Image */}
            <div className="relative md:w-80 h-48 sm:h-52 bg-[#EFECE6] shrink-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 bg-black/75 text-[#F3E7D5] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs font-mono">
                Slide #{index + 1}
              </span>
              <span
                className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded ${
                  slide.active
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-400 text-white'
                }`}
              >
                {slide.active ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>

            {/* Slide Text Content */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-editorial italic tracking-widest uppercase text-[#B89758]">
                  {slide.kicker || 'Experience premium in every touch'}
                </p>
                <h3 className="font-display text-xl font-bold tracking-wider uppercase text-[#1E1E22] mt-1">
                  {slide.title}
                </h3>
                <p className="text-xs text-[#594E42] mt-1 tracking-wider uppercase font-medium">
                  {slide.subtitle}
                </p>

                <div className="flex items-center gap-3 mt-4 text-xs">
                  <span className="bg-[#FAF8F5] border border-[#D5C7B0] px-3 py-1 rounded text-[#1E1E22] font-semibold">
                    Primary: {slide.ctaText} ({slide.ctaLink})
                  </span>
                  {slide.secondaryCtaText && (
                    <span className="bg-[#FAF8F5] border border-[#D5C7B0] px-3 py-1 rounded text-[#1E1E22] font-semibold">
                      Secondary: {slide.secondaryCtaText} ({slide.secondaryCtaLink})
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#F0EAE0] flex items-center justify-between">
                <button
                  onClick={() =>
                    updateBanner(slide.id, { active: !slide.active })
                  }
                  className={`text-xs font-semibold px-3 py-1 rounded cursor-pointer ${
                    slide.active
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {slide.active ? 'Pause / Deactivate' : 'Activate Slide'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(slide)}
                    className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D5C7B0] hover:bg-[#F2EDE2] text-[#1E1E22] text-xs font-semibold rounded flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-[#B89758]" />
                    <span>Edit Slide</span>
                  </button>

                  {banners.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm('Delete this banner slide?')) {
                          deleteBanner(slide.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF8F5] w-full max-w-xl rounded-2xl border border-[#D5C2A5] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-white border-b border-[#E8DEC8] flex items-center justify-between">
              <h3 className="font-display text-base font-bold tracking-wider uppercase text-[#1E1E22]">
                {editingBanner ? 'EDIT BANNER SLIDE' : 'CREATE NEW BANNER SLIDE'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full border border-[#D5C7B0] flex items-center justify-center text-[#1E1E22] hover:bg-[#F2ECE1]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                  MAIN TITLE (Display Face) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. LAP OF LUXURY"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                  KICKER (Small Tagline above title)
                </label>
                <input
                  type="text"
                  value={formData.kicker}
                  onChange={(e) => setFormData({ ...formData, kicker: e.target.value })}
                  placeholder="e.g. Experience premium in every touch"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                  SUBTITLE / CATEGORY HIGHLIGHTS *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. PREMIUM FASHION · WATCHES · BAGS · SHOES"
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                    PRIMARY CTA TEXT
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                    PRIMARY TARGET CATEGORY
                  </label>
                  <select
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Festive">Festive Edit</option>
                    <option value="Watches">Watches</option>
                    <option value="Bags">Bags</option>
                    <option value="Jeans">Jeans</option>
                  </select>
                </div>
              </div>

              {/* Banner Image & Direct Upload */}
              <div className="p-4 bg-white rounded-xl border border-[#D5C7B0] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1E1E22] uppercase tracking-wider flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-[#B89758]" />
                    Banner Image (PNG / JPG)
                  </label>
                  <label className="text-xs bg-[#FAF6EE] hover:bg-[#EFE8DD] text-[#1E1E22] border border-[#C5B39E] px-3 py-1 rounded cursor-pointer flex items-center gap-1 font-semibold">
                    <Upload className="w-3.5 h-3.5 text-[#B89758]" />
                    <span>{isUploading ? 'Uploading...' : 'Upload PNG/JPG'}</span>
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
                  placeholder="Paste image URL or upload above"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758]"
                />

                {formData.image && (
                  <div className="h-28 rounded-lg overflow-hidden border border-[#D5C7B0]">
                    <img
                      src={formData.image}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
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
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
