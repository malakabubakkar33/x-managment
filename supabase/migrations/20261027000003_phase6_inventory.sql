-- X MANAGEMENT PHARMACY ERP: PHASE 6 SCHEMA MIGRATION
-- Tenant-Isolated Medicine Catalog, Batch Expiry & Stock Movement Ledger

-- 1. Medicine Categories Table
CREATE TABLE IF NOT EXISTS public.medicine_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(pharmacy_id, name)
);

-- 2. Medicines Catalog Table
CREATE TABLE IF NOT EXISTS public.medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    generic_name TEXT,
    strength TEXT,
    dosage_form TEXT NOT NULL DEFAULT 'tablet' CHECK (dosage_form IN ('tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'inhaler', 'suspension', 'other')),
    manufacturer TEXT,
    barcode TEXT,
    category_id UUID REFERENCES public.medicine_categories(id) ON DELETE SET NULL,
    unit_of_measure TEXT NOT NULL DEFAULT 'box',
    reorder_level INT NOT NULL DEFAULT 10 CHECK (reorder_level >= 0),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Medicine Batches Table (Traceable batch-level stock)
CREATE TABLE IF NOT EXISTS public.medicine_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
    batch_number TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    purchase_price NUMERIC(12, 2) NOT NULL CHECK (purchase_price >= 0),
    selling_price NUMERIC(12, 2) NOT NULL CHECK (selling_price >= 0),
    quantity_received INT NOT NULL CHECK (quantity_received >= 0),
    available_quantity INT NOT NULL CHECK (available_quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(pharmacy_id, medicine_id, batch_number)
);

-- 4. Inventory Movements Ledger Table (Append-only audit trail)
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES public.medicine_batches(id) ON DELETE SET NULL,
    movement_type TEXT NOT NULL CHECK (movement_type IN (
        'opening_stock', 'stock_received', 'purchase_receipt', 'stock_adjustment_in',
        'stock_adjustment_out', 'damaged_stock', 'expired_stock', 'stock_correction',
        'pos_sale', 'sales_return'
    )),
    quantity_delta INT NOT NULL,
    quantity_before INT,
    quantity_after INT,
    reference_type TEXT,
    reference_id TEXT,
    reason TEXT NOT NULL,
    actor_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_medicines_pharmacy ON public.medicines(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_medicines_barcode ON public.medicines(pharmacy_id, barcode);
CREATE INDEX IF NOT EXISTS idx_batches_pharmacy ON public.medicine_batches(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_batches_expiry ON public.medicine_batches(pharmacy_id, expiry_date);
CREATE INDEX IF NOT EXISTS idx_movements_pharmacy ON public.inventory_movements(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_movements_medicine ON public.inventory_movements(medicine_id);

-- RLS Policies
ALTER TABLE public.medicine_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacy users manage categories" ON public.medicine_categories FOR ALL TO authenticated USING (public.is_pharmacy_member(auth.uid(), pharmacy_id)) WITH CHECK (public.is_pharmacy_member(auth.uid(), pharmacy_id));
CREATE POLICY "Super Admins view categories" ON public.medicine_categories FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Pharmacy users manage medicines" ON public.medicines FOR ALL TO authenticated USING (public.is_pharmacy_member(auth.uid(), pharmacy_id)) WITH CHECK (public.is_pharmacy_member(auth.uid(), pharmacy_id));
CREATE POLICY "Super Admins view medicines" ON public.medicines FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Pharmacy users manage batches" ON public.medicine_batches FOR ALL TO authenticated USING (public.is_pharmacy_member(auth.uid(), pharmacy_id)) WITH CHECK (public.is_pharmacy_member(auth.uid(), pharmacy_id));
CREATE POLICY "Super Admins view batches" ON public.medicine_batches FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Pharmacy users view movements" ON public.inventory_movements FOR SELECT TO authenticated USING (public.is_pharmacy_member(auth.uid(), pharmacy_id));
CREATE POLICY "Pharmacy users insert movements" ON public.inventory_movements FOR INSERT TO authenticated WITH CHECK (public.is_pharmacy_member(auth.uid(), pharmacy_id));
CREATE POLICY "Super Admins view movements" ON public.inventory_movements FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));
