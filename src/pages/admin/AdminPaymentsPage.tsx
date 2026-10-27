import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/layout/AdminLayout';
import { StatusBadge } from '../../components/admin/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { adminDataService } from '../../services/adminDataService';
import { PaymentRecord } from '../../types/admin';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDataService.getRecentPayments().then((res) => {
      setPayments(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout title="Payment Records &amp; Transactions">
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
            Billing &amp; Invoice Transactions
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit history of SaaS subscription payments, bank transfers, and remittance statuses.
          </p>
        </div>

        <div>
          <Button
            onClick={() => alert('Tax report and CSV export will be generated from database tables in Phase 3.')}
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Ledger
          </Button>
        </div>
      </div>

      {/* Scope Notice */}
      <div className="mb-6 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-start gap-3 text-xs leading-relaxed">
        <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <div>
          <strong>PCI &amp; Payment Compliance Notice:</strong> Live card tokenization, 3D Secure verification, and automated refund hooks will be connected when payment processors are integrated.
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-500" />
            <p className="text-xs font-medium">Loading payment records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Invoice #</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Pharmacy Tenant</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Method</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Amount</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Date</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {p.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {p.pharmacyName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {p.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {p.date}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <StatusBadge status={p.status} />
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
