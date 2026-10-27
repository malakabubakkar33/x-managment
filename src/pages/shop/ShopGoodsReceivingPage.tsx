import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  PackageCheck,
  CheckCircle2,
  AlertCircle,
  Boxes,
  ShoppingCart,
  Info,
} from 'lucide-react';
import { useShopAuth } from '../../context/ShopAuthContext';
import { ShopLayout } from '../../components/shop/layout/ShopLayout';
import { purchaseService } from '../../services/purchaseService';
import { PurchaseOrder, ReceiveItemInput } from '../../types/purchase';

interface ItemReceivingFormState {
  purchaseOrderItemId: string;
  medicineId: string;
  medicineName: string;
  orderedQuantity: number;
  previouslyReceived: number;
  remainingQuantity: number;
  quantityReceiving: number;
  batchNumber: string;
  expiryDate: string;
  actualUnitCost: number;
}

export const ShopGoodsReceivingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preSelectedPoId = searchParams.get('poId') || '';

  const { activePharmacy, user } = useShopAuth();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [selectedPoId, setSelectedPoId] = useState<string>(preSelectedPoId);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [supplierInvoiceNumber, setSupplierInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [receivingItems, setReceivingItems] = useState<ItemReceivingFormState[]>([]);
  const [successResult, setSuccessResult] = useState<{
    grnNumber: string;
    poNumber: string;
    itemsReceived: number;
  } | null>(null);

  // Load active purchase orders
  useEffect(() => {
    if (!activePharmacy) return;

    const loadOrders = async () => {
      setLoading(true);
      try {
        const list = await purchaseService.getPurchaseOrders(activePharmacy.id);
        // Only show orders that have pending items
        const pending = list.filter(
          (p) => p.status === 'ordered' || p.status === 'partially_received'
        );
        setOrders(pending);

        const targetId = preSelectedPoId || (pending.length > 0 ? pending[0].id : '');
        setSelectedPoId(targetId);
      } catch (err) {
        console.error('Failed to load pending POs', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [activePharmacy, preSelectedPoId]);

  // When selected PO changes, construct the line items state
  useEffect(() => {
    if (!selectedPoId) {
      setReceivingItems([]);
      return;
    }

    const currentOrder = orders.find((p) => p.id === selectedPoId);
    if (!currentOrder) {
      setReceivingItems([]);
      return;
    }

    // Default next year expiry
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const defaultExpiry = nextYear.toISOString().slice(0, 10);

    const itemsState: ItemReceivingFormState[] = currentOrder.items
      .filter((item) => item.orderedQuantity > item.receivedQuantity)
      .map((item, idx) => {
        const remaining = item.orderedQuantity - item.receivedQuantity;
        return {
          purchaseOrderItemId: item.id,
          medicineId: item.medicineId,
          medicineName: item.medicineName || 'Medicine',
          orderedQuantity: item.orderedQuantity,
          previouslyReceived: item.receivedQuantity,
          remainingQuantity: remaining,
          quantityReceiving: remaining, // default to receiving the full remaining balance
          batchNumber: `LOT-${new Date().getFullYear()}-${String(idx + 1).padStart(2, '0')}`,
          expiryDate: defaultExpiry,
          actualUnitCost: item.unitCost,
        };
      });

    setReceivingItems(itemsState);
    setSupplierInvoiceNumber(currentOrder.supplierInvoiceNumber || '');
    setSuccessResult(null);
    setError(null);
  }, [selectedPoId, orders]);

  const handleLineChange = (
    index: number,
    field: keyof ItemReceivingFormState,
    value: string | number
  ) => {
    const updated = [...receivingItems];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setReceivingItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePharmacy || !selectedPoId) return;

    // Validate lines
    const payloadItems: ReceiveItemInput[] = [];
    for (const item of receivingItems) {
      if (item.quantityReceiving <= 0) continue; // Skip items receiving 0

      if (item.quantityReceiving > item.remainingQuantity) {
        setError(
          `Quantity ${item.quantityReceiving} for "${item.medicineName}" exceeds remaining order balance (${item.remainingQuantity}).`
        );
        return;
      }

      if (!item.batchNumber.trim()) {
        setError(`Please provide a manufacturer batch/lot number for "${item.medicineName}".`);
        return;
      }

      if (!item.expiryDate) {
        setError(`Please specify an expiry date for "${item.medicineName}".`);
        return;
      }

      payloadItems.push({
        purchaseOrderItemId: item.purchaseOrderItemId,
        medicineId: item.medicineId,
        quantityReceiving: Number(item.quantityReceiving),
        batchNumber: item.batchNumber.trim().toUpperCase(),
        expiryDate: item.expiryDate,
        actualUnitCost: Number(item.actualUnitCost),
      });
    }

    if (payloadItems.length === 0) {
      setError('Please specify at least 1 unit to receive.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { grn, po } = await purchaseService.receiveGoods(
        activePharmacy.id,
        {
          purchaseOrderId: selectedPoId,
          supplierInvoiceNumber: supplierInvoiceNumber.trim() || undefined,
          notes: notes.trim() || undefined,
          receivedItems: payloadItems,
        },
        user?.fullName
      );

      setSuccessResult({
        grnNumber: grn.grnNumber,
        poNumber: po.poNumber,
        itemsReceived: payloadItems.length,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Goods receipt processing failed');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedOrder = orders.find((p) => p.id === selectedPoId);

  return (
    <ShopLayout title="Goods Receiving Note (GRN)">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Goods Receiving & Physical Intake (GRN)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Atomically check-in vendor shipments, register physical lot numbers, record expiry dates, and update inventory movements.
          </p>
        </div>

        {/* Success Banner */}
        {successResult && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-emerald-900 shadow-xs space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-950">
                  Goods Receipt Processed Successfully!
                </h3>
                <p className="text-xs text-emerald-800">
                  Assigned GRN Number: <span className="font-mono font-bold text-slate-900">{successResult.grnNumber}</span> &bull; PO: <span className="font-mono font-bold">{successResult.poNumber}</span>
                </p>
              </div>
            </div>

            <div className="bg-white/80 rounded-xl p-3 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span>
                Medicine stock incremented atomically across <strong>{successResult.itemsReceived} batch(es)</strong>. Movements logged to audit ledger.
              </span>
              <div className="flex items-center gap-2">
                <Link
                  to="/shop/batches"
                  className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                >
                  View FEFO Batches &rarr;
                </Link>
                <Link
                  to="/shop/movements"
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                >
                  View Ledger
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* PO Selector Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Active Purchase Order Awaiting Intake *
          </label>

          {loading ? (
            <div className="text-xs text-slate-400">Loading pending orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
              <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">No pending purchase orders available for receipt</p>
              <p className="text-slate-400 mt-1">
                All existing purchase orders have been fully received or cancelled.
              </p>
              <Link
                to="/shop/purchases/new"
                className="mt-3 inline-block text-xs font-semibold text-emerald-600 hover:underline"
              >
                + Create New Purchase Order
              </Link>
            </div>
          ) : (
            <select
              value={selectedPoId}
              onChange={(e) => setSelectedPoId(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
            >
              {orders.map((po) => (
                <option key={po.id} value={po.id}>
                  {po.poNumber} — {po.supplierName} (Total: PKR {po.netAmount.toLocaleString()}, Status: {po.status.replace(/_/g, ' ')})
                </option>
              ))}
            </select>
          )}

          {selectedOrder && (
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
              <span>Supplier: <strong className="text-slate-800">{selectedOrder.supplierName}</strong></span>
              <span>&bull;</span>
              <span>Pending Lines: <strong className="text-slate-800">{receivingItems.length} items</strong></span>
            </div>
          )}
        </div>

        {/* Goods Receiving Form */}
        {selectedOrder && receivingItems.length > 0 && !successResult && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Delivery Reference Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Vendor Delivery Challan / Invoice #
                </label>
                <input
                  type="text"
                  placeholder="e.g. DC-9841 / INV-GSK-2026"
                  value={supplierInvoiceNumber}
                  onChange={(e) => setSupplierInvoiceNumber(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Receiving Inspector Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delivered via temperature controlled transport. Boxes intact."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Batch Entry Lines Table */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Boxes className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Physical Batch Verification & Intake Lines
                </h3>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
                      <th className="py-2.5 px-3">Medicine Item</th>
                      <th className="py-2.5 px-3 w-28">Remaining</th>
                      <th className="py-2.5 px-3 w-32">Qty Receiving *</th>
                      <th className="py-2.5 px-3 w-36">Batch / Lot # *</th>
                      <th className="py-2.5 px-3 w-36">Expiry Date *</th>
                      <th className="py-2.5 px-3 w-28">Unit Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {receivingItems.map((item, idx) => (
                      <tr key={item.purchaseOrderItemId} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900">{item.medicineName}</div>
                          <div className="text-[10px] text-slate-400">
                            Ordered: {item.orderedQuantity} &bull; Received: {item.previouslyReceived}
                          </div>
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-amber-700">
                          {item.remainingQuantity} units
                        </td>

                        <td className="py-3 px-3">
                          <input
                            type="number"
                            min="0"
                            max={item.remainingQuantity}
                            required
                            value={item.quantityReceiving}
                            onChange={(e) =>
                              handleLineChange(
                                idx,
                                'quantityReceiving',
                                Math.max(0, parseInt(e.target.value) || 0)
                              )
                            }
                            className="w-full text-xs py-1.5 px-2 border border-slate-200 rounded-lg font-mono font-bold text-emerald-700 focus:outline-none focus:border-emerald-500"
                          />
                        </td>

                        <td className="py-3 px-3">
                          <input
                            type="text"
                            required
                            placeholder="e.g. AUG-2026-88"
                            value={item.batchNumber}
                            onChange={(e) => handleLineChange(idx, 'batchNumber', e.target.value)}
                            className="w-full text-xs py-1.5 px-2 border border-slate-200 rounded-lg font-mono uppercase focus:outline-none focus:border-emerald-500"
                          />
                        </td>

                        <td className="py-3 px-3">
                          <input
                            type="date"
                            required
                            value={item.expiryDate}
                            onChange={(e) => handleLineChange(idx, 'expiryDate', e.target.value)}
                            className="w-full text-xs py-1.5 px-2 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </td>

                        <td className="py-3 px-3 font-mono text-slate-700">
                          PKR {item.actualUnitCost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submission */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Confirming this receipt will atomically increment batch stock and post movements.
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <PackageCheck className="w-4 h-4" />
                <span>{submitting ? 'Updating Batches & Stock...' : 'Confirm Goods Receipt (GRN)'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </ShopLayout>
  );
};
