# UniVerse — Student Marketplace Platform

> **One unified codebase.** Waitlist landing + full dashboard sandbox — served from a single React SPA.

---

## Project Structure

```
src/
├── app/
│   ├── App.jsx               # Master router (Waitlist → Dashboard)
│   ├── main.jsx              # React DOM entry point
│   └── providers/
│       └── ThemeContext.jsx  # Global dark/light theme state
│
├── features/
│   ├── waitlist/             # Landing page, signup form, SoftAurora
│   ├── dashboard/            # Dashboard home, Messages
│   ├── marketplace/          # Product grid, details, create listing
│   ├── study-hub/            # Study resources, upload, details
│   └── user/                 # Profile, settings, notifications, saved, my-listings
│
├── components/
│   ├── layout/               # DashboardLayout, Sidebar, Topbar
│   ├── ui/                   # ProductCard
│   └── shared/               # Toast notifications
│
├── services/
│   ├── analytics/            # analytics.service.js
│   └── api/                  # waitlist.service.js
│
├── utils/                    # waitlist.validation.js, waitlist.constants.js
├── assets/                   # Static media
└── styles/
    └── globals.css           # Tailwind v4 + CSS custom properties (theme tokens)
```

---

## Routing Architecture

| Path | Component | Description |
|---|---|---|
| `/` | `WaitlistApp` | Pre-launch waitlist landing page |
| `/marketplace` | `Marketplace` | Product listing grid |
| `/marketplace/:id` | `ProductDetails` | Product detail view |
| `/create-listing` | `CreateListing` | New listing form |
| `/study-hub` | `StudyHub` | Study resources grid |
| `/study-hub/:id` | `ResourceDetails` | Resource detail view |
| `/upload-resource` | `UploadResource` | Resource upload form |
| `/messages` | `Messages` | Peer chat |
| `/saved` | `SavedItems` | Saved listings |
| `/my-listings` | `MyListings` | User's own listings |
| `/notifications` | `Notifications` | Activity feed |
| `/profile` | `Profile` | User profile |
| `/settings` | `Settings` | App settings |

---

## Running Locally

```bash
npm install
npm run dev
```

Server starts on **http://localhost:5173**

- `/` → Waitlist Landing
- `/marketplace` → Full Dashboard Sandbox

---

## Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS v4** with CSS custom properties for theming
- **Framer Motion** for animations
- **React Router v7** for SPA routing
- **HugeIcons** (`@hugeicons/react` + `@hugeicons/core-free-icons`)
- **localStorage** for waitlist persistence (pre-Supabase)

---

## Theme System

The app supports **dark** (default) and **light** modes via `ThemeContext.jsx`.

Toggle is available in the Topbar (dashboard) and the Waitlist header. Preference is persisted in `localStorage` under the key `universe-theme`.

CSS variables defined in `styles/globals.css` flip automatically when `html.light` class is applied.
