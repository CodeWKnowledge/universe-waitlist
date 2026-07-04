-- =============================================================================
-- 009_indexes_and_cron.sql
-- Purpose: Performance indexes and the pg_cron job to fire process-email-queue.
--
-- Run LAST — all tables must exist before indexes are created.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- subscribers
-- ---------------------------------------------------------------------------

-- getSubscriberByEmail() — called on every waitlist signup
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_email
    ON public.subscribers (email);

-- useAdminSubscribers.js filters by status and source
CREATE INDEX IF NOT EXISTS idx_subscribers_status
    ON public.subscribers (status);

CREATE INDEX IF NOT EXISTS idx_subscribers_source
    ON public.subscribers (source);

-- useAdminMetrics.js: subscriber counts by date range
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at
    ON public.subscribers (created_at DESC);

-- ---------------------------------------------------------------------------
-- referral_tracking
-- ---------------------------------------------------------------------------

-- getReferralByCode() — called every time a referral link is used
CREATE UNIQUE INDEX IF NOT EXISTS idx_referral_code
    ON public.referral_tracking (referral_code);

-- getReferralsForUser() — leaderboard in useAdminReferrals.js
CREATE INDEX IF NOT EXISTS idx_referral_referrer_id
    ON public.referral_tracking (referrer_id);

-- useAdminMetrics.js: COUNT converted referrals
CREATE INDEX IF NOT EXISTS idx_referral_conversion_status
    ON public.referral_tracking (conversion_status);

-- ---------------------------------------------------------------------------
-- newsletter_campaigns
-- ---------------------------------------------------------------------------

-- getCampaigns() orders by created_at DESC
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at
    ON public.newsletter_campaigns (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_campaigns_status
    ON public.newsletter_campaigns (status);

-- ---------------------------------------------------------------------------
-- email_queue
-- ---------------------------------------------------------------------------

-- process-email-queue polls: WHERE status = 'pending' ORDER BY scheduled_for
CREATE INDEX IF NOT EXISTS idx_email_queue_status_scheduled
    ON public.email_queue (status, scheduled_for ASC);

-- AutomationsPage: COUNT by status
CREATE INDEX IF NOT EXISTS idx_email_queue_status
    ON public.email_queue (status);

-- ---------------------------------------------------------------------------
-- email_logs
-- ---------------------------------------------------------------------------

-- useAdminMetrics.js + AnalyticsPage: aggregate over time ranges
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at
    ON public.email_logs (created_at DESC);

-- useAdminMetrics.js: COUNT WHERE opened = TRUE
CREATE INDEX IF NOT EXISTS idx_email_logs_opened
    ON public.email_logs (opened) WHERE opened = TRUE;

-- useAdminMetrics.js: COUNT WHERE clicked = TRUE
CREATE INDEX IF NOT EXISTS idx_email_logs_clicked
    ON public.email_logs (clicked) WHERE clicked = TRUE;

-- analyticsService.js: COUNT WHERE delivery_status = 'delivered'
CREATE INDEX IF NOT EXISTS idx_email_logs_delivery_status
    ON public.email_logs (delivery_status);

-- campaignService.js / process-email-queue: look up logs by campaign
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign_id
    ON public.email_logs (campaign_id);

-- ---------------------------------------------------------------------------
-- audience_subscribers
-- ---------------------------------------------------------------------------

-- campaignService.js: get all subscriber IDs for a given audience
CREATE INDEX IF NOT EXISTS idx_audience_subscribers_audience_id
    ON public.audience_subscribers (audience_id);

-- ---------------------------------------------------------------------------
-- sequence_subscribers
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_sequence_subscribers_sequence_id
    ON public.sequence_subscribers (sequence_id);

-- ---------------------------------------------------------------------------
-- pg_cron — process-email-queue every minute
-- ---------------------------------------------------------------------------
-- Replace the anon key below with your project's actual anon key if it changes.
-- The edge function is invoked via HTTP POST from inside Postgres.
-- service_role key is preferred here so the Edge Function has elevated access.
-- Store it via: supabase secrets set CRON_AUTH_TOKEN=<service_role_key>
-- Then reference it below — OR hard-code the anon key for minimal privilege.

SELECT cron.schedule(
    'process-email-queue',      -- job name (must be unique)
    '* * * * *',                -- every minute
    $$
    SELECT net.http_post(
        url     := 'https://ndrmttzvfqntcipsfins.supabase.co/functions/v1/process-email-queue',
        headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kcm10dHp2ZnFudGNpcHNmaW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTE1MjIsImV4cCI6MjA5NjQyNzUyMn0.Gk-pBwjJIuV2DkHWsFtej4DrvRxeAwpm8xmtI7uJsNw"}'::JSONB,
        body    := '{}'::JSONB
    );
    $$
);
