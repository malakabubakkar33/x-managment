import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  Boxes,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { useShopAuth } from '../../context/ShopAuthContext';
import { ShopLayout } from '../../components/shop/layout/ShopLayout';
import { inventoryService } from '../../services/inventoryService';
import { Medicine, MedicineCategory } from '../../types/inventory';

export const ShopInventoryPage: React.FC = () => {
  const { activePharmacy } = useShopAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<MedicineCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'normal'>('all');

  const loadData = async () => {
    if (!activePharmacy) return;
    setLoading(true);
    try {
      const [cats, meds] = await Promise.all([
        inventoryService.getCategories(activePharmacy.id),
        inventoryService.getMedicines(activePharmacy.id, {
          search,
          categoryId: selectedCategory,
          stockStatus: stockFilter,
        }),
      ]);
      setCategories(cats);
      setMedicines(meds);
    } catch (err) {
      console.error('Failed to load medicine catalog', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activePharmacy, selectedCategory, stockFilter]);

  // Client search debounce / filter
  const filteredMedicines = useMemo(() => {
    if (!search.trim()) return medicines;
    const q = search.toLowerCase();
    return medicines.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.genericName?.toLowerCase().includes(q) ||
        m.barcode?.includes(q) ||
        m.manufacturer?.toLowerCase().includes(q)
    );
  }, [medicines, search]);

  return (
    <ShopLayout title="Medicine Catalog">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Dispensary Medicines ({filteredMedicines.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage pharmaceutical items, reorder thresholds, and active SKU catalog.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/shop/batches"
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Boxes className="w-4 h-4 text-slate-500" />
              <span>FEFO Batches</span>
            </Link>
            <Link
              to="/shop/inventory/new"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medicine</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by brand name, generic formula, barcode, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Stock Level Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as 'all' | 'low' | 'out' | 'normal')}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Stock Levels</option>
              <option value="normal">In Stock (Healthy)</option>
              <option value="low">Low Stock Warning</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Catalog Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Medicine & Form</th>
                  <th className="py-3 px-4">Generic & Manufacturer</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Available Stock</th>
                  <th className="py-3 px-4">Reorder Level</th>
                  <th className="py-3 px-4">Nearest Expiry</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <span>Loading medicine catalog...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <Pill className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No medicines found</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Try adjusting your filters or click "Add Medicine" to catalog your first SKU.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredMedicines.map((med) => {
                    const stock = med.totalAvailableStock || 0;
                    const isLow = stock > 0 && stock <= med.reorderLevel;
                    const isOut = stock === 0;

                    return (
                      <tr key={med.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{med.name}</div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                            <span className="capitalize px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-[10px] font-medium">
                              {med.dosageForm}
                            </span>
                            {med.strength && <span>&bull; {med.strength}</span>}
                            {med.barcode && (
                              <span className="font-mono text-[10px] text-slate-400">
                                #{med.barcode}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-800 font-medium truncate max-w-[200px]">
                            {med.genericName || '—'}
                          </div>
                          <div className="text-slate-400 text-[11px] truncate max-w-[200px]">
                            {med.manufacturer || 'General Supplier'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {med.categoryName || 'General'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-bold font-mono text-sm ${
                                isOut
                                  ? 'text-rose-600'
                                  : isLow
                                  ? 'text-amber-600'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {stock}
                            </span>
                            <span className="text-slate-400 text-[11px]">{med.unitOfMeasure}</span>
                          </div>
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 mt-0.5">
                              <XCircle className="w-3 h-3" /> Out of stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 mt-0.5">
                              <AlertTriangle className="w-3 h-3" /> Low stock alert
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 mt-0.5">
                              <CheckCircle className="w-3 h-3" /> Healthy
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {med.reorderLevel} {med.unitOfMeasure}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          {med.nearestExpiry ? (
                            <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {med.nearestExpiry}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">No batches</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <Link
                            to={`/shop/batches?medicineId=${med.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                          >
                            <Boxes className="w-3 h-3 text-slate-500" />
                            Batches
                          </Link>
                          <Link
                            to={`/shop/inventory/edit/${med.id}`}
                            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            <Edit className="w-3 h-3" />
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};
