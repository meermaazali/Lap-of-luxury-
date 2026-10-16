import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Clock,
  Image as ImageIcon,
  AlertCircle,
  Check,
  CheckCircle,
} from 'lucide-react';

import { useStore } from '../../context/StoreContext';
import { BannerSlide } from '../../types';
import {
  normalizeImageUrl,
  FALLBACK_LUXURY_IMAGE,
} from '../../utils/imageUtils';

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

  const [editingBanner, setEditingBanner] =
    useState<BannerSlide | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [showMediaPickerHero, setShowMediaPickerHero] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(
    null
  );

  const [boutiqueHeroData, setBoutiqueHeroData] = useState({
    kicker: boutiqueHeroConfig?.kicker || 'EXCLUSIVE COLLECTION',
    titleLine1: boutiqueHeroConfig?.titleLine1 || 'Luxury',
    titleLine2: boutiqueHeroConfig?.titleLine2 || 'For Every Moment',
    subtitle:
      boutiqueHeroConfig?.subtitleItems?.join(' | ') ||
      'Premium Fashion | Elegant Accessories | Timeless Style',
    ctaText: boutiqueHeroConfig?.ctaText || 'Shop Now',
    image:
      boutiqueHeroConfig?.image ||
      '/images/flagship_banner_16_9.jpg',
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

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3500);
  };

  // Accept website paths and direct HTTP/HTTPS image URLs.
  const normalizeEnteredImage = (value: string): string => {
    const image = value.trim();

    if (!image) return '';

    if (
      image.startsWith('/') ||
      image.startsWith('data:') ||
      /^https?:\/\//i.test(image)
    ) {
      return image;
    }

    return `/${image}`;
  };

  const handleHeroFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.');
      e.target.value = '';
      return;
    }

    setIsUploadingHero(true);

    try {
      const asset = await uploadMediaAsset(file, 'Banners');

      setBoutiqueHeroData((prev) => ({
        ...prev,
        image: asset.dataUrl,
      }));

      showToast(
        'Image uploaded. Click Save & Publish to save the hero banner.'
      );
    } catch (err: unknown) {
      showToast(
        'Upload failed: ' +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsUploadingHero(false);
      e.target.value = '';
    }
  };

  const handleSaveBoutiqueHero = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const image = normalizeEnteredImage(boutiqueHeroData.image);

    if (!image) {
      showToast('Please paste an image URL or upload an image.');
      return;
    }

    const items = boutiqueHeroData.subtitle
      .split(/[|,]/)
      .map((item) => item.trim())
      .filter(Boolean);

    setIsSavingHero(true);

    try {
      await updateBoutiqueHeroConfig({
        kicker: boutiqueHeroData.kicker,
        titleLine1: boutiqueHeroData.titleLine1,
        titleLine2: boutiqueHeroData.titleLine2,
        subtitleItems: items.length
          ? items
          : [
              'Premium Fashion',
              'Elegant Accessories',
              'Timeless Style',
            ],
        ctaText: boutiqueHeroData.ctaText,
        image,
      });

      setBoutiqueHeroData((prev) => ({ ...prev, image }));

      showToast(
        'Hero banner saved. Check your storefront to confirm the change.'
      );
    } catch (err: unknown) {
      showToast(
        'Could not save hero banner: ' +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsSavingHero(false);
    }
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
      image:
        mediaAssets[0]?.dataUrl ||
        '/images/hero_luxury_fashion_1791098539165.jpg',
      active: true,
    });

    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: BannerSlide) => {
    setEditingBanner(banner);
    setFormError(null);

    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      kicker: banner.kicker || '',
      ctaText: banner.ctaText,
      ctaLink: banner.ctaLink,
      secondaryCtaText: banner.secondaryCtaText || '',
      secondaryCtaLink: banner.secondaryCtaLink || '',
      image: normalizeImageUrl(banner.image),
      active: banner.active,
    });

    setIsModalOpen(true);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setFormError(null);

    try {
      const asset = await uploadMediaAsset(file, 'Banners');

      setFormData((prev) => ({
        ...prev,
        image: asset.dataUrl,
      }));

      showToast(
        'Image uploaded. Click Save Slide to save the banner.'
      );
    } catch (err: unknown) {
      setFormError(
        'Upload failed: ' +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setFormError('Main title is required.');
      return;
    }

    const image = normalizeEnteredImage(formData.image);

    if (!image) {
      setFormError(
        'A banner image is required. Paste an image link or upload an image.'
      );
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const bannerData = {
        title: formData.title.trim(),
        subtitle: formData.subtitle,
        kicker: formData.kicker,
        ctaText: formData.ctaText,
        ctaLink: formData.ctaLink,
        secondaryCtaText: formData.secondaryCtaText,
        secondaryCtaLink: formData.secondaryCtaLink,
        image,
        active: formData.active,
      };

      if (editingBanner) {
        await updateBanner(editingBanner.id, bannerData);
        showToast('Banner updated successfully.');
      } else {
        await addBanner({
          ...bannerData,
          order: banners.length + 1,
        });
        showToast('Banner added successfully.');
      }

      setIsModalOpen(false);
    } catch (err: unknown) {
      setFormError(
        'Could not save banner: ' +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    try {
      await deleteBanner(deleteConfirmId);
      setDeleteConfirmId(null);
      showToast('Banner deleted.');
    } catch (err: unknown) {
      showToast(
        'Could not delete banner: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  const updateHeroField = (
    field: keyof typeof boutiqueHeroData,
    value: string
  ) => {
    setBoutiqueHeroData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const presets = [
    {
      name: 'Fashion Hero',
      url: '/images/hero_luxury_fashion_1791098539165.jpg',
    },
    {
      name: 'Festive Edit',
      url: '/images/festive_edit_luxury_1791098550195.jpg',
    },
    {
      name: 'Luxury Denim',
      url: '/images/category_luxury_denim_1791098561162.jpg',
    },
    {
      name: 'Gold Watch',
      url: '/images/luxury_gold_watch_1791098572108.jpg',
    },
    {
      name: 'Full Collection',
      url: '/images/luxury_products_hero_1791099185940.jpg',
    },
  ];

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="flex items-center gap-2 justify-between rounded-xl border-2 border-emerald-400 bg-emerald-50 p-4 text-xs font-bold text-emerald-900">
          <span className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            {toastMessage}
          </span>
        </div>
      )}

      {/* MAIN HOMEPAGE HERO EDITOR */}
      <section className="overflow-hidden rounded-2xl border-2 border-[#D4AF37]/60 bg-white shadow-md">
        <div className="bg-gradient-to-r from-[#1E1E22] via-[#2A261F] to-[#1E1E22] p-5 text-white sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#D4AF37] px-2 py-0.5 text-[10px] font-black uppercase text-black">
              Main Homepage
            </span>
            <h2 className="font-bodoni text-lg font-bold uppercase tracking-wider sm:text-xl">
              Flagship Fashion Hero Banner
            </h2>
          </div>
          <p className="mt-2 text-xs text-gray-300">
            Upload an image or paste an image link. Save to publish the
            banner and its text.
          </p>
        </div>

        <form
          onSubmit={handleSaveBoutiqueHero}
          className="space-y-5 p-5 sm:p-6"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-7">
              {/* IMAGE UPLOAD AND IMAGE URL */}
              <div className="space-y-4 rounded-xl border border-[#D5C7B0] bg-[#FAF8F5] p-4">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#1E1E22]">
                    <ImageIcon className="mr-1 inline h-4 w-4 text-[#B89758]" />
                    Homepage Hero Image
                  </label>
                  <p className="mb-3 text-[11px] text-[#7A6C58]">
                    Upload a photo from your device, paste an image URL,
                    or use an image path from your website.
                  </p>

                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gradient-to-r from-[#DFBA53] via-[#F4E09E] to-[#B8860B] px-4 py-2 text-xs font-bold text-black">
                    <Upload className="h-4 w-4" />
                    {isUploadingHero ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroFileUpload}
                      className="sr-only"
                      disabled={isUploadingHero}
                    />
                  </label>

                  {mediaAssets.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowMediaPickerHero((prev) => !prev)
                      }
                      className="ml-2 rounded-lg border border-[#D5C7B0] bg-white px-3 py-2 text-xs font-semibold text-[#1E1E22]"
                    >
                      Pick from Media
                    </button>
                  )}
                </div>

                {showMediaPickerHero && mediaAssets.length > 0 && (
                  <div className="rounded-lg border border-[#D5C7B0] bg-white p-3">
                    <p className="mb-2 text-[10px] font-bold uppercase text-[#7A6C58]">
                      Choose an image from Media Storage
                    </p>
                    <div className="grid max-h-44 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-5">
                      {mediaAssets.map((asset) => (
                        <button
                          type="button"
                          key={asset.id}
                          onClick={() => {
                            updateHeroField('image', asset.dataUrl);
                            setShowMediaPickerHero(false);
                          }}
                          className="overflow-hidden rounded border border-gray-200 text-left hover:border-[#D4AF37]"
                          title={`Use ${asset.name}`}
                        >
                          <img
                            src={normalizeImageUrl(asset.dataUrl)}
                            alt={asset.name}
                            className="aspect-video w-full object-cover"
                          />
                          <span className="block truncate p-1 text-[9px]">
                            {asset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="homepage-hero-image-url"
                    className="mb-1 block text-xs font-bold text-[#1E1E22]"
                  >
                    Paste Image Link / Image Path
                  </label>
                  <input
                    id="homepage-hero-image-url"
                    type="text"
                    value={boutiqueHeroData.image}
                    onChange={(e) =>
                      updateHeroField('image', e.target.value)
                    }
                    placeholder="/images/category_mens_fashion_1791290148102.jpg or https://example.com/image.jpg"
                    className="w-full rounded-lg border border-[#D5C7B0] bg-white px-3 py-3 text-xs text-[#111111] focus:border-[#B89758] focus:outline-none"
                  />
                  <p className="mt-1 text-[10px] text-[#7A6C58]">
                    Example: /images/category_mens_fashion_1791290148102.jpg
                    <br />
                    You can also paste a direct https:// image URL.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateHeroField(
                        'image',
                        '/images/flagship_banner_16_9.jpg'
                      )
                    }
                    className="rounded-lg border border-[#D5C7B0] bg-white px-3 py-2 text-xs font-semibold text-[#55493B]"
                  >
                    Reset Default Image
                  </button>
                  <button
                    type="button"
                    onClick={() => updateHeroField('image', '')}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
                  >
                    Clear Image Link
                  </button>
                </div>

                <div className="rounded-lg border border-[#E8DEC8] bg-white p-3">
                  <p className="mb-2 text-[10px] font-bold uppercase text-[#7A6C58]">
                    Current Image Preview
                  </p>
                  {boutiqueHeroData.image.trim() ? (
                    <img
                      src={normalizeImageUrl(boutiqueHeroData.image)}
                      alt="Homepage hero preview"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          FALLBACK_LUXURY_IMAGE;
                      }}
                      className="max-h-56 w-full rounded-lg border border-[#D5C7B0] bg-[#F5EFE3] object-cover"
                    />
                  ) : (
                    <div className="rounded-lg border border-dashed border-[#D5C7B0] p-8 text-center text-xs text-[#7A6C58]">
                      Paste an image link or upload an image to preview it.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3D3327]">
                  Top Kicker / Tagline
                </label>
                <input
                  value={boutiqueHeroData.kicker}
                  onChange={(e) =>
                    updateHeroField('kicker', e.target.value)
                  }
                  placeholder="EXCLUSIVE COLLECTION"
                  className="w-full rounded-xl border border-[#D5C7B0] bg-[#FAF8F5] px-3 py-2.5 text-xs text-[#7A5508] focus:border-[#B89758] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3D3327]">
                    Headline Line 1
                  </label>
                  <input
                    required
                    value={boutiqueHeroData.titleLine1}
                    onChange={(e) =>
                      updateHeroField('titleLine1', e.target.value)
                    }
                    className="w-full rounded-xl border border-[#D5C7B0] bg-[#FAF8F5] px-3 py-2.5 text-xs focus:border-[#B89758] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3D3327]">
                    Headline Line 2
                  </label>
                  <input
                    required
                    value={boutiqueHeroData.titleLine2}
                    onChange={(e) =>
                      updateHeroField('titleLine2', e.target.value)
                    }
                    className="w-full rounded-xl border border-[#D5C7B0] bg-[#FAF8F5] px-3 py-2.5 text-xs focus:border-[#B89758] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3D3327]">
                  Subtitle Highlights (separate with | or commas)
                </label>
                <input
                  value={boutiqueHeroData.subtitle}
                  onChange={(e) =>
                    updateHeroField('subtitle', e.target.value)
                  }
                  placeholder="Premium Fashion | Elegant Accessories | Timeless Style"
                  className="w-full rounded-xl border border-[#D5C7B0] bg-[#FAF8F5] px-3 py-2.5 text-xs focus:border-[#B89758] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#3D3327]">
                  Call to Action Button Text
                </label>
                <input
                  value={boutiqueHeroData.ctaText}
                  onChange={(e) =>
                    updateHeroField('ctaText', e.target.value)
                  }
                  placeholder="Shop Now"
                  className="w-full rounded-xl border border-[#D5C7B0] bg-[#FAF8F5] px-3 py-2.5 text-xs focus:border-[#B89758] focus:outline-none"
                />
              </div>
            </div>

            {/* LIVE PREVIEW AND SAVE */}
            <div className="space-y-4 lg:col-span-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A6C58]">
                Live Showcase Preview
              </p>

              <div className="relative aspect-video overflow-hidden rounded-2xl border-2 border-[#D4AF37]/50 bg-[#1B1916] shadow-md">
                <img
                  src={normalizeImageUrl(boutiqueHeroData.image)}
                  alt="Homepage hero live preview"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      FALLBACK_LUXURY_IMAGE;
                  }}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-white/90 via-white/50 to-transparent p-4">
                  <span className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#7A5508]">
                    {boutiqueHeroData.kicker}
                  </span>
                  <h3 className="font-serif text-base font-bold leading-tight text-[#111113] sm:text-xl">
                    {boutiqueHeroData.titleLine1}
                    <br />
                    {boutiqueHeroData.titleLine2}
                  </h3>
                  <p className="mt-2 text-[9px] font-semibold text-[#221F1A]">
                    {boutiqueHeroData.subtitle}
                  </p>
                  <div className="mt-3">
                    <span className="inline-block rounded-full bg-gradient-to-r from-[#C29748] to-[#B8860B] px-3 py-1 text-[9px] font-extrabold uppercase text-[#111113]">
                      {boutiqueHeroData.ctaText}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingHero || isUploadingHero}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] py-4 text-xs font-black uppercase tracking-widest text-[#111111] shadow-md hover:brightness-105 disabled:opacity-60"
              >
                {isSavingHero ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Save &amp; Publish to Live Storefront
                  </>
                )}
              </button>

              <p className="text-[10px] leading-relaxed text-[#7A6C58]">
                The image link and text are saved through your existing
                updateBoutiqueHeroConfig function. A website image path
                works only when that image exists in your deployed
                website's public/images folder.
              </p>
            </div>
          </div>
        </form>
      </section>

      {/* SLIDING BANNER CONTROLS */}
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-[#E0D5C3] bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wider text-[#1E1E22]">
            <Sliders className="h-5 w-5 text-[#B89758]" />
            Automatic Sliding Banner System
          </h2>
          <p className="mt-1 text-xs text-[#7A6C58]">
            Manage carousel slides, image links, text and buttons.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-[#D5C7B0] bg-[#FAF8F5] px-3 py-2 text-xs">
            <Clock className="h-3.5 w-3.5 text-[#B89758]" />
            <span className="font-semibold text-[#4A4033]">
              Slide Interval:
            </span>
            <select
              value={bannerInterval}
              onChange={(e) => setBannerInterval(Number(e.target.value))}
              className="cursor-pointer bg-transparent font-bold text-[#1E1E22] focus:outline-none"
            >
              <option value={3}>3 Seconds</option>
              <option value={4}>4 Seconds</option>
              <option value={5}>5 Seconds</option>
              <option value={7}>7 Seconds</option>
              <option value={10}>10 Seconds</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-lg bg-[#1E1E22] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#34343A]"
          >
            <Plus className="h-4 w-4 text-[#B89758]" />
            Add Slide
          </button>
        </div>
      </section>

      {/* EXISTING SLIDES */}
      <div className="space-y-4">
        {banners.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col items-stretch overflow-hidden rounded-xl border border-[#E0D5C3] bg-white shadow-sm transition-shadow hover:shadow-md md:flex-row"
          >
            <div className="relative h-48 shrink-0 bg-[#EFECE6] sm:h-52 md:w-80">
              <img
                src={normalizeImageUrl(slide.image)}
                alt={slide.title}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    FALLBACK_LUXURY_IMAGE;
                }}
                className="h-full w-full object-cover"
              />
              <span className="absolute left-2 top-2 rounded bg-black/75 px-2 py-0.5 font-mono text-[10px] font-bold text-[#F3E7D5]">
                Slide #{index + 1}
              </span>
              <span
                className={`absolute bottom-2 left-2 rounded px-2 py-0.5 text-[10px] font-bold text-white ${
                  slide.active ? 'bg-emerald-600' : 'bg-gray-500'
                }`}
              >
                {slide.active ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#B89758]">
                  {slide.kicker || 'Experience premium in every touch'}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold uppercase tracking-wider text-[#1E1E22]">
                  {slide.title}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#594E42]">
                  {slide.subtitle}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded border border-[#D5C7B0] bg-[#FAF8F5] px-3 py-1 font-semibold text-[#1E1E22]">
                    Primary CTA: {slide.ctaText} ({slide.ctaLink})
                  </span>
                  {slide.secondaryCtaText && (
                    <span className="rounded border border-[#D5C7B0] bg-[#FAF8F5] px-3 py-1 font-semibold text-[#1E1E22]">
                      Secondary CTA: {slide.secondaryCtaText} (
                      {slide.secondaryCtaLink})
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#F0EAE0] pt-3">
                <button
                  type="button"
                  onClick={() =>
                    updateBanner(slide.id, { active: !slide.active })
                  }
                  className={`rounded border px-3 py-1 text-xs font-semibold transition-colors ${
                    slide.active
                      ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {slide.active ? 'Pause / Deactivate' : 'Activate Slide'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(slide)}
                    className="flex items-center gap-1 rounded border border-[#D5C7B0] bg-[#FAF8F5] px-3 py-1.5 text-xs font-semibold text-[#1E1E22] hover:bg-[#F2EDE2]"
                  >
                    <Edit2 className="h-3 w-3 text-[#B89758]" />
                    Edit Slide
                  </button>

                  {banners.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(slide.id)}
                      className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete slide"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#D5C7B0] bg-white p-8 text-center text-sm text-[#7A6C58]">
            No sliding banners yet. Click Add Slide to create one.
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-red-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111111]">
                  Delete Banner Slide?
                </h3>
                <p className="mt-1 text-xs text-[#7A6C58]">
                  This will remove the selected slide from your banner list.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold uppercase text-white hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT SLIDE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="my-auto flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-[#D5C2A5] bg-[#FAF8F5] shadow-2xl">
            <div className="flex shrink-0 items-center justify-between border-b border-[#E8DEC8] bg-white px-6 py-4">
              <h3 className="font-display text-base font-bold uppercase tracking-wider text-[#1E1E22]">
                {editingBanner ? 'Edit Banner Slide' : 'Create New Banner Slide'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full border border-[#D5C7B0] px-2 py-1 text-sm hover:bg-[#F2ECE1]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 flex shrink-0 items-center gap-2 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form
              onSubmit={handleSave}
              className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6"
            >
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#4A4033]">
                  Main Title *
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="LAP OF LUXURY"
                  className="w-full rounded border border-[#D5C7B0] bg-white px-3 py-2 text-xs focus:border-[#B89758] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#4A4033]">
                  Kicker / Tagline
                </label>
                <input
                  value={formData.kicker}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      kicker: e.target.value,
                    }))
                  }
                  placeholder="Experience premium in every touch"
                  className="w-full rounded border border-[#D5C7B0] bg-white px-3 py-2 text-xs focus:border-[#B89758] focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#4A4033]">
                  Subtitle / Category Highlights *
                </label>
                <input
                  required
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subtitle: e.target.value,
                    }))
                  }
                  placeholder="PREMIUM FASHION · WATCHES · BAGS · SHOES"
                  className="w-full rounded border border-[#D5C7B0] bg-white px-3 py-2 text-xs focus:border-[#B89758] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#4A4033]">
                    Primary CTA Text
                  </label>
                  <input
                    value={formData.ctaText}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ctaText: e.target.value,
                      }))
                    }
                    className="w-full rounded border border-[#D5C7B0] bg-white px-3 py-2 text-xs focus:border-[#B89758] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#4A4033]">
                    Primary Target Category
                  </label>
                  <select
                    value={formData.ctaLink}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        ctaLink: e.target.value,
                      }))
                    }
                    className="w-full cursor-pointer rounded border border-[#D5C7B0] bg-white px-3 py-2 text-xs focus:border-[#B89758] focus:outline-none"
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

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#4A4033]">
                    Secondary CTA Text
                  </label>
                  <input
                    value={formData.secondaryCtaText}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        secondaryCtaText: e.target.value,
                      }))
                    }
                    className="w-full rounded border border-[#D5C7B0] bg-white px-3 py-2 text-xs focus:border-[#B89758] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#4A4033]">
                    Secondary Target
                  </label>
                  <select
                    value={formData.secondaryCtaLink}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        secondaryCtaLink: e.target.value,
                      }))
                    }
                    className="w-full cursor-pointer rounded border border-[#D5C7B0] bg-white px-3 py-2 text-xs focus:border-[#B89758] focus:outline-none"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Festive">Festive Edit</option>
                    <option value="Watches">Watches</option>
                    <option value="Bags">Bags</option>
                    <option value="Jeans">Jeans</option>
                  </select>
                </div>
              </div>

              {/* SLIDE IMAGE: UPLOAD OR PASTE LINK */}
              <div className="space-y-3 rounded-xl border border-[#D5C7B0] bg-white p-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E1E22]">
                  <ImageIcon className="mr-1 inline h-4 w-4 text-[#B89758]" />
                  Banner Image
                </label>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#C5B39E] bg-[#FAF6EE] px-3 py-2 text-xs font-semibold text-[#1E1E22] hover:bg-[#EFE8DD]">
                  <Upload className="h-4 w-4 text-[#B89758]" />
                  {isUploading ? 'Uploading...' : 'Upload Image from Device'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="sr-only"
                  />
                </label>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#4A4033]">
                    Or Paste Image URL / Website Path *
                  </label>
                  <input
                    required
                    value={formData.image}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        image: e.target.value,
                      }))
                    }
                    placeholder="/images/category_mens_fashion_1791290148102.jpg or https://..."
                    className="w-full rounded border border-[#D5C7B0] bg-[#FAF8F5] px-3 py-3 text-xs focus:border-[#B89758] focus:outline-none"
                  />
                </div>

                {formData.image.trim() ? (
                  <div className="overflow-hidden rounded-lg border border-[#D5C7B0] bg-[#F5EFE3]">
                    <img
                      src={normalizeImageUrl(formData.image)}
                      alt="Banner preview"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          FALLBACK_LUXURY_IMAGE;
                      }}
                      className="h-36 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="m-2 inline-flex items-center gap-1 rounded bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Clear Image
                    </button>
                  </div>
                ) : (
                  <p className="rounded-lg border border-dashed border-[#D5C7B0] p-4 text-center text-xs text-[#8A7966]">
                    No image selected yet.
                  </p>
                )}

                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase text-[#7A6C58]">
                    Choose a website preset
                  </p>
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {presets.map((preset) => (
                      <button
                        type="button"
                        key={preset.url}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            image: preset.url,
                          }))
                        }
                        className={`whitespace-nowrap rounded border px-2.5 py-1.5 text-[11px] font-semibold ${
                          formData.image === preset.url
                            ? 'border-[#D4AF37] bg-[#1E1E22] text-[#D4AF37]'
                            : 'border-[#D5C7B0] bg-white text-[#55493B] hover:border-[#B89758]'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#4A4033]">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      active: e.target.checked,
                    }))
                  }
                  className="accent-[#B8860B]"
                />
                Show this slide on the storefront
              </label>

              <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[#E8DEC8] bg-[#FAF8F5] pb-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded border border-[#D5C7B0] bg-white px-4 py-2 text-xs font-semibold uppercase hover:bg-[#F2ECE1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="flex items-center gap-2 rounded bg-[#1E1E22] px-6 py-2 text-xs font-bold uppercase tracking-wider text-white shadow disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    'Save Slide'
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
