import React, { useState, useEffect } from 'react';
import { Menu, Bell, Plus, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShopAuth } from '../../../context/ShopAuthContext';
import { inventoryService } from '../../../services/inventoryService';

interface ShopTopBarProps {
  title: string;
  onOpenMobile: () => void;
}

export const ShopTopBar: React.FC<ShopTopBarProps> = ({ title, onOpenMobile }) => {
  const { activePharmacy } = useShopAuth();
  const [alertCount, setAlertCount] = useState<number>(0);

  useEffect(() => {
    if (!activePharmacy) return;
    const loadAlerts = async () => {
      try {
        const alerts = await inventoryService.getInventoryAlerts(activePharmacy.id);
        const total = alerts.expired.length + alerts.nearExpiry.length + alerts.lowStock.length;
        setAlertCount(total);
      } catch {
        // ignore
      }
    };
    loadAlerts();
  }, [activePharmacy]);

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Left: Mobile hamburger & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobile}
            className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Tenant Badges & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          {activePharmacy && (
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-1.5 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium text-slate-800">{activePharmacy.city}</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-slate-500">{activePharmacy.licenseNumber}</span>
            </div>
          )}

          {/* Alert Bell */}
          <Link
            to="/shop/alerts"
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors"
            title="View Expiry & Low Stock Alerts"
          >
            <Bell className="w-5 h-5" />
            {alertCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full animate-pulse">
                {alertCount}
              </span>
            )}
          </Link>

          {/* Quick Add Medicine */}
          <Link
            to="/shop/inventory/new"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medicine</span>
          </Link>

          {/* Quick Create PO */}
          <Link
            to="/shop/purchases/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New PO</span>
            <span className="sm:hidden">PO</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
