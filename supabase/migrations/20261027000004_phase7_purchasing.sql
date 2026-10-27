-- X MANAGEMENT PHARMACY ERP: PHASE 7 SCHEMA MIGRATION
-- Supplier Management, Purchase Orders & Goods Receiving Integration

-- 1. Suppliers Table
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    tax_number TEXT,
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(pharmacy_id, name)
);

-- 2. Purchase Orders Table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    po_number TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ordered', 'partially_received', 'fully_received', 'cancelled')),
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    net_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (net_amount >= 0),
    notes TEXT,
    supplier_invoice_number TEXT,
    ordered_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(pharmacy_id, po_number)
);

-- 3. Purchase Order Items Table
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE RESTRICT,
    ordered_quantity INT NOT NULL CHECK (ordered_quantity > 0),
    received_quantity INT NOT NULL DEFAULT 0 CHECK (received_quantity >= 0),
    unit_cost NUMERIC(12, 2) NOT NULL CHECK (unit_cost >= 0),
    discount_percent NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
    line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Goods Receipts (GRN) Table
CREATE TABLE IF NOT EXISTS public.goods_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
    grn_number TEXT NOT NULL,
    received_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    supplier_invoice_number TEXT,
    notes TEXT,
    received_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(pharmacy_id, grn_number)
);

-- 5. Goods Receipt Items Table
CREATE TABLE IF NOT EXISTS public.goods_receipt_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    goods_receipt_id UUID NOT NULL REFERENCES public.goods_receipts(id) ON DELETE CASCADE,
    purchase_order_item_id UUID NOT NULL REFERENCES public.purchase_order_items(id) ON DELETE RESTRICT,
    medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE RESTRICT,
    batch_number TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_received INT NOT NULL CHECK (quantity_received > 0),
    unit_cost NUMERIC(12, 2) NOT NULL CHECK (unit_cost >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_suppliers_pharmacy ON public.suppliers(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_po_pharmacy ON public.purchase_orders(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_po_supplier ON public.purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_po_items_po ON public.purchase_order_items(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_grn_po ON public.goods_receipts(purchase_order_id);

-- RLS Policies
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goods_receipt_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacy users manage suppliers" ON public.suppliers FOR ALL TO authenticated USING (public.is_pharmacy_member(auth.uid(), pharmacy_id)) WITH CHECK (public.is_pharmacy_member(auth.uid(), pharmacy_id));
CREATE POLICY "Super Admins view suppliers" ON public.suppliers FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Pharmacy users manage purchase orders" ON public.purchase_orders FOR ALL TO authenticated USING (public.is_pharmacy_member(auth.uid(), pharmacy_id)) WITH CHECK (public.is_pharmacy_member(auth.uid(), pharmacy_id));
CREATE POLICY "Super Admins view purchase orders" ON public.purchase_orders FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Pharmacy users manage purchase order items" ON public.purchase_order_items FOR ALL TO authenticated USING (public.is_pharmacy_member(auth.uid(), pharmacy_id)) WITH CHECK (public.is_pharmacy_member(auth.uid(), pharmacy_id));
CREATE POLICY "Super Admins view purchase order items" ON public.purchase_order_items FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Pharmacy users manage goods receipts" ON public.goods_receipts FOR ALL TO authenticated USING (public.is_pharmacy_member(auth.uid(), pharmacy_id)) WITH CHECK (public.is_pharmacy_member(auth.uid(), pharmacy_id));
CREATE POLICY "Super Admins view goods receipts" ON public.goods_receipts FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Pharmacy users manage goods receipt items" ON public.goods_receipt_items FOR ALL TO authenticated USING (public.is_pharmacy_member(auth.uid(), pharmacy_id)) WITH CHECK (public.is_pharmacy_member(auth.uid(), pharmacy_id));
CREATE POLICY "Super Admins view goods receipt items" ON public.goods_receipt_items FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));
