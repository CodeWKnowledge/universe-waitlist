# 01 — Email System Architecture Overview

> **Audience:** This document is written for non-technical founders and future developers alike.
> It describes *exactly* how the email system works — based on the actual code in this repository — with no assumptions.

---

## What Is the Email System?

The UniVerse email system is an in-house email marketing and automation platform built directly into the admin portal. It serves three core purposes:

1. **Transactional Emails** — Automatically sent when a user joins the waitlist (e.g., a Welcome Email).
2. **Broadcast Campaigns** — One-off newsletters sent from the Admin Dashboard to a selected group of subscribers.
3. **Automated Drip Sequences** — A series of scheduled emails sent to subscribers over time (e.g., Day 3, Day 7, Day 14, Day 21 after signup).

The system uses **Resend** as the email delivery provider and **Supabase** (a cloud database + serverless function platform) as the backend.

---

## The Four Layers of the System

Think of the email system like a post office with four departments:

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: Admin Dashboard (React Frontend)                  │
│  What the admin sees and interacts with                     │
│  Files: /src/features/admin/                                │
└───────────────────────┬─────────────────────────────────────┘
                        │ User actions (click "Send", "Create")
┌───────────────────────▼─────────────────────────────────────┐
│  LAYER 2: Service & Hook Layer (JavaScript Logic)           │
│  Translates user actions into database commands             │
│  Files: /src/services/email/, /src/hooks/                   │
└───────────────────────┬─────────────────────────────────────┘
                        │ Read/write data
┌───────────────────────▼─────────────────────────────────────┐
│  LAYER 3: Database Layer (Supabase / PostgreSQL)            │
│  Stores subscribers, campaigns, logs, and queues            │
│  Tables: subscribers, newsletter_campaigns, email_queue...  │
└───────────────────────┬─────────────────────────────────────┘
                        │ Deliver emails
┌───────────────────────▼─────────────────────────────────────┐
│  LAYER 4: Delivery Layer (Resend + React Email)             │
│  Converts templates to HTML and physically sends the email  │
│  Files: /src/lib/email/, /supabase/functions/               │
└─────────────────────────────────────────────────────────────┘
```

---

## Complete File Inventory

Every file that is part of the email system, and what it does:

### Email Library (`/src/lib/email/`)

| File | Purpose |
|---|---|
| `provider.js` | Creates the Resend API client using the `VITE_RESEND_API_KEY` environment variable. Defines the default sender address (`hello@universe.market`). |
| `sendEmail.js` | A low-level utility function to send a single raw HTML email. Checks if the API key exists; if not, logs a mock message to the browser console instead of crashing. |
| `react-templates/WelcomeEmail.jsx` | The React Email component for the welcome email sent to new waitlist signups. Uses Tailwind CSS classes (compiled by `@react-email`). Accepts `firstName` and `referralLink` as props. |
| `react-templates/OnboardingSequence.jsx` | A single React Email component that renders different content depending on the `day` prop (3, 7, 14, or 21). Used for the automated drip campaign. |
| `react-templates/Transactional.jsx` | A generic, reusable transactional email template for account-related messages (e.g., password reset). Accepts `title` and `message` props. |
| `templates/WelcomeEmail.js` | An **older, plain JavaScript** version of the welcome email that generates raw HTML as a string using template literals. This is a legacy file; the React-based version in `react-templates/` is the preferred approach. |

### Service Layer (`/src/services/`)

| File | Purpose |
|---|---|
| `email/emailService.js` | The core email dispatch service. Has three functions: `sendReactEmail` (renders a React Email component to HTML and calls Resend), `sendWelcomeEmail` (a convenience wrapper for new signups), and `sendBatchBroadcast` (currently a **mock** that simulates batch sending). |
| `email/campaignService.js` | Manages the full lifecycle of a broadcast campaign: create a draft, update it, schedule it, and trigger the broadcast. When sending, it fetches the campaign and its target subscribers from Supabase, then calls `emailService.sendBatchBroadcast`. |
| `email/analyticsService.js` | A simple analytics helper that fetches `totalSubscribers` and `totalEmailsSent` from Supabase. The `openRate` and `clickRate` are **currently hardcoded mock values** (`68%` and `24%`). |
| `newsletter/newsletterService.js` | Called when a user submits the waitlist form. Checks if the email already exists in the `subscribers` table, inserts a new record if not, then fires a Welcome Email in the background (non-blocking — the form submission succeeds even if the email fails). |
| `newsletter/subscriberService.js` | A simpler subscriber insertion utility. Note: this references functions (`getNewsletterSubscriberByEmail`, `insertNewsletterSubscriber`) that do not exist in the current `queries.js` file. **This file is partially broken.** |
| `analytics/analytics.service.js` | A general-purpose frontend analytics tracker (for events like "waitlist joined", "referral copied"). Currently logs to the console only; it's prepared for PostHog or Google Analytics integration but not connected to any third-party service yet. |

### Admin React Hooks (`/src/hooks/`)

Hooks are JavaScript functions that connect React components to the database. Each hook fetches data from Supabase and provides helper actions.

| Hook | Reads From | Provides |
|---|---|---|
| `useAdminSubscribers.js` | `subscribers` table | Paginated subscriber list, search, status filter, CSV export |
| `useAdminCampaigns.js` | `newsletter_campaigns` table | Campaign list, create draft, delete, update status |
| `useAdminAudiences.js` | `audiences` + `audience_subscribers` tables | Audience list with subscriber counts, create, delete |
| `useAdminSequences.js` | `email_sequences` + `sequence_steps` + `sequence_subscribers` | Sequence list with step counts and active users, create, update status |
| `useAdminMetrics.js` | Multiple tables | All Overview dashboard KPIs (total subscribers, emails sent, open rate, referrals, etc.) |
| `useAdminReferrals.js` | `referral_tracking` table | Referral list |

### Admin Dashboard Pages (`/src/features/admin/pages/`)

| Page | URL Route | Purpose |
|---|---|---|
| `Overview.jsx` | `/admin/overview` | KPI cards, subscriber growth chart, source breakdown pie chart, recent signups table |
| `WaitlistPage.jsx` | `/admin/waitlist` | Searchable table of all subscribers with `status = 'waitlist'`. Has CSV export. |
| `SubscribersPage.jsx` | `/admin/subscribers` | Searchable and filterable table of ALL subscribers across all statuses. Has CSV export. |
| `AudiencesPage.jsx` | `/admin/audiences` | Create and delete named audience groups. Displays subscriber count per audience. |
| `CampaignsPage.jsx` | `/admin/campaigns` | Full campaign workflow: create draft → design in EmailBuilder → assign audience → Send or Schedule. |
| `AutomationsPage.jsx` | `/admin/automations` | Create and manage drip sequences. Allows activating/pausing sequences. |
| `TemplatesPage.jsx` | `/admin/templates` | **Placeholder only.** Displays a "coming soon" message. |
| `AnalyticsPage.jsx` | `/admin/analytics` | Renders a 14-day email performance chart with **randomly generated mock data**. |
| `ReferralsPage.jsx` | `/admin/referrals` | Referral tracking (not email-specific). |
| `SettingsPage.jsx` | `/admin/settings` | Static display of email configuration (API key masked, default sender). No live editing. |

### Email Builder Components (`/src/features/admin/components/email-builder/`)

| Component | Purpose |
|---|---|
| `EmailBuilder.jsx` | The visual drag-and-drop (actually click-to-add) email editor. Left panel: block palette + properties editor. Middle panel: canvas with live editing. Right panel: live preview. Supports Heading, Text, Image, Button, and Divider blocks. |
| `EmailRenderer.jsx` | The rendering engine. Takes the JSON block array and converts each block into a real `@react-email` component (`<Heading>`, `<Text>`, `<Button>`, `<Img>`, `<Hr>`). Used in both preview mode (no `<Html>` wrapper) and send mode (full `<Html>` wrapper). Always includes a branded UniVerse header and a footer. |

### Edge Function (`/supabase/functions/process-email-queue/`)

| File | Purpose |
|---|---|
| `index.ts` | A Deno-based serverless function deployed to Supabase. Reads the `email_queue` table for pending emails whose `scheduled_for` time has passed. Processes them in batches of 10. Sends each email via the Resend HTTP API directly (not the npm package). Updates the queue item to `completed` or `failed` and inserts a record into `email_logs`. |

### Supabase Database Client (`/src/lib/supabase/`)

| File | Purpose |
|---|---|
| `client.js` | Creates and exports the global Supabase client instance using the environment variables. Falls back gracefully if variables are missing. |
| `config.js` | Reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the environment. |
| `constants.js` | Defines string constants for all database table names (e.g., `TABLES.EMAIL_LOGS = 'email_logs'`). |
| `queries.js` | A collection of pre-built Supabase database query functions (insert subscriber, get subscriber by email, log email event, get campaigns). Also exposes the raw `supabase` client for advanced queries. |

---

## Flow 1: User Joins Waitlist → Welcome Email Sent

This is the most critical automated email path.

```
User fills out waitlist form
         │
         ▼
newsletterService.subscribeFromWaitlist() called
         │
         ▼
queries.getSubscriberByEmail()  ─── Already exists? ──► Return existing record (no duplicate email)
         │ (new user)
         ▼
queries.insertSubscriber() → Inserts into `subscribers` table
         │
         ▼
emailService.sendWelcomeEmail() called (fire-and-forget)
         │
         ▼
emailService.sendReactEmail() called
         │
         ▼
React.createElement(WelcomeEmail, { firstName, referralLink })
         │
         ▼
@react-email/render() → Converts React component to pure HTML string
         │
         ▼
Is VITE_RESEND_API_KEY set?
         │
    YES  │  NO
         │   └──► console.log("[Email Mock]") → Stops here in development
         ▼
emailProvider.emails.send({ from, to, subject, html })
         │
         ▼
Resend API delivers the email to the user's inbox
```

---

## Flow 2: Admin Sends a Broadcast Campaign

```
Admin clicks "Send Now" on a draft campaign
         │
         ▼
campaignService.sendBroadcast(campaignId)
         │
         ▼
Fetch campaign from `newsletter_campaigns` table
         │
         ▼
Does campaign have an audience_id?
         │
    YES  │  NO
         │   └──► Query ALL subscribers from `subscribers` table
         ▼
Query `audience_subscribers` for matching subscriber_ids
         │
         ▼
Query `subscribers` table WHERE id IN [subscriber_ids]
         │
         ▼
Update campaign status → 'processing' in database
         │
         ▼
emailService.sendBatchBroadcast(campaign, subscribers)
         │
         ▼ ← ⚠️ THIS IS A MOCK — No real emails are sent here yet
console.log("[Batch Broadcast] Sending...")
         │
         ▼
Insert one row per subscriber into `email_logs` (status: 'delivered')
         │
         ▼
Update campaign status → 'sent' in database
```

> **⚠️ Critical Note:** The `sendBatchBroadcast` function is **currently a simulation**. It logs to the console but does NOT call the Resend API. Real emails are **not physically sent** during a manual broadcast. This must be implemented before production.

---

## Flow 3: Automated Drip Sequence (Onboarding Emails)

```
(This happens in the background, on a schedule)

Every 1 hour: Supabase pg_cron triggers the Edge Function
         │
         ▼
supabase/functions/process-email-queue/index.ts runs
         │
         ▼
Query `email_queue` WHERE status='pending' AND scheduled_for <= NOW()
LIMIT 10
         │
         ▼
For each queue item:
    Fetch subscriber from related `subscribers` table
         │
         ▼
    generateEmailContent(email_type, firstName) creates HTML string
         │ (e.g., email_type = 'onboarding_day_3')
         ▼
    POST https://api.resend.com/emails
    { from, to: subscriber.email, subject, html }
         │
         ▼
    If Resend responds OK:
        Update `email_queue` row → status = 'completed'
        Insert into `email_logs` → delivery_status = 'delivered'
         │
    If Resend responds with error:
        Update `email_queue` row → status = 'failed'
```

> **Note:** For this flow to work, rows must be pre-inserted into the `email_queue` table with correct `scheduled_for` timestamps. A database trigger or a one-time script populates this queue when a subscriber is first created.

---

## Flow 4: Visual Email Builder → Save → Send

```
Admin opens CampaignsPage → clicks "New Campaign"
         │
         ▼
Admin fills: Campaign Title, Subject Line, Target Audience
         │
         ▼
Admin uses EmailBuilder.jsx to build the email
  ┌─────────────────────────────────────┐
  │  Left Panel:  Add Heading, Text,   │
  │               Image, Button, Divider│
  │  Middle Panel: Live click-to-edit   │
  │               canvas               │
  │  Right Panel: Desktop/Mobile live   │
  │               preview via           │
  │               EmailRenderer.jsx     │
  └─────────────────────────────────────┘
         │
         ▼
Admin clicks "Save Draft"
         │
         ▼
campaignService.createDraft() or campaignService.updateCampaign()
         │
         ▼
Saves this JSON to `newsletter_campaigns.blocks` column in Supabase:
[
  { "id": "abc123", "type": "heading", "content": "Big News!", "styles": {"align": "center"} },
  { "id": "def456", "type": "button",  "content": "Learn More", "url": "https://...", "styles": {...} }
]
         │
         ▼
Admin returns to list → clicks "Send" icon on the draft
         │
         ▼
campaignService.sendBroadcast() ← (See Flow 2 above)
```

---

## Database Tables Summary

| Table Name | What It Stores |
|---|---|
| `subscribers` | Every person who has joined the waitlist or platform. Has `email`, `first_name`, `last_name`, `status`, `source`, `tags` (an array of strings like `university:unilag`). |
| `newsletter_campaigns` | Email campaign metadata: `title`, `subject`, `status` (draft/scheduled/processing/sent), `blocks` (the JSON from the builder), `audience_id`, `schedule_date`. |
| `audiences` | Named subscriber lists (e.g., "VIP Early Access"). Just a name + description. |
| `audience_subscribers` | The join table linking subscribers to audiences. Has `audience_id` and `subscriber_id` columns. |
| `email_sequences` | Automation sequences (e.g., "Waitlist Nurturing"). Has `name`, `trigger_event`, `status`. |
| `sequence_steps` | Individual steps within a sequence (e.g., "Send Day 3 email"). Has `step_number`, `email_type`, `delay_days`. |
| `sequence_subscribers` | Tracks which subscribers are enrolled in which sequences and at what step. |
| `email_logs` | A historical log of every email sent. Has `subscriber_id`, `campaign_id`, `email_type`, `delivery_status`, `opened` (bool), `clicked` (bool). |
| `email_queue` | The scheduler queue for automated emails. Has `subscriber_id`, `email_type`, `status` (pending/completed/failed), `scheduled_for` (timestamp). |
| `referral_tracking` | Tracks referral codes, who referred whom, and `conversion_status`. |
| `email_templates` | (Registered as a constant but not yet used in UI) Intended for storing reusable template HTML in the database. |
