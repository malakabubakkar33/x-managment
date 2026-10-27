import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Pill, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useShopAuth } from '../../context/ShopAuthContext';
import { ShopLayout } from '../../components/shop/layout/ShopLayout';
import { inventoryService } from '../../services/inventoryService';
import { DosageForm, MedicineCategory } from '../../types/inventory';

export const ShopMedicineFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const { activePharmacy } = useShopAuth();
  const [categories, setCategories] = useState<MedicineCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [strength, setStrength] = useState('');
  const [dosageForm, setDosageForm] = useState<DosageForm>('tablet');
  const [categoryId, setCategoryId] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [barcode, setBarcode] = useState('');
  const [unitOfMeasure, setUnitOfMeasure] = useState('box');
  const [reorderLevel, setReorderLevel] = useState<number>(10);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!activePharmacy) return;

    const init = async () => {
      setLoading(true);
      try {
        const cats = await inventoryService.getCategories(activePharmacy.id);
        setCategories(cats);
        if (cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].id);
        }

        if (id) {
          const med = await inventoryService.getMedicineById(activePharmacy.id, id);
          if (med) {
            setName(med.name);
            setGenericName(med.genericName || '');
            setStrength(med.strength || '');
            setDosageForm(med.dosageForm);
            setCategoryId(med.categoryId || (cats[0]?.id || ''));
            setManufacturer(med.manufacturer || '');
            setBarcode(med.barcode || '');
            setUnitOfMeasure(med.unitOfMeasure);
            setReorderLevel(med.reorderLevel);
            setDescription(med.description || '');
          }
        }
      } catch (err) {
        console.error('Failed to load medicine form data', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [activePharmacy, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePharmacy) return;

    if (!name.trim()) {
      setError('Please provide a medicine brand name.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEdit) {
        // Edit mode (we can update fields or create if needed)
        // For now, re-use existing medicine or update
        // We will navigate back
        navigate('/shop/inventory');
      } else {
        await inventoryService.createMedicine(activePharmacy.id, {
          name: name.trim(),
          genericName: genericName.trim() || undefined,
          strength: strength.trim() || undefined,
          dosageForm,
          categoryId: categoryId || undefined,
          manufacturer: manufacturer.trim() || undefined,
          barcode: barcode.trim() || undefined,
          unitOfMeasure: unitOfMeasure.trim() || 'box',
          reorderLevel: Number(reorderLevel) || 10,
          description: description.trim() || undefined,
        });
        navigate('/shop/inventory');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save medicine');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ShopLayout title={isEdit ? 'Edit Medicine' : 'Add New Medicine'}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          to="/shop/inventory"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {isEdit ? 'Update Medicine Information' : 'Catalog New Pharmaceutical Item'}
                </h2>
                <p className="text-xs text-slate-500">
                  Define item brand, generic composition, dosage form, and stock alert rules.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="m-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-xs text-slate-400">Loading form...</div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Brand Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Brand Name / Trade Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Augmentin 625mg, Panadol Extra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Generic Formula */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Generic Active Ingredient(s)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Amoxicillin + Clavulanic Acid"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Strength */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Strength / Concentration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500mg, 10mg/5ml, 250mg"
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Dosage Form */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Dosage Form *
                  </label>
                  <select
                    value={dosageForm}
                    onChange={(e) => setDosageForm(e.target.value as DosageForm)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="tablet">Tablet</option>
                    <option value="capsule">Capsule</option>
                    <option value="syrup">Syrup</option>
                    <option value="suspension">Suspension</option>
                    <option value="injection">Injection</option>
                    <option value="cream">Cream / Ointment</option>
                    <option value="drops">Drops (Eye/Ear)</option>
                    <option value="inhaler">Inhaler</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Therapeutic Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Manufacturer */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Manufacturer / Company
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GSK Pakistan, Abbott, Getz Pharma"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Barcode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Barcode / EAN / GTIN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 896400012345"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>

                {/* Unit of Measure */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Unit of Measure *
                  </label>
                  <select
                    value={unitOfMeasure}
                    onChange={(e) => setUnitOfMeasure(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="box">Box</option>
                    <option value="strip">Strip</option>
                    <option value="bottle">Bottle</option>
                    <option value="vial">Vial</option>
                    <option value="ampoule">Ampoule</option>
                    <option value="tube">Tube</option>
                    <option value="piece">Piece</option>
                  </select>
                </div>

                {/* Reorder Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Reorder Minimum Threshold *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Storage Instructions / Clinical Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Store below 25°C in a dry place. Protect from direct sunlight."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link
                  to="/shop/inventory"
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Catalog Medicine'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </ShopLayout>
  );
};
