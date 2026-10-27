import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Pill,
  Boxes,
  History,
  AlertTriangle,
  Truck,
  ShoppingCart,
  PackageCheck,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  X,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { useShopAuth } from '../../../context/ShopAuthContext';
import { cn } from '../../../utils/cn';

interface ShopSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const ShopSidebar: React.FC<ShopSidebarProps> = ({
  mobileOpen,
  onCloseMobile,
}) => {
  const {
    user,
    activePharmacy,
    activeMembership,
    authorizedPharmacies,
    switchPharmacy,
    logout,
  } = useShopAuth();

  const primaryNav = [
    { label: 'Overview', href: '/shop', icon: LayoutDashboard, exact: true },
    { label: 'Medicine Catalog', href: '/shop/inventory', icon: Pill },
    { label: 'FEFO Batches', href: '/shop/batches', icon: Boxes },
    { label: 'Stock Movements', href: '/shop/movements', icon: History },
    { label: 'Expiry & Stock Alerts', href: '/shop/alerts', icon: AlertTriangle },
  ];

  const procurementNav = [
    { label: 'Suppliers', href: '/shop/suppliers', icon: Truck },
    { label: 'Purchase Orders', href: '/shop/purchases', icon: ShoppingCart },
    { label: 'Receive Goods (GRN)', href: '/shop/goods-receiving', icon: PackageCheck },
  ];

  const upcomingNav = [
    { label: 'POS Terminal', href: '/shop/pos', icon: CreditCard, badge: 'Phase 8' },
    { label: 'Customer Khata', href: '/shop/customers', icon: Users, badge: 'Phase 9' },
    { label: 'Financial Reports', href: '/shop/reports', icon: BarChart3, badge: 'Phase 10' },
    { label: 'Shop Settings', href: '/shop/settings', icon: Settings, badge: 'Phase 11' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800">
      {/* Pharmacy Header & Tenant Switcher */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <Link to="/shop" className="flex items-center gap-2.5 group" onClick={onCloseMobile}>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-sm shadow-md">
              <Building className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                Pharmacy Portal
              </span>
              <span className="text-sm font-bold text-white leading-tight truncate max-w-[170px]">
                {activePharmacy?.name || 'My Pharmacy'}
              </span>
            </div>
          </Link>
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pharmacy Tenant Switcher (if user manages > 1 pharmacy) */}
        {authorizedPharmacies.length > 1 && (
          <div className="mt-2 pt-2 border-t border-slate-800/80">
            <label className="text-[11px] font-medium text-slate-400 block mb-1">
              Active Branch:
            </label>
            <select
              value={activePharmacy?.id || ''}
              onChange={(e) => switchPharmacy(e.target.value)}
              className="w-full text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              {authorizedPharmacies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.city})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status pill */}
        <div className="mt-2.5 flex items-center justify-between text-xs bg-slate-800/60 rounded-md px-2.5 py-1.5 border border-slate-800">
          <span className="text-slate-400 truncate text-[11px]">Lic: {activePharmacy?.licenseNumber}</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core Inventory */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Inventory & Batches
          </div>
          <nav className="space-y-1">
            {primaryNav.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.exact}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )
                }
              >
                <link.icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Procurement */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Procurement & POs
          </div>
          <nav className="space-y-1">
            {procurementNav.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )
                }
              >
                <link.icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Future Modules */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Coming Soon
          </div>
          <nav className="space-y-1">
            {upcomingNav.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-300'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>{link.label}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  {link.badge}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* User & Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90">
        <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-800/60">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {user?.fullName || 'Pharmacy Staff'}
            </p>
            <p className="text-[10px] text-emerald-400 truncate capitalize font-mono">
              {activeMembership?.role.replace('_', ' ') || 'Owner'}
            </p>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2 text-center">
          <Link
            to="/"
            className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
          >
            &larr; Back to X Management Website
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
