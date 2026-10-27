import React from 'react';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/layout/AdminLayout';

export const AdminUsersPage: React.FC = () => {
  const users = [
    {
      id: 'usr-1',
      name: 'Platform Super Administrator',
      email: 'superadmin@xmanagement.com',
      role: 'Super Admin',
      scope: 'Global Platform',
      status: 'Active',
      lastActive: 'Just now',
    },
    {
      id: 'usr-2',
      name: 'Lead System Auditor',
      email: 'auditor@xmanagement.com',
      role: 'Platform Auditor',
      scope: 'Compliance & Logs',
      status: 'Active',
      lastActive: '2 hours ago',
    },
    {
      id: 'usr-3',
      name: 'Dr. Tariq Mahmood (Tenant Owner)',
      email: 'admin@apexcentralcare.com',
      role: 'Pharmacy Owner',
      scope: 'Tenant #101',
      status: 'Active',
      lastActive: 'Today at 14:22',
    },
  ];

  return (
    <AdminLayout title="Platform Users &amp; Role Assignments">
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
            User Roles &amp; Administrative Hierarchy
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit privileged Super Admin accounts and inspect tenant-level administrator credentials.
          </p>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
        <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Security Principle (Section 3):</strong> Administrator privileges can never be granted via client-side role toggles. Real authentication verifies claims through server-side JWT roles.
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">User Identity</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Assigned Role</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Permission Scope</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Last Activity</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{u.name}</span>
                    <span className="text-[11px] font-mono text-slate-400 block">{u.email}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{u.role}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">
                    {u.scope}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {u.lastActive}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{u.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
