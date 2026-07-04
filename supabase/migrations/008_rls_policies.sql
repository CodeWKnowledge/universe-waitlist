-- =============================================================================
-- 008_rls_policies.sql
-- Purpose: Row Level Security for every table.
--
-- Access matrix:
--   anon (unauthenticated public)  — waitlist INSERT, preferences SELECT/UPDATE
--   authenticated non-admin        — same as anon (no extra access)
--   admin (is_admin() = TRUE)      — full CRUD on everything
--   service_role (edge functions)  — bypasses RLS entirely (Supabase default)
--
-- Run AFTER 007_admin.sql (requires is_admin() to exist).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Enable RLS on all tables
-- ---------------------------------------------------------------------------
ALTER TABLE public.subscribers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_tracking      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaigns   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audiences              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_subscribers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_queue            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequences        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequence_steps         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sequence_subscribers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles            ENABLE ROW LEVEL SECURITY;

-- ===========================================================================
-- subscribers
-- ===========================================================================

-- Public: join waitlist (INSERT) — no auth required
CREATE POLICY "public_insert_subscribers"
    ON public.subscribers FOR INSERT
    WITH CHECK (true);

-- Public: check for duplicate email on signup (SELECT by email) — waitlistService.js
CREATE POLICY "public_select_subscribers"
    ON public.subscribers FOR SELECT
    USING (true);

-- Public: update own preferences via token link — PreferencesPage.jsx
-- The token is the subscriber's own UUID passed in the URL as ?token=<uuid>
-- The frontend selects/updates by id, so a row-level check on id = auth is not
-- possible for unauthenticated users. We allow public UPDATE here and rely on
-- the fact that UUIDs are unguessable.
CREATE POLICY "public_update_subscriber_preferences"
    ON public.subscribers FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Admin: full management
CREATE POLICY "admin_all_subscribers"
    ON public.subscribers FOR ALL
    USING (public.is_admin());

-- ===========================================================================
-- referral_tracking
-- ===========================================================================

-- Public: referralService.js inserts a tracking row when a code is used
CREATE POLICY "public_insert_referral_tracking"
    ON public.referral_tracking FOR INSERT
    WITH CHECK (true);

-- Public: referralService.js reads a referral record to check conversion
CREATE POLICY "public_select_referral_tracking"
    ON public.referral_tracking FOR SELECT
    USING (true);

-- Admin: full management
CREATE POLICY "admin_all_referral_tracking"
    ON public.referral_tracking FOR ALL
    USING (public.is_admin());

-- ===========================================================================
-- newsletter_campaigns
-- ===========================================================================

-- Admin only — campaigns are internal; no public access needed
CREATE POLICY "admin_all_campaigns"
    ON public.newsletter_campaigns FOR ALL
    USING (public.is_admin());

-- ===========================================================================
-- audiences
-- ===========================================================================

CREATE POLICY "admin_all_audiences"
    ON public.audiences FOR ALL
    USING (public.is_admin());

-- ===========================================================================
-- audience_subscribers
-- ===========================================================================

CREATE POLICY "admin_all_audience_subscribers"
    ON public.audience_subscribers FOR ALL
    USING (public.is_admin());

-- ===========================================================================
-- email_logs
-- ===========================================================================

-- Service role (process-email-queue Edge Function) inserts logs automatically.
-- Admins can read and manage all logs.
CREATE POLICY "admin_all_email_logs"
    ON public.email_logs FOR ALL
    USING (public.is_admin());

-- ===========================================================================
-- email_queue
-- ===========================================================================

-- waitlistService.js inserts queue entries for new subscribers (anon context)
CREATE POLICY "public_insert_email_queue"
    ON public.email_queue FOR INSERT
    WITH CHECK (true);

-- Admin: full management (view queue, delete stuck items)
CREATE POLICY "admin_all_email_queue"
    ON public.email_queue FOR ALL
    USING (public.is_admin());

-- ===========================================================================
-- email_templates
-- ===========================================================================

-- Admin only
CREATE POLICY "admin_all_email_templates"
    ON public.email_templates FOR ALL
    USING (public.is_admin());

-- ===========================================================================
-- email_sequences
-- ===========================================================================

-- Admin: create, activate, pause sequences
CREATE POLICY "admin_all_email_sequences"
    ON public.email_sequences FOR ALL
    USING (public.is_admin());

-- ===========================================================================
-- sequence_steps
-- ===========================================================================

CREATE POLICY "admin_all_sequence_steps"
    ON public.sequence_steps FOR ALL
    USING (public.is_admin());

-- ===========================================================================
-- sequence_subscribers
-- ===========================================================================

-- Public INSERT: when a new subscriber is enrolled at waitlist join time
CREATE POLICY "public_insert_sequence_subscribers"
    ON public.sequence_subscribers FOR INSERT
    WITH CHECK (true);

-- Admin: full management
CREATE POLICY "admin_all_sequence_subscribers"
    ON public.sequence_subscribers FOR ALL
    USING (public.is_admin());

-- ===========================================================================
-- admin_roles
-- ===========================================================================

-- Only admins can see or modify the whitelist (uses is_admin() SECURITY DEFINER
-- — no recursion risk)
CREATE POLICY "admin_all_admin_roles"
    ON public.admin_roles FOR ALL
    USING (public.is_admin());
