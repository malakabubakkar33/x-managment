import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Receipt,
  Layers,
  Users2,
  Settings,
  LogOut,
  X,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { cn } from '../../../utils/cn';

interface AdminSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  mobileOpen,
  onCloseMobile,
}) => {
  const { user, logout, isDevPreview } = useAdminAuth();

  const navLinks = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Pharmacies', href: '/admin/pharmacies', icon: Building2 },
    { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    { label: 'Payments', href: '/admin/payments', icon: Receipt },
    { label: 'Plans & Pricing', href: '/admin/plans', icon: Layers },
    { label: 'Users & Roles', href: '/admin/users', icon: Users2 },
    { label: 'Platform Settings', href: '/admin/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-navy-950 text-slate-300">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-3 group" onClick={onCloseMobile}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-navy-900 border border-brand-400/40 shadow-sm">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 5L19 19" />
              <path d="M19 5L5 19" />
              <circle cx="12" cy="12" r="2.5" fill="#10B981" stroke="#0E86D4" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block">
              X <span className="text-brand-400">Management</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 block">
              Super Admin Console
            </span>
          </div>
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close Sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role / Dev Status Badge */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-400" />
          <span className="text-slate-300 font-medium">Super Admin Access</span>
        </div>
        {isDevPreview && (
          <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Preview
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.exact}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-150',
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Public Site Link & User Profile & Logout */}
      <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-900/40">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>View Public Website</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-white block truncate">
              {user?.name || 'Super Administrator'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block truncate">
              {user?.email || 'admin@xmanagement.local'}
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              onCloseMobile();
            }}
            title="Log Out"
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
            aria-label="Log Out of Super Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
