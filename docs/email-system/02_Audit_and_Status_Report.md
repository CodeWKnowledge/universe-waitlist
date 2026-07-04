# 02 — Complete Audit & Feature Status Report

> This report is the result of a complete end-to-end code inspection of every file in the email system.
> Each feature's status is determined from the actual source code, not assumptions.

---

## Complete Codebase File Index

### Delivery & Provider
- `src/lib/email/provider.js` — Resend client initialization
- `src/lib/email/sendEmail.js` — Low-level HTML email sender
- `src/lib/email/react-templates/WelcomeEmail.jsx` — Welcome email React template
- `src/lib/email/react-templates/OnboardingSequence.jsx` — Drip sequence React template (4 days)
- `src/lib/email/react-templates/Transactional.jsx` — Generic transactional React template
- `src/lib/email/templates/WelcomeEmail.js` — Legacy HTML string template (superseded)

### Services
- `src/services/email/emailService.js` — Core dispatch service (sendReactEmail, sendWelcomeEmail, sendBatchBroadcast)
- `src/services/email/campaignService.js` — Campaign lifecycle (create, update, schedule, broadcast)
- `src/services/email/analyticsService.js` — Metrics aggregation service
- `src/services/newsletter/newsletterService.js` — Waitlist-to-subscriber pipeline
- `src/services/newsletter/subscriberService.js` — Direct subscriber insertion utility
- `src/services/analytics/analytics.service.js` — Frontend event tracker (console-only currently)

### React Hooks
- `src/hooks/useAdminSubscribers.js` — Paginated subscriber data with search/filter/export
- `src/hooks/useAdminCampaigns.js` — Campaign CRUD operations
- `src/hooks/useAdminAudiences.js` — Audience CRUD with subscriber counts
- `src/hooks/useAdminSequences.js` — Sequence CRUD with step counts and active users
- `src/hooks/useAdminMetrics.js` — Overview KPI aggregation (9 parallel Supabase queries)
- `src/hooks/useAdminReferrals.js` — Referral tracking data

### Admin Dashboard Pages
- `src/features/admin/pages/Overview.jsx` — KPI dashboard
- `src/features/admin/pages/WaitlistPage.jsx` — Waitlist-filtered subscriber table
- `src/features/admin/pages/SubscribersPage.jsx` — All subscribers with filters
- `src/features/admin/pages/AudiencesPage.jsx` — Audience management
- `src/features/admin/pages/CampaignsPage.jsx` — Campaign builder and broadcaster
- `src/features/admin/pages/AutomationsPage.jsx` — Drip sequence management
- `src/features/admin/pages/TemplatesPage.jsx` — Templates placeholder
- `src/features/admin/pages/AnalyticsPage.jsx` — Analytics charts (mocked data)
- `src/features/admin/pages/SettingsPage.jsx` — Static configuration display

### Email Builder
- `src/features/admin/components/email-builder/EmailBuilder.jsx` — Visual block editor (add, edit, reorder, delete blocks)
- `src/features/admin/components/email-builder/EmailRenderer.jsx` — JSON-to-React-Email renderer

### Database & Backend
- `src/lib/supabase/client.js` — Supabase JavaScript client
- `src/lib/supabase/config.js` — Environment variable reader
- `src/lib/supabase/constants.js` — Table name constants
- `src/lib/supabase/queries.js` — Pre-built query functions
- `supabase/functions/process-email-queue/index.ts` — Deno Edge Function for automated queue processing

---

## Feature Status Report

---

### 1. Resend Integration

**Current Status: ✅ Fully Functional (with important caveats)**

**Purpose:** Connect the application to the Resend email delivery API so that emails can be physically dispatched.

**Current Implementation:**
- `provider.js` initializes the Resend SDK using `import.meta.env.VITE_RESEND_API_KEY`.
- Both `sendEmail.js` and `emailService.js` check for the key before calling Resend — if the key is absent, they fall back to a console log (safe in development).
- A real API key (`re_PeWC1XEc_...`) is already present in the `.env` file.
- The sender domain is hardcoded as `hello@universe.market`.

**Missing Requirements:**
- The API key is exposed in the frontend (`VITE_` prefix makes it visible in the browser's source code). For production, email sends should be proxied through a backend (Supabase Edge Function) to keep the key server-side only.
- Domain verification status in Resend is unknown (not visible from the code).

**Recommended Improvements:**
- Move all Resend calls to a Supabase Edge Function. Never expose the production API key in the browser.
- Create a separate "restricted" Resend API key for any remaining frontend usage.

---

### 2. Welcome Email (Transactional)

**Current Status: ✅ Fully Functional**

**Purpose:** Automatically send a branded welcome email to every new user who joins the waitlist.

**Current Implementation:**
- `newsletterService.subscribeFromWaitlist()` is called when the waitlist form is submitted.
- It inserts the subscriber into the database, then calls `emailService.sendWelcomeEmail()` in a non-blocking manner (using `.catch()` so a failed email does not block a successful waitlist join).
- `sendWelcomeEmail` calls `sendReactEmail` with `WelcomeEmail.jsx` as the React component.
- `WelcomeEmail.jsx` is a polished React Email template with a greeting, description, and a referral link button.
- The email renders properly using `@react-email/render()` which compiles the JSX into email-client-safe HTML.

**Missing Requirements:**
- The referral link uses `window.location.origin` which will be `localhost:5173` during development. This should be replaced with a hardcoded production URL (e.g., `https://universe.market`) via an environment variable like `VITE_APP_URL`.

**Recommended Improvements:**
- Add an unsubscribe link to the footer.
- Personalize further with the user's university name.

---

### 3. Visual Email Builder

**Current Status: ✅ Fully Functional**

**Purpose:** Allow admins to compose email campaigns visually without writing HTML code.

**Current Implementation:**
- `EmailBuilder.jsx` is a three-panel component:
  - **Left Panel:** A block palette to add `Heading`, `Text`, `Image`, `Button`, and `Divider` elements. Also shows a property editor for the currently selected block (content, URL, alignment, button color).
  - **Middle Panel:** A visual canvas where blocks are rendered inline for click-to-edit. Blocks can be reordered (up/down arrows) and deleted.
  - **Right Panel:** A live email preview (using `EmailRenderer.jsx`) that switches between Desktop (600px) and Mobile (320px) widths.
- The builder state is a JSON array of block objects: `[{ id, type, content, url, styles: { align, padding, color, backgroundColor } }]`.
- Blocks are saved to the `blocks` JSONB column in `newsletter_campaigns`.

**Missing Requirements:**
- True drag-and-drop reordering (currently relies on arrow buttons).
- No image upload — users must paste an external image URL.
- No custom font support.
- No branded background color or padding controls for the container.
- No "Spacer" or "Social Links" block types.
- No undo/redo functionality.

**Recommended Improvements:**
- Integrate `react-dnd` or similar for proper drag-and-drop.
- Integrate Supabase Storage for image uploads.
- Add a "Spacer" block for layout control.

---

### 4. Campaign Management (Broadcast Campaigns)

**Current Status: ⚠️ Partially Functional — UI Complete, Real Sending is Mocked**

**Purpose:** Allow admins to create, draft, assign to an audience, and broadcast newsletter campaigns.

**Current Implementation:**
- `CampaignsPage.jsx` provides a full workflow: list view → builder view → save → send.
- `campaignService.createDraft()` correctly saves campaigns to the database with `status: 'draft'`.
- `campaignService.updateCampaign()` correctly updates existing campaigns.
- `campaignService.sendBroadcast()` correctly fetches the campaign, resolves the target subscribers (all or audience-filtered), updates the status to 'processing', calls `emailService.sendBatchBroadcast()`, logs the results, and updates status to 'sent'.
- **The problem:** `emailService.sendBatchBroadcast()` is a stub that only does `console.log(...)` — it does NOT actually call the Resend API.

**What "sendBatchBroadcast" should do but doesn't:**
```
// What currently exists (mock):
console.log(`[Batch Broadcast] Sending campaign "${campaign.subject}" to ${subscribers.length} users.`);
return { success: true, sentCount: subscribers.length };

// What it should do:
for (const subscriber of subscribers) {
  const html = await render(<EmailRenderer blocks={campaign.blocks} />);
  await resend.emails.send({ from, to: subscriber.email, subject: campaign.subject, html });
}
```

**Missing Requirements:**
- Implement real Resend dispatch inside `sendBatchBroadcast`.
- Move the dispatch loop to a Supabase Edge Function to prevent browser timeouts.
- Implement Resend's Batch API (100 emails per request) for scale.

---

### 5. Audience Management

**Current Status: ⚠️ Partially Functional — Groups Created, Membership Not Manageable**

**Purpose:** Allow admins to create named groups of subscribers and target campaigns specifically at them.

**Current Implementation:**
- `AudiencesPage.jsx` and `useAdminAudiences.js` allow creating and deleting audience groups.
- The subscriber count per audience is correctly fetched using a Supabase join (`audience_subscribers(count)`).
- Campaigns can be assigned to an audience via a dropdown in `CampaignsPage.jsx`.
- When sending, `campaignService.sendBroadcast()` correctly filters subscribers using the `audience_subscribers` join table.

**Missing Requirements:**
- There is **no UI to add subscribers to an audience**. The admin can create an audience named "VIP Beta Users" but cannot put anyone in it from the dashboard.
- No CSV import into a specific audience.
- No bulk selection of subscribers to add to an audience.
- No dynamic/rule-based audience segments (e.g., "all users from Lagos").

**Recommended Improvements:**
- Add a subscriber selection modal inside `AudiencesPage.jsx`.
- Add a CSV import component using the `PapaParse` library.

---

### 6. Automated Sequences (Drip Campaigns)

**Current Status: ⚠️ Partially Functional — Database & Edge Function Ready, UI Incomplete**

**Purpose:** Automatically send a series of emails to subscribers over time (e.g., Day 3, Day 7 onboarding emails) without any manual admin action.

**Current Implementation:**
- The Edge Function (`process-email-queue/index.ts`) is fully implemented and handles actual email dispatch via Resend. It processes up to 10 queue items per run.
- `email_sequences`, `sequence_steps`, and `sequence_subscribers` tables are registered and queried by `useAdminSequences.js`.
- `AutomationsPage.jsx` allows creating sequences, activating/pausing them, and viewing step counts and active user counts.

**Missing Requirements:**
- The Edge Function handles **onboarding emails only** based on hardcoded `email_type` strings. It is not dynamically connected to the sequence/steps UI.
- The **Visual Workflow Builder** is missing: admins cannot add, edit, or delete individual steps from the dashboard. The "Edit Steps" button in `AutomationsPage.jsx` does nothing (no handler implemented).
- There is no mechanism to **enroll subscribers** in a sequence from the UI.
- The cron job schedule (`pg_cron`) is not defined in this repository — it must be manually configured in the Supabase dashboard.

---

### 7. Analytics & Open Tracking

**Current Status: ❌ Placeholder Only — All Data is Mocked or Incomplete**

**Purpose:** Show real metrics on email performance — how many emails were opened, clicked, bounced, or delivered.

**Current Implementation:**
- `AnalyticsPage.jsx` renders a beautiful area chart using `recharts`.
- **The data is entirely randomly generated** in the browser using `Math.random()`. This resets on every page load.
- `useAdminMetrics.js` does query `email_logs` for `opened = true` and `clicked = true` fields, but these fields are never set to `true` anywhere in the codebase. They would always read `0`.
- `analyticsService.js` also hardcodes `openRate: '68%'` and `clickRate: '24%'`.

**Missing Requirements:**
- A **Resend Webhook Listener** (Supabase Edge Function) that receives POST requests from Resend when an email is opened or a link is clicked, then updates the `email_logs` table accordingly.
- The webhook URL must be registered in the Resend dashboard under **Webhooks**.
- An **open tracking pixel** (a tiny 1x1 image linked to a tracking endpoint) embedded in each sent email.
- **Per-campaign analytics** — the current system only tracks global totals, not which subscribers opened which campaigns.

---

### 8. Email Queue & Scheduling

**Current Status: ✅ Functionally Complete (Backend) — Not Connected to UI**

**Purpose:** Allow emails to be scheduled for future delivery and processed reliably in the background.

**Current Implementation:**
- `email_queue` table stores pending emails with `scheduled_for` timestamps.
- The Edge Function reads this table and dispatches emails whose schedule time has passed.
- The function correctly handles success (marks as `completed`) and failure (marks as `failed`).
- Emails are processed in batches of 10 per invocation to prevent timeouts.

**Missing Requirements:**
- The `email_queue` table needs to be **automatically populated** when a new subscriber signs up. This requires a PostgreSQL database trigger (a piece of SQL code that auto-runs on new row inserts).
- The `pg_cron` schedule is not configured. A DBA must run the following SQL in the Supabase SQL Editor:
  ```sql
  SELECT cron.schedule('process-email-queue', '0 * * * *',
    $$SELECT net.http_post(
      url:='https://[PROJECT_ID].supabase.co/functions/v1/process-email-queue',
      headers:='{"Authorization": "Bearer [ANON_KEY]"}'::jsonb
    )$$
  );
  ```
- No retry logic for emails that fail beyond marking them as `failed`.

---

### 9. Unsubscribe Handling

**Current Status: ❌ Not Implemented**

**Purpose:** Allow users to opt-out of all future emails by clicking an "Unsubscribe" link. This is **legally required** under CAN-SPAM (US) and GDPR (EU).

**Current Implementation:**
- None. The `EmailRenderer.jsx` footer only shows copyright text and "You are receiving this because you subscribed."
- There is no unsubscribe link in any email template.
- There is no API endpoint to process an unsubscribe request.
- The `subscribers` table has a `status` column that could hold `'unsubscribed'`, but no logic sets it.

**Required Implementation:**
1. Create a Supabase Edge Function: `POST /functions/v1/unsubscribe?subscriberId=XYZ`
2. This function should: update `subscribers` SET `status = 'unsubscribed'` WHERE `id = subscriberId`
3. The Edge Function URL must be added to the `EmailRenderer.jsx` footer as a clickable link.
4. The `campaignService.sendBroadcast()` must filter out unsubscribed users.

**Complexity: Low (1–2 days)**

---

### 10. Bounce Handling

**Current Status: ❌ Not Implemented**

**Purpose:** When Resend reports that an email "bounced" (i.e., could not be delivered because the address doesn't exist), the system should mark that subscriber appropriately to protect sender reputation.

**Current Implementation:**
- Not implemented. All email logs are immediately marked as `delivery_status: 'delivered'` regardless of actual outcome.

**Required Implementation:**
- A Resend Webhook Edge Function that listens for `email.bounced` events and updates the subscriber's status.

---

### 11. Email Logging

**Current Status: ⚠️ Partially Functional — Logs Created, But Inaccurate**

**Purpose:** Maintain a historical record of every email sent for debugging and analytics.

**Current Implementation:**
- `email_logs` inserts happen in two places:
  1. `campaignService.sendBroadcast()` — logs all subscribers as `delivery_status: 'delivered'` immediately (before any real sending happens).
  2. The Edge Function — accurately logs `delivered` or `failed` based on Resend's actual response.
- The `opened` and `clicked` boolean columns exist in the table but are never set to `true`.

**Missing Requirements:**
- Remove the premature "delivered" logging from `sendBroadcast` (since the actual sending is currently mocked).
- Add real delivery status from Resend's API response.
- Implement webhook updates for `opened` and `clicked`.

---

### 12. Template Management

**Current Status: ❌ Placeholder Only**

**Purpose:** Allow admins to save, name, and reuse email templates without rebuilding them from scratch.

**Current Implementation:**
- `TemplatesPage.jsx` shows a "coming soon" message.
- The `email_templates` table is registered in `constants.js` but no queries or UI are built for it.

**Required Implementation:**
- A page to list saved templates from the `email_templates` database table.
- A "Save as Template" button in the `EmailBuilder`.
- A "Load Template" button when creating a new campaign.

---

### 13. Subscriber Import (CSV)

**Current Status: ❌ Not Implemented**

**Purpose:** Allow founders to import an existing email list from a CSV file.

**Missing Requirements:**
- A file upload component using the `PapaParse` library to parse CSV data.
- Bulk insert logic into `subscribers` using Supabase's batch insert.
- An option to assign imported subscribers to an existing audience.

---

### 14. Security Architecture

**Current Status: ⚠️ Development Mode Open — Not Production-Safe**

**Purpose:** Ensure only authorized admins can access the admin portal and email system.

**Current Implementation:**
- Supabase Row Level Security (RLS) policies are referenced in the codebase (mentioned in the Production Readiness doc), but there is **no authentication guard on the `/admin` routes in `App.jsx`**. Any user who navigates to `https://universe.market/admin` can see the dashboard without logging in.

**Required Implementation:**
- Add a route guard component that checks if the user is authenticated and has an `admin` role before rendering `<AdminLayout />`.
