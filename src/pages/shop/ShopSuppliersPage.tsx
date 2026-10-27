import React, { useState, useEffect } from 'react';
import {
  Truck,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
  X,
} from 'lucide-react';
import { useShopAuth } from '../../context/ShopAuthContext';
import { ShopLayout } from '../../components/shop/layout/ShopLayout';
import { purchaseService } from '../../services/purchaseService';
import { Supplier } from '../../types/supplier';

export const ShopSuppliersPage: React.FC = () => {
  const { activePharmacy } = useShopAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add / Edit Supplier Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadSuppliers = async () => {
    if (!activePharmacy) return;
    setLoading(true);
    try {
      const data = await purchaseService.getSuppliers(activePharmacy.id);
      setSuppliers(data);
    } catch (err) {
      console.error('Failed to load suppliers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [activePharmacy]);

  const openAddModal = () => {
    setEditingSupplier(null);
    setName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setAddress('');
    setTaxNumber('');
    setNotes('');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sup: Supplier) => {
    setEditingSupplier(sup);
    setName(sup.name);
    setContactPerson(sup.contactPerson || '');
    setPhone(sup.phone);
    setEmail(sup.email || '');
    setAddress(sup.address || '');
    setTaxNumber(sup.taxNumber || '');
    setNotes(sup.notes || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePharmacy) return;

    if (!name.trim() || !phone.trim()) {
      setFormError('Supplier company name and contact phone are required.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (editingSupplier) {
        await purchaseService.updateSupplier(activePharmacy.id, editingSupplier.id, {
          name: name.trim(),
          contactPerson: contactPerson.trim() || undefined,
          phone: phone.trim(),
          email: email.trim() || undefined,
          address: address.trim() || undefined,
          taxNumber: taxNumber.trim() || undefined,
          notes: notes.trim() || undefined,
        });
      } else {
        await purchaseService.createSupplier(activePharmacy.id, {
          name: name.trim(),
          contactPerson: contactPerson.trim() || undefined,
          phone: phone.trim(),
          email: email.trim() || undefined,
          address: address.trim() || undefined,
          taxNumber: taxNumber.trim() || undefined,
          notes: notes.trim() || undefined,
          isActive: true,
        });
      }

      setIsModalOpen(false);
      loadSuppliers();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to save supplier');
    } finally {
      setSaving(false);
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.contactPerson && s.contactPerson.toLowerCase().includes(q)) ||
      s.phone.includes(q)
    );
  });

  return (
    <ShopLayout title="Medicine Suppliers & Distributors">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Supplier Directory ({filteredSuppliers.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage authorized pharmaceutical distributors, purchase order histories, and outstanding payable accounts.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company name, contact person, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400">
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading distributors...</span>
              </div>
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
              <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-800">No suppliers registered yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Add pharmaceutical distributors like GSK, Abbott, or local wholesalers to generate Purchase Orders.
              </p>
              <button
                onClick={openAddModal}
                className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100"
              >
                + Register First Supplier
              </button>
            </div>
          ) : (
            filteredSuppliers.map((sup) => (
              <div
                key={sup.id}
                className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-xs p-5 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{sup.name}</h3>
                      {sup.contactPerson && (
                        <p className="text-xs text-slate-500 font-medium">
                          Attn: {sup.contactPerson}
                        </p>
                      )}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{sup.phone}</span>
                    </div>
                    {sup.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{sup.email}</span>
                      </div>
                    )}
                    {sup.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{sup.address}</span>
                      </div>
                    )}
                    {sup.taxNumber && (
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>NTN / Tax: {sup.taxNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="p-2 rounded-lg bg-slate-50">
                      <div className="text-[10px] text-slate-500 font-medium">Total Orders</div>
                      <div className="font-bold text-slate-800 font-mono">
                        {sup.totalPurchasesCount || 0} POs
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-100">
                      <div className="text-[10px] text-rose-700 font-medium">Payable Balance</div>
                      <div className="font-bold text-rose-800 font-mono">
                        PKR {(sup.outstandingBalance || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal(sup)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <a
                      href={`/shop/purchases/new?supplierId=${sup.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    >
                      + Create PO
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: Add / Edit Supplier */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingSupplier ? 'Edit Supplier Information' : 'Register New Medicine Supplier'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {formError && (
                <div className="m-5 mb-0 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Company / Distributor Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. GSK Pakistan Distribution Ltd"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tariq Mehmood (Rep)"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +92 300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="orders@supplier.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Tax / NTN Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1234567-8"
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Warehouse / Office Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Warehouse 12, I-9 Industrial Area, Islamabad"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Payment Terms & Internal Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. 30 days net credit term, free delivery on orders above PKR 50,000."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : editingSupplier ? 'Update Supplier' : 'Save Supplier'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ShopLayout>
  );
};
