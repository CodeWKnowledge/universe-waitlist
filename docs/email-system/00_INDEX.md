# UniVerse Email System — Documentation Index

> **Last Updated:** June 2026  
> **Based on:** Complete code audit of `/waitlist/src` and `/waitlist/supabase`  
> **Overall System Status:** Early Beta Ready (52/100 Production Readiness)

---

## Who Should Read What

| You are... | Start with... |
|---|---|
| A founder setting up email for the first time | [04 — Resend Setup Guide](./04_Resend_Setup_Guide.md) → [05 — Configuration Guide](./05_Project_Configuration.md) |
| A founder who wants to send campaigns day-to-day | [06 — Operating Manual](./06_Operating_Manual.md) |
| A developer joining the project | [01 — Architecture Overview](./01_Architecture_Overview.md) → [02 — Audit Report](./02_Audit_and_Status_Report.md) |
| Someone evaluating production readiness | [03 — Production Readiness](./03_Production_Readiness.md) |
| Someone debugging an email problem | [07 — Troubleshooting Guide](./07_Troubleshooting_Guide.md) |
| Someone responsible for ongoing operations | [08 — Maintenance Handbook](./08_Maintenance_Handbook.md) |

---

## Document Summaries

### [01 — Architecture Overview](./01_Architecture_Overview.md)
The technical blueprint of the entire email system. Covers the four-layer architecture (UI → Service → Database → Delivery), every file and what it does, and four detailed flow diagrams showing exactly how emails travel from user action to inbox.

### [02 — Audit & Status Report](./02_Audit_and_Status_Report.md)
A complete inventory of every email-related file with an honest assessment of each feature's current status (Fully Functional / Partially Functional / Placeholder / Not Implemented). Identifies all gaps and what is needed to close them.

### [03 — Production Readiness Assessment](./03_Production_Readiness.md)
A scored assessment (52/100 overall) across six categories: Infrastructure, Deliverability, Reliability, Scalability, Compliance, and Security. Includes an ordered action plan to reach 100%.

### [04 — Resend Setup Guide](./04_Resend_Setup_Guide.md)
A beginner-friendly step-by-step guide to creating a Resend account, verifying a domain, adding SPF/DKIM/DMARC DNS records, obtaining API keys, and setting up webhooks for analytics.

### [05 — Project Configuration Guide](./05_Project_Configuration.md)
Documents every required environment variable with its purpose, format, and where to find it. Covers local development setup, Edge Function deployment, cron job configuration, and Vercel production deployment.

### [06 — Operating Manual](./06_Operating_Manual.md)
A practical guide for founders to operate the email system day-to-day through the Admin Dashboard. Covers subscriber management, audience creation, campaign building, email design, sending broadcasts, and managing automation sequences.

### [07 — Troubleshooting Guide](./07_Troubleshooting_Guide.md)
Solutions to 10 common problems: emails not sending, domain verification failures, API key errors, spam delivery, blank dashboards, analytics showing zeros, automation emails not arriving, bounced emails, Edge Function timeouts, and missing subscribers.

### [08 — Maintenance Handbook](./08_Maintenance_Handbook.md)
A recurring maintenance schedule covering deliverability monitoring, domain health checks, list hygiene, bounce management, template updates, sequence content reviews, security key rotation, dependency updates, and disaster recovery procedures.

---

## Critical Issues Summary (As of Audit Date)

These are the most urgent gaps identified from the code audit:

| # | Issue | Severity | Affects |
|---|---|---|---|
| 1 | `/admin` route has NO authentication guard | 🔴 Critical | Security |
| 2 | `sendBatchBroadcast()` is a mock — no real emails sent for campaigns | 🔴 Critical | Campaign Sending |
| 3 | No unsubscribe link in any email (CAN-SPAM/GDPR violation) | 🔴 Critical | Legal Compliance |
| 4 | `VITE_RESEND_API_KEY` is exposed in browser source code | 🟠 High | Security |
| 5 | Edge Function not deployed (automated emails won't send) | 🟠 High | Automation |
| 6 | `pg_cron` job not configured (Edge Function never runs) | 🟠 High | Automation |
| 7 | Database trigger missing (email queue never populated) | 🟠 High | Automation |
| 8 | Analytics data is entirely randomly generated (mock) | 🟡 Medium | Dashboard |
| 9 | `subscriberService.js` references non-existent query functions (broken) | 🟡 Medium | Code Quality |
| 10 | Audience subscriber management has no UI (empty audiences only) | 🟡 Medium | Targeting |
| 11 | No CSV import for subscriber lists | 🟡 Medium | Operations |
| 12 | `email_templates` table registered but completely unused | 🟢 Low | Templates |
| 13 | WelcomeEmail referral link uses `window.location.origin` (localhost in dev) | 🟢 Low | Emails |
| 14 | 9 simultaneous DB queries on Overview load (needs RPC optimization at scale) | 🟢 Low | Performance |

---

## Technology Stack Reference

| Technology | Version | Role |
|---|---|---|
| React | 19.2.6 | Frontend UI framework |
| Vite | 8.0.12 | Development server and build tool |
| React Router DOM | 7.17.0 | Client-side routing |
| Supabase JS | 2.107.0 | Database client (PostgreSQL) |
| Resend | 6.12.4 | Email delivery provider |
| @react-email/components | 1.0.12 | Email-safe React components |
| @react-email/render | 2.0.8 | JSX → HTML compiler for emails |
| Recharts | 3.8.1 | Analytics chart library |
| Framer Motion | 12.40.0 | Animations |
| TailwindCSS | 4.3.0 | Utility CSS (used in email templates via @react-email Tailwind support) |
| Deno | Latest | Runtime for Supabase Edge Functions |

---

## Other Documentation

- [`/docs/RESEND_SETUP_GUIDE.md`](../RESEND_SETUP_GUIDE.md) — Legacy quick-start guide (superseded by Document 04 above)
- [`/docs/SUPABASE_EDGE_FUNCTIONS_GUIDE.md`](../SUPABASE_EDGE_FUNCTIONS_GUIDE.md) — Supabase CLI reference
