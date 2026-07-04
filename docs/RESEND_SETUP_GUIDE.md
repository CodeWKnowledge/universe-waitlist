# Resend Setup Guide for Founders

This guide will walk you through setting up Resend, the modern email delivery platform we use to send waitlist confirmations, newsletters, and automated sequences. You don't need to write any code to manage this!

## 1. What Resend Is
Resend is an API platform that allows our app to send emails securely. It is designed for startups, offering great deliverability (so emails don't go to spam), detailed analytics (opens/clicks), and developer-friendly templates.

## 2. Creating a Resend Account
1. Go to [resend.com](https://resend.com) and click **Sign Up**.
2. Create an account using your startup's Google Workspace or email.

## 3. Domain Verification
To ensure your emails look professional (e.g., `hello@universe.market`) instead of going to spam, you must verify your domain.
1. In the Resend Dashboard, go to **Domains**.
2. Click **Add Domain** and enter your domain (e.g., `universe.market`).
3. Resend will provide you with DNS records (TXT and MX records).
4. Go to your domain registrar (GoDaddy, Namecheap, Vercel, etc.) and add these exact records to your DNS settings.
5. Click **Verify** in Resend. It may take up to 24 hours to propagate, but it's usually instant.

## 4. Obtaining API Keys
1. In the Resend Dashboard, go to **API Keys**.
2. Click **Create API Key**.
3. Name it (e.g., "Production") and give it **Full Access**.
4. **Copy the key**. You will only see it once! Keep it secure.

## 5. Connecting Resend to the Project
1. Open the `.env` file located in your project folder.
2. Paste the API key into the `VITE_RESEND_API_KEY` variable:
   ```env
   VITE_RESEND_API_KEY=re_1234567890
   ```
3. Your app is now connected!

## 6. Managing Contacts
Your waitlist users are automatically synced to our database. If you want to manage them via Resend's Audience feature in the future, you can export them from your Supabase Dashboard and import them into Resend via CSV.

## 7. Creating Newsletters
Currently, our app uses React Email templates. To send manual newsletters without coding:
1. You can log into your Admin Dashboard (built into the app).
2. Create a Draft, write your rich text, select your segment, and click **Send Broadcast**.

## 8. Monitoring Deliverability
Go to the **Emails** tab in Resend to see a real-time log of every email sent, whether it bounced, was delivered, opened, or clicked.

## 9. Troubleshooting
- **Emails going to Spam:** Ensure your Domain DNS records (SPF, DKIM) are perfectly verified in the Domains tab.
- **API Key Error:** Double-check your `.env` file and make sure you restart your local development server if you just added it.

## 10. Founder Workflow
Without touching code, you can:
1. Log into your Supabase Dashboard to view all `subscribers`.
2. Check the `referral_tracking` table to see who your top ambassadors are.
3. Use the app's Admin Dashboard (under `/admin`) to schedule newsletters directly to those users.
