import React from 'react';
import { Menu, Bell, Shield, LogOut } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';

interface AdminTopBarProps {
  title: string;
  onOpenMobile: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ title, onOpenMobile }) => {
  const { user, logout, isDevPreview } = useAdminAuth();

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
          aria-label="Open Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Notification, Role Badge & User Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* System Alert Indicator */}
        <div className="relative">
          <button
            type="button"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="System Notifications (Phase 2 Preview)"
            aria-label="System Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500"></span>
          </button>
        </div>

        {/* Super Admin Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Super Admin</span>
        </div>

        {/* Profile Card & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-800 block leading-tight">
              {user?.name || 'Admin'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">
              {isDevPreview ? 'Preview Mode' : 'Live Verified'}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Sign Out of Super Admin"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
