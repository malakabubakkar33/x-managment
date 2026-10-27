import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Boxes,
  Search,
  ArrowUpDown,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useShopAuth } from '../../context/ShopAuthContext';
import { ShopLayout } from '../../components/shop/layout/ShopLayout';
import { inventoryService } from '../../services/inventoryService';
import { MedicineBatch, StockAdjustmentPayload } from '../../types/inventory';

export const ShopBatchesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMedId = searchParams.get('medicineId') || '';

  const { activePharmacy } = useShopAuth();
  const [batches, setBatches] = useState<MedicineBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Stock Adjustment Modal
  const [adjustingBatch, setAdjustingBatch] = useState<MedicineBatch | null>(null);
  const [adjType, setAdjType] = useState<'increase' | 'decrease'>('decrease');
  const [adjQty, setAdjQty] = useState<number>(1);
  const [adjReason, setAdjReason] = useState<StockAdjustmentPayload['reason']>('physical_count_correction');
  const [adjNotes, setAdjNotes] = useState('');
  const [adjError, setAdjError] = useState<string | null>(null);
  const [adjSaving, setAdjSaving] = useState(false);
  const [adjSuccess, setAdjSuccess] = useState<string | null>(null);

  const loadBatches = async () => {
    if (!activePharmacy) return;
    setLoading(true);
    try {
      const bts = await inventoryService.getBatches(
        activePharmacy.id,
        initialMedId || undefined
      );
      setBatches(bts);
    } catch (err) {
      console.error('Failed to load batches', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, [activePharmacy, initialMedId]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePharmacy || !adjustingBatch) return;

    if (adjQty <= 0) {
      setAdjError('Please enter a valid quantity greater than 0.');
      return;
    }

    if (adjType === 'decrease' && adjQty > adjustingBatch.availableQuantity) {
      setAdjError(
        `Cannot deduct ${adjQty} units. Maximum available stock in this batch is ${adjustingBatch.availableQuantity}.`
      );
      return;
    }

    setAdjSaving(true);
    setAdjError(null);

    try {
      await inventoryService.adjustStock(activePharmacy.id, {
        medicineId: adjustingBatch.medicineId,
        batchId: adjustingBatch.id,
        adjustmentType: adjType,
        quantityDelta: adjQty,
        reason: adjReason,
        notes: adjNotes.trim() || undefined,
      });

      setAdjSuccess(
        `Batch ${adjustingBatch.batchNumber} stock adjusted successfully! Movement logged to ledger.`
      );
      setTimeout(() => {
        setAdjustingBatch(null);
        setAdjSuccess(null);
        setAdjNotes('');
        setAdjQty(1);
        loadBatches();
      }, 1200);
    } catch (err: unknown) {
      setAdjError(err instanceof Error ? err.message : 'Adjustment failed');
    } finally {
      setAdjSaving(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredBatches = batches.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.batchNumber.toLowerCase().includes(q) ||
      (b.medicineName && b.medicineName.toLowerCase().includes(q))
    );
  });

  return (
    <ShopLayout title="FEFO Medicine Batches">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              FEFO Batch Inventory ({filteredBatches.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              First-Expire, First-Out batch management with batch tracking, expiration monitoring, and audited adjustments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/shop/movements"
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Stock Movements Ledger</span>
            </Link>
            <Link
              to="/shop/goods-receiving"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>+ Receive New Batch</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by batch number or medicine name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {initialMedId && (
            <Link
              to="/shop/batches"
              className="text-xs font-medium text-emerald-600 hover:underline"
            >
              Clear medicine filter &times;
            </Link>
          )}
        </div>

        {/* FEFO Batches Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Medicine Item</th>
                  <th className="py-3 px-4">Batch Number</th>
                  <th className="py-3 px-4">Expiry Date (FEFO)</th>
                  <th className="py-3 px-4">Cost Price</th>
                  <th className="py-3 px-4">Selling MRP</th>
                  <th className="py-3 px-4">Available Qty</th>
                  <th className="py-3 px-4 text-right">Stock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <span>Loading batch records...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredBatches.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <Boxes className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No batches on record</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Receive a supplier shipment through Goods Receiving (GRN) to populate batch stock.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBatches.map((batch) => {
                    const exp = new Date(batch.expiryDate);
                    const diffDays = Math.ceil(
                      (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const isExpired = diffDays <= 0;
                    const isNear = diffDays > 0 && diffDays <= 90;

                    return (
                      <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">
                            {batch.medicineName || 'Medicine'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            ID: {batch.medicineId}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                          {batch.batchNumber}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium text-slate-800">
                              {batch.expiryDate}
                            </span>
                            {isExpired ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                EXPIRED
                              </span>
                            ) : isNear ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                {diffDays} days left
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Valid
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-700">
                          PKR {batch.purchasePrice}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          PKR {batch.sellingPrice}
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold">
                          <span
                            className={
                              batch.availableQuantity === 0
                                ? 'text-rose-500'
                                : batch.availableQuantity < 10
                                ? 'text-amber-600'
                                : 'text-emerald-700'
                            }
                          >
                            {batch.availableQuantity} units
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setAdjustingBatch(batch);
                              setAdjQty(1);
                              setAdjError(null);
                              setAdjSuccess(null);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          >
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                            <span>Adjust Stock</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Adjustment Modal */}
        {adjustingBatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Adjust Stock for Batch {adjustingBatch.batchNumber}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {adjustingBatch.medicineName} &bull; Current:{' '}
                    <span className="font-bold text-slate-800">
                      {adjustingBatch.availableQuantity} units
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setAdjustingBatch(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {adjSuccess ? (
                <div className="p-8 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-emerald-800">{adjSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleAdjustSubmit} className="p-5 space-y-4">
                  {adjError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                      <span>{adjError}</span>
                    </div>
                  )}

                  {/* Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Adjustment Action
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAdjType('decrease')}
                        className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all ${
                          adjType === 'decrease'
                            ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        - Deduct / Write-Off
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdjType('increase')}
                        className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all ${
                          adjType === 'increase'
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        + Add Stock
                      </button>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Quantity to {adjType === 'increase' ? 'Add' : 'Deduct'} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={adjQty}
                      onChange={(e) => setAdjQty(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Clinical & Operational Reason *
                    </label>
                    <select
                      value={adjReason}
                      onChange={(e) =>
                        setAdjReason(e.target.value as StockAdjustmentPayload['reason'])
                      }
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="physical_count_correction">
                        Physical Stock Count Reconciliation
                      </option>
                      <option value="damaged_stock">Damaged / Broken Packaging</option>
                      <option value="expired_stock">Expired Medication Disposal</option>
                      <option value="data_entry_correction">Data Entry Correction</option>
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Audit Justification Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Broken vial during monthly stock count verified by pharmacist."
                      value={adjNotes}
                      onChange={(e) => setAdjNotes(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAdjustingBatch(null)}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={adjSaving}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                    >
                      {adjSaving ? 'Logging Movement...' : 'Confirm Stock Adjustment'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </ShopLayout>
  );
};
