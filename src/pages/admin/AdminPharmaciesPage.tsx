import React, { useState, useEffect } from 'react';
import { Building2, Search, Plus, ArrowLeft, Eye, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { pharmacyService } from '../../services/pharmacyService';
import { Pharmacy } from '../../types/pharmacy';

export const AdminPharmaciesPage: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  // New Tenant Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [address, setAddress] = useState('');
  const [planId, setPlanId] = useState('plan-standard');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await pharmacyService.getPharmacies();
      setPharmacies(list);
    } catch (err) {
      console.error('Failed to load pharmacies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ownerName.trim() || !ownerEmail.trim()) {
      setCreateError('Pharmacy name, owner name, and owner email are required.');
      return;
    }

    setCreating(true);
    setCreateError(null);

    try {
      await pharmacyService.createPharmacy({
        name: name.trim(),
        ownerName: ownerName.trim(),
        ownerEmail: ownerEmail.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        city: city.trim() || undefined,
        licenseNumber: licenseNumber.trim() || undefined,
        address: address.trim() || undefined,
        planId,
      });

      setIsCreateOpen(false);
      setName('');
      setOwnerName('');
      setOwnerEmail('');
      setPhone('');
      setLicenseNumber('');
      setAddress('');
      loadData();
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Failed to register pharmacy');
    } finally {
      setCreating(false);
    }
  };

  const filtered = pharmacies.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      (p.licenseNumber && p.licenseNumber.toLowerCase().includes(search.toLowerCase())) ||
      (p.city && p.city.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
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
            Registered Pharmacy Tenants ({filtered.length})
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage multi-tenant pharmacy organizations, license records, and owner credentials.
          </p>
        </div>

        <div>
          <Button
            onClick={() => setIsCreateOpen(true)}
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
            placeholder="Search by name, owner, license, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Tenants</option>
            <option value="active">Active</option>
            <option value="pending">Pending Provision</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading pharmacy tenants...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No pharmacy tenants match your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Pharmacy Business</th>
                  <th className="py-3 px-4">City / Address</th>
                  <th className="py-3 px-4">Pharmacist in Charge</th>
                  <th className="py-3 px-4">License Number</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-slate-400 text-[11px] font-mono">slug: {p.slug}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-medium">{p.city || 'Islamabad'}</div>
                      <div className="text-slate-400 text-[11px] truncate max-w-xs">{p.address}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{p.ownerName}</div>
                      <div className="text-slate-400 text-[11px]">{p.ownerEmail}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {p.licenseNumber || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
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

      {/* Inspect Tenant Modal */}
      {selectedPharmacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Tenant Dossier & Credentials
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                {selectedPharmacy.status}
              </span>
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
                  <span className="text-slate-400 block font-medium">City:</span>
                  <span className="font-bold text-slate-800">{selectedPharmacy.city}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block font-medium">Owner / RPh:</span>
                  <span className="text-slate-800 font-medium">{selectedPharmacy.ownerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Owner Email:</span>
                  <span className="text-slate-800 font-mono">{selectedPharmacy.ownerEmail}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Tenant Portal Access:</span>
                <div className="mt-1 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center justify-between">
                  <span>Sign in as owner at <strong>/shop/login</strong></span>
                  <Link
                    to="/shop/login"
                    target="_blank"
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
                  >
                    <span>Launch Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
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

      {/* Provision New Tenant Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Provision New Pharmacy Tenant
                </h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createError && (
              <div className="m-5 mb-0 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Pharmacy Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Shifa Family Pharmacy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Owner / Pharmacist Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Haris Khan, PharmD"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Owner Login Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="owner@alshifapharma.com"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Direct Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+92 300 7654321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Islamabad / Lahore / Karachi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State Drug License #
                  </label>
                  <input
                    type="text"
                    placeholder="PHA-PK-77201"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Initial Subscription Tier
                  </label>
                  <select
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-brand-500"
                  >
                    <option value="plan-standard">Standard Dispensary (PKR 8,500/mo)</option>
                    <option value="plan-basic">Single Counter Basic (PKR 4,500/mo)</option>
                    <option value="plan-enterprise">Hospital Chain Enterprise (PKR 18,500/mo)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Physical Store Address
                  </label>
                  <input
                    type="text"
                    placeholder="Shop #4, Ground Floor, Jinnah Medical Complex"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  variant="primary"
                  size="sm"
                >
                  {creating ? 'Provisioning...' : 'Provision Tenant Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
