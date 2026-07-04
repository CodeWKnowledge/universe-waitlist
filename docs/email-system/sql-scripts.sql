-- ==========================================
-- UniVerse Email System Setup Scripts
-- ==========================================

-- 1. Enable pg_cron extension (Must be run by a superuser)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Create the Trigger for Auto-Queuing Onboarding Emails
-- This trigger automatically adds users to the email_queue for the 3, 7, 14, and 21 day onboarding sequences
-- when they are inserted into the subscribers table.

CREATE OR REPLACE FUNCTION queue_onboarding_sequence()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert Day 3 email
  INSERT INTO email_queue (subscriber_id, email_type, scheduled_for, status)
  VALUES (NEW.id, 'onboarding_day_3', NOW() + INTERVAL '3 days', 'pending');

  -- Insert Day 7 email
  INSERT INTO email_queue (subscriber_id, email_type, scheduled_for, status)
  VALUES (NEW.id, 'onboarding_day_7', NOW() + INTERVAL '7 days', 'pending');

  -- Insert Day 14 email
  INSERT INTO email_queue (subscriber_id, email_type, scheduled_for, status)
  VALUES (NEW.id, 'onboarding_day_14', NOW() + INTERVAL '14 days', 'pending');

  -- Insert Day 21 email
  INSERT INTO email_queue (subscriber_id, email_type, scheduled_for, status)
  VALUES (NEW.id, 'onboarding_day_21', NOW() + INTERVAL '21 days', 'pending');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to the subscribers table
DROP TRIGGER IF EXISTS trg_queue_onboarding_sequence ON subscribers;
CREATE TRIGGER trg_queue_onboarding_sequence
AFTER INSERT ON subscribers
FOR EACH ROW
EXECUTE FUNCTION queue_onboarding_sequence();


-- 3. Setup the Cron Job to process the queue every 5 minutes
-- This calls the Edge Function 'process-email-queue'

SELECT cron.schedule(
  'process-email-queue-job',
  '*/5 * * * *', -- Every 5 minutes
  $$
  SELECT net.http_post(
      url:='https://[PROJECT_REF].supabase.co/functions/v1/process-email-queue',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer [SERVICE_ROLE_KEY]"}'::jsonb
  ) as request_id;
  $$
);

-- Note: Replace [PROJECT_REF] with your actual Supabase project ID.
-- Replace [SERVICE_ROLE_KEY] with your actual Supabase service role key.
