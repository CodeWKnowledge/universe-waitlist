-- =============================================================================
-- 005_email_system.sql
-- Purpose: Email delivery infrastructure — logs, queue, and templates.
--
-- Frontend dependencies:
--   - campaignService.js     (INSERT email_queue, INSERT email_logs with
--                             campaign_id + delivery_status)
--   - analyticsService.js    (COUNT email_logs WHERE delivery_status='delivered')
--   - useAdminMetrics.js     (COUNT email_logs, COUNT WHERE opened=true,
--                             COUNT WHERE clicked=true)
--   - AnalyticsPage.jsx      (SELECT email_logs: created_at, opened, clicked)
--   - AutomationsPage.jsx    (COUNT email_queue by status: pending/sent/failed)
--   - process-email-queue    (UPDATE email_queue status + processed_at,
--                             INSERT email_logs with campaign_id)
--   - constants.js           (TABLES.EMAIL_LOGS, TABLES.EMAIL_QUEUE,
--                             TABLES.EMAIL_TEMPLATES)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Email logs — one row per email sent (delivery receipt)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    subscriber_id   UUID REFERENCES public.subscribers(id)            ON DELETE SET NULL,
    campaign_id     UUID REFERENCES public.newsletter_campaigns(id)   ON DELETE SET NULL,

    email_type      TEXT,           -- 'newsletter' | 'onboarding_day_3' | 'welcome' etc.

    -- Delivery
    delivery_status TEXT DEFAULT 'pending',   -- 'pending'|'delivered'|'bounced'|'failed'

    -- Engagement — populated by Resend webhook (resend-webhook edge function)
    opened          BOOLEAN DEFAULT FALSE,    -- useAdminMetrics.js + AnalyticsPage.jsx
    clicked         BOOLEAN DEFAULT FALSE,    -- useAdminMetrics.js + AnalyticsPage.jsx

    -- Resend message ID for webhook correlation
    resend_id       TEXT,

    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT email_logs_delivery_status_check CHECK (
        delivery_status IN ('pending', 'delivered', 'bounced', 'failed')
    )
);

CREATE TRIGGER email_logs_updated_at
    BEFORE UPDATE ON public.email_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Email queue — pending outbound emails processed by process-email-queue EF
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_queue (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    campaign_id     UUID REFERENCES public.newsletter_campaigns(id)   ON DELETE CASCADE,
    subscriber_id   UUID REFERENCES public.subscribers(id)            ON DELETE CASCADE,

    -- Onboarding / sequence email type (e.g. 'onboarding_day_3')
    -- NULL for campaign-based sends (campaign_id is used instead)
    email_type      TEXT,

    -- Status aligned with AutomationsPage.jsx which queries 'pending','sent','failed'
    -- NOTE: 'completed' was a prior mismatch — canonical value is now 'sent'
    status          TEXT DEFAULT 'pending',
    CHECK (status IN ('pending', 'processing', 'sent', 'failed')),

    error_message   TEXT,

    -- Scheduled delivery time — process-email-queue respects this
    scheduled_for   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at    TIMESTAMP WITH TIME ZONE
);

-- ---------------------------------------------------------------------------
-- Email templates — stores reusable HTML/MJML bodies for the edge function
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_templates (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,   -- e.g. 'welcome', 'onboarding_day_3'
    subject     TEXT NOT NULL,
    html_body   TEXT,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TRIGGER email_templates_updated_at
    BEFORE UPDATE ON public.email_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.email_logs IS
    'Delivery receipt for every outbound email. opened/clicked updated by Resend webhook.';
COMMENT ON COLUMN public.email_logs.resend_id IS
    'The message ID returned by Resend API — used to correlate webhook events.';
COMMENT ON TABLE public.email_queue IS
    'Outbound email jobs. Polled by process-email-queue Edge Function every minute via pg_cron.';
COMMENT ON COLUMN public.email_queue.status IS
    'pending → processing → sent | failed. AutomationsPage.jsx reads pending/sent/failed.';
COMMENT ON TABLE public.email_templates IS
    'Optional server-side HTML storage for emails. Alternative to rendering React Email client-side.';
