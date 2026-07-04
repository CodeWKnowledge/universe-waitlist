# 06 — Operations Manual

> **Who this is for:** A founder or administrator who wants to operate the email marketing platform day-to-day without touching any code.
>
> All operations described here are performed through the Admin Dashboard at `/admin`.

---

## Accessing the Admin Dashboard

1. Navigate to your deployed application (e.g., `https://universe.market`).
2. Add `/admin` to the URL: `https://universe.market/admin`
3. You will land on the **Overview** page.

> **⚠️ Note:** The admin portal is currently unprotected — anyone with the URL can access it. Before going public, the development team must implement authentication on this route. Do not share the `/admin` URL publicly.

---

## The Overview Dashboard

The Overview page (`/admin/overview`) is your mission control center. It shows:

### KPI Cards (Top Row)
| Card | What It Shows |
|---|---|
| Total Subscribers | The total number of people who have ever joined the waitlist |
| New Today | Signups since midnight (refreshes when you reload the page) |
| This Week | Signups in the last 7 days |
| Emails Sent | Total emails logged in the system across all campaigns |
| Open Rate | Percentage of sent emails that were opened (currently 0% — requires webhook setup) |
| Click Rate | Percentage of sent emails where a link was clicked (currently 0% — requires webhook setup) |
| Total Referrals | Number of referral codes generated |
| Conversions | Percentage of referrals that converted to a signup |

### Subscriber Growth Chart
A 7-day area chart showing new subscriber signups over time.

> **Current Limitation:** This chart only shows today's count on the last data point. A future improvement will show a true daily breakdown via a Supabase database function.

### Source Breakdown (Pie Chart)
Shows the distribution of where subscribers came from (Waitlist vs. Referral vs. Direct).

### Recent Signups Table
Shows the 5 most recent subscribers with their email, name, source, status, and join date.

---

## Managing Subscribers

### Viewing All Subscribers

1. Click **"Subscribers"** in the left sidebar → `/admin/subscribers`
2. A table shows all subscribers with columns: Email, Name, Source, Status, Joined
3. The list is paginated (25 per page)

### Searching for a Subscriber

1. Type an email address (or partial email) in the search box at the top right.
2. The table updates instantly to show matching results.

### Filtering by Status

Use the filter dropdown (next to the search box) to filter by:
- **All Statuses** — Shows every subscriber
- **Waitlist** — Shows users waiting for platform access
- **Beta** — Shows beta testers
- **Active** — Shows active platform users

### Exporting Subscribers to CSV

1. Apply any filters you want (or leave as "All")
2. Click the **"Export"** button (top right, shows a download icon)
3. A CSV file will automatically download to your computer
4. Open it in Excel or Google Sheets

The CSV export includes: Email, First Name, Last Name, Source, Status, Tags, and Joined date.

### Viewing Waitlist Only

Click **"Waitlist"** in the left sidebar → `/admin/waitlist`

This page shows only subscribers with `status = 'waitlist'`. It also shows the University and Role extracted from their tags.

### What You Cannot Currently Do (Limitations)

- You cannot manually add a subscriber from the admin dashboard
- You cannot edit a subscriber's details
- You cannot delete a subscriber
- You cannot import subscribers from a CSV

These features need to be built. For now, subscriber management can be done directly in the Supabase Database UI (for technical users only).

---

## Managing Audiences

Audiences are named groups of subscribers that you can target with specific campaigns.

### Creating a New Audience

1. Click **"Audiences"** in the left sidebar → `/admin/audiences`
2. Click **"New Audience"**
3. Fill in:
   - **Name:** e.g., "VIP Early Access", "Lagos Campus Users", "Beta Testers"
   - **Description:** (Optional) A brief note about who this group contains
4. Click **"Create Audience"**

The audience card will appear, showing `0 subscribers` until people are added to it.

### Adding Subscribers to an Audience

> **⚠️ Limitation:** This cannot currently be done from the UI. The audience management page only creates the "container" — it does not yet provide a way to add specific subscribers to it.

**Workaround (for technical users):**
1. Log into the Supabase Dashboard → **Table Editor** → **audience_subscribers**
2. Click **"Insert Row"**
3. Add the `audience_id` and `subscriber_id` values manually

This is a known gap that needs to be implemented.

### Deleting an Audience

1. Click the trash icon (🗑️) in the top right of any audience card.
2. The audience is immediately deleted along with all of its subscriber associations.
3. Any campaigns previously targeted at this audience will fall back to sending to all subscribers.

---

## Creating Email Campaigns

### Step 1: Start a New Campaign

1. Click **"Campaigns"** in the left sidebar → `/admin/campaigns`
2. Click **"New Campaign"**
3. You are taken to the Campaign Builder

### Step 2: Fill in the Campaign Details

At the top of the builder, fill in three fields:
- **Campaign Title (Internal):** A name for your own reference (subscribers will never see this). e.g., "June Newsletter"
- **Subject Line:** The subject line subscribers will see in their inbox. e.g., "Big updates from UniVerse 🚀"
- **Target Audience:** Choose a specific audience group, or leave as "All Subscribers (Default)" to send to everyone.

### Step 3: Build the Email Content

The email builder has three panels:

#### Left Panel — Add Elements
Click any element to add it to your email:
- **Heading** — A large, bold title
- **Text** — A paragraph of body text
- **Image** — An image from a URL
- **Button** — A clickable call-to-action button
- **Divider** — A horizontal line to separate sections

When you click a block in the canvas (middle panel), the left panel switches to a **Properties** editor where you can:
- Edit the content/text of the block
- Set a URL (for buttons and images)
- Change text alignment (left, center, right)
- Change button color (click the color swatch)

#### Middle Panel — Email Canvas
This is where your email takes shape:
- Click on any block to select and edit it
- Use the ↑ and ↓ arrows (that appear on hover) to reorder blocks
- Use the 🗑️ icon (that appears on hover) to delete a block

The canvas is a WYSIWYG editor — what you see here is (approximately) what your email will look like.

#### Right Panel — Live Preview
This panel shows a real-time rendering of your email. Toggle between:
- **Desktop** — 600px wide (how most desktop email clients show it)
- **Mobile** — 320px wide (how phone inboxes show it)

The preview always includes the UniVerse branding header (green "UniVerse" bar) and a standard footer.

### Step 4: Save the Campaign

Click **"Save Draft"** in the top right. This saves your campaign to the database with `status: draft`. You can return to edit it at any time by clicking on its title in the campaign list.

---

## Previewing Emails

The Live Preview panel in the Email Builder automatically updates as you add and edit blocks. There is no separate "preview" button needed.

To see a more realistic preview:
1. Use the **Desktop** toggle to see the 600px-wide email view
2. Use the **Mobile** toggle to see the 320px-wide view
3. Note that the preview uses the actual `EmailRenderer.jsx` component — the same one used when sending — so the preview is accurate

> **Known Limitation:** The preview renders the email inside the browser's DOM, which may slightly differ from how certain email clients (like Outlook) will render it. Always send a test email to yourself before broadcasting.

---

## Sending a Broadcast Campaign

> **⚠️ Important Notice:** The broadcast sending mechanism is currently a **simulation**. Clicking "Send Now" will update the campaign status in the database and create delivery log entries, but no real emails will be physically delivered to subscribers. The development team must implement the real Resend dispatch before this works in production.

### Sending Immediately

1. In the campaign list, find the draft campaign you want to send.
2. Click the **Send** icon (📤) on the right side of the campaign row.
3. A confirmation dialog will appear: "Are you sure you want to broadcast this campaign?"
4. Click **OK**.
5. The campaign status will change from `draft` → `processing` → `sent`.

### Scheduling a Campaign

Scheduling is partially implemented at the database level (`campaignService.scheduleCampaign()`), but there is no UI to set a schedule date from the dashboard yet. You can only send immediately.

---

## Managing Automation Sequences

### Viewing Sequences

Click **"Automations"** in the left sidebar → `/admin/automations`

Each automation card shows:
- Sequence name and description
- Status badge (Draft / Active / Paused)
- Trigger event (e.g., "When user joins waitlist")
- Number of steps
- Number of active subscribers enrolled in this sequence

### Creating a New Sequence

1. Click **"New Sequence"**
2. Fill in:
   - **Sequence Name:** e.g., "Waitlist Nurturing"
   - **Description:** What this sequence does
   - **Trigger Event:** When should this sequence start?
     - "When user joins waitlist" — starts automatically on signup
     - "When user's referral converts" — starts when they successfully refer someone
3. Click **"Create Sequence"**

The sequence is created with `status: draft`.

### Activating a Sequence

Click the **▶️ (Play)** button on a sequence card. The status changes to **Active**.

> **⚠️ Important:** Activating a sequence in the UI only updates the database record. The actual email sending is handled by the Supabase Edge Function and `email_queue` table. Activating the sequence will not automatically enroll existing subscribers — a database trigger handles enrollment for new subscribers who join after activation.

### Pausing a Sequence

Click the **⏸️ (Pause)** button on an Active sequence. No more emails will be dispatched for this sequence, but subscribers who have already received emails retain their progress.

### Editing Steps

The **"Edit Steps"** button is currently a placeholder — clicking it does nothing. Building the step editor UI is a future development task.

---

## Monitoring Campaigns

### Campaign Status Labels

| Status | Meaning |
|---|---|
| `draft` | Campaign saved but not sent |
| `scheduled` | Campaign set for future send (requires UI development) |
| `processing` | Currently being dispatched |
| `sent` | Dispatch complete |

### Viewing the Analytics Page

Click **"Analytics"** in the left sidebar → `/admin/analytics`

The analytics page shows a 14-day performance chart with Sent, Opens, and Clicks lines.

> **⚠️ Important: Current Data is Mocked.** All chart data is randomly generated in the browser on each page load. It does not reflect real email performance. Real analytics require the Resend Webhook setup described in Document 04.

### Checking Real Delivery Status

Until the webhook system is built, you can monitor actual delivery in the **Resend Dashboard**:
1. Log into [resend.com](https://resend.com)
2. Click **"Emails"** in the left sidebar
3. Every sent email is listed with:
   - Delivery status (Delivered / Bounced / Failed)
   - Sent timestamp
   - Subject line
   - Recipient email

---

## Managing Referrals

Click **"Referrals"** in the left sidebar → `/admin/referrals`

This page shows referral activity — who generated referral codes, who they referred, and whether those referrals converted to signups.

---

## System Settings

Click **"Settings"** in the left sidebar → `/admin/settings`

This page shows:
- **Resend API Key:** Displayed as `********` (masked). You cannot change it from here — it is controlled via the `.env` file or Vercel environment variables.
- **Default Sender Address:** `hello@universe.market` (hardcoded in `provider.js`).
- **Waitlist Behavior:** A toggle showing whether new signups are accepted. Currently a display-only element (non-functional).

---

## Routine Operating Checklist

### Daily (5 minutes)
- [ ] Check the Resend Dashboard for any bounced emails
- [ ] Check the Overview dashboard for new signups

### Weekly (15 minutes)
- [ ] Review the Subscribers page for any unusual activity
- [ ] Review DMARC reports sent to `dmarc@universe.market` (once DMARC is configured)
- [ ] Check Resend account usage against monthly email limit

### Monthly (30 minutes)
- [ ] Review subscriber growth trends
- [ ] Assess whether inactive subscribers should be cleaned up
- [ ] Check Resend delivery rates for any deliverability issues
- [ ] Plan the next newsletter campaign
