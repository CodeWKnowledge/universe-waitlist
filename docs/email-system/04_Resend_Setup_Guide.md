# 04 — Resend Setup Guide for Beginners

> **Who this is for:** A founder or team member who has never used Resend before and needs to get the email system live from scratch.
>
> **Time required:** 30–60 minutes

---

## What Is Resend?

Resend is a modern email delivery service. Think of it like a post office for your app — your application hands Resend an email address, a subject line, and some content, and Resend physically delivers that email to the recipient's inbox.

Without Resend (or a similar service), your app cannot send emails. Web servers are generally blocked from sending emails directly because spammers have abused that privilege. Resend handles the technical complexity of email delivery — including building sender reputation, maintaining infrastructure, and ensuring inbox placement.

**Why Resend specifically?**
- Free tier: 3,000 emails/month (sufficient for early beta)
- Excellent developer experience
- Built-in open/click tracking (once webhooks are configured)
- Clean dashboard for monitoring deliveries

---

## Step 1: Create a Resend Account

1. Open your web browser and go to **[https://resend.com](https://resend.com)**.
2. Click the **"Sign Up"** button in the top right corner.
3. Create an account using your startup's email address. Using a Google Workspace account (e.g., `founder@universe.market`) is recommended over a personal Gmail.
4. Verify your email address by clicking the link in the confirmation email Resend sends you.
5. You are now in the Resend Dashboard.

---

## Step 2: Add and Verify Your Domain

This is the most important step. Without domain verification, your emails will either go to spam or fail entirely.

### What is "Domain Verification"?

Your email address is `hello@universe.market`. The part after the `@` sign is your **domain** (`universe.market`). Resend needs to prove to the world's email servers (Gmail, Outlook, Yahoo, etc.) that you are the legitimate owner of that domain.

The way it does this is through **DNS records** — entries in your domain's settings that act like a verified ID card for your email.

### Where Are Your Domain Settings?

Your domain settings are controlled by your **domain registrar** — the company where you purchased your domain. Common registrars:
- **Namecheap** — namecheap.com → Domain List → Manage → Advanced DNS
- **GoDaddy** — godaddy.com → My Products → DNS
- **Vercel** — vercel.com → Your Project → Settings → Domains
- **Cloudflare** — cloudflare.com → Select Domain → DNS

### How to Verify Your Domain in Resend

1. In the Resend Dashboard, click **"Domains"** in the left sidebar.
2. Click **"Add Domain"**.
3. Type your domain name: `universe.market` (do NOT include `https://` or `www`).
4. Select your region (choose the one closest to your users — EU or US).
5. Click **"Add"**.
6. Resend will now show you a list of DNS records to add. They will look something like this:

   | Type | Name | Value |
   |---|---|---|
   | TXT | `@` or `universe.market` | `v=spf1 include:amazonses.com ~all` |
   | CNAME | `resend._domainkey` | `resend._domainkey.amazonses.com` |
   | MX | `bounce` | `feedback-smtp.us-east-1.amazonses.com` |
   | TXT | `bounce` | `v=spf1 include:amazonses.com ~all` |

7. Log into your domain registrar in a separate browser tab.
8. Navigate to the DNS settings for `universe.market`.
9. Add each record exactly as Resend shows you. Be very precise — a single typo will cause verification to fail.
10. Return to the Resend dashboard and click **"Verify"**.

> **⏳ Note:** DNS changes can take up to 24 hours to propagate worldwide, but in most cases they take 5–30 minutes. If verification fails immediately, wait 15 minutes and try again.

### How to Know When Verification is Complete

In the Resend Domains page, your domain will show either:
- 🔴 **Pending** — DNS records have not propagated yet. Wait and try again.
- 🟡 **Unverified** — The records are incorrect. Double-check your DNS entries.
- ✅ **Verified** — You are ready to send emails from this domain.

---

## Step 3: Configure SPF

### What is SPF?

**SPF (Sender Policy Framework)** is a DNS record that tells the world "only these email servers are allowed to send emails from `@universe.market`."

Without SPF:
- Spammers can send emails pretending to be `hello@universe.market`
- Receiving email servers will flag your emails as suspicious

### How to Set Up SPF

Resend automatically provides an SPF record during domain verification (the `v=spf1 include:...` TXT record). If you followed Step 2 above and added all the TXT records Resend provided, your SPF is already configured.

### How to Verify SPF is Working

1. Go to **[https://mxtoolbox.com/SuperTool.aspx](https://mxtoolbox.com/SuperTool.aspx)**.
2. Type `universe.market` in the search box.
3. Click the dropdown and select **"SPF Record Lookup"**.
4. Click **"SPF Record Lookup"** button.
5. You should see your SPF record appear with no errors.

---

## Step 4: Configure DKIM

### What is DKIM?

**DKIM (DomainKeys Identified Mail)** is a digital signature system. When Resend sends an email on your behalf, it attaches an invisible cryptographic signature. The receiving email server then checks that signature against a public key stored in your DNS records.

If the signature matches: "This email is legitimate." ✅
If the signature does not match: "This email may have been tampered with." ⚠️

### How to Set Up DKIM

DKIM is configured via the CNAME record Resend provides during domain verification. If you added the `resend._domainkey` CNAME record in Step 2, your DKIM is already configured.

### How to Verify DKIM is Working

1. Go to **[https://mxtoolbox.com/SuperTool.aspx](https://mxtoolbox.com/SuperTool.aspx)**.
2. Type `resend._domainkey.universe.market` in the search box.
3. Select **"DKIM Lookup"** from the dropdown.
4. The lookup should return a public key value without errors.

---

## Step 5: Configure DMARC

### What is DMARC?

**DMARC (Domain-based Message Authentication, Reporting, and Conformance)** is a policy record that tells receiving email servers what to do if an email claiming to be from `@universe.market` fails both SPF and DKIM checks. It also sends you regular reports about who is sending emails using your domain.

DMARC has three policy levels:
- `p=none` — Monitor only. Collect reports but do not block any emails. **Start here.**
- `p=quarantine` — Put failing emails in spam/junk folder.
- `p=reject` — Block failing emails entirely. (Most strict — enable this after monitoring for a month.)

### How to Set Up DMARC

1. Go to your domain registrar's DNS settings.
2. Add a new TXT record:
   - **Host/Name:** `_dmarc`
   - **Value:** `v=DMARC1; p=none; rua=mailto:dmarc@universe.market; ruf=mailto:dmarc@universe.market; sp=none`
3. Save the record.

> **Explanation of the value:**
> - `p=none` — Policy: monitor only (don't block anything yet)
> - `rua=mailto:` — Send aggregate reports to this email address (you'll get weekly summaries)
> - `ruf=mailto:` — Send forensic reports (individual failure notifications)
> - `sp=none` — Policy for subdomains: also monitor only

### How to Verify DMARC is Working

1. Go to **[https://mxtoolbox.com/SuperTool.aspx](https://mxtoolbox.com/SuperTool.aspx)**.
2. Type `universe.market` in the search box.
3. Select **"DMARC Lookup"** from the dropdown.
4. You should see your DMARC record.

---

## Step 6: Obtain Your API Key

An API key is like a password that allows the UniVerse application to use your Resend account to send emails. Without this key, the app cannot communicate with Resend.

### How to Get Your API Key

1. In the Resend Dashboard, click **"API Keys"** in the left sidebar.
2. Click **"Create API Key"**.
3. In the **"Name"** field, type a descriptive name. We recommend creating two keys:
   - `UniVerse Production` — For the live website
   - `UniVerse Development` — For local development and testing
4. Under **"Permission"**, select **"Full Access"** for now (you can restrict later).
5. Click **"Add"**.
6. **CRITICAL: Copy the key immediately.** Resend will only show it to you once. If you lose it, you must create a new one.

   Your key will look like: `re_PeWC1XEc_XXXXXXXXXXXXXXXXXXXXXXXXXXX`

### Security Best Practices for API Keys

- **Never share your API key** in Slack, email, or any messaging platform.
- **Never commit it to GitHub** — especially a public repository. Automated bots scan GitHub for exposed API keys within minutes of a commit.
- Store it only in:
  - The `.env` file on your local machine (which should be in `.gitignore`)
  - Vercel's environment variables (for production deployment)
  - Supabase secrets (for Edge Functions)
- If a key is ever compromised, immediately **delete it** in the Resend dashboard and create a new one.

### Resend Rate Limits

| Plan | Emails per month | Rate limit |
|---|---|---|
| Free | 3,000 | 10 req/sec |
| Pro ($20/mo) | 50,000 | 10 req/sec |
| Scale ($90/mo) | 200,000 | 100 req/sec |

For a beta with fewer than 5,000 subscribers, the free plan is sufficient.

---

## Step 7: Configure the Webhook (For Open & Click Tracking)

Webhooks allow Resend to notify your application in real-time when an email is opened, a link is clicked, or an email bounces. Without this, your analytics dashboard will show zeros for open and click rates.

### How to Set Up a Webhook

1. In the Resend Dashboard, click **"Webhooks"** in the left sidebar.
2. Click **"Add Endpoint"**.
3. In the **"Endpoint URL"** field, enter the URL of your Supabase Edge Function:
   `https://[YOUR-SUPABASE-PROJECT-ID].supabase.co/functions/v1/resend-webhook`
   *(This Edge Function does not exist yet — it must be built. See Document 05 for how to create it.)*
4. Under **"Events"**, select:
   - `email.delivered`
   - `email.opened`
   - `email.clicked`
   - `email.bounced`
   - `email.complained` (spam reports)
5. Click **"Add"**.
6. Copy the **"Signing Secret"** that Resend provides. Add it to your Supabase secrets as `RESEND_WEBHOOK_SECRET`.

---

## Step 8: Verify Everything is Working

Once you have completed all the above steps, run this verification checklist:

### Pre-Send Checklist

- [ ] Resend account created
- [ ] Domain `universe.market` added to Resend
- [ ] SPF record added to DNS and verified (green checkmark in Resend)
- [ ] DKIM record added to DNS and verified (green checkmark in Resend)
- [ ] DMARC record added to DNS
- [ ] Production API key created and copied
- [ ] API key added to `.env` as `VITE_RESEND_API_KEY`
- [ ] API key added to Vercel production environment variables
- [ ] Edge Function `RESEND_API_KEY` secret set in Supabase

### Test Send

To confirm your setup works, send a test email:
1. Open the Admin Dashboard at `/admin`.
2. Go to **Campaigns** → **New Campaign**.
3. Fill in a title (e.g., "Test Campaign"), a subject line, and a short body.
4. Set the audience to "All Subscribers" (or just your own email if you're already a subscriber).
5. Click **Save Draft**, then click the send icon.
6. Check your email inbox. If you receive it within 1–2 minutes, everything is working.
7. Check the **Emails** tab in the Resend Dashboard — you should see the email logged there with a "Delivered" status.

---

## Managing Your Resend Account

### Monitoring Deliveries

In the Resend Dashboard:
- **Emails tab:** Shows every email sent, with delivery status (delivered, bounced, opened, clicked)
- **Domains tab:** Shows your domain verification health
- **Analytics tab:** Shows aggregate open/click rates over time

### What to Do if Emails Stop Delivering

1. Check the **Emails** tab in Resend. Look for `bounced` or `failed` statuses.
2. Go to the **Domains** tab and verify your domain still shows ✅ Verified.
3. Check if your monthly email limit has been reached (free tier: 3,000/month).
4. Check if the API key is still valid (it may have been revoked).

### Common Error Codes

| Error | Meaning | Fix |
|---|---|---|
| `401 Unauthorized` | Invalid or missing API key | Check `VITE_RESEND_API_KEY` in `.env` |
| `422 Unprocessable Entity` | Invalid `from` address or unverified domain | Verify domain in Resend dashboard |
| `429 Too Many Requests` | Rate limit exceeded | Implement batch sending; upgrade plan if needed |
| `500 Internal Server Error` | Resend-side issue | Check [status.resend.com](https://status.resend.com) |
