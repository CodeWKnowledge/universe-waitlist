-- =============================================================================
-- 007_admin.sql
-- Purpose: Admin role management and the is_admin() helper function.
--
-- Frontend dependencies:
--   - RequireAdmin.jsx   (checkAdminRole → SELECT admin_roles WHERE user_id = uid)
--   - All RLS policies   (use is_admin() as the gating function)
--
-- IMPORTANT: The is_admin() function MUST be created before the RLS policies
-- in 008_rls_policies.sql, and it MUST be SECURITY DEFINER so it bypasses RLS
-- on admin_roles itself (prevents infinite recursion).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Admin roles — explicit whitelist of Supabase Auth users with admin access
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT admin_roles_user_unique UNIQUE (user_id)
);

COMMENT ON TABLE public.admin_roles IS
    'Whitelist of Supabase Auth users who can access the /admin dashboard. '
    'Insert a row with the user UUID to grant access.';

-- ---------------------------------------------------------------------------
-- is_admin() — SECURITY DEFINER helper used in all RLS policies
--
-- SECURITY DEFINER means the function runs with the privileges of its owner
-- (postgres), bypassing RLS on admin_roles. This prevents the infinite
-- recursion that would occur if the admin_roles policy called itself.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.admin_roles
        WHERE user_id = auth.uid()
    );
END;
$$;

COMMENT ON FUNCTION public.is_admin() IS
    'Returns TRUE if the currently authenticated user exists in admin_roles. '
    'SECURITY DEFINER prevents recursive RLS evaluation.';
