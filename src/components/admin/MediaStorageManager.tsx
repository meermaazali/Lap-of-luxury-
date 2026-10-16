import React, { useState } from 'react';
import {
  Cloud,
  Upload,
  Copy,
  Check,
  Trash2,
  HardDrive,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

import { useStore } from '../../context/StoreContext';
import { MediaAsset } from '../../types';
import { cloudAddMediaAsset } from '../../lib/firebaseServices';

export const MediaStorageManager: React.FC = () => {
  const { mediaAssets, uploadMediaAsset, deleteMediaAsset } = useStore();

  const [isUploading, setIsUploading] = useState(false);
  const [isSavingUrl, setIsSavingUrl] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Upload image files from the computer to Firebase Storage.
  const handleFiles = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not a supported image.`);
        }

        await uploadMediaAsset(file, 'Uploads');
      }

      setSuccessMsg('Image upload completed successfully.');
    } catch (err: unknown) {
      setErrorMsg(
        'Image upload failed: ' +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsUploading(false);

      // Allow the same file to be selected again.
      e.target.value = '';
    }
  };

  // Save an externally hosted image URL in Firestore.
  const handleAddImageUrl = async () => {
    const value = imageUrl.trim();

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!value) {
      setErrorMsg('Please enter an image URL.');
      return;
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(value);
    } catch {
      setErrorMsg(
        'Enter a complete image URL beginning with https:// or http://.'
      );
      return;
    }

    if (
      parsedUrl.protocol !== 'https:' &&
      parsedUrl.protocol !== 'http:'
    ) {
      setErrorMsg('Only HTTP and HTTPS image URLs are supported.');
      return;
    }

    setIsSavingUrl(true);

    try {
      const fileName =
        parsedUrl.pathname.split('/').pop() || 'External image';

      await cloudAddMediaAsset({
        name: fileName,
        size: 0,
        type: 'image/url',
        dataUrl: parsedUrl.href,
        createdAt: new Date().toISOString(),
        category: 'Uploads',
      });

      setImageUrl('');
      setSuccessMsg('Image URL saved successfully.');
    } catch (err: unknown) {
      setErrorMsg(
        'Could not save the image URL: ' +
          (err instanceof Error ? err.message : String(err))
      );
    } finally {
      setIsSavingUrl(false);
    }
  };

  // Copy the image URL.
  const copyUrl = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(asset.dataUrl);
      setCopiedId(asset.id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setErrorMsg('Could not copy the URL. Check your browser permissions.');
    }
  };

  // Delete an asset.
  const handleDelete = async (id: string) => {
    try {
      await deleteMediaAsset(id);
      setDeleteConfirmId(null);
      setSuccessMsg('Media record deleted.');
    } catch (err: unknown) {
      setErrorMsg(
        'Could not delete this asset: ' +
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  const filteredAssets = mediaAssets.filter((asset) => {
    if (selectedCategory === 'All') return true;
    return asset.category === selectedCategory;
  });

  const totalBytes = mediaAssets.reduce(
    (sum, asset) => sum + (asset.size || 0),
    0
  );

  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E0D5C3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Cloud className="w-5 h-5 text-[#B89758]" />

            <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22]">
              CLOUD & MEDIA STORAGE
            </h2>

            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Firebase Storage
            </span>
          </div>

          <p className="text-xs text-[#7A6C58] mt-1">
            Upload product photos and banners from your device, or add an
            image hosted online.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-[#7A6C58]">
              Stored Assets:
            </span>

            <p className="text-xs font-bold text-[#1E1E22] tabular-nums">
              {mediaAssets.length} Files ({totalMB} MB known file size)
            </p>
          </div>

          <label
            className={`px-4 py-2.5 bg-[#B89758] hover:bg-[#A58448] text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all ${
              isUploading ? 'opacity-60 pointer-events-none' : ''
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}

            <span>{isUploading ? 'Uploading...' : 'Upload Images'}</span>

            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleFiles}
              disabled={isUploading}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* Status messages */}
      {errorMsg && (
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs"
        >
          <div className="flex items-start justify-between gap-3">
            <span>{errorMsg}</span>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="font-bold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg text-xs"
        >
          <div className="flex items-start justify-between gap-3">
            <span>{successMsg}</span>
            <button
              type="button"
              onClick={() => setSuccessMsg(null)}
              className="font-bold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Add image by URL */}
      <div className="bg-white p-5 rounded-xl border border-[#E0D5C3] shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-[#B89758]" />

          <h3 className="font-display text-sm font-bold tracking-wider uppercase text-[#1E1E22]">
            Add Image Using URL
          </h3>
        </div>

        <p className="text-xs text-[#7A6C58]">
          Paste a direct link to an image hosted online. The URL will be
          saved to your cloud media library.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void handleAddImageUrl();
              }
            }}
            placeholder="https://example.com/product-image.jpg"
            disabled={isSavingUrl}
            className="flex-1 min-w-0 px-3 py-3 border border-[#D5C7B0] rounded-lg text-xs text-[#1E1E22] focus:outline-none focus:border-[#B89758] disabled:opacity-60"
          />

          <button
            type="button"
            onClick={() => void handleAddImageUrl()}
            disabled={isSavingUrl || !imageUrl.trim()}
            className="px-5 py-3 bg-[#1E1E22] hover:bg-[#35353B] text-white rounded-lg text-xs font-bold tracking-wider uppercase disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSavingUrl && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}

            {isSavingUrl ? 'Saving...' : 'Add Image URL'}
          </button>
        </div>

        <p className="text-[10px] text-[#7A6C58]">
          Note: External image URLs are not uploaded to Firebase Storage.
          The original website hosting the image must continue to make it
          available.
        </p>
      </div>

      {/* Upload from computer */}
      <div className="bg-[#FAF8F5] border-2 border-dashed border-[#D5C2A5] rounded-2xl p-8 text-center hover:bg-[#F5EFE4] transition-colors">
        <HardDrive className="w-12 h-12 text-[#B89758] mx-auto mb-3" />

        <h3 className="font-display text-sm font-bold text-[#1E1E22] uppercase tracking-wider">
          UPLOAD IMAGES FROM YOUR COMPUTER
        </h3>

        <p className="text-xs text-[#7A6C58] mt-1 max-w-sm mx-auto">
          Select product photographs, fashion images, campaign banners,
          footwear, watches, or bags.
        </p>

        <label
          className={`mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#C5B39E] text-[#1E1E22] text-xs font-semibold rounded-lg cursor-pointer hover:bg-[#FAF8F5] shadow-xs ${
            isUploading ? 'opacity-60 pointer-events-none' : ''
          }`}
        >
          <Upload className="w-4 h-4 text-[#B89758]" />
          {isUploading ? 'Uploading...' : 'Browse Computer Files'}

          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFiles}
            disabled={isUploading}
            className="sr-only"
          />
        </label>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#7A6C58]">
          Filter:
        </span>

        {['All', ...Array.from(new Set(mediaAssets.map((a) => a.category).filter(Boolean)))].map(
          (category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                selectedCategory === category
                  ? 'bg-[#1E1E22] text-white border-[#1E1E22]'
                  : 'bg-white text-[#7A6C58] border-[#D5C7B0] hover:border-[#B89758]'
              }`}
            >
              {category}
            </button>
          )
        )}
      </div>

      {/* Media gallery */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white border border-[#E0D5C3] rounded-xl p-10 text-center">
          <ImageIcon className="w-10 h-10 text-[#B89758] mx-auto mb-3" />

          <p className="text-sm font-bold text-[#1E1E22]">
            No images found
          </p>

          <p className="text-xs text-[#7A6C58] mt-1">
            Upload an image from your computer or add an image URL above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => {
            const isCopied = copiedId === asset.id;
            const sizeKb = Math.round((asset.size || 0) / 1024);

            return (
              <div
                key={asset.id}
                className="bg-white rounded-xl border border-[#E0D5C3] overflow-hidden flex flex-col justify-between group shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square bg-[#F7F4EE] overflow-hidden">
                  <img
                    src={asset.dataUrl}
                    alt={asset.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.opacity = '0.35';
                    }}
                  />

                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded uppercase">
                    {asset.type === 'image/url'
                      ? 'URL'
                      : asset.type.split('/')[1] || 'IMG'}
                  </span>

                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                    {asset.type === 'image/url'
                      ? 'External URL'
                      : sizeKb > 0
                        ? `${sizeKb} KB`
                        : 'Unknown size'}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF8F5] border-t border-[#EFE8DC]">
                  <p
                    className="font-bold text-xs text-[#1E1E22] truncate"
                    title={asset.name}
                  >
                    {asset.name}
                  </p>

                  <p className="text-[10px] text-[#7A6C58] mt-0.5">
                    {asset.createdAt
                      ? new Date(asset.createdAt).toLocaleDateString()
                      : 'Date unavailable'}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-1 pt-2 border-t border-[#E8DFC8]">
                    <button
                      type="button"
                      onClick={() => void copyUrl(asset)}
                      className={`flex-1 py-1.5 px-2 rounded text-[10px] font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1 ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-[#D5C7B0] hover:bg-[#F2ECE1] text-[#1E1E22]'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#B89758]" />
                          Copy URL
                        </>
                      )}
                    </button>

                    {deleteConfirmId === asset.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => void handleDelete(asset.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700"
                        >
                          Delete
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-1 text-[#7A6C58] hover:text-[#1E1E22] text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(asset.id)}
                        className="p-1.5 text-[#A39280] hover:text-red-600 transition-colors"
                        title="Delete Asset"
                        aria-label={`Delete ${asset.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};