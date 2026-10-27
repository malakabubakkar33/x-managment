import React from 'react';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/layout/AdminLayout';
import { pricingPlans } from '../../config/pricing';

export const AdminPlansPage: React.FC = () => {
  return (
    <AdminLayout title="SaaS Plan &amp; Tier Configuration">
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
            Subscription Tier Definitions
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure feature entitlement limits, maximum register seats, and commercial pricing.
          </p>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Plan Configuration Mode:</strong> Tier definitions are currently mapped from the central product configuration. Dynamic plan creation and stripe price synchronization will be enabled in Phase 3.
        </div>
      </div>

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  {plan.targetRole}
                </span>
                {plan.isPopular && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    Recommended
                  </span>
                )}
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 mb-1">
                {plan.name} Tier
              </h3>
              <p className="text-xs text-slate-500 mb-4 min-h-[32px]">
                {plan.tagline}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-5">
                <span className="text-xs font-bold text-slate-800 block">
                  {plan.priceNote}
                </span>
                <span className="text-[10px] text-slate-400">
                  Feature Entitlements Locked
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Enforced Limits:
                </span>
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => alert('Dynamic tier pricing modification will be enabled when the pricing catalog table is migrated.')}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Modify Feature Flags
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};
