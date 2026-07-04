# 07 — Troubleshooting Guide

> This guide covers the most common problems encountered when operating the UniVerse email system, with step-by-step diagnosis and solutions.

---

## Quick Diagnosis Checklist

Before diving into specific issues, work through this checklist:

1. **Check the browser console:** Open Developer Tools (F12 in Chrome) → Console tab. Look for red error messages.
2. **Check the Supabase Dashboard:** Log into [supabase.com](https://supabase.com) → Your Project → **Logs** to see database and Edge Function errors.
3. **Check the Resend Dashboard:** Log into [resend.com](https://resend.com) → **Emails** tab to see delivery status for recent sends.
4. **Check environment variables:** Ensure `VITE_RESEND_API_KEY` and both Supabase variables are set correctly in `.env`.

---

## Problem 1: Emails Not Being Sent at All

### Symptom
A user joins the waitlist but receives no Welcome Email. Or a broadcast campaign appears to complete but recipients receive nothing.

### Likely Causes and Solutions

#### Cause A: API Key is Missing or Invalid

**How to diagnose:**
1. Open the browser's Developer Tools (F12) → Console tab
2. Look for this message: `[Email Mock] Sent to user@example.com: Welcome to UniVerse 🚀`
3. If you see this message, the app is running in "mock mode" — the `VITE_RESEND_API_KEY` environment variable is empty or invalid.

**Solution:**
1. Open the `.env` file in the `waitlist` folder
2. Ensure it contains: `VITE_RESEND_API_KEY=re_YOUR_KEY_HERE`
3. Restart the development server: press `Ctrl+C` in the terminal, then run `npm run dev` again
4. (Vite only picks up `.env` changes on restart)

---

#### Cause B: Domain Not Verified in Resend

**How to diagnose:**
1. Log into [resend.com](https://resend.com) → Domains
2. Find `universe.market`
3. If any DNS record shows 🔴 (red/unverified), emails from this domain will be rejected

**Solution:**
1. Re-read Document 04 (Resend Setup Guide) carefully
2. Log into your domain registrar and verify each DNS record matches exactly what Resend requires
3. Wait up to 24 hours for DNS propagation, then click "Verify" in Resend again

---

#### Cause C: Broadcast Sending is Currently Mocked (Not Implemented)

**How to diagnose:**
- This is a known issue, not a configuration problem
- The `sendBatchBroadcast()` function in `emailService.js` only logs to the console; it does not call Resend

**Current workaround:**
- There is no workaround for broadcasts in the current codebase
- Only the Welcome Email (triggered by waitlist signup) is actually sent via Resend
- The development team must implement real batch sending before campaigns work

---

#### Cause D: React Email Render Failure

**How to diagnose:**
1. Open the browser console (F12)
2. Look for errors mentioning `@react-email/render` or `Invalid component`

**Solution:**
This usually occurs when a React Email component receives an `undefined` prop. Check:
- Is `firstName` undefined? The `WelcomeEmail` receives it from `userData.name?.split(' ')[0] || 'there'` — if `name` is null, it defaults to `'there'`.
- Is `referralLink` undefined? It uses `window.location.origin + ?ref= + referralCode` — if `referralCode` is empty, the link will still render but with an empty ref parameter.

---

## Problem 2: Domain Not Verified in Resend

### Symptom
Resend shows one or more DNS records with a 🔴 status even after you added them.

### Solution Steps

1. **Wait longer.** DNS changes can take up to 48 hours in rare cases. If you just added the records, wait at least 30 minutes before troubleshooting.

2. **Check for typos.** Log into your registrar and compare every character of your DNS records with what Resend shows. Common mistakes:
   - Extra spaces before or after the value
   - Wrong record type (TXT vs. CNAME)
   - Incorrect hostname (e.g., `www.universe.market` instead of `universe.market`)

3. **Check for duplicates.** Some registrars (e.g., GoDaddy) automatically append the root domain. If Resend says add a record named `resend._domainkey`, do not add it as `resend._domainkey.universe.market` — just `resend._domainkey`.

4. **Verify propagation.** Use [DNSChecker.org](https://dnschecker.org) to see if your DNS change has propagated worldwide. Paste the record name and select the type (TXT or CNAME).

5. **Contact your registrar support.** If records look correct but won't verify, your registrar may have domain-specific restrictions on TXT records.

---

## Problem 3: API Key Errors

### Symptom
Error in the browser console or Resend response: `401 Unauthorized` or `Invalid API Key`.

### Solution Steps

1. **Check the key is not truncated.** Copy the full key from Resend (it starts with `re_`) and paste it into `.env` without any extra spaces.

2. **Check the key has not been deleted.** Log into Resend → API Keys. If your key is not listed, it was deleted or never created properly. Create a new one.

3. **Restart the dev server.** After editing `.env`, always restart: `Ctrl+C` then `npm run dev`.

4. **Check Vercel environment variables.** In production, the key must be added to Vercel: Settings → Environment Variables → `VITE_RESEND_API_KEY`. After adding it, you must trigger a new deployment.

5. **Check for key restrictions.** If you created an API key with restricted permissions (e.g., "Sending Access" only), ensure it has permission to send from your verified domain.

---

## Problem 4: Welcome Email Goes to Spam

### Symptom
The user receives the email but it lands in their Spam or Junk folder.

### Solution Steps

1. **Verify your domain's DNS records are complete.** Spam filters heavily penalize emails from domains without SPF, DKIM, and DMARC. All three must be properly configured (see Document 04).

2. **Check the "from" address.** The current sender is `UniVerse <hello@universe.market>`. Ensure this is the verified domain in your Resend account. If you're sending from `@gmail.com` or an unverified domain, email clients will flag it as suspicious.

3. **Check the email content.** Some spam triggers include:
   - ALL CAPS words in the subject line
   - Excessive use of `$$$`, `FREE`, `URGENT` in the body
   - Links to domains with poor reputation
   - Missing unsubscribe link (the current system is missing this — add it ASAP)

4. **Build sender reputation.** New domains have zero reputation. Start by sending small volumes (50–100 emails) and gradually increase. Sending 10,000 emails from a brand-new domain is almost guaranteed to be spam-flagged.

5. **Ask early users to mark as "Not Spam".** This signals to Gmail and Outlook that your emails are wanted.

---

## Problem 5: Admin Dashboard Shows Blank / Loading Spinner Forever

### Symptom
The Overview, Subscribers, or Campaigns page shows a loading spinner that never resolves, or shows "No data" when you expect data.

### Likely Causes

#### Cause A: Database Tables Don't Exist

**How to diagnose:** Open browser console (F12) — look for errors like `relation "subscribers" does not exist` or `relation "newsletter_campaigns" does not exist`.

**Solution:** The required database tables need to be created. Ask the development team to run the SQL migration script in the Supabase SQL Editor.

---

#### Cause B: Supabase Connection Failed

**How to diagnose:** Look for `network error` or `Failed to fetch` in the browser console.

**Solution:**
1. Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correctly set in `.env`
2. Check [status.supabase.com](https://status.supabase.com) for any ongoing outages
3. Restart the development server

---

#### Cause C: Row Level Security (RLS) Blocking Access

**How to diagnose:** Look for `permission denied for table subscribers` in the browser console.

**Solution:** 
- This means RLS policies are blocking the anon key from reading the table
- For development, this may be intentional. Check the Supabase Dashboard → Authentication → Policies for the `subscribers` table
- If developing locally, there may be a `fix_rls.sql` script — run it in the Supabase SQL Editor

---

## Problem 6: Campaign Analytics Shows Zeros or Random Numbers

### Symptom
Open rates and click rates show 0%, or the chart shows random-looking numbers that change every time you load the page.

### Explanation (This Is Expected)

This is a **known limitation**, not a bug. The analytics system is not yet connected to real data:

- **Open Rate / Click Rate on Overview:** These are calculated from `email_logs` where `opened = true` and `clicked = true`. These boolean fields are never set to `true` in the current codebase (requires Resend webhooks).
- **Analytics Page Chart:** The data is **randomly generated in JavaScript** on every page load using `Math.random()`. It resets every time you navigate to the page.

### Solution

This requires implementing the Resend Webhook integration:

1. **Build a Resend Webhook Edge Function** that receives POST requests from Resend
2. **Register the webhook URL** in the Resend Dashboard (Webhooks → Add Endpoint)
3. **Events to listen for:** `email.opened`, `email.clicked`, `email.bounced`
4. **The Edge Function should:** Update the `email_logs` table to set `opened = true` or `clicked = true` for the matching log entry

Until this is implemented, the analytics dashboard cannot show real data.

---

## Problem 7: Automated Sequence Emails Not Sending

### Symptom
Users join the waitlist but do not receive Day 3, Day 7, Day 14, or Day 21 onboarding emails.

### Likely Causes

#### Cause A: Edge Function Not Deployed

**How to diagnose:** Log into the Supabase Dashboard → Edge Functions. If `process-email-queue` is not listed, it has never been deployed.

**Solution:**
```bash
supabase link --project-ref ndrmttzvfqntcipsfins
supabase functions deploy process-email-queue
```

---

#### Cause B: Edge Function Secrets Not Set

**How to diagnose:** Go to Supabase Dashboard → Edge Functions → `process-email-queue` → Logs. If you see `RESEND_API_KEY is undefined`, the secrets are missing.

**Solution:**
```bash
supabase secrets set RESEND_API_KEY=re_XXXXXXXXXX
supabase secrets set SUPABASE_URL=https://ndrmttzvfqntcipsfins.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

#### Cause C: Cron Job Not Configured

**How to diagnose:** The Edge Function exists but is never called automatically. Log into Supabase → SQL Editor and run:
```sql
SELECT * FROM cron.job;
```
If no rows appear, the cron job is not set up.

**Solution:** Run this in the SQL Editor:
```sql
SELECT cron.schedule(
  'process-email-queue',
  '0 * * * *',
  $$SELECT net.http_post(
    url := 'https://ndrmttzvfqntcipsfins.supabase.co/functions/v1/process-email-queue',
    headers := '{"Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
  )$$
);
```

---

#### Cause D: Email Queue is Empty

**How to diagnose:** Log into Supabase → Table Editor → `email_queue`. If it is empty (even after new signups), the database trigger to populate it is missing.

**Solution:** A database trigger must be written in SQL that automatically inserts rows into `email_queue` when a new row is inserted into `subscribers`. Ask the development team to implement this trigger.

---

## Problem 8: Resend Dashboard Shows "Bounced" Emails

### Symptom
In Resend → Emails, you see emails with a "Bounced" status.

### Explanation

A bounce means the email could not be delivered. There are two types:
- **Hard bounce:** The email address does not exist. Never send to this address again.
- **Soft bounce:** Temporary issue (e.g., inbox full). May retry automatically.

### Solution

1. **For hard bounces:** Immediately mark these subscribers as `status = 'bounced'` in the database. Continuing to send to bounced addresses damages your sender reputation.
2. **Monitor bounce rate:** Resend suspends accounts with a bounce rate above 5%. If you're seeing many bounces, you may have bad data in your list.
3. **Implement automated bounce handling:** The development team should build a webhook that listens for `email.bounced` events from Resend and automatically updates the subscriber's status in Supabase.

---

## Problem 9: The Supabase Edge Function Times Out

### Symptom
The Edge Function runs but only processes some emails before stopping. The Supabase logs show a timeout error.

### Explanation

Supabase Edge Functions have a maximum execution time of 10 seconds (free tier) or 60 seconds (Pro tier). If there are many pending emails, a single run may not complete them all.

### Current Protection

The Edge Function already has protection against this: `.limit(10)` ensures only 10 emails are processed per run. If 10 emails cannot be processed within 10 seconds (very unlikely), increase the `limit` cautiously or upgrade to the Supabase Pro plan.

### If Emails Get Stuck in "Pending"

Manually check the queue:
```sql
SELECT * FROM email_queue WHERE status = 'pending' ORDER BY scheduled_for;
```

If old emails are stuck, manually trigger the Edge Function by visiting its URL in a browser or running:
```bash
curl -X POST https://ndrmttzvfqntcipsfins.supabase.co/functions/v1/process-email-queue \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

## Problem 10: Subscribers Not Appearing in the Admin Dashboard

### Symptom
A user reports joining the waitlist, but they don't appear in the Subscribers table.

### Likely Causes

1. **Waitlist form error:** Check if the form submission returned an error. The newsletter subscriber insertion happens in `newsletterService.subscribeFromWaitlist()` — if there was a database error, the subscriber was not saved.

2. **Duplicate prevention:** If the email already exists in the database, the system returns the existing record and does not create a duplicate. Check the existing record.

3. **RLS policy blocking insert:** Run the following in Supabase SQL Editor to diagnose:
   ```sql
   SELECT * FROM subscribers ORDER BY created_at DESC LIMIT 10;
   ```
   If you can see records here but not in the admin dashboard, it's an RLS issue on the read side.

4. **The `subscriberService.js` is broken:** The `subscriberService.js` file references functions (`getNewsletterSubscriberByEmail`, `insertNewsletterSubscriber`) that do not exist in `queries.js`. If this service is being called anywhere, it will throw a JavaScript error. However, the primary waitlist flow uses `newsletterService.js` and `queries.js` directly, which are both correct.
