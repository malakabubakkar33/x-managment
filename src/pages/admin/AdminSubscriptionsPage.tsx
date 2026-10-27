import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/layout/AdminLayout';
import { StatusBadge } from '../../components/admin/ui/StatusBadge';
import { adminDataService } from '../../services/adminDataService';
import { SubscriptionRecord } from '../../types/admin';

export const AdminSubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDataService.getSubscriptions().then((res) => {
      setSubscriptions(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout title="SaaS Subscriptions Management">
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
            Tenant Subscription Ledgers
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitor billing cycles, renewal windows, and active monthly recurring revenue (MRR).
          </p>
        </div>
      </div>

      {/* Scope Disclaimer */}
      <div className="mb-6 p-4 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 flex items-start gap-3 text-xs leading-relaxed">
        <AlertCircle className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Billing Integration Boundary:</strong> Automated credit card charging, recurring invoice webhooks, and subscription lifecycle hooks will be implemented in a dedicated payment gateway phase.
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-500" />
            <p className="text-xs font-medium">Loading subscription accounts...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Pharmacy Account</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Subscribed Tier</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Cycle</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Rate</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Current Period End</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {subscriptions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {s.pharmacyName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-brand-700">{s.planName}</span>
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[11px] font-semibold text-slate-500">
                      {s.billingCycle}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ${s.amount.toFixed(2)} / mo
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {s.currentPeriodEnd}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <StatusBadge status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
