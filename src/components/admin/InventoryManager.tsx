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
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const InventoryManager: React.FC = () => {
  const { products, updateStock, updateProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const lowStockCount = products.filter((p) => p.stockCount <= 5).length;

  const handleRestockAllLow = () => {
    products.forEach((p) => {
      if (p.stockCount <= 5) {
        updateStock(p.id, 25);
      }
    });
    alert('Restocked all low-stock items to 25 units!');
  };

  return (
    <div className="space-y-6">
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
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg border border-[#E0D5C3] bg-[#F2EDE2]"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-[#1E1E22] truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <span className="text-[10px] text-[#8C7D6B]">
                            Sizes: {product.sizes.join(', ')}
                          </span>
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
    </div>
  );
};
