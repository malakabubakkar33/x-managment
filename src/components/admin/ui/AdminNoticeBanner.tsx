import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export const AdminNoticeBanner: React.FC = () => {
  const { isBackendConfigured, isDevPreview } = useAdminAuth();

  if (isBackendConfigured) {
    return (
      <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Production Backend Connected:</strong> Authenticated queries and RLS enforcement active.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm shadow-sm">
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-snug">
          <span className="font-bold">
            {isDevPreview ? 'Development Preview Session Active: ' : 'Backend Authentication Unconfigured: '}
          </span>
          No live Supabase PostgreSQL endpoint is configured in <code className="font-mono bg-amber-100/70 px-1.5 py-0.5 rounded text-[11px] text-amber-950">.env</code>. Displaying illustrative SaaS platform data for interface verification.
        </div>
      </div>
      <span className="flex-shrink-0 font-mono text-[11px] bg-amber-200/60 px-2.5 py-1 rounded text-amber-900 border border-amber-300/50">
        Phase 2 Architecture
      </span>
    </div>
  );
};
