import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  Search,
  RefreshCw,
  Edit2,
  Save,
  Image as ImageIcon,
  X,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import {
  normalizeImageUrl,
  FALLBACK_CATEGORY_IMAGES,
  FALLBACK_LUXURY_IMAGE,
} from '../../utils/imageUtils';

export const InventoryManager: React.FC = () => {
  const { products, updateStock, updateProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [tempImagePath, setTempImagePath] = useState<string>('');

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = products.filter((p) => p.stockCount <= 5).length;

  const [restockToast, setRestockToast] = useState<string | null>(null);

  const handleSaveImageLink = (productId: string) => {
    let clean = tempImagePath.trim();
    if (!clean) return;

    // Ensure leading "/" for local PNG / JPG paths
    if (
      !clean.startsWith('http://') &&
      !clean.startsWith('https://') &&
      !clean.startsWith('data:') &&
      !clean.startsWith('blob:') &&
      !clean.startsWith('/')
    ) {
      clean = '/' + clean;
    }

    updateProduct(productId, { image: clean });
    setRestockToast(`✓ Updated image link to: ${clean}`);
    setTimeout(() => setRestockToast(null), 3500);
    setEditingImageId(null);
  };

  const handleAddSlash = () => {
    if (!tempImagePath.startsWith('/') && !tempImagePath.startsWith('http')) {
      setTempImagePath('/' + tempImagePath);
    }
  };

  const handleRestockAllLow = () => {
    products.forEach((p) => {
      if (p.stockCount <= 5) {
        updateStock(p.id, 25);
      }
    });
    setRestockToast('Restocked all low-stock items to 25 units!');
    setTimeout(() => setRestockToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {restockToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-bold animate-in fade-in">
          ✓ {restockToast}
        </div>
      )}

      {/* Top Banner & Low stock warning */}
      <div className="bg-white p-4 rounded-xl border border-[#E0D5C3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold tracking-wider uppercase text-[#1E1E22] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#B89758]" />
            INVENTORY & STOCK CONTROL
          </h2>
          <p className="text-xs text-[#7A6C58]">
            Manage stock counts, trigger reorders, and adjust pricing instantly.
          </p>
        </div>

        {lowStockCount > 0 && (
          <button
            onClick={handleRestockAllLow}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold tracking-wider uppercase rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restock {lowStockCount} Low Items (+25)</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C7D6B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inventory by product name or category..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#D5C7B0] rounded-lg text-xs focus:outline-none focus:border-[#B89758]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-[#D5C7B0] rounded-lg text-xs focus:outline-none focus:border-[#B89758] font-medium"
        >
          <option value="All">All Categories</option>
          <option value="Men">Men's Shirts & Tops</option>
          <option value="Jeans">Jeans & Denim</option>
          <option value="Watches">Watches</option>
          <option value="Bags">Handbags</option>
          <option value="Shoes">Footwear</option>
          <option value="Accessories">Accessories</option>
          <option value="Perfumes">Perfumes</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-[#E0D5C3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-b border-[#E8DFC8] text-[#5A4F41] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8DC]">
              {filtered.map((product) => {
                const isLow = product.stockCount <= 5 && product.stockCount > 0;
                const isOutOfStock = product.stockCount <= 0;
                const isEditingPrice = editingPriceId === product.id;

                return (
                  <tr key={product.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    {/* Product Name & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative group shrink-0">
                          <img
                            src={normalizeImageUrl(product.image, product.category)}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg border border-[#E0D5C3] bg-[#F2EDE2]"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const fb = FALLBACK_CATEGORY_IMAGES[product.category] || FALLBACK_LUXURY_IMAGE;
                              if (target.src !== fb) target.src = fb;
                            }}
                          />
                          <button
                            onClick={() => {
                              setEditingImageId(product.id);
                              setTempImagePath(product.image);
                            }}
                            className="absolute inset-0 bg-black/60 text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity"
                            title="Edit image link"
                          >
                            Edit /
                          </button>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#1E1E22] truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-[#8C7D6B]">
                              Sizes: {product.sizes.join(', ')}
                            </span>
                          </div>
                          {/* Image Path Status with leading / indicator */}
                          <div className="mt-1 flex items-center gap-1">
                            <code className="text-[9.5px] bg-[#F4EFE6] px-1.5 py-0.5 rounded text-[#5A4E3F] font-mono truncate max-w-[170px]" title={product.image}>
                              {product.image.startsWith('/') ? product.image : `/${product.image}`}
                            </code>
                            <button
                              onClick={() => {
                                setEditingImageId(product.id);
                                setTempImagePath(product.image);
                              }}
                              className="text-[10px] text-[#B89758] hover:underline font-semibold"
                            >
                              Edit Link
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#5A4F41]">
                      {product.category}
                    </td>

                    {/* Price with Inline Edit */}
                    <td className="py-3 px-4">
                      {isEditingPrice ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-[#B89758] rounded text-xs"
                          />
                          <button
                            onClick={() => {
                              updateProduct(product.id, { price: tempPrice });
                              setEditingPriceId(null);
                            }}
                            className="p-1 bg-[#1E1E22] text-white rounded hover:bg-[#B89758]"
                          >
                            <Save className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1E1E22] tabular-nums">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => {
                              setEditingPriceId(product.id);
                              setTempPrice(product.price);
                            }}
                            className="text-[#998A77] hover:text-[#1E1E22] p-1"
                            title="Edit Price"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Stock Level */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-sm tabular-nums text-[#1E1E22]">
                        {product.stockCount} units
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-100 text-red-800">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3" /> Low Stock ({product.stockCount})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" /> In Stock
                        </span>
                      )}
                    </td>

                    {/* Stock Adjuster Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1 border border-[#D5C7B0] rounded-lg p-0.5 bg-white">
                        <button
                          onClick={() => updateStock(product.id, product.stockCount - 1)}
                          className="p-1 hover:bg-[#F2EDE2] rounded text-[#4A4033]"
                          title="Decrease 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <input
                          type="number"
                          value={product.stockCount}
                          onChange={(e) => updateStock(product.id, Number(e.target.value))}
                          className="w-12 text-center text-xs font-bold border-0 focus:outline-none tabular-nums"
                        />

                        <button
                          onClick={() => updateStock(product.id, product.stockCount + 1)}
                          className="p-1 hover:bg-[#F2EDE2] rounded text-[#4A4033]"
                          title="Increase 1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => updateStock(product.id, product.stockCount + 10)}
                          className="px-1.5 py-0.5 text-[10px] font-bold bg-[#FAF6EE] hover:bg-[#EFE8DD] text-[#7A6C58] rounded ml-1"
                          title="Quick Restock +10"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Image Link Editor Modal */}
      {editingImageId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#D5C7B0] space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E1E22] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#B89758]" />
                <span>Edit Product Image Link (PNG / JPG)</span>
              </h3>
              <button
                onClick={() => setEditingImageId(null)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#7A6C58]">
                Enter relative or local image path. Ensure path starts with <code className="bg-[#FAF6EE] text-[#B8860B] font-bold px-1 rounded">/</code> for 100% Vercel production deployment support.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-[#4A4033] uppercase mb-1">
                  Image URL / Local File Path:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempImagePath}
                    onChange={(e) => setTempImagePath(e.target.value)}
                    placeholder="e.g. /images/cat_bag_cream.jpg or /cat_watch.png"
                    className="flex-1 px-3 py-2 border border-[#D5C7B0] rounded-lg text-xs font-mono focus:outline-none focus:border-[#B89758]"
                  />
                  {!tempImagePath.startsWith('/') && !tempImagePath.startsWith('http') && (
                    <button
                      type="button"
                      onClick={handleAddSlash}
                      className="px-2.5 py-2 bg-[#FAF6EE] hover:bg-[#F2ECE1] border border-[#B89758] text-[#8C6D1F] text-xs font-bold rounded-lg cursor-pointer whitespace-nowrap"
                      title="Add leading /"
                    >
                      + Add /
                    </button>
                  )}
                </div>
              </div>

              {/* Live Preview */}
              {tempImagePath && (
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DFC8] flex items-center gap-3">
                  <img
                    src={normalizeImageUrl(tempImagePath)}
                    alt="Preview"
                    className="w-14 h-14 object-cover rounded-lg border border-[#D5C7B0] bg-white shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_LUXURY_IMAGE;
                    }}
                  />
                  <div className="text-xs space-y-1 min-w-0">
                    <p className="font-bold text-[#1E1E22]">Live Preview</p>
                    <p className="text-[10px] text-[#7A6C58] truncate">
                      Formatted path: <code className="font-mono text-[#B8860B]">{tempImagePath.startsWith('/') ? tempImagePath : `/${tempImagePath}`}</code>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8DFC8]">
              <button
                type="button"
                onClick={() => setEditingImageId(null)}
                className="px-3.5 py-1.5 text-xs text-gray-600 hover:text-black cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveImageLink(editingImageId)}
                className="px-4 py-2 bg-[#1E1E22] hover:bg-[#34343A] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm cursor-pointer"
              >
                Save Image Path
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
