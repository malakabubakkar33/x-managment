-- X MANAGEMENT PHARMACY ERP: PHASE 4 SCHEMA MIGRATION
-- Subscription Plans, Monthly Billing Invoices & Payment Ledger

-- 1. Subscription Plans Table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE, -- 'basic', 'standard', 'premium'
    name TEXT NOT NULL,
    description TEXT,
    billing_interval TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'annual')),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    currency TEXT NOT NULL DEFAULT 'PKR',
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    limits JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Pharmacy Subscriptions Table
CREATE TABLE IF NOT EXISTS public.pharmacy_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE UNIQUE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'trialing', 'active', 'past_due', 'expired', 'suspended', 'cancelled')),
    start_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    current_period_end TIMESTAMPTZ NOT NULL,
    trial_end_at TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Subscription Invoices Table
CREATE TABLE IF NOT EXISTS public.subscription_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    subscription_id UUID NOT NULL REFERENCES public.pharmacy_subscriptions(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL UNIQUE,
    billing_period_start TIMESTAMPTZ NOT NULL,
    billing_period_end TIMESTAMPTZ NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    currency TEXT NOT NULL DEFAULT 'PKR',
    status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'paid', 'overdue', 'void')),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    due_at TIMESTAMPTZ NOT NULL,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Payment Records Table
CREATE TABLE IF NOT EXISTS public.payment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES public.subscription_invoices(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    currency TEXT NOT NULL DEFAULT 'PKR',
    payment_method TEXT NOT NULL CHECK (payment_method IN ('Bank Transfer', 'Cash', 'Credit Card', 'Online')),
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
    transaction_reference TEXT,
    received_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    recorded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subs_pharmacy ON public.pharmacy_subscriptions(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_invoices_pharmacy ON public.subscription_invoices(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.subscription_invoices(status);
CREATE INDEX IF NOT EXISTS idx_payments_pharmacy ON public.payment_records(pharmacy_id);

-- RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active plans" ON public.subscription_plans FOR SELECT TO authenticated USING (is_active = true OR public.is_super_admin(auth.uid()));
CREATE POLICY "Super Admins can manage plans" ON public.subscription_plans FOR ALL TO authenticated USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Super Admins can manage all subscriptions" ON public.pharmacy_subscriptions FOR ALL TO authenticated USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Pharmacy users can view their own subscription" ON public.pharmacy_subscriptions FOR SELECT TO authenticated USING (public.is_pharmacy_member(auth.uid(), pharmacy_id));

CREATE POLICY "Super Admins can manage invoices" ON public.subscription_invoices FOR ALL TO authenticated USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Pharmacy users can view their invoices" ON public.subscription_invoices FOR SELECT TO authenticated USING (public.is_pharmacy_member(auth.uid(), pharmacy_id));

CREATE POLICY "Super Admins can manage payments" ON public.payment_records FOR ALL TO authenticated USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Pharmacy users can view their payments" ON public.payment_records FOR SELECT TO authenticated USING (public.is_pharmacy_member(auth.uid(), pharmacy_id));
