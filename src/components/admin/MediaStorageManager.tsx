import React, { useState } from 'react';
import {
  Cloud,
  Upload,
  Image,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  HardDrive,
  FileCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MediaAsset } from '../../types';

export const MediaStorageManager: React.FC = () => {
  const { mediaAssets, uploadMediaAsset, deleteMediaAsset } = useStore();
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMsg(null);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadMediaAsset(files[i], 'Uploads');
      }
    } catch (err: unknown) {
      setErrorMsg('Error uploading media asset: ' + (err instanceof Error ? err.message : String(err)));
      setTimeout(() => setErrorMsg(null), 4000);
    } finally {
      setIsUploading(false);
    }
  };

  const copyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.dataUrl);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const filteredAssets = mediaAssets.filter((a) => {
    if (selectedCategory === 'All') return true;
    return a.category === selectedCategory;
  });

  const totalBytes = mediaAssets.reduce((sum, a) => sum + (a.size || 250000), 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Top Bar with Unlimited Storage Info */}
      <div className="bg-white p-5 rounded-xl border border-[#E0D5C3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-[#B89758]" />
            <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22]">
              UNLIMITED CLOUD & MEDIA STORAGE
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Unlimited Quota
            </span>
          </div>
          <p className="text-xs text-[#7A6C58] mt-1">
            Store high-resolution PNG & JPG fashion images, banners, and product shoots with persistent local cloud caching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-[#7A6C58]">Stored Assets:</span>
            <p className="text-xs font-bold text-[#1E1E22] tabular-nums">
              {mediaAssets.length} Files ({totalMB} MB)
            </p>
          </div>

          <label className="px-4 py-2.5 bg-[#B89758] hover:bg-[#A58448] text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload PNG / JPG'}</span>
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

      {/* Drag & Drop Visual Area */}
      <div className="bg-[#FAF8F5] border-2 border-dashed border-[#D5C2A5] rounded-2xl p-8 text-center hover:bg-[#F5EFE4] transition-colors relative">
        <HardDrive className="w-12 h-12 text-[#B89758] mx-auto mb-3" />
        <h3 className="font-display text-sm font-bold text-[#1E1E22] uppercase tracking-wider">
          DROP PNG OR JPG FILES HERE
        </h3>
        <p className="text-xs text-[#7A6C58] mt-1 max-w-sm mx-auto">
          High-definition jewelry photos, denim jeans, linen shirts, leather bags or campaign hero banners.
        </p>
        <label className="mt-4 inline-block px-4 py-2 bg-white border border-[#C5B39E] text-[#1E1E22] text-xs font-semibold rounded cursor-pointer hover:bg-[#FAF8F5] shadow-xs">
          Browse Computer Files
          <input
            type="file"
            multiple
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFiles}
            className="sr-only"
          />
        </label>
      </div>

      {/* Media Assets Gallery */}
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
                  src={asset.dataUrl}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-xs uppercase">
                  {asset.type.split('/')[1] || 'IMG'}
                </span>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-xs">
                  {sizeKb > 0 ? `${sizeKb} KB` : 'Cached'}
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
                    onClick={() => copyUrl(asset)}
                    className={`flex-1 py-1 px-2 rounded text-[10px] font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer ${
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
                        onClick={() => {
                          deleteMediaAsset(asset.id);
                          setDeleteConfirmId(null);
                        }}
                        className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold hover:bg-red-700 cursor-pointer"
                      >
                        Yes, Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-1.5 py-0.5 text-gray-400 hover:text-gray-200 text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
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
    </div>
  );
};
