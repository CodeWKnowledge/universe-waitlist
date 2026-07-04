-- =============================================================================
-- 001_extensions.sql
-- Purpose: Enable all required Postgres extensions before any tables are created.
-- Must be run first.
-- =============================================================================

-- UUID generation (used as primary keys everywhere)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- pg_cron: schedules recurring jobs (e.g. process-email-queue every minute)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- pg_net: makes outbound HTTP calls from within Postgres (used by pg_cron to
-- invoke Supabase Edge Functions)
CREATE EXTENSION IF NOT EXISTS pg_net;
