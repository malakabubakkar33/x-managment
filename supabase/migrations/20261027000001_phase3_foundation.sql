-- X MANAGEMENT PHARMACY ERP: PHASE 3 SCHEMA MIGRATION
-- Multi-Tenant Pharmacy Database Foundation, User Profiles & Tenant Isolation

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (Maps authenticated identities to application profiles)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Platform Admins Table (Strict mapping of authorized Super Administrators)
CREATE TABLE IF NOT EXISTS public.platform_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE UNIQUE,
    role TEXT NOT NULL DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'platform_auditor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Pharmacies Table (Multi-tenant isolated organizations)
CREATE TABLE IF NOT EXISTS public.pharmacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    license_number TEXT,
    owner_email TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    city TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Pharmacy Memberships Table (User to Pharmacy RBAC Association)
CREATE TABLE IF NOT EXISTS public.pharmacy_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID NOT NULL REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('pharmacy_owner', 'pharmacy_manager', 'pharmacy_staff')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(pharmacy_id, user_id)
);

-- 6. Audit Logs Table (Administrative and Security Event Logging)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    pharmacy_id UUID REFERENCES public.pharmacies(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_entity TEXT NOT NULL,
    target_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance & integrity
CREATE INDEX IF NOT EXISTS idx_pharmacies_slug ON public.pharmacies(slug);
CREATE INDEX IF NOT EXISTS idx_pharmacies_owner_email ON public.pharmacies(owner_email);
CREATE INDEX IF NOT EXISTS idx_memberships_pharmacy_id ON public.pharmacy_memberships(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.pharmacy_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_pharmacy_id ON public.audit_logs(pharmacy_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Security helper: check if user is a platform Super Admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.platform_admins
        WHERE user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Security helper: check if user is a member of pharmacy
CREATE OR REPLACE FUNCTION public.is_pharmacy_member(user_uuid UUID, pharmacy_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.pharmacy_memberships
        WHERE user_id = user_uuid
          AND pharmacy_id = pharmacy_uuid
          AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pharmacies RLS Policies
CREATE POLICY "Super Admins can view and manage all pharmacies"
    ON public.pharmacies
    FOR ALL
    TO authenticated
    USING (public.is_super_admin(auth.uid()))
    WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Pharmacy members can view their own pharmacy"
    ON public.pharmacies
    FOR SELECT
    TO authenticated
    USING (public.is_pharmacy_member(auth.uid(), id));

-- Pharmacy Memberships RLS Policies
CREATE POLICY "Super Admins can manage all memberships"
    ON public.pharmacy_memberships
    FOR ALL
    TO authenticated
    USING (public.is_super_admin(auth.uid()))
    WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Pharmacy users can view memberships of their pharmacy"
    ON public.pharmacy_memberships
    FOR SELECT
    TO authenticated
    USING (public.is_pharmacy_member(auth.uid(), pharmacy_id));
