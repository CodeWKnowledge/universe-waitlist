# Supabase Edge Functions Deployment Guide

This guide covers deploying all **4 Edge Functions** required for the UniVerse email system.
Run every command from inside the `waitlist/` project folder.

> **Your project is already linked.** You ran `supabase link --project-ref rnznmvkfgvjtorkazblf`
> successfully. Skip Steps 1–2 on this machine.

---

## Functions Overview

| Function | Purpose | JWT Required |
|---|---|---|
| `send-email` | Sends a single transactional email via Resend | No (`--no-verify-jwt`) |
| `process-email-queue` | Polls the queue and dispatches pending emails | No (`--no-verify-jwt`) |
| `send-broadcast` | Sends campaigns to large audiences via Resend Batch | Yes |
| `resend-webhook` | Receives delivery/open/click events from Resend | No (`--no-verify-jwt`) |

---

## Step 1 — Install Supabase CLI

Skip this if `supabase --version` already works (confirmed: **v2.105.0** installed).

**Windows (PowerShell):**
```powershell
# Option A — using Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Option B — using npm
npm install -g supabase
```

**Mac:**
```bash
brew install supabase/tap/supabase
```

---

## Step 2 — Login & Link Your Project

Skip this if already done (confirmed: logged in, project linked).

```bash
# Login (opens browser for token)
supabase login

# Link to your Supabase project
supabase link --project-ref rnznmvkfgvjtorkazblf
```

When prompted for the database password, use the value from your `.env` file (`SUPABASE_PASSWORD`).

---

## Step 3 — Run the Database Migrations

Go to your **Supabase Dashboard → SQL Editor** and run each file in order:

| # | File | What it creates |
|---|---|---|
| 1 | `supabase/migrations/001_extensions.sql` | pg_cron, pg_net, uuid-ossp |
| 2 | `supabase/migrations/002_subscribers.sql` | subscribers table |
| 3 | `supabase/migrations/003_referrals.sql` | referral_tracking table |
| 4 | `supabase/migrations/004_newsletter.sql` | audiences, newsletter_campaigns, audience_subscribers |
| 5 | `supabase/migrations/005_email_system.sql` | email_logs, email_queue, email_templates |
| 6 | `supabase/migrations/006_sequences.sql` | email_sequences, sequence_steps, sequence_subscribers |
| 7 | `supabase/migrations/007_admin.sql` | admin_roles, is_admin() function |
| 8 | `supabase/migrations/008_rls_policies.sql` | All Row Level Security policies |
| 9 | `supabase/migrations/009_indexes_and_cron.sql` | Performance indexes + pg_cron job |

> **Important**: Run them strictly in order. Each file depends on tables from the previous one.

After running 007, also run the seed file to create your first admin:
```
supabase/seeds/seed_admin.sql
```
(Replace the placeholder UUID with your real Auth user UUID first.)

---

## Step 4 — Set Secrets (Server-Side Environment Variables)

These secrets live **only on the server** and are never exposed to the browser:

```bash
# Your Resend API key (get from resend.com → API Keys)
supabase secrets set RESEND_API_KEY="re_your_resend_key_here"

# Your public site URL (used to build unsubscribe links in emails)
supabase secrets set PUBLIC_SITE_URL="https://universe-waitlist.pxxl.pro"
```

> **Never** put `RESEND_API_KEY` in your `.env` file with the `VITE_` prefix.
> The `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically injected into
> Edge Functions by Supabase — you do not need to set them manually.

---

## Step 5 — Deploy All 4 Functions

```bash
# 1. Transactional emails (welcome, onboarding)
supabase functions deploy send-email --no-verify-jwt

# 2. Scheduled queue processor (invoked by pg_cron every minute)
supabase functions deploy process-email-queue --no-verify-jwt

# 3. Campaign broadcast sender (called from admin dashboard)
supabase functions deploy send-broadcast

# 4. Resend delivery webhook (tracks opens, clicks, bounces)
supabase functions deploy resend-webhook --no-verify-jwt
```

> `--no-verify-jwt` allows the function to be called without a logged-in user session.
> This is required for pg_cron, email link clicks, and Resend webhook callbacks.

Verify all 5 are deployed:
```bash
supabase functions list
```

---

## Step 6 — Set Up the Resend Webhook (for Analytics)

This enables real open/click tracking in the Analytics dashboard.

1. Go to [resend.com](https://resend.com) → your account → **Webhooks**
2. Click **Add Webhook**
3. Set the endpoint URL to:
   ```
   https://rnznmvkfgvjtorkazblf.supabase.co/functions/v1/resend-webhook
   ```
4. Enable these events: `email.sent`, `email.delivered`, `email.opened`, `email.clicked`, `email.bounced`, `email.complained`
5. Copy the **Signing Secret** Resend shows you, then run:
   ```bash
   supabase secrets set RESEND_WEBHOOK_SECRET="your_webhook_signing_secret"
   ```
6. Redeploy the webhook function to pick up the new secret:
   ```bash
   supabase functions deploy resend-webhook --no-verify-jwt
   ```

---

## Step 7 — Verify Everything Works

| Test | Expected Result |
|---|---|
| Admin Dashboard → Automations → **Process Queue Now** | Returns `{ processed: N }`, no error |
| Submit a waitlist signup with a new email | Welcome email arrives within 60 seconds |
| Dashboard → Analytics | Real sent/opened/clicked counts (after webhook is live) |
| Supabase Dashboard → Edge Functions | All 4 functions show green invocation logs |

---

## Troubleshooting

| Error | Fix |
|---|---|
| `FunctionsFetchError` or `CORS` | Function not deployed yet. Run the deploy commands in Step 5. |
| `RESEND_API_KEY not set` | Run `supabase secrets set RESEND_API_KEY="..."` and redeploy. |
| `No pending emails` | Normal if queue is empty. Submit a new test signup first. |
| `relation does not exist` | A migration was skipped. Re-run the migrations in order. |
| `invalid_jwt` / 401 | Function needs `--no-verify-jwt` flag. Redeploy with that flag. |
| Email not delivered | Check Resend Dashboard → Logs. Verify domain DNS is correct. |
| `pg_net` not found | Run `001_extensions.sql` first — it enables the pg_net extension. |
