import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Eye,
  PackageCheck,
} from 'lucide-react';
import { useShopAuth } from '../../context/ShopAuthContext';
import { ShopLayout } from '../../components/shop/layout/ShopLayout';
import { purchaseService } from '../../services/purchaseService';
import { PurchaseOrder, PurchaseOrderStatus } from '../../types/purchase';

export const ShopPurchasesPage: React.FC = () => {
  const { activePharmacy } = useShopAuth();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadPOs = async () => {
    if (!activePharmacy) return;
    setLoading(true);
    try {
      const data = await purchaseService.getPurchaseOrders(activePharmacy.id);
      setPurchaseOrders(data);
    } catch (err) {
      console.error('Failed to load purchase orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPOs();
  }, [activePharmacy]);

  const filteredPOs = purchaseOrders.filter((po) => {
    if (statusFilter !== 'all' && po.status !== statusFilter) {
      return false;
    }
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      po.poNumber.toLowerCase().includes(q) ||
      (po.supplierName && po.supplierName.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status: PurchaseOrderStatus) => {
    switch (status) {
      case 'fully_received':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'partially_received':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ordered':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const totalProcurementValue = purchaseOrders.reduce((sum, po) => sum + po.netAmount, 0);
  const pendingCount = purchaseOrders.filter(
    (p) => p.status === 'ordered' || p.status === 'partially_received'
  ).length;

  return (
    <ShopLayout title="Purchase Orders">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Procurement & Purchase Orders ({filteredPOs.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Draft, dispatch, and track vendor medicine orders before atomic goods receipt (GRN).
            </p>
          </div>

          <Link
            to="/shop/purchases/new"
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase Order</span>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-medium text-slate-500 uppercase">Total Orders</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{purchaseOrders.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Dispatched to suppliers</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-medium text-amber-700 uppercase">Pending Delivery</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Ordered or partial receipt</div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <div className="text-xs font-medium text-emerald-700 uppercase">Total Net Procurement</div>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-1">
              PKR {totalProcurementValue.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Sum of all purchase orders</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by PO number or supplier name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="ordered">Ordered (Awaiting Delivery)</option>
              <option value="partially_received">Partially Received</option>
              <option value="fully_received">Fully Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Purchase Orders Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">PO Number</th>
                  <th className="py-3 px-4">Supplier Distributor</th>
                  <th className="py-3 px-4">Order Date</th>
                  <th className="py-3 px-4">Items / Progress</th>
                  <th className="py-3 px-4">Net Value (PKR)</th>
                  <th className="py-3 px-4">Delivery Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <span>Loading purchase orders...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPOs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-semibold text-slate-700">No purchase orders found</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Create a PO to reorder medicines from your registered distributors.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredPOs.map((po) => {
                    const totalOrderedQty = po.items.reduce((s, i) => s + i.orderedQuantity, 0);
                    const totalReceivedQty = po.items.reduce((s, i) => s + i.receivedQuantity, 0);
                    const canReceive = po.status === 'ordered' || po.status === 'partially_received';

                    return (
                      <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {po.poNumber}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{po.supplierName}</div>
                          {po.supplierInvoiceNumber && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              Inv: #{po.supplierInvoiceNumber}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600">
                          {po.orderedAt ? new Date(po.orderedAt).toLocaleDateString() : '—'}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-800">
                            {po.items.length} line items
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Received {totalReceivedQty} of {totalOrderedQty} units
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                          PKR {po.netAmount.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getStatusBadge(
                              po.status
                            )}`}
                          >
                            {po.status.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <Link
                            to={`/shop/purchases/${po.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            View
                          </Link>

                          {canReceive && (
                            <Link
                              to={`/shop/goods-receiving?poId=${po.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition-colors"
                            >
                              <PackageCheck className="w-3.5 h-3.5" />
                              Receive
                            </Link>
                          )}
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
