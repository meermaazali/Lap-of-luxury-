import React, { useState } from 'react';
import {
  Cloud,
  Upload,
  Link as LinkIcon,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  HardDrive,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MediaAsset } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUtils';

export const MediaStorageManager: React.FC = () => {
  const { mediaAssets, uploadMediaAsset, addMediaAssetByUrl, deleteMediaAsset } = useStore();
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Add by URL modal / state
  const [showAddUrlModal, setShowAddUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlName, setUrlName] = useState('');
  const [urlCategory, setUrlCategory] = useState('Products');
  const [isSubmittingUrl, setIsSubmittingUrl] = useState(false);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadMediaAsset(files[i], selectedCategory === 'All' ? 'Uploads' : selectedCategory);
      }
      setSuccessMsg(`✓ Successfully uploaded and synced ${files.length} image(s) to Cloud Storage!`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: unknown) {
      setErrorMsg('Error uploading media asset: ' + (err instanceof Error ? err.message : String(err)));
      setTimeout(() => setErrorMsg(null), 5000);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setErrorMsg('Please enter an image URL.');
      return;
    }

    setIsSubmittingUrl(true);
    setErrorMsg(null);
    try {
      await addMediaAssetByUrl(urlInput.trim(), urlName.trim() || 'Linked Media', urlCategory);
      setSuccessMsg('✓ Image URL successfully linked and saved to Cloud Media!');
      setUrlInput('');
      setUrlName('');
      setShowAddUrlModal(false);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: unknown) {
      setErrorMsg('Failed to save image URL: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSubmittingUrl(false);
    }
  };

  const copyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.dataUrl);
    setCopiedId(asset.id);
    setSuccessMsg('✓ Image URL copied to clipboard! You can paste it into products, banners, or categories.');
    setTimeout(() => {
      setCopiedId(null);
      setSuccessMsg(null);
    }, 2500);
  };

  const filteredAssets = mediaAssets.filter((a) => {
    if (selectedCategory === 'All') return true;
    return a.category === selectedCategory;
  });

  const totalBytes = mediaAssets.reduce((sum, a) => sum + (a.size || 45000), 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Top Banner with Real-time Status */}
      <div className="bg-white p-5 rounded-2xl border border-[#E0D5C3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-[#B89758]" />
            <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22]">
              CLOUD MEDIA & ASSET STORAGE
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Cloud Sync
            </span>
          </div>
          <p className="text-xs text-[#7A6C58] mt-1">
            Store and manage product catalog shoots, campaign hero banners, and category covers. Upload files directly or paste external image URLs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="text-right hidden sm:block pr-3 border-r border-[#EFE8DC]">
            <span className="text-[11px] text-[#7A6C58]">Catalog Media:</span>
            <p className="text-xs font-bold text-[#1E1E22] tabular-nums">
              {mediaAssets.length} Files ({totalMB} MB)
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddUrlModal(true)}
            className="px-3.5 py-2.5 bg-white border border-[#C5B39E] hover:bg-[#FAF6EE] text-[#1E1E22] text-xs font-bold tracking-wider uppercase rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#B89758]" />
            <span>Paste Image URL</span>
          </button>

          <label className="px-4 py-2.5 bg-[#B89758] hover:bg-[#A58448] text-white text-xs font-bold tracking-wider uppercase rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload Images'}</span>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFiles}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* Success / Error Feedback Toasts */}
      {successMsg && (
        <div className="bg-emerald-50 border-2 border-emerald-400 text-emerald-900 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border-2 border-red-300 text-red-900 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Paste URL Modal */}
      {showAddUrlModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-lg rounded-2xl border border-[#D5C2A5] shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8]">
              <h3 className="font-display text-sm font-bold tracking-wider uppercase text-[#1E1E22] flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#B89758]" />
                ADD IMAGE FROM WEB URL
              </h3>
              <button
                type="button"
                onClick={() => setShowAddUrlModal(false)}
                className="w-7 h-7 rounded-full border border-[#D5C7B0] flex items-center justify-center text-[#1E1E22] hover:bg-[#F2ECE1] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                  IMAGE URL (HTTPS, Unsplash, ImgBB, CDN) *
                </label>
                <input
                  type="text"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/... or https://i.ibb.co/..."
                  className="w-full px-3 py-2.5 bg-white border border-[#D5C7B0] rounded-xl text-xs text-[#1E1E22] focus:border-[#B89758] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                    ASSET TITLE / LABEL
                  </label>
                  <input
                    type="text"
                    value={urlName}
                    onChange={(e) => setUrlName(e.target.value)}
                    placeholder="e.g. Silk Shirt Shoot"
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded-lg text-xs focus:border-[#B89758] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A4033] mb-1">
                    ASSIGN CATEGORY
                  </label>
                  <select
                    value={urlCategory}
                    onChange={(e) => setUrlCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D5C7B0] rounded-lg text-xs focus:border-[#B89758] focus:outline-none cursor-pointer"
                  >
                    <option value="Products">Products</option>
                    <option value="Banners">Banners</option>
                    <option value="Categories">Categories</option>
                    <option value="Uploads">Uploads</option>
                  </select>
                </div>
              </div>

              {urlInput.trim() && (
                <div className="p-3 bg-white rounded-xl border border-[#D5C7B0]">
                  <span className="text-[10px] font-bold text-[#7A6C58] uppercase block mb-1.5">
                    Live Preview:
                  </span>
                  <div className="relative aspect-[16/9] max-h-48 rounded-lg overflow-hidden bg-[#FAF8F5] border border-gray-200">
                    <img
                      src={normalizeImageUrl(urlInput)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/category_mens_fashion_1791290148102.jpg';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E8DEC8]">
                <button
                  type="button"
                  onClick={() => setShowAddUrlModal(false)}
                  className="px-4 py-2 border border-[#D5C7B0] text-xs font-semibold uppercase rounded-lg hover:bg-[#F2ECE1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingUrl}
                  className="px-5 py-2 bg-[#B89758] hover:bg-[#A58448] text-white text-xs font-bold uppercase rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingUrl ? 'Saving...' : 'Save to Cloud Media'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E8DEC8]">
        {['All', 'Products', 'Banners', 'Categories', 'Uploads'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#1E1E22] text-[#D4AF37]'
                : 'bg-white text-[#7A6C58] hover:text-[#1E1E22] border border-[#E0D5C3]'
            }`}
          >
            {cat} ({cat === 'All' ? mediaAssets.length : mediaAssets.filter((a) => a.category === cat).length})
          </button>
        ))}
      </div>

      {/* Drag & Drop Visual Area */}
      <div className="bg-[#FAF8F5] border-2 border-dashed border-[#D5C2A5] rounded-2xl p-7 text-center hover:bg-[#F5EFE4] transition-colors relative">
        <HardDrive className="w-10 h-10 text-[#B89758] mx-auto mb-2" />
        <h3 className="font-display text-xs font-bold text-[#1E1E22] uppercase tracking-wider">
          DRAG & DROP PNG, JPG, OR WEBP FILES HERE
        </h3>
        <p className="text-[11px] text-[#7A6C58] mt-1 max-w-sm mx-auto">
          High-resolution product shoots, lookbook banners, and category hero covers automatically compressed and synced to Firestore.
        </p>
        <div className="mt-3.5 flex items-center justify-center gap-3">
          <label className="inline-block px-4 py-1.5 bg-white border border-[#C5B39E] text-[#1E1E22] text-xs font-semibold rounded-lg cursor-pointer hover:bg-[#FAF8F5] shadow-xs">
            Browse Device Files
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFiles}
              className="sr-only"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowAddUrlModal(true)}
            className="inline-block px-4 py-1.5 bg-[#FAF6EE] border border-[#B89758] text-[#8C6D1F] text-xs font-bold rounded-lg cursor-pointer hover:bg-[#F2ECE1]"
          >
            + Paste Web URL
          </button>
        </div>
      </div>

      {/* Media Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E0D5C3] p-12 text-center text-xs text-[#7A6C58]">
          <ImageIcon className="w-8 h-8 text-[#B89758]/50 mx-auto mb-2" />
          <p className="font-bold text-sm text-[#1E1E22]">No media assets found in this category.</p>
          <p className="mt-1">Upload a photo from your computer or paste an external image URL above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => {
            const isCopied = copiedId === asset.id;
            const sizeKb = Math.round(asset.size / 1024);

            return (
              <div
                key={asset.id}
                className="bg-white rounded-xl border border-[#E0D5C3] overflow-hidden flex flex-col justify-between group shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square bg-[#F7F4EE] overflow-hidden">
                  <img
                    src={normalizeImageUrl(asset.dataUrl)}
                    alt={asset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/category_mens_fashion_1791290148102.jpg';
                    }}
                  />
                  <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-xs uppercase">
                    {asset.category || 'Asset'}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-xs">
                    {sizeKb > 0 ? `${sizeKb} KB` : 'Cloud'}
                  </span>
                </div>

                <div className="p-3 bg-[#FAF8F5] border-t border-[#EFE8DC]">
                  <p className="font-bold text-xs text-[#1E1E22] truncate" title={asset.name}>
                    {asset.name}
                  </p>
                  <p className="text-[10px] text-[#7A6C58] mt-0.5">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-1 pt-2 border-t border-[#E8DFC8]">
                    <button
                      type="button"
                      onClick={() => copyUrl(asset)}
                      className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-[#D5C7B0] hover:bg-[#F2ECE1] text-[#1E1E22]'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#B89758]" /> Copy URL
                        </>
                      )}
                    </button>

                    {deleteConfirmId === asset.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            deleteMediaAsset(asset.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700 cursor-pointer"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 text-gray-500 hover:text-gray-700 text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(asset.id)}
                        className="p-1 text-[#A39280] hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete Asset"
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
