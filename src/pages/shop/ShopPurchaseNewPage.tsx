import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  ShoppingCart,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useShopAuth } from '../../context/ShopAuthContext';
import { ShopLayout } from '../../components/shop/layout/ShopLayout';
import { purchaseService } from '../../services/purchaseService';
import { inventoryService } from '../../services/inventoryService';
import { Supplier } from '../../types/supplier';
import { Medicine } from '../../types/inventory';
import { PurchaseOrderStatus } from '../../types/purchase';

interface OrderLineItemState {
  medicineId: string;
  orderedQuantity: number;
  unitCost: number;
  discountPercent: number;
}

export const ShopPurchaseNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedSupplierId = searchParams.get('supplierId') || '';
  const preSelectedMedicineId = searchParams.get('medicineId') || '';

  const { activePharmacy, user } = useShopAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [supplierId, setSupplierId] = useState(preSelectedSupplierId);
  const [status, setStatus] = useState<PurchaseOrderStatus>('ordered');
  const [supplierInvoiceNumber, setSupplierInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<OrderLineItemState[]>([
    {
      medicineId: preSelectedMedicineId || '',
      orderedQuantity: 10,
      unitCost: 100,
      discountPercent: 0,
    },
  ]);

  useEffect(() => {
    if (!activePharmacy) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [sups, meds] = await Promise.all([
          purchaseService.getSuppliers(activePharmacy.id),
          inventoryService.getMedicines(activePharmacy.id),
        ]);
        setSuppliers(sups);
        setMedicines(meds);

        if (sups.length > 0 && !supplierId) {
          setSupplierId(preSelectedSupplierId || sups[0].id);
        }

        if (meds.length > 0 && (!items[0] || !items[0].medicineId)) {
          setItems([
            {
              medicineId: preSelectedMedicineId || meds[0].id,
              orderedQuantity: 20,
              unitCost: 100,
              discountPercent: 0,
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load PO creation dependencies', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activePharmacy]);

  const handleAddItem = () => {
    if (medicines.length === 0) return;
    setItems([
      ...items,
      {
        medicineId: medicines[0].id,
        orderedQuantity: 10,
        unitCost: 100,
        discountPercent: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof OrderLineItemState, val: string | number) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    setItems(updated);
  };

  // Calculations
  const grossTotal = items.reduce((sum, item) => sum + item.orderedQuantity * item.unitCost, 0);
  const discountTotal = items.reduce(
    (sum, item) => sum + Math.round((item.orderedQuantity * item.unitCost * item.discountPercent) / 100),
    0
  );
  const netPayable = grossTotal - discountTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePharmacy) return;

    if (!supplierId) {
      setError('Please select a supplier distributor.');
      return;
    }

    if (items.length === 0) {
      setError('Please add at least one medicine item to the purchase order.');
      return;
    }

    for (const item of items) {
      if (!item.medicineId) {
        setError('Please select a medicine for every line item.');
        return;
      }
      if (item.orderedQuantity <= 0) {
        setError('Ordered quantity must be at least 1 unit.');
        return;
      }
      if (item.unitCost < 0) {
        setError('Unit cost cannot be negative.');
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      const createdPO = await purchaseService.createPurchaseOrder(
        activePharmacy.id,
        {
          supplierId,
          status,
          supplierInvoiceNumber: supplierInvoiceNumber.trim() || undefined,
          notes: notes.trim() || undefined,
          items: items.map((i) => ({
            medicineId: i.medicineId,
            orderedQuantity: Number(i.orderedQuantity),
            unitCost: Number(i.unitCost),
            discountPercent: Number(i.discountPercent) || 0,
          })),
        },
        user?.fullName
      );

      navigate(`/shop/purchases/${createdPO.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create purchase order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ShopLayout title="Create Purchase Order">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back link */}
        <Link
          to="/shop/purchases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Purchase Orders</span>
        </Link>

        {/* Business Rule Notice */}
        <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Inventory Isolation Policy</p>
            <p className="text-blue-800/90 text-[11px] mt-0.5">
              Creating a purchase order reserves vendor commitment but does <strong>NOT</strong> increase medicine stock.
              Batch quantities and stock ledger entries will only update when goods are verified and received via Goods Receiving (GRN).
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  New Supplier Purchase Order
                </h2>
                <p className="text-xs text-slate-500">
                  Specify supplier, medicine line items, unit costs, and trade discount percentages.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading catalog...</div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Supplier & Header Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Supplier Distributor *
                  </label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Order Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PurchaseOrderStatus)}
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ordered">Ordered (Ready for dispatch)</option>
                    <option value="draft">Draft (Save internally)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Supplier Quotation / Inv #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. QT-9981"
                    value={supplierInvoiceNumber}
                    onChange={(e) => setSupplierInvoiceNumber(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Order Items Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Ordered Medicine Line Items ({items.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                        <th className="py-2.5 px-3">Medicine Item</th>
                        <th className="py-2.5 px-3 w-28">Ordered Qty</th>
                        <th className="py-2.5 px-3 w-32">Unit Cost (PKR)</th>
                        <th className="py-2.5 px-3 w-24">Disc %</th>
                        <th className="py-2.5 px-3 w-32 text-right">Line Total</th>
                        <th className="py-2.5 px-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, idx) => {
                        const gross = item.orderedQuantity * item.unitCost;
                        const lineNet = gross - Math.round((gross * item.discountPercent) / 100);

                        return (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3">
                              <select
                                value={item.medicineId}
                                onChange={(e) => handleItemChange(idx, 'medicineId', e.target.value)}
                                className="w-full text-xs py-1.5 px-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
                              >
                                {medicines.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.name} ({m.dosageForm}) - Stock: {m.totalAvailableStock || 0}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="py-2.5 px-3">
                              <input
                                type="number"
                                min="1"
                                required
                                value={item.orderedQuantity}
                                onChange={(e) =>
                                  handleItemChange(idx, 'orderedQuantity', Math.max(1, parseInt(e.target.value) || 0))
                                }
                                className="w-full text-xs py-1.5 px-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-emerald-500"
                              />
                            </td>

                            <td className="py-2.5 px-3">
                              <input
                                type="number"
                                min="0"
                                required
                                value={item.unitCost}
                                onChange={(e) =>
                                  handleItemChange(idx, 'unitCost', Math.max(0, parseFloat(e.target.value) || 0))
                                }
                                className="w-full text-xs py-1.5 px-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-emerald-500"
                              />
                            </td>

                            <td className="py-2.5 px-3">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.discountPercent}
                                onChange={(e) =>
                                  handleItemChange(idx, 'discountPercent', Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))
                                }
                                className="w-full text-xs py-1.5 px-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-emerald-500"
                              />
                            </td>

                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-right">
                              PKR {lineNet.toLocaleString()}
                            </td>

                            <td className="py-2.5 px-2 text-center">
                              {items.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(idx)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes & Summary Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Order Instructions / Terms
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Please deliver before Friday afternoon. Requires cold-chain handling for biologics."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Calculation Box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Gross Amount:</span>
                    <span className="font-mono">PKR {grossTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Discount Deduction:</span>
                    <span className="font-mono text-emerald-700">- PKR {discountTotal.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                    <span>Net Order Value:</span>
                    <span className="font-mono text-emerald-800">PKR {netPayable.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Submit Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link
                  to="/shop/purchases"
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Generating PO...' : 'Dispatch Purchase Order'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ShopLayout>
  );
};
