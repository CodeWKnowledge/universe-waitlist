-- =============================================================================
-- 002_subscribers.sql
-- Purpose: Core subscribers table — the single source of truth for every person
-- who has joined the UniVerse waitlist or newsletter.
--
-- Frontend dependencies:
--   - waitlistService.js (insert, duplicate-check, queue-position)
--   - newsletterService.js (subscribeFromWaitlist)
--   - queries.js (insertSubscriber, getSubscriberByEmail, getSubscriberById)
--   - useAdminSubscribers.js (paginated list, search, filter by status/source)
--   - PreferencesPage.jsx (SELECT + UPDATE marketing_opt_in, product_opt_in)
--   - RequireAdmin.jsx (checkAdminRole via admin_roles FK to auth.users)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.subscribers (
    -- Identity
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT NOT NULL,

    -- Profile
    first_name      TEXT,
    last_name       TEXT,

    -- Acquisition
    source          TEXT DEFAULT 'waitlist',           -- 'waitlist' | 'direct' | 'referral'
    status          TEXT DEFAULT 'waitlist',           -- 'waitlist' | 'active' | 'unsubscribed' | 'bounced'
    tags            TEXT[] DEFAULT '{}',               -- e.g. ['university:unilag', 'role:buyer']

    -- Email preference flags (used by PreferencesPage.jsx)
    marketing_opt_in    BOOLEAN DEFAULT TRUE NOT NULL,
    product_opt_in      BOOLEAN DEFAULT TRUE NOT NULL,

    -- Timestamps
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT subscribers_email_unique UNIQUE (email),
    CONSTRAINT subscribers_status_check CHECK (
        status IN ('waitlist', 'active', 'unsubscribed', 'bounced')
    ),
    CONSTRAINT subscribers_source_check CHECK (
        source IN ('waitlist', 'direct', 'referral', 'import')
    )
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscribers_updated_at
    BEFORE UPDATE ON public.subscribers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.subscribers IS
    'Every person who has joined the UniVerse waitlist or newsletter. Single source of truth.';
COMMENT ON COLUMN public.subscribers.tags IS
    'Free-form tag array. Convention: "key:value", e.g. university:unilag, role:buyer.';
COMMENT ON COLUMN public.subscribers.marketing_opt_in IS
    'Controls receipt of marketing / promotional emails.';
COMMENT ON COLUMN public.subscribers.product_opt_in IS
    'Controls receipt of product-update and announcement emails.';
