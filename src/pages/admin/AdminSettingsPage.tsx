import React from 'react';
import { ArrowLeft, Shield, Key, Database, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/layout/AdminLayout';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminSettingsPage: React.FC = () => {
  const { isBackendConfigured } = useAdminAuth();

  return (
    <AdminLayout title="Platform Security &amp; Settings">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/admin"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Configuration &amp; Security
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit environment variables, database connectivity, and access policies.
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Environment & Backend Integration Status */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base mb-4">
            <Database className="w-5 h-5 text-brand-600" />
            <span>Database &amp; Authentication Environment Configuration</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono font-bold text-slate-900 block text-xs">
                  VITE_SUPABASE_URL
                </span>
                <span className="text-[11px] text-slate-500">
                  Target Supabase PostgreSQL API endpoint
                </span>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                {isBackendConfigured ? 'Configured' : 'Not Set in .env'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono font-bold text-slate-900 block text-xs">
                  VITE_SUPABASE_ANON_KEY
                </span>
                <span className="text-[11px] text-slate-500">
                  Public anon key with RLS enforcement
                </span>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                {isBackendConfigured ? 'Configured' : 'Not Set in .env'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono font-bold text-slate-900 block text-xs">
                  SUPABASE_SERVICE_ROLE_KEY
                </span>
                <span className="text-[11px] text-slate-500">
                  Privileged admin key (Server-side ONLY; NEVER expose to Vite client)
                </span>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Protected Server Side
              </span>
            </div>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base mb-4">
            <Shield className="w-5 h-5 text-brand-600" />
            <span>Administrative Security Policies</span>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
              <Key className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Session Inactivity Timeout</span>
                <span>Active sessions automatically expire after 8 hours of inactivity.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
              <Server className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Multi-Tenant Isolation</span>
                <span>Every pharmacy organization queries through strict tenant-id isolation.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
