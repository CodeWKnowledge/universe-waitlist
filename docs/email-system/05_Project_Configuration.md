# 05 — Project Configuration Guide

> This document explains how to connect Resend and Supabase to the UniVerse project in every environment: local development, staging, and production.

---

## Understanding Environment Variables

Environment variables are configuration values that the application reads at startup. They are stored outside the code so that:
1. Sensitive values (like API keys) are not embedded in the code itself.
2. Different configurations can be used in development vs. production without changing any code.

In this project, environment variables are stored in a file called `.env` in the root of the `waitlist` folder.

> **⚠️ Security Rule:** The `.env` file must **never** be committed to GitHub. Verify that the file `.gitignore` in the project root contains the line `.env`.

---

## Required Environment Variables

### For the Frontend Application (Vite/React)

All frontend environment variables must start with `VITE_`. Variables without this prefix are invisible to the React application.

---

#### `VITE_SUPABASE_URL`
| Property | Value |
|---|---|
| **Variable Name** | `VITE_SUPABASE_URL` |
| **Purpose** | The URL of your Supabase project. This tells the app where to connect to your database. |
| **Format** | `https://[your-project-id].supabase.co` |
| **Current Value** | `https://ndrmttzvfqntcipsfins.supabase.co` |
| **Where it is used** | `src/lib/supabase/config.js` → `src/lib/supabase/client.js` |
| **How to find it** | Log into [supabase.com](https://supabase.com) → Your Project → Settings → API → Project URL |

---

#### `VITE_SUPABASE_ANON_KEY`
| Property | Value |
|---|---|
| **Variable Name** | `VITE_SUPABASE_ANON_KEY` |
| **Purpose** | The anonymous (public) key for Supabase. Used for all read/write operations from the browser. It is safe to expose because Supabase's Row Level Security (RLS) policies limit what it can do. |
| **Format** | A long JWT token starting with `eyJ...` |
| **Where it is used** | `src/lib/supabase/config.js` → `src/lib/supabase/client.js` |
| **How to find it** | Supabase → Your Project → Settings → API → Project API Keys → `anon (public)` |

---

#### `VITE_RESEND_API_KEY`
| Property | Value |
|---|---|
| **Variable Name** | `VITE_RESEND_API_KEY` |
| **Purpose** | Authenticates the React app with the Resend email delivery service. Used when `emailService.js` sends transactional emails (like the Welcome Email). |
| **Format** | `re_XXXXXXXXXXXXXXXXXXXXXXXXX` |
| **Where it is used** | `src/lib/email/provider.js` → used by `emailService.js` and `sendEmail.js` |
| **How to find it** | Log into [resend.com](https://resend.com) → API Keys → Create API Key |
| **Security Note** | ⚠️ Because this has the `VITE_` prefix, it is visible in the browser's JavaScript bundle. For production, create a separate "sending" Edge Function in Supabase so the key lives server-side only. Use a restricted key (domains only, not full access) for the frontend until then. |

---

### For the Supabase Edge Function

The Edge Function (`supabase/functions/process-email-queue/index.ts`) runs on Supabase's servers, not in the browser. It uses a different set of environment variables called **Secrets**, which are set via the Supabase CLI or dashboard.

---

#### `RESEND_API_KEY` (Edge Function Secret)
| Property | Value |
|---|---|
| **Variable Name** | `RESEND_API_KEY` |
| **Purpose** | The Resend API key used by the server-side Edge Function to dispatch automated queue emails. |
| **How to find it** | Resend Dashboard → API Keys |
| **How to set it** | `supabase secrets set RESEND_API_KEY=re_XXXXXXXX` |
| **Why different from `VITE_RESEND_API_KEY`** | This one lives on the server — it is never exposed to browsers. Use a **Full Access** key here. |

---

#### `SUPABASE_URL` (Edge Function Secret)
| Property | Value |
|---|---|
| **Variable Name** | `SUPABASE_URL` |
| **Purpose** | The Edge Function's Supabase client needs to connect back to the database to read the email queue and write logs. |
| **How to set it** | `supabase secrets set SUPABASE_URL=https://[your-project-id].supabase.co` |

---

#### `SUPABASE_SERVICE_ROLE_KEY` (Edge Function Secret)
| Property | Value |
|---|---|
| **Variable Name** | `SUPABASE_SERVICE_ROLE_KEY` |
| **Purpose** | The service role key bypasses Row Level Security. This is required because the Edge Function needs to read from the `email_queue` (which has RLS enabled for security) without being authenticated as a specific user. |
| **How to find it** | Supabase → Your Project → Settings → API → Project API Keys → `service_role (secret)` |
| **How to set it** | `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJ...` |
| **⚠️ Security Warning** | This key has ADMIN-level access to your entire database. Never expose it in the browser or commit it to Git. |

---

## Local Development Setup

### Prerequisites

You need the following installed on your computer:
- [Node.js](https://nodejs.org) (v18 or later) — the JavaScript runtime
- [npm](https://www.npmjs.com) (comes with Node.js) — the package manager
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for deploying Edge Functions)
- A code editor (VS Code is recommended)

### Step 1: Install Dependencies

Open a terminal, navigate to the `waitlist` folder, and run:

```bash
npm install
```

This reads `package.json` and installs all required libraries into the `node_modules` folder. This only needs to be done once (and again whenever `package.json` changes).

### Step 2: Configure Environment Variables

1. The `.env` file already exists in the `waitlist` folder with the following variables:
   ```env
   VITE_SUPABASE_URL=https://ndrmttzvfqntcipsfins.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   VITE_RESEND_API_KEY=re_PeWC1XEc_...
   ```
2. These values are already configured for the current Supabase project. No changes are needed for local development.
3. If you ever need to test without actually sending real emails, you can temporarily rename or empty the `VITE_RESEND_API_KEY` value. The app will fall back to logging email content to the browser console.

### Step 3: Start the Development Server

```bash
npm run dev
```

The terminal will show something like:
```
  VITE v8.0.12  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser and navigate to `http://localhost:5173` to see the waitlist page.
Navigate to `http://localhost:5173/admin` to access the admin dashboard.

### Step 4: Test the Email Connection

In development, the app operates in "mock mode" — emails are not physically sent even with a real API key, because:
- `emailService.sendBatchBroadcast()` is a stub (no real Resend call)
- The development server is running locally on your laptop, not on a server

To test real email delivery:
1. Ensure `VITE_RESEND_API_KEY` is set to your real key
2. Ensure your domain is verified in Resend
3. Submit the waitlist form with your own email address
4. Check your inbox — you should receive the Welcome Email within 1–2 minutes

> **Tip:** The Welcome Email is the only email currently sent from the browser-side code. The others (onboarding sequences) are handled by the Supabase Edge Function which requires separate deployment.

---

## Deploying the Edge Function

The Edge Function is the server-side component that processes the email queue for automated sequences.

### Prerequisites

Install the Supabase CLI:
```bash
npm install -g supabase
```

Log in:
```bash
supabase login
```

Link your local project to the Supabase cloud project:
```bash
supabase link --project-ref ndrmttzvfqntcipsfins
```

### Set Edge Function Secrets

```bash
supabase secrets set RESEND_API_KEY=re_XXXXXXXXXX
supabase secrets set SUPABASE_URL=https://ndrmttzvfqntcipsfins.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...
```

### Deploy the Edge Function

```bash
supabase functions deploy process-email-queue
```

After deployment, your Edge Function will be available at:
`https://ndrmttzvfqntcipsfins.supabase.co/functions/v1/process-email-queue`

### Configure the Cron Job (Automated Schedule)

To make the Edge Function run automatically every hour, log into the Supabase Dashboard and go to:

**SQL Editor** → **New Query** → Paste and run the following SQL:

```sql
-- Enable pg_cron extension (if not already enabled)
-- Go to Supabase Dashboard → Database → Extensions → Enable pg_cron

-- Create the cron job
SELECT cron.schedule(
  'process-email-queue',          -- Job name
  '0 * * * *',                    -- Every hour at minute 0
  $$
  SELECT net.http_post(
    url := 'https://ndrmttzvfqntcipsfins.supabase.co/functions/v1/process-email-queue',
    headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."}'::jsonb
  );
  $$
);
```

Replace the `Bearer` token with your project's `anon` key.

To verify the cron job is registered:
```sql
SELECT * FROM cron.job;
```

To remove it if needed:
```sql
SELECT cron.unschedule('process-email-queue');
```

---

## Production Deployment Setup (Vercel)

The frontend is deployed to [Vercel](https://vercel.com). The `vercel.json` file in the project root is already configured.

### Setting Production Environment Variables in Vercel

1. Log into your [Vercel Dashboard](https://vercel.com).
2. Select your project.
3. Go to **Settings** → **Environment Variables**.
4. Add the following variables:

   | Variable Name | Value | Environment |
   |---|---|---|
   | `VITE_SUPABASE_URL` | `https://ndrmttzvfqntcipsfins.supabase.co` | Production |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` (your anon key) | Production |
   | `VITE_RESEND_API_KEY` | `re_XXXXX...` (your production API key) | Production |

5. After adding variables, trigger a new deployment by pushing a commit or clicking **Redeploy** in the Vercel dashboard.

### Production Security Checklist

Before going live:
- [ ] Environment variables are set in Vercel (not hard-coded in code)
- [ ] `.env` file is in `.gitignore` and has never been committed to GitHub
- [ ] Resend domain is verified (green checkmarks for SPF, DKIM)
- [ ] Edge Function is deployed to Supabase with correct secrets
- [ ] Row Level Security is enabled on all Supabase tables
- [ ] `/admin` route is protected with authentication

---

## Database Schema (Reference)

The email system relies on these tables in your Supabase PostgreSQL database. If any of these tables are missing, features will fail silently.

To verify all tables exist, log into the Supabase Dashboard → **Table Editor** and confirm:

| Table | Required For | Key Columns |
|---|---|---|
| `subscribers` | Everything | `id`, `email`, `first_name`, `last_name`, `status`, `source`, `tags` |
| `newsletter_campaigns` | Campaign broadcasting | `id`, `title`, `subject`, `status`, `blocks` (JSONB), `audience_id` |
| `audiences` | Audience segmentation | `id`, `name`, `description` |
| `audience_subscribers` | Targeting campaigns | `audience_id`, `subscriber_id` |
| `email_sequences` | Automation sequences | `id`, `name`, `trigger_event`, `status` |
| `sequence_steps` | Automation steps | `id`, `sequence_id`, `step_number`, `email_type`, `delay_days` |
| `sequence_subscribers` | Tracking enrolled users | `id`, `sequence_id`, `subscriber_id`, `current_step` |
| `email_logs` | Delivery history | `id`, `subscriber_id`, `campaign_id`, `email_type`, `delivery_status`, `opened`, `clicked` |
| `email_queue` | Background automation | `id`, `subscriber_id`, `email_type`, `status`, `scheduled_for` |
| `referral_tracking` | Referral system | `id`, `referrer_id`, `referred_email`, `referral_code`, `conversion_status` |

If any tables are missing, you will need to run the SQL migration scripts from your Supabase dashboard. Contact the development team for the schema SQL files.
