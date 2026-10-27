import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  PackageCheck,
} from 'lucide-react';
import { useShopAuth } from '../../context/ShopAuthContext';
import { ShopLayout } from '../../components/shop/layout/ShopLayout';
import { purchaseService } from '../../services/purchaseService';
import { PurchaseOrder, GoodsReceipt } from '../../types/purchase';
import { Supplier } from '../../types/supplier';

export const ShopPurchaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { activePharmacy } = useShopAuth();

  const [po, setPo] = useState<PurchaseOrder | null>(null);
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [grns, setGrns] = useState<GoodsReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!activePharmacy || !id) return;
    setLoading(true);
    try {
      const order = await purchaseService.getPurchaseOrderById(activePharmacy.id, id);
      if (order) {
        setPo(order);
        const [sup, receipts] = await Promise.all([
          purchaseService.getSupplierById(activePharmacy.id, order.supplierId),
          purchaseService.getGoodsReceipts(activePharmacy.id, order.id),
        ]);
        setSupplier(sup);
        setGrns(receipts);
      }
    } catch (err) {
      console.error('Failed to load PO details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activePharmacy, id]);

  if (!po && !loading) {
    return (
      <ShopLayout title="Purchase Order Not Found">
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-bold text-slate-800">Purchase Order not found</p>
          <Link
            to="/shop/purchases"
            className="mt-3 inline-block text-xs font-semibold text-emerald-600 hover:underline"
          >
            &larr; Return to Purchase Orders
          </Link>
        </div>
      </ShopLayout>
    );
  }

  const totalOrderedQty = po ? po.items.reduce((s, i) => s + i.orderedQuantity, 0) : 0;
  const totalReceivedQty = po ? po.items.reduce((s, i) => s + i.receivedQuantity, 0) : 0;
  const percentComplete = totalOrderedQty > 0 ? Math.round((totalReceivedQty / totalOrderedQty) * 100) : 0;
  const canReceive = po?.status === 'ordered' || po?.status === 'partially_received';

  return (
    <ShopLayout title={`Purchase Order ${po?.poNumber || ''}`}>
      <div className="space-y-6">
        {/* Top Navigation & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/shop/purchases"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Purchase Orders</span>
          </Link>

          {canReceive && (
            <Link
              to={`/shop/goods-receiving?poId=${po?.id}`}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Receive Goods (GRN)</span>
            </Link>
          )}
        </div>

        {/* PO Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-mono font-bold text-slate-900">{po?.poNumber}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    po?.status === 'fully_received'
                      ? 'bg-emerald-100 text-emerald-800'
                      : po?.status === 'partially_received'
                      ? 'bg-amber-100 text-amber-800'
                      : po?.status === 'ordered'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {po?.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Created on {po?.orderedAt ? new Date(po.orderedAt).toLocaleString() : '—'} by{' '}
                <span className="text-slate-700 font-medium">{po?.createdBy}</span>
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Total Net Amount</div>
              <div className="text-2xl font-bold font-mono text-emerald-800">
                PKR {po?.netAmount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Supplier & Delivery Progress Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Distributor Details
              </h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="font-bold text-slate-900 text-sm">{supplier?.name || po?.supplierName}</div>
                {supplier?.contactPerson && (
                  <div>Contact: {supplier.contactPerson}</div>
                )}
                {supplier?.phone && <div>Phone: {supplier.phone}</div>}
                {supplier?.email && <div>Email: {supplier.email}</div>}
                {po?.supplierInvoiceNumber && (
                  <div className="pt-1 text-slate-500 font-mono text-[11px]">
                    Quotation / Inv: #{po.supplierInvoiceNumber}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Shipment Receipt Progress
              </h4>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3 text-xs">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>Received Units:</span>
                  <span className="font-mono font-bold">
                    {totalReceivedQty} / {totalOrderedQty} units ({percentComplete}%)
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      percentComplete === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500">
                  {percentComplete === 100
                    ? 'All items on this purchase order have been received and logged into inventory.'
                    : 'Awaiting remaining goods arrival. Use Goods Receiving (GRN) to register lot numbers and shelf expiries.'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-900">
              Ordered Medicine Line Items ({po?.items.length || 0})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Medicine Item</th>
                  <th className="py-3 px-4">Dosage Form</th>
                  <th className="py-3 px-4">Ordered Qty</th>
                  <th className="py-3 px-4">Received Qty</th>
                  <th className="py-3 px-4">Remaining</th>
                  <th className="py-3 px-4">Unit Cost</th>
                  <th className="py-3 px-4 text-right">Line Net Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {po?.items.map((item) => {
                  const rem = item.orderedQuantity - item.receivedQuantity;
                  const isDone = rem <= 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {item.medicineName}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 capitalize">
                        {item.dosageForm}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                        {item.orderedQuantity}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                        {item.receivedQuantity}
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        {isDone ? (
                          <span className="text-emerald-600 font-bold">0 (Complete)</span>
                        ) : (
                          <span className="text-amber-700 font-bold">{rem} pending</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        PKR {item.unitCost}{' '}
                        {item.discountPercent > 0 && (
                          <span className="text-[10px] text-emerald-600">
                            (-{item.discountPercent}%)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-right">
                        PKR {item.lineTotal.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Goods Receipts (GRN) History */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Associated Goods Receiving Notes (GRNs)
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {grns.length} receipt events
            </span>
          </div>

          {grns.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No shipments received for this purchase order yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {grns.map((grn) => (
                <div key={grn.id} className="p-4 text-xs space-y-2 hover:bg-slate-50/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono font-bold text-slate-900">
                      <span>{grn.grnNumber}</span>
                      <span className="text-slate-400 font-normal">
                        &bull; {new Date(grn.receivedDate).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Received By: <strong className="text-slate-700">{grn.receivedBy}</strong>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-700 mb-1">
                      Batch Receipts:
                    </div>
                    <div className="space-y-1">
                      {grn.items.map((gi) => (
                        <div key={gi.id} className="flex justify-between text-slate-600 font-mono text-[11px]">
                          <span>
                            {gi.medicineName} &bull; Batch: <strong>{gi.batchNumber}</strong> (Exp: {gi.expiryDate})
                          </span>
                          <span className="font-bold text-emerald-700">
                            +{gi.quantityReceived} units @ PKR {gi.unitCost}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ShopLayout>
  );
};
