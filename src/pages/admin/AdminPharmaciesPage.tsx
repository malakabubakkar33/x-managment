import React, { useState, useEffect } from 'react';
import { Building2, Search, Filter, Plus, ArrowLeft, RefreshCw, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/layout/AdminLayout';
import { StatusBadge } from '../../components/admin/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { adminDataService } from '../../services/adminDataService';
import { PharmacyTenant } from '../../types/admin';

export const AdminPharmaciesPage: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<PharmacyTenant[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyTenant | null>(null);

  useEffect(() => {
    adminDataService.getPharmacies().then((res) => {
      setPharmacies(res.data);
      setLoading(false);
    });
  }, []);

  const filtered = pharmacies.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      p.licenseNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.subscriptionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout title="Pharmacy Tenants Directory">
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
            Registered Pharmacy Accounts
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage multi-tenant pharmacy licenses, active store subscriptions, and counter terminals.
          </p>
        </div>

        <div>
          <Button
            onClick={() => alert('Tenant provisioning and isolated schema migration will be implemented in Phase 3.')}
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Provision New Tenant
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, owner, or license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="past_due">Past Due</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-500" />
            <p className="text-xs font-medium">Loading pharmacy tenants...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No matching pharmacies found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Pharmacy Name</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">License #</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Owner / Pharmacist</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Tier</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px]">Terminals</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-center">Status</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-[11px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{p.name}</span>
                      <span className="text-[11px] text-slate-400 block">{p.city}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">
                      {p.licenseNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-900 font-semibold block">{p.ownerName}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{p.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded uppercase font-bold text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                        {p.planId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold">
                      {p.registersCount}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={p.subscriptionStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedPharmacy(p)}
                        className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 font-semibold text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Drawer Modal */}
      {selectedPharmacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Tenant License Dossier
              </h3>
              <StatusBadge status={selectedPharmacy.subscriptionStatus} />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Pharmacy Business Name:</span>
                <span className="font-bold text-slate-900 text-sm">{selectedPharmacy.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block font-medium">State License #:</span>
                  <span className="font-mono text-slate-800 font-semibold">{selectedPharmacy.licenseNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Assigned Tier:</span>
                  <span className="font-bold uppercase text-brand-700">{selectedPharmacy.planId} Tier</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block font-medium">Pharmacist in Charge:</span>
                  <span className="text-slate-800 font-medium">{selectedPharmacy.ownerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Direct Telephone:</span>
                  <span className="text-slate-800 font-mono">{selectedPharmacy.phone}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Tenant Isolation Status:</span>
                <span className="text-slate-600">
                  Logical multi-tenant schema partitioning scheduled for Phase 3 database migrations.
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button onClick={() => setSelectedPharmacy(null)} variant="secondary" size="sm">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
