import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  AlertOctagon,
  Clock,
  ShoppingCart,
  Pill,
  ArrowRight,
} from 'lucide-react';
import { useShopAuth } from '../../context/ShopAuthContext';
import { ShopLayout } from '../../components/shop/layout/ShopLayout';
import { inventoryService } from '../../services/inventoryService';
import { InventoryAlerts, Medicine, MedicineBatch } from '../../types/inventory';

export const ShopInventoryAlertsPage: React.FC = () => {
  const { activePharmacy } = useShopAuth();
  const [alerts, setAlerts] = useState<InventoryAlerts | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAlerts = async () => {
    if (!activePharmacy) return;
    setLoading(true);
    try {
      const data = await inventoryService.getInventoryAlerts(activePharmacy.id, 90);
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [activePharmacy]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <ShopLayout title="Inventory Expiry & Low Stock Alerts">
      <div className="space-y-6">
        {/* Header Bar */}
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Clinical Expiry & Stock Threshold Alerts
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time monitoring of expired medication quarantine, 90-day FEFO expiry countdowns, and reorder levels.
          </p>
        </div>

        {/* 4 Metric Warning Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                Expired Batches
              </span>
              <AlertOctagon className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-900">
              {alerts?.expired.length || 0}
            </div>
            <div className="text-[11px] text-rose-700 mt-1">Requires immediate disposal</div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Near Expiry (&lt;90d)
              </span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-900">
              {alerts?.nearExpiry.length || 0}
            </div>
            <div className="text-[11px] text-amber-700 mt-1">Prioritize in FEFO dispensing</div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">
                Low Stock
              </span>
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <div className="text-2xl font-black text-orange-900">
              {alerts?.lowStock.length || 0}
            </div>
            <div className="text-[11px] text-orange-700 mt-1">Below minimum threshold</div>
          </div>

          <div className="bg-slate-100 border border-slate-300 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Out of Stock
              </span>
              <Pill className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {alerts?.outOfStock.length || 0}
            </div>
            <div className="text-[11px] text-slate-600 mt-1">Zero units available</div>
          </div>
        </div>

        {/* Section 1: Expiry Alerts Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Medication Batches Expired or Expiring Within 90 Days
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {(alerts?.expired.length || 0) + (alerts?.nearExpiry.length || 0)} items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Medicine Item</th>
                  <th className="py-3 px-4">Batch Number</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Days Remaining</th>
                  <th className="py-3 px-4">Available Quantity</th>
                  <th className="py-3 px-4 text-right">Remedial Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Loading expiry data...
                    </td>
                  </tr>
                ) : (alerts?.expired.length || 0) === 0 && (alerts?.nearExpiry.length || 0) === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      <p className="font-semibold text-emerald-700">No expiring batches!</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        All batches currently have more than 90 days shelf-life remaining.
                      </p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {/* Expired items */}
                    {alerts?.expired.map((batch: MedicineBatch) => (
                      <tr key={batch.id} className="bg-rose-50/40 hover:bg-rose-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {batch.medicineName || 'Medicine'}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {batch.batchNumber}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-700">
                          {batch.expiryDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900">
                            EXPIRED
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-700">
                          {batch.availableQuantity} units
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/shop/batches?medicineId=${batch.medicineId}`}
                            className="px-2.5 py-1 text-[11px] font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-md transition-colors"
                          >
                            Quarantine / Dispose
                          </Link>
                        </td>
                      </tr>
                    ))}

                    {/* Near expiry items */}
                    {alerts?.nearExpiry.map((batch: MedicineBatch) => {
                      const exp = new Date(batch.expiryDate);
                      const diffDays = Math.ceil(
                        (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                      );

                      return (
                        <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {batch.medicineName || 'Medicine'}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">
                            {batch.batchNumber}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-800">
                            {batch.expiryDate}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              {diffDays} days left
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">
                            {batch.availableQuantity} units
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Link
                              to={`/shop/batches?medicineId=${batch.medicineId}`}
                              className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                            >
                              View Batch
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Low Stock & Reorder Alerts Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Low Stock & Out of Stock Medications (Reorder Required)
              </h3>
            </div>
            <Link
              to="/shop/purchases/new"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>+ Create Procurement PO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Medicine Name</th>
                  <th className="py-3 px-4">Form & Category</th>
                  <th className="py-3 px-4">Current Stock</th>
                  <th className="py-3 px-4">Reorder Level</th>
                  <th className="py-3 px-4">Deficit / Suggested Qty</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Loading stock alerts...
                    </td>
                  </tr>
                ) : (alerts?.lowStock.length || 0) === 0 && (alerts?.outOfStock.length || 0) === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      <p className="font-semibold text-emerald-700">All inventory levels are optimal!</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        No medicines currently below their reorder threshold.
                      </p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {alerts?.outOfStock.map((med: Medicine) => (
                      <tr key={med.id} className="bg-rose-50/30 hover:bg-rose-50/60 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{med.name}</td>
                        <td className="py-3 px-4 text-slate-600 capitalize">
                          {med.dosageForm} &bull; {med.categoryName || 'General'}
                        </td>
                        <td className="py-3 px-4 font-mono font-black text-rose-600">
                          0 {med.unitOfMeasure}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {med.reorderLevel} {med.unitOfMeasure}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-700">
                          +{med.reorderLevel * 2} {med.unitOfMeasure}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/shop/purchases/new?medicineId=${med.id}`}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors"
                          >
                            Reorder Now
                          </Link>
                        </td>
                      </tr>
                    ))}

                    {alerts?.lowStock.map((med: Medicine) => (
                      <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{med.name}</td>
                        <td className="py-3 px-4 text-slate-600 capitalize">
                          {med.dosageForm} &bull; {med.categoryName || 'General'}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-600">
                          {med.totalAvailableStock || 0} {med.unitOfMeasure}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {med.reorderLevel} {med.unitOfMeasure}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-slate-800">
                          +{Math.max(med.reorderLevel * 2 - (med.totalAvailableStock || 0), med.reorderLevel)} {med.unitOfMeasure}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/shop/purchases/new?medicineId=${med.id}`}
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors"
                          >
                            Add to PO
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};
