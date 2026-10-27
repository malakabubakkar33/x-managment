import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  Boxes,
  AlertTriangle,
  ShoppingCart,
  Plus,
  ArrowRight,
  TrendingUp,
  PackageCheck,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useShopAuth } from '../../context/ShopAuthContext';
import { ShopLayout } from '../../components/shop/layout/ShopLayout';
import { inventoryService } from '../../services/inventoryService';
import { purchaseService } from '../../services/purchaseService';
import { subscriptionService } from '../../services/subscriptionService';
import { Medicine, MedicineBatch, InventoryAlerts } from '../../types/inventory';
import { PurchaseOrder } from '../../types/purchase';
import { PharmacySubscription } from '../../types/subscription';

export const ShopDashboardPage: React.FC = () => {
  const { activePharmacy, user } = useShopAuth();

  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [batches, setBatches] = useState<MedicineBatch[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlerts | null>(null);
  const [recentPOs, setRecentPOs] = useState<PurchaseOrder[]>([]);
  const [subscription, setSubscription] = useState<PharmacySubscription | null>(null);

  useEffect(() => {
    if (!activePharmacy) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [meds, bts, alrts, pos, sub] = await Promise.all([
          inventoryService.getMedicines(activePharmacy.id),
          inventoryService.getBatches(activePharmacy.id),
          inventoryService.getInventoryAlerts(activePharmacy.id),
          purchaseService.getPurchaseOrders(activePharmacy.id),
          subscriptionService.getSubscriptionByPharmacyId(activePharmacy.id),
        ]);

        setMedicines(meds);
        setBatches(bts);
        setAlerts(alrts);
        setRecentPOs(pos.slice(0, 5));
        setSubscription(sub);
      } catch (err) {
        console.error('Failed to load shop dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activePharmacy]);

  if (!activePharmacy) return null;

  // Calculate total inventory valuation at cost
  const totalStockValuation = batches.reduce(
    (sum, b) => sum + b.availableQuantity * b.purchasePrice,
    0
  );

  const totalRetailValuation = batches.reduce(
    (sum, b) => sum + b.availableQuantity * b.sellingPrice,
    0
  );

  const totalAlertsCount =
    (alerts?.expired.length || 0) +
    (alerts?.nearExpiry.length || 0) +
    (alerts?.lowStock.length || 0);

  return (
    <ShopLayout title="Dispensary Overview">
      <div className="space-y-6">
        {/* Welcome & Pharmacy Identity Card */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-2xl p-6 text-white shadow-lg border border-slate-700/60 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Building className="w-4 h-4" />
                <span>{activePharmacy.city} Branch &bull; Lic #{activePharmacy.licenseNumber}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {activePharmacy.name}
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Logged in as <span className="text-white font-medium">{user?.fullName}</span>. Complete inventory & FEFO batch control active.
              </p>
            </div>

            {/* Subscription Pill */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-3 sm:px-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Current Plan</div>
                <div className="text-xs font-bold text-white capitalize">
                  {subscription?.plan ? `${subscription.plan.name} Tier` : 'Active ERP Tier'}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  {subscription ? `Renewal: ${subscription.currentPeriodEnd.slice(0, 10)}` : 'Standard Renewal'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cataloged Items</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{medicines.length}</div>
            <div className="text-xs text-slate-500 mt-1">
              Active SKUs in dispensary
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">FEFO Batches</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{batches.length}</div>
            <div className="text-xs text-slate-500 mt-1">
              Tracked with lot & expiry
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inventory Value</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              PKR {totalStockValuation.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Retail: PKR {totalRetailValuation.toLocaleString()}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Alerts</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-rose-600">
              {totalAlertsCount}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Near-expiry or reorder warning
            </div>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Quick Operations:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/shop/inventory/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Medicine
            </Link>
            <Link
              to="/shop/purchases/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Create Purchase Order
            </Link>
            <Link
              to="/shop/goods-receiving"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              Receive Shipment (GRN)
            </Link>
          </div>
        </div>

        {/* Two-Column Operational Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Near-Expiry & Low-Stock Alerts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  Critical Expiry & Low Stock Warnings
                </h3>
              </div>
              <Link
                to="/shop/alerts"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 flex-1">
              {loading ? (
                <div className="text-center py-8 text-xs text-slate-400">Loading alerts...</div>
              ) : (alerts?.nearExpiry.length || 0) === 0 && (alerts?.lowStock.length || 0) === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs font-medium text-emerald-600">All batches & stocks are healthy!</p>
                  <p className="text-[11px] text-slate-400 mt-1">No items expiring within 90 days or below reorder level.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {alerts?.nearExpiry.slice(0, 3).map((batch: MedicineBatch) => (
                    <div
                      key={batch.id}
                      className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{batch.medicineName || 'Medicine Batch'}</div>
                        <div className="text-slate-600 text-[11px]">
                          Batch: {batch.batchNumber} &bull; Qty: {batch.availableQuantity} units
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-800">
                          Expires Soon
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                          {batch.expiryDate}
                        </div>
                      </div>
                    </div>
                  ))}

                  {alerts?.lowStock.slice(0, 2).map((med: Medicine) => (
                    <div
                      key={med.id}
                      className="p-3 rounded-lg bg-rose-50/70 border border-rose-200/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{med.name}</div>
                        <div className="text-slate-600 text-[11px]">
                          Stock: <span className="font-bold text-rose-600">{med.totalAvailableStock || 0}</span> / Min: {med.reorderLevel}
                        </div>
                      </div>
                      <Link
                        to="/shop/purchases/new"
                        className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-md transition-colors"
                      >
                        Reorder Now
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Purchase Orders & Procurement Status */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Purchase Orders
                </h3>
              </div>
              <Link
                to="/shop/purchases"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>View All ({recentPOs.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 flex-1">
              {loading ? (
                <div className="text-center py-8 text-xs text-slate-400">Loading orders...</div>
              ) : recentPOs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs font-medium text-slate-500">No purchase orders created yet.</p>
                  <Link
                    to="/shop/purchases/new"
                    className="mt-2 inline-block text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    + Create First Purchase Order
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPOs.map((po) => (
                    <div
                      key={po.id}
                      className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{po.poNumber}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              po.status === 'fully_received'
                                ? 'bg-emerald-100 text-emerald-800'
                                : po.status === 'partially_received'
                                ? 'bg-amber-100 text-amber-800'
                                : po.status === 'ordered'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {po.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Supplier: <span className="text-slate-800 font-medium">{po.supplierName}</span> &bull; {po.items.length} items
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-slate-900 font-mono">
                          PKR {po.netAmount.toLocaleString()}
                        </div>
                        <Link
                          to={`/shop/purchases/${po.id}`}
                          className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-0.5 mt-0.5"
                        >
                          Details &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};
