import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  CreditCard,
  AlertTriangle,
  DollarSign,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/layout/AdminLayout';
import { SummaryCard } from '../../components/admin/ui/SummaryCard';
import { StatusBadge } from '../../components/admin/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { adminDataService } from '../../services/adminDataService';
import {
  DashboardKPIs,
  PharmacyTenant,
  PaymentRecord,
} from '../../types/admin';

export const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [pharmacies, setPharmacies] = useState<PharmacyTenant[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isIllustrative, setIsIllustrative] = useState(true);
  const [quickActionModal, setQuickActionModal] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [kpiRes, pharmaRes, payRes] = await Promise.all([
        adminDataService.getDashboardKPIs(),
        adminDataService.getPharmacies(),
        adminDataService.getRecentPayments(),
      ]);

      setKpis(kpiRes.data);
      setPharmacies(pharmaRes.data);
      setPayments(payRes.data);
      setIsIllustrative(kpiRes.isIllustrative);
    } catch {
      // Handle error gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AdminLayout title="Super Admin Dashboard">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              SaaS Operations Overview
            </h2>
            {isIllustrative && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Illustrative Mode
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Centralized multi-tenant metrics, pharmacy subscriptions, and billing health.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={fetchData}
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            onClick={() => setQuickActionModal('New Pharmacy Onboarding is scheduled for Phase 3 (Tenant Provisioning).')}
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Pharmacy
          </Button>
        </div>
      </div>

      {/* 4 Primary Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <SummaryCard
          title="Total Pharmacies"
          value={kpis ? kpis.totalPharmacies : '—'}
          subtitle="Registered accounts"
          icon={Building2}
          variant="blue"
          trendText="12% YoY"
          trendPositive={true}
          isIllustrative={isIllustrative}
        />
        <SummaryCard
          title="Active Subscriptions"
          value={kpis ? kpis.activeSubscriptions : '—'}
          subtitle="Paid & operational"
          icon={CreditCard}
          variant="emerald"
          trendText="+3 this month"
          trendPositive={true}
          isIllustrative={isIllustrative}
        />
        <SummaryCard
          title="Expired / Past Due"
          value={kpis ? kpis.expiredSubscriptions : '—'}
          subtitle="Action required"
          icon={AlertTriangle}
          variant="rose"
          trendText="2 in grace period"
          trendPositive={false}
          isIllustrative={isIllustrative}
        />
        <SummaryCard
          title="Recorded Monthly Revenue"
          value={kpis ? `$${kpis.monthlyRevenue.toLocaleString()}` : '—'}
          subtitle="Estimated SaaS MRR"
          icon={DollarSign}
          variant="navy"
          trendText="15.8% margin"
          trendPositive={true}
          isIllustrative={isIllustrative}
        />
      </div>

      {/* Subscription Status Distribution & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Subscription Status Breakdown */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Subscription Status Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Current tenant distribution across active tiers and grace periods.
              </p>
            </div>
            <Link
              to="/admin/subscriptions"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View Subscriptions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Progress bar visual */}
          <div className="h-4 rounded-xl bg-slate-100 overflow-hidden flex mb-4">
            <div
              style={{ width: '75%' }}
              className="bg-emerald-500 hover:opacity-90 transition-opacity"
              title="Active: 75%"
            />
            <div
              style={{ width: '12%' }}
              className="bg-blue-500 hover:opacity-90 transition-opacity"
              title="Trial: 12%"
            />
            <div
              style={{ width: '13%' }}
              className="bg-amber-500 hover:opacity-90 transition-opacity"
              title="Past Due / Expired: 13%"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-emerald-500 flex-shrink-0" />
              <div>
                <span className="text-slate-500 block">Active Tenants</span>
                <span className="font-bold text-slate-900">14 Pharmacies (75%)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-blue-500 flex-shrink-0" />
              <div>
                <span className="text-slate-500 block">In Pilot Trial</span>
                <span className="font-bold text-slate-900">2 Pharmacies (12%)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-amber-500 flex-shrink-0" />
              <div>
                <span className="text-slate-500 block">Past Due / Grace</span>
                <span className="font-bold text-slate-900">2 Accounts (13%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Admin Quick Actions
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Common operational workflows and administrative controls.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setQuickActionModal('Tenant database provisioning will be implemented in Phase 3.')}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-brand-50/60 border border-slate-200/80 text-xs font-semibold text-slate-700 hover:text-brand-700 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-brand-600" />
                  <span>Onboard Pharmacy Tenant</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Phase 3</span>
              </button>

              <Link
                to="/admin/plans"
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-brand-50/60 border border-slate-200/80 text-xs font-semibold text-slate-700 hover:text-brand-700 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-600" />
                  <span>Configure SaaS Pricing Tiers</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                to="/admin/settings"
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-brand-50/60 border border-slate-200/80 text-xs font-semibold text-slate-700 hover:text-brand-700 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>Inspect Security &amp; Audit Logs</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Platform Engine:</span>
            <span className="font-mono text-slate-600 font-semibold">X-Core v2.0-Alpha</span>
          </div>
        </div>
      </div>

      {/* Two-Column Tables: Recent Pharmacies + Recent Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Recent Pharmacies Table */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Pharmacy Tenants
              </h3>
              <p className="text-xs text-slate-500">
                Latest independent and hospital pharmacies joined.
              </p>
            </div>
            <Link
              to="/admin/pharmacies"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View All ({pharmacies.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400">
                  <th className="pb-3 font-semibold">Pharmacy</th>
                  <th className="pb-3 font-semibold">Tier</th>
                  <th className="pb-3 font-semibold">Registers</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {pharmacies.slice(0, 4).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3">
                      <span className="font-bold text-slate-900 block truncate max-w-[200px]">
                        {p.name}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {p.city} • {p.licenseNumber}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold uppercase text-[11px] text-slate-700">
                        {p.planId}
                      </span>
                    </td>
                    <td className="py-3 font-mono">
                      {p.registersCount} {p.registersCount === 1 ? 'Terminal' : 'Terminals'}
                    </td>
                    <td className="py-3 text-right">
                      <StatusBadge status={p.subscriptionStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payment Records */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Recent Invoices &amp; Payments
              </h3>
              <p className="text-xs text-slate-500">
                Latest billing ledger transactions.
              </p>
            </div>
            <Link
              to="/admin/payments"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400">
                  <th className="pb-3 font-semibold">Invoice</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payments.slice(0, 4).map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3">
                      <span className="font-mono text-slate-900 font-bold block">
                        {pay.invoiceNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                        {pay.pharmacyName}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-900">
                      ${pay.amount.toFixed(2)}
                    </td>
                    <td className="py-3 text-right">
                      <StatusBadge status={pay.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal / Alert for Future Phase Actions */}
      {quickActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Future Operational Module
            </h4>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {quickActionModal}
            </p>
            <div className="flex justify-end">
              <Button
                onClick={() => setQuickActionModal(null)}
                variant="primary"
                size="sm"
              >
                Understood
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
