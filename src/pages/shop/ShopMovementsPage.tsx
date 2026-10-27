import React, { useState, useEffect } from 'react';
import { History, Search, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useShopAuth } from '../../context/ShopAuthContext';
import { ShopLayout } from '../../components/shop/layout/ShopLayout';
import { inventoryService } from '../../services/inventoryService';
import { InventoryMovement, InventoryMovementType } from '../../types/inventory';

export const ShopMovementsPage: React.FC = () => {
  const { activePharmacy } = useShopAuth();
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');

  const loadMovements = async () => {
    if (!activePharmacy) return;
    setLoading(true);
    try {
      const data = await inventoryService.getMovements(activePharmacy.id, 100);
      setMovements(data);
    } catch (err) {
      console.error('Failed to load inventory movements', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, [activePharmacy]);

  const filteredMovements = movements.filter((m) => {
    if (filterType !== 'all' && m.movementType !== filterType) {
      return false;
    }
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (m.medicineName && m.medicineName.toLowerCase().includes(q)) ||
      (m.batchNumber && m.batchNumber.toLowerCase().includes(q)) ||
      m.reason.toLowerCase().includes(q)
    );
  });

  const getMovementBadge = (type: InventoryMovementType) => {
    switch (type) {
      case 'purchase_receipt':
      case 'stock_received':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'stock_adjustment_in':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'damaged_stock':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'expired_stock':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'stock_adjustment_out':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pos_sale':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <ShopLayout title="Stock Movement Ledger">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Immutable Stock Movements ({filteredMovements.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Append-only audit trail tracking every GRN receipt, batch adjustment, damage write-off, and dispenser balance change.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by medicine, batch number, or audit reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Movement Types</option>
              <option value="purchase_receipt">Purchase Receipt (GRN)</option>
              <option value="stock_adjustment_in">Manual Inflow (+)</option>
              <option value="stock_adjustment_out">Manual Outflow (-)</option>
              <option value="damaged_stock">Damaged Write-Off</option>
              <option value="expired_stock">Expired Disposal</option>
              <option value="pos_sale">POS Dispense</option>
            </select>
          </div>
        </div>

        {/* Movements Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Medicine Item</th>
                  <th className="py-3 px-4">Batch Number</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-4">Quantity Change</th>
                  <th className="py-3 px-4">Balance (Before &rarr; After)</th>
                  <th className="py-3 px-4">Audit Reference / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <span>Loading movement ledger...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No stock movements found</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Movements are created automatically when goods are received or stock is adjusted.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map((mov) => {
                    const isPositive = mov.quantityDelta > 0;

                    return (
                      <tr key={mov.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {new Date(mov.createdAt).toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {mov.medicineName || 'Medicine'}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                          {mov.batchNumber || '—'}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getMovementBadge(
                              mov.movementType
                            )}`}
                          >
                            {mov.movementType.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold">
                          <div className="flex items-center gap-1">
                            {isPositive ? (
                              <>
                                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">+{mov.quantityDelta}</span>
                              </>
                            ) : (
                              <>
                                <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                                <span className="text-rose-600">{mov.quantityDelta}</span>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {mov.quantityBefore !== undefined && mov.quantityAfter !== undefined ? (
                            <span>
                              {mov.quantityBefore} &rarr;{' '}
                              <strong className="text-slate-900">{mov.quantityAfter}</strong>
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">
                          {mov.reason}
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
