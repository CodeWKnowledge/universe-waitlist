# 08 — Maintenance Handbook

> This handbook describes the ongoing maintenance tasks required to keep the UniVerse email system healthy, deliverable, and compliant over time.

---

## Overview: What Needs Regular Attention?

An email system is not "set and forget." A neglected email infrastructure leads to:
- Emails going to spam (lost engagement)
- Domain reputation damage (hard to recover)
- Legal exposure (CAN-SPAM/GDPR violations)
- Database performance degradation
- Angry or confused subscribers

This handbook covers exactly what to check, how often, and what to do about it.

---

## 1. Monitoring Email Deliverability

### What to Monitor

**Deliverability** means whether your emails are actually reaching inboxes. Even if Resend says "Delivered," some email providers may still route to spam.

### How to Monitor

#### Resend Dashboard (Check Weekly)
1. Log into [resend.com](https://resend.com) → **Emails** tab
2. Look at the overall delivery statistics:
   - **Delivery Rate:** Should be above 98%
   - **Bounce Rate:** Must stay below 2%. Above 5% and Resend may suspend your account.
   - **Spam Complaint Rate:** Must stay below 0.08% (8 out of 10,000 emails)
3. Click any bounced email to see the bounce reason (e.g., `5.1.1 The email account does not exist`)

#### DMARC Reports (Check Monthly)
Once DMARC is configured with `rua=mailto:dmarc@universe.market`, you will receive weekly XML reports from Google, Yahoo, and Microsoft. These reports show:
- How many emails passed/failed SPF checks
- How many emails passed/failed DKIM checks
- Whether anyone is trying to spoof your domain

To read these reports easily, use [MXToolbox DMARC Analyzer](https://mxtoolbox.com/DmarcReport.aspx) or [DMARC Analyzer](https://www.dmarcanalyzer.com).

#### MX Toolbox (Check Quarterly)
Go to [mxtoolbox.com/EmailHeaders.aspx](https://mxtoolbox.com/EmailHeaders.aspx) and paste in the raw headers of a recent email you received. This shows you exactly how your email passed through various spam filters.

### Warning Signs

| Metric | Healthy | Warning | Critical |
|---|---|---|---|
| Bounce rate | < 1% | 2–5% | > 5% |
| Spam complaint rate | < 0.05% | 0.05–0.1% | > 0.1% |
| Delivery rate | > 99% | 97–99% | < 97% |
| Open rate | > 20% | 10–20% | < 10% |

---

## 2. Monitoring Domain Health

### DNS Record Integrity

DNS records can theoretically be changed or expire. Check quarterly:

1. Go to [MXToolbox](https://mxtoolbox.com/SuperTool.aspx)
2. Run these checks for `universe.market`:
   - **SPF Lookup** — Should show the Resend SPF record
   - **DKIM Lookup** (for `resend._domainkey.universe.market`) — Should return a public key
   - **DMARC Lookup** — Should show your DMARC policy
3. Also verify in Resend Dashboard → Domains → all records show ✅ Verified

### Domain Blacklist Check

If emails start going to spam unexpectedly, check if your domain or sending IP has been blacklisted:
1. Go to [MXToolbox Blacklist Check](https://mxtoolbox.com/blacklists.aspx)
2. Enter `universe.market`
3. If listed on any blacklist, follow the delisting instructions for each service

---

## 3. Managing Subscriber List Health

### Why List Hygiene Matters

Sending emails to invalid, bounced, or unengaged addresses:
- Increases your bounce rate (damaging your reputation)
- Wastes your monthly Resend email quota
- Reduces your average open rate (making your metrics look worse)

### Monthly: Remove Hard Bounces

A hard bounce means the email address definitively does not exist. Keeping these in your list and continuing to send to them is harmful.

**Process:**
1. In Resend Dashboard → Emails, filter by status = "Bounced"
2. Note the recipient email addresses
3. Log into Supabase → Table Editor → `subscribers`
4. Update each bounced subscriber: set `status = 'bounced'`
5. Ensure your broadcast logic filters out subscribers with `status = 'bounced'`

Once the automatic bounce webhook is implemented (see Document 02), this will happen automatically.

### Quarterly: Re-engagement Campaign

Subscribers who have not opened any emails in 6 months are "inactive." Options:
1. **Re-engagement email:** "Hey, are you still interested in UniVerse? Click here to stay subscribed."
2. If they don't click within 2 weeks: update `status = 'inactive'`
3. Remove inactive subscribers from your active send list

### Yearly: Full List Audit

Once per year, review the entire subscriber list:
- Remove all subscribers with `status IN ('bounced', 'unsubscribed', 'inactive')`
- Check for and remove obvious test addresses (e.g., `test@test.com`)
- Verify the tag data is consistent (e.g., university names follow a consistent format)

---

## 4. Managing Subscriber Growth

### Monitoring Growth Rate

Check the Overview Dashboard weekly for:
- **New Today** — A sudden spike may indicate a viral moment or bot signup
- **This Week** — Compare week-over-week to spot growth trends

### Handling Bot Signups

Signs that you have bot signups:
- Many signups from the same IP address in a short time
- Names/emails that look randomly generated (e.g., `xkqjr@randomdomain.xyz`)
- Signups with no university selection

**Solution:** Implement CAPTCHA (e.g., [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) — free) on the waitlist form.

### Scaling Considerations

| Subscriber Count | Resend Plan Needed | Notes |
|---|---|---|
| 0 – 3,000 | Free | 3,000 emails/month included |
| 3,000 – 50,000 | Pro ($20/mo) | 50,000 emails/month |
| 50,000+ | Scale ($90/mo) or custom | Requires Batch API implementation |

At 10,000 subscribers with monthly newsletters: 10,000 emails/month (Pro plan easily covers this)
At 10,000 subscribers with weekly newsletters: 40,000 emails/month (still within Pro plan)
With a full onboarding sequence (4 emails per subscriber): add 4× subscriber count to monthly volume

---

## 5. Keeping Email Templates Updated

### When to Update Templates

- **Brand changes:** If UniVerse's logo, color scheme, or name changes, all templates need updating
- **Legal changes:** If new regulations require additional footer content
- **Performance issues:** If open rates drop, test new subject lines and content styles

### How to Update Templates

The email templates live in two places:

1. **React Email Components** (for automated transactional emails):
   - `src/lib/email/react-templates/WelcomeEmail.jsx`
   - `src/lib/email/react-templates/OnboardingSequence.jsx`
   - `src/lib/email/react-templates/Transactional.jsx`
   - These are code files. A developer must edit them.

2. **Campaign Blocks** (for broadcast campaigns):
   - Managed visually in the admin dashboard → Campaigns → Email Builder
   - Founders can update these without coding

### Template Versioning

When making significant template changes:
- Note the date and nature of the change in a changelog (you can create a `CHANGELOG.md` in the `/docs` folder)
- Keep a copy of the old template in case the new version needs to be rolled back
- Send a test email to yourself before broadcasting to the full list

---

## 6. Managing Automations Over Time

### Reviewing Automation Performance

Check monthly (once webhook analytics are implemented):
1. What percentage of subscribers in the sequence opened each email?
2. Which step has the highest/lowest engagement?
3. Are any subscribers stuck at a step for longer than expected?

### Updating Sequence Content

As UniVerse evolves, the onboarding email content in `OnboardingSequence.jsx` needs to reflect:
- Current product features (not promised/future features)
- Accurate launch timelines
- Updated referral incentives

A developer must update `OnboardingSequence.jsx` and the equivalent content in the Edge Function (`process-email-queue/index.ts`).

### Monitoring the Email Queue

Check the `email_queue` table monthly for stuck items:
```sql
-- Check for old, stuck emails
SELECT *, 
  EXTRACT(DAYS FROM NOW() - scheduled_for) as days_overdue
FROM email_queue 
WHERE status = 'pending' 
  AND scheduled_for < NOW() - INTERVAL '7 days'
ORDER BY scheduled_for;
```

If you find emails stuck for more than 7 days past their scheduled time, investigate why the cron job is not processing them.

---

## 7. Monitoring System Performance

### Supabase Database Usage

Check monthly in the Supabase Dashboard → Settings → Usage:
- **Database size:** Free tier limit is 500MB. Pro tier: 8GB.
- **API requests:** Free tier: 500,000 requests/month. Monitor if growing quickly.
- **Storage:** If implementing image uploads, track storage usage.

### Database Query Performance

As subscriber count grows, some queries may slow down. Watch for:
- The `useAdminMetrics` hook running 9 simultaneous queries (may need optimization with a Supabase RPC function)
- The `useAdminSubscribers` hook's search query (should use an indexed `email` column)

To check index health, run in Supabase SQL Editor:
```sql
-- View indexes on subscribers table
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'subscribers';
```

### Resend API Latency

If the Welcome Email is taking more than 10 seconds to be delivered after signup:
1. Check Resend's status page: [status.resend.com](https://status.resend.com)
2. Check the API key has not been rate-limited (10 requests/second on free tier)
3. Consider switching the Welcome Email send to an Edge Function if latency is a concern

---

## 8. Security Maintenance

### Quarterly: Rotate API Keys

Best practice is to rotate API keys every 3–6 months:
1. Create a new Resend API key
2. Update it in:
   - `.env` file (local development)
   - Vercel environment variables (production)
   - Supabase secrets for Edge Functions
3. Wait for the new deployment to complete (Vercel auto-deploys on env var changes)
4. Verify emails still send correctly
5. Delete the old API key in Resend

### Monitor for Unauthorized Access

Check monthly:
- Supabase Auth logs for unexpected authentication events
- Resend email logs for sends you did not authorize (could indicate a leaked API key)
- Review all active API keys in Resend and delete any that are unused or unfamiliar

### Keep Dependencies Updated

Run monthly:
```bash
npm outdated
```

This shows which packages have newer versions available. Pay special attention to:
- `resend` — Security patches are important
- `@supabase/supabase-js` — Required for compatibility with Supabase server updates
- `@react-email/components` — May have new features or bug fixes

To update all packages:
```bash
npm update
```

After updating, test the email system thoroughly before deploying to production.

---

## 9. Disaster Recovery

### If Resend Account is Suspended

Resend will suspend accounts with consistently poor deliverability metrics (high bounce rates or spam complaints).

**Recovery steps:**
1. Log into Resend → find the suspension notification and reason
2. Clean your subscriber list to remove bad addresses
3. Reply to Resend's suspension email with your remediation plan
4. Consider moving to the Resend Pro plan if you're close to free tier limits

**Prevention:** Maintain bounce rate below 2% and spam complaint rate below 0.05%.

### If DNS Records are Accidentally Deleted

If someone deletes the SPF, DKIM, or DMARC records from your domain registrar:
1. Emails will immediately start going to spam
2. Re-add all records from the Resend Dashboard → Domains → your domain
3. DNS propagates within 30 minutes for most registrars
4. Verify all checkmarks are green in Resend before resuming email sends

### If Supabase Data is Lost

Supabase automatically creates daily backups on the Pro plan. If data is lost:
1. Log into Supabase → Settings → Backups
2. Restore from the most recent backup
3. Note: any emails sent after the backup timestamp will not be in the restored logs

---

## 10. Upgrade Path Planning

### Short-Term Maintenance Tasks (Next 30 Days)

These are critical for basic production safety:
- [ ] Implement unsubscribe link in all emails
- [ ] Protect `/admin` route with authentication
- [ ] Deploy Edge Function to Supabase
- [ ] Configure `pg_cron` job in Supabase
- [ ] Verify domain DNS in Resend (confirm all checkmarks are green)

### Medium-Term Tasks (30–90 Days)

- [ ] Build Resend Webhook listener for open/click tracking
- [ ] Implement real batch sending in `sendBatchBroadcast()`
- [ ] Move broadcast dispatch from browser to Edge Function
- [ ] Build audience subscriber import (CSV)
- [ ] Add database trigger for email queue population

### Long-Term Tasks (90+ Days)

- [ ] Build the visual sequence step editor
- [ ] Implement `email_templates` table with save/load in builder
- [ ] Build per-campaign analytics (not just global totals)
- [ ] Add A/B subject line testing
- [ ] Implement subscriber preference center (let users choose email frequency)
- [ ] Add consent checkbox and timestamp logging for GDPR compliance
