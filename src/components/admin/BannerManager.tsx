import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Clock,
  Image as ImageIcon,
  X,
  AlertCircle,
  Check,
  CheckCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BannerSlide } from '../../types';
import { normalizeImageUrl, FALLBACK_LUXURY_IMAGE } from '../../utils/imageUtils';

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
    boutiqueHeroConfig,
    updateBoutiqueHeroConfig,
  } = useStore();

  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Flagship Boutique Hero state
  const [boutiqueHeroData, setBoutiqueHeroData] = useState({
    kicker: boutiqueHeroConfig?.kicker || 'EXCLUSIVE COLLECTION',
    titleLine1: boutiqueHeroConfig?.titleLine1 || 'Luxury',
    titleLine2: boutiqueHeroConfig?.titleLine2 || 'For Every Moment',
    subtitle: boutiqueHeroConfig?.subtitleItems?.join(' | ') || 'Premium Fashion | Elegant Accessories | Timeless Style',
    ctaText: boutiqueHeroConfig?.ctaText || 'Shop Now',
    image: boutiqueHeroConfig?.image || '/images/flagship_banner_16_9.jpg',
  });

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

  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [showManualHeroUrl, setShowManualHeroUrl] = useState(false);
  const [showMediaPickerHero, setShowMediaPickerHero] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingHero(true);
    try {
      const asset = await uploadMediaAsset(file, 'Banners');
      setBoutiqueHeroData((prev) => ({ ...prev, image: asset.dataUrl }));
      showToast('✓ Photo uploaded from device successfully! Click "Save Changes" below to publish.');
    } catch (err: unknown) {
      showToast('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsUploadingHero(false);
      e.target.value = '';
    }
  };

  const handleSaveBoutiqueHero = (e: React.FormEvent) => {
    e.preventDefault();
    let img = boutiqueHeroData.image.trim();
    if (!img.startsWith('/') && !img.startsWith('http') && !img.startsWith('data:')) {
      img = '/' + img;
    }

    const items = boutiqueHeroData.subtitle
      .split(/[|,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    updateBoutiqueHeroConfig({
      kicker: boutiqueHeroData.kicker,
      titleLine1: boutiqueHeroData.titleLine1,
      titleLine2: boutiqueHeroData.titleLine2,
      subtitleItems: items.length ? items : ['Premium Fashion', 'Elegant Accessories', 'Timeless Style'],
      ctaText: boutiqueHeroData.ctaText,
      image: img,
    });
    setBoutiqueHeroData((prev) => ({ ...prev, image: img }));
    showToast('✓ Flagship Boutique Showcase banner & texts updated! Changes are live on the storefront.');
  };

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormError(null);
    setFormData({
      title: 'LAP OF LUXURY',
      subtitle: 'PREMIUM FASHION · WATCHES · ACCESSORIES',
      kicker: 'Experience premium in every touch',
      ctaText: 'SHOP MEN →',
      ctaLink: 'Men',
      secondaryCtaText: 'SHOP WOMEN →',
      secondaryCtaLink: 'Women',
      image: mediaAssets[0]?.dataUrl || '/images/hero_luxury_fashion_1791098539165.jpg',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BannerSlide) => {
    setEditingBanner(b);
    setFormError(null);
    setFormData({
      title: b.title,
      subtitle: b.subtitle,
      kicker: b.kicker || '',
      ctaText: b.ctaText,
      ctaLink: b.ctaLink,
      secondaryCtaText: b.secondaryCtaText || '',
      secondaryCtaLink: b.secondaryCtaLink || '',
      image: normalizeImageUrl(b.image),
      active: b.active,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setFormError(null);
    try {
      const asset = await uploadMediaAsset(file, 'Banners');
      setFormData((prev) => ({ ...prev, image: asset.dataUrl }));
      showToast('Image uploaded and optimized successfully!');
    } catch (err: unknown) {
      setFormError(
        'Upload failed: ' + (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Main Title is required.');
      return;
    }
    if (!formData.image.trim()) {
      setFormError('A banner image is required. Please upload or enter an image URL.');
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
      showToast('✓ Banner slide updated! Live storefront reflects the changes.');
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
      showToast('✓ New banner slide created successfully!');
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteBanner(deleteConfirmId);
      setDeleteConfirmId(null);
      showToast('✓ Banner slide deleted successfully.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-700">Live on storefront</span>
        </div>
      )}

      {/* 1. FLAGSHIP BOUTIQUE SHOWCASE BANNER & TEXT EDITOR */}
      <div className="bg-white rounded-2xl border-2 border-[#D4AF37]/60 shadow-md overflow-hidden">
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1E1E22] via-[#2A261F] to-[#1E1E22] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-wider">
                MAIN HOMEPAGE
              </span>
              <h2 className="font-bodoni text-lg sm:text-xl font-bold tracking-wider uppercase text-white">
                FLAGSHIP BOUTIQUE HERO BANNER & TEXTS
              </h2>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              Edit the main boutique showcase banner image, headlines, kicker, subtitles, and CTA button.
            </p>
          </div>

          <div className="text-[11px] bg-white/10 border border-[#D4AF37]/50 px-3.5 py-2 rounded-xl text-[#E5C07B] shrink-0 flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#D4AF37]" />
            <span>Recommended: 16:9 Widescreen (1920 × 1080 px) · Direct File Upload</span>
          </div>
        </div>

        {/* Client Guidance Tip */}
        <div className="bg-[#FAF5E8] border-b border-[#E0D5C3] px-5 py-3 flex items-center justify-between text-xs text-[#5C4A19]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#D4AF37] text-black shrink-0">
              <ImageIcon className="w-3.5 h-3.5" />
            </span>
            <span>
              <strong>Client Photo Tip:</strong> Use a 16:9 horizontal image (1920 × 1080 px). Click <strong>"Upload Photo from Device"</strong> below to select directly from your computer or phone gallery without typing any links.
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveBoutiqueHero} className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 cols: Inputs */}
            <div className="lg:col-span-7 space-y-4">
              {/* Banner Photo Upload (Direct Device Upload, No Links Needed) */}
              <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#D5C7B0] space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="text-xs font-bold text-[#1E1E22] uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#B89758]" />
                      <span>HERO BANNER PHOTO (DIRECT UPLOAD)</span>
                    </label>
                    <span className="text-[10px] text-[#7A6C58] block mt-0.5">
                      Recommended: <strong>16:9 Widescreen (1920 × 1080 px)</strong> · Pick directly from device (no links needed!)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="text-xs bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] hover:brightness-105 text-[#111113] px-3.5 py-1.5 rounded-lg cursor-pointer flex items-center gap-1.5 font-bold shadow-xs transition-all active:scale-95">
                      <Upload className="w-3.5 h-3.5 text-[#111113]" />
                      <span>{isUploadingHero ? 'Uploading...' : 'Upload Photo from Device'}</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleHeroFileUpload}
                        className="sr-only"
                      />
                    </label>

                    {mediaAssets.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowMediaPickerHero(!showMediaPickerHero)}
                        className="text-xs bg-white hover:bg-gray-50 text-[#1E1E22] border border-[#D5C7B0] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold transition-colors"
                      >
                        Pick from Media
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setBoutiqueHeroData({ ...boutiqueHeroData, image: '/images/flagship_banner_16_9.jpg' })}
                      className="text-[11px] text-[#7A6C58] hover:text-black underline cursor-pointer"
                      title="Reset to default luxury boutique banner"
                    >
                      Reset Default
                    </button>
                  </div>
                </div>

                {/* Media Library Quick Dropdown */}
                {showMediaPickerHero && mediaAssets.length > 0 && (
                  <div className="p-3 bg-white rounded-lg border border-[#D5C7B0] space-y-2 animate-in fade-in">
                    <span className="text-[10px] font-bold text-[#7A6C58] uppercase tracking-wider block">
                      Select From Uploaded Media Library:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-1">
                      {mediaAssets.map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() => {
                            setBoutiqueHeroData((prev) => ({ ...prev, image: asset.dataUrl }));
                            setShowMediaPickerHero(false);
                            showToast('Selected banner photo from Media Library!');
                          }}
                          className="aspect-[16/9] rounded border border-gray-200 overflow-hidden cursor-pointer hover:border-[#D4AF37] hover:scale-105 transition-all shadow-2xs"
                        >
                          <img src={asset.dataUrl} alt={asset.name} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Active Image Info Box */}
                <div className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-[#E8DEC8]">
                  <div className="w-16 h-10 rounded overflow-hidden bg-black shrink-0 border border-[#D4AF37]/50">
                    <img
                      src={normalizeImageUrl(boutiqueHeroData.image)}
                      alt="Banner thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-[#111111] truncate">
                      Current Banner Image
                    </p>
                    <p className="text-[10px] text-[#7A6C58] truncate">
                      {boutiqueHeroData.image.startsWith('data:') ? 'Custom uploaded image (Ready)' : boutiqueHeroData.image}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowManualHeroUrl(!showManualHeroUrl)}
                    className="text-[10px] text-[#8C6D1F] hover:underline cursor-pointer shrink-0"
                  >
                    {showManualHeroUrl ? 'Hide URL' : 'Advanced: Edit Path'}
                  </button>
                </div>

                {/* Advanced Path / URL fallback input (Hidden by default) */}
                {showManualHeroUrl && (
                  <div className="pt-2 border-t border-[#E8DEC8] space-y-1">
                    <span className="text-[10px] font-semibold text-[#7A6C58]">
                      Manual image path (optional for developers):
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={boutiqueHeroData.image}
                        onChange={(e) => setBoutiqueHeroData({ ...boutiqueHeroData, image: e.target.value })}
                        placeholder="e.g. /images/flagship_banner_16_9.jpg"
                        className="flex-1 px-3 py-1.5 bg-white border border-[#D5C7B0] rounded-lg text-xs font-mono text-[#111111] focus:outline-none focus:border-[#B89758]"
                      />
                      {!boutiqueHeroData.image.startsWith('/') && !boutiqueHeroData.image.startsWith('http') && Boolean(boutiqueHeroData.image.trim()) && (
                        <button
                          type="button"
                          onClick={() => setBoutiqueHeroData({ ...boutiqueHeroData, image: '/' + boutiqueHeroData.image.trim() })}
                          className="px-2.5 py-1.5 bg-[#B8860B] text-black font-bold text-xs rounded-lg cursor-pointer"
                        >
                          + Add /
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Tagline / Kicker */}
              <div>
                <label className="block text-xs font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                  TOP KICKER / TAGLINE
                </label>
                <input
                  type="text"
                  value={boutiqueHeroData.kicker}
                  onChange={(e) => setBoutiqueHeroData({ ...boutiqueHeroData, kicker: e.target.value })}
                  placeholder="e.g. EXCLUSIVE COLLECTION"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5C7B0] rounded-xl text-xs font-bold text-[#7A5508] tracking-widest uppercase focus:outline-none focus:border-[#B89758]"
                />
              </div>

              {/* Headlines Line 1 & Line 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                    MAIN HEADLINE LINE 1
                  </label>
                  <input
                    type="text"
                    required
                    value={boutiqueHeroData.titleLine1}
                    onChange={(e) => setBoutiqueHeroData({ ...boutiqueHeroData, titleLine1: e.target.value })}
                    placeholder="e.g. Luxury"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5C7B0] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:border-[#B89758]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                    MAIN HEADLINE LINE 2 (Italic)
                  </label>
                  <input
                    type="text"
                    required
                    value={boutiqueHeroData.titleLine2}
                    onChange={(e) => setBoutiqueHeroData({ ...boutiqueHeroData, titleLine2: e.target.value })}
                    placeholder="e.g. For Every Moment"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5C7B0] rounded-xl text-xs font-bold italic text-[#111111] focus:outline-none focus:border-[#B89758]"
                  />
                </div>
              </div>

              {/* Subtitle Items */}
              <div>
                <label className="block text-xs font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                  SUBTITLE HIGHLIGHTS (Separate with | or commas)
                </label>
                <input
                  type="text"
                  value={boutiqueHeroData.subtitle}
                  onChange={(e) => setBoutiqueHeroData({ ...boutiqueHeroData, subtitle: e.target.value })}
                  placeholder="Premium Fashion | Elegant Accessories | Timeless Style"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5C7B0] rounded-xl text-xs text-[#1E1A16] font-medium focus:outline-none focus:border-[#B89758]"
                />
              </div>

              {/* CTA Button Text */}
              <div>
                <label className="block text-xs font-bold text-[#3D3327] uppercase tracking-wider mb-1">
                  CALL TO ACTION BUTTON TEXT
                </label>
                <input
                  type="text"
                  value={boutiqueHeroData.ctaText}
                  onChange={(e) => setBoutiqueHeroData({ ...boutiqueHeroData, ctaText: e.target.value })}
                  placeholder="e.g. Shop Now"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D5C7B0] rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:border-[#B89758]"
                />
              </div>
            </div>

            {/* Right 5 cols: Live Preview */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="block text-[11px] font-bold text-[#7A6C58] uppercase tracking-wider mb-2">
                  Live Showcase Preview (What Customers See)
                </span>
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border-2 border-[#D4AF37]/50 shadow-md bg-[#1B1916]">
                  <img
                    src={normalizeImageUrl(boutiqueHeroData.image)}
                    alt="Preview"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                    }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent p-4 flex flex-col justify-center">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-[#7A5508] uppercase mb-0.5">
                      {boutiqueHeroData.kicker}
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#111113] leading-tight">
                      {boutiqueHeroData.titleLine1} <br />
                      <span className="italic">{boutiqueHeroData.titleLine2}</span>
                    </h4>
                    <p className="text-[9px] text-[#221F1A] font-semibold mt-1 truncate">
                      {boutiqueHeroData.subtitle}
                    </p>
                    <div className="mt-2.5">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#C29748] to-[#B8860B] text-[#111113] text-[9px] font-extrabold rounded-full uppercase">
                        {boutiqueHeroData.ctaText} →
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] hover:brightness-105 text-[#111111] text-xs font-black tracking-widest uppercase rounded-xl shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>SAVE & PUBLISH TO LIVE STOREFRONT</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Top Banner Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#B89758]" />
            AUTOMATIC SLIDING BANNER SYSTEM
          </h2>
          <p className="text-xs text-[#7A6C58]">
            Configure homepage hero slider images, typography, CTA buttons, and delete/replace banner imagery.
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
              className="bg-transparent font-bold focus:outline-none text-[#1E1E22] cursor-pointer"
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
            className="px-4 py-2 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
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
                src={normalizeImageUrl(slide.image)}
                alt={slide.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                }}
                className="w-full h-full object-cover"
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

                <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
                  <span className="bg-[#FAF8F5] border border-[#D5C7B0] px-3 py-1 rounded text-[#1E1E22] font-semibold">
                    Primary CTA: {slide.ctaText} ({slide.ctaLink})
                  </span>
                  {slide.secondaryCtaText && (
                    <span className="bg-[#FAF8F5] border border-[#D5C7B0] px-3 py-1 rounded text-[#1E1E22] font-semibold">
                      Secondary CTA: {slide.secondaryCtaText} ({slide.secondaryCtaLink})
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
                  className={`text-xs font-semibold px-3 py-1 rounded cursor-pointer transition-colors ${
                    slide.active
                      ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {slide.active ? 'Pause / Deactivate' : 'Activate Slide'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(slide)}
                    className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D5C7B0] hover:bg-[#F2EDE2] text-[#1E1E22] text-xs font-semibold rounded flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3 h-3 text-[#B89758]" />
                    <span>Edit Slide</span>
                  </button>

                  {banners.length > 1 && (
                    <button
                      onClick={() => setDeleteConfirmId(slide.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer hover:bg-red-50 rounded"
                      title="Delete Slide"
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

      {/* Delete Confirmation Modal (In-App, safe for iFrames) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl border border-red-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#111111]">Delete Banner Slide?</h3>
                <p className="text-xs text-[#7A6C58]">
                  This banner will be removed permanently from the sliding carousel.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => setDeleteConfirmId(null)}
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
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
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
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
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
                  className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
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
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                    PRIMARY TARGET CATEGORY
                  </label>
                  <select
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none cursor-pointer"
                  >
                    <option value="Men">Men (Shirts)</option>
                    <option value="Women">Women</option>
                    <option value="Festive">Festive Edit</option>
                    <option value="Watches">Watches</option>
                    <option value="Bags">Bags</option>
                    <option value="Jeans">Jeans</option>
                  </select>
                </div>
              </div>

              {/* Banner Image, Delete & Direct Upload */}
              <div className="p-4 bg-white rounded-xl border border-[#D5C7B0] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1E1E22] uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#B89758]" />
                    Banner Image (PNG / JPG)
                  </label>
                  <div className="flex items-center gap-2">
                    {formData.image && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded cursor-pointer flex items-center gap-1 font-semibold transition-colors"
                        title="Delete current image"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                        <span>Remove Image</span>
                      </button>
                    )}
                    <label className="text-xs bg-[#FAF6EE] hover:bg-[#EFE8DD] text-[#1E1E22] border border-[#C5B39E] px-3 py-1 rounded cursor-pointer flex items-center gap-1 font-semibold transition-colors">
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
                </div>

                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Paste image URL or upload file above"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D5C7B0] rounded text-xs focus:border-[#B89758] focus:outline-none"
                />

                {formData.image ? (
                  <div className="relative h-32 rounded-lg overflow-hidden border border-[#D5C7B0] group bg-[#F5EFE3]">
                    <img
                      src={normalizeImageUrl(formData.image)}
                      alt="Banner Preview"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Image</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#FAF8F5] rounded-lg border border-dashed border-[#D5C7B0] text-center text-xs text-[#8A7966]">
                    No image selected. Upload a file above or pick from presets below.
                  </div>
                )}

                {/* Preset quick picker */}
                <div>
                  <span className="text-[10px] text-[#7A6C58] uppercase font-bold block mb-1.5">
                    Or select from high-definition store presets:
                  </span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {[
                      { name: 'Fashion Hero', url: '/images/hero_luxury_fashion_1791098539165.jpg' },
                      { name: 'Festive Edit', url: '/images/festive_edit_luxury_1791098550195.jpg' },
                      { name: 'Luxury Denim', url: '/images/category_luxury_denim_1791098561162.jpg' },
                      { name: 'Gold Watch', url: '/images/luxury_gold_watch_1791098572108.jpg' },
                      { name: 'Full Collection', url: '/images/luxury_products_hero_1791099185940.jpg' },
                    ].map((preset) => (
                      <button
                        type="button"
                        key={preset.url}
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                          formData.image === preset.url
                            ? 'bg-[#1E1E22] text-[#D4AF37] border-[#D4AF37]'
                            : 'bg-white border-[#D5C7B0] text-[#55493B] hover:border-[#B89758]'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
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
