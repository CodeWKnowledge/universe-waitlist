# UniVerse Waitlist — Supabase Database

## Quick Start (Fresh Deployment)

Run the migration files **in order** in the Supabase SQL Editor, or via the CLI:

```bash
supabase db push
```

### Migration Order

| # | File | Purpose |
|---|---|---|
| 1 | `001_extensions.sql` | Enable `uuid-ossp`, `pg_cron`, `pg_net` |
| 2 | `002_subscribers.sql` | Core subscribers table |
| 3 | `003_referrals.sql` | Referral tracking |
| 4 | `004_newsletter.sql` | Campaigns, audiences, membership |
| 5 | `005_email_system.sql` | Email logs, queue, templates |
| 6 | `006_sequences.sql` | Automation sequences & steps |
| 7 | `007_admin.sql` | Admin roles + `is_admin()` function |
| 8 | `008_rls_policies.sql` | All Row Level Security policies |
| 9 | `009_indexes_and_cron.sql` | Performance indexes + pg_cron job |

### After Migration: First Admin User

```bash
# Run the seed file after creating your user in Supabase Auth dashboard
# Edit seeds/seed_admin.sql with your real UUID first
```

Or run in the SQL Editor:
```sql
INSERT INTO public.admin_roles (user_id)
VALUES ('<your-auth-user-uuid>');
```

---

## Edge Functions

Deploy all edge functions before going live:

```bash
supabase functions deploy send-email --no-verify-jwt
supabase functions deploy send-broadcast --no-verify-jwt
supabase functions deploy process-email-queue --no-verify-jwt
supabase functions deploy resend-webhook --no-verify-jwt
supabase functions deploy unsubscribe --no-verify-jwt
```

Set the required secret:

```bash
supabase secrets set RESEND_API_KEY=re_your_key_here
supabase secrets set PUBLIC_SITE_URL=https://your-domain.com
```

---

## Required Environment Variables

### Frontend (`.env`)
```
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

### Supabase Secrets (Edge Functions)
```
RESEND_API_KEY=re_...
PUBLIC_SITE_URL=https://your-domain.com
```

---

## Database Schema Overview

```
subscribers              ← core user table (waitlist + newsletter)
  └── referral_tracking  ← referral codes owned by subscribers
  └── email_logs         ← delivery receipts per subscriber
  └── email_queue        ← pending outbound jobs
  └── sequence_subscribers

newsletter_campaigns     ← email campaign records
  └── email_queue        ← queued sends for a campaign
  └── email_logs         ← delivery log for a campaign

audiences                ← named subscriber lists
  └── audience_subscribers (join table)

email_sequences          ← drip automation workflows
  └── sequence_steps     ← ordered steps in a sequence
  └── sequence_subscribers ← enrolled users

email_templates          ← stored HTML bodies (optional)

admin_roles              ← Supabase Auth user whitelist for /admin
```

---

## Access Control Summary

| Actor | subscribers | campaigns | audiences | email_queue | admin_roles |
|---|---|---|---|---|---|
| **anon** | INSERT, SELECT, UPDATE | — | — | INSERT | — |
| **admin** | ALL | ALL | ALL | ALL | ALL |
| **service_role** | ALL (bypasses RLS) | ALL | ALL | ALL | ALL |
