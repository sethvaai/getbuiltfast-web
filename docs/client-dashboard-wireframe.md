# Client dashboard — textual wireframe (Fix 9)

**Status:** wireframe only. Zal reviews this before any code is written.

This document describes the client-facing dashboard at `/dashboard`, the auth flow at `/login`, and the data model that supports it. All code paths are described — none are implemented yet.

---

## Why build this

Today, a client who submits a brief (Fix 7) or pays for a project (Fix 6) has no self-serve way to check status. They wait for email. That creates:
- Repeated "where are we?" emails that interrupt delivery
- No single source of truth for what was agreed vs. what was delivered
- No way to send large files (brand assets, existing site dumps) without Dropbox/WeTransfer friction

A minimal dashboard fixes all three with ~1 week of focused work.

---

## Routes

| Path                 | Who                | Purpose                                                                                         |
| -------------------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| `/login`             | anonymous          | Enter email → receive Supabase magic link                                                       |
| `/auth/callback`     | anonymous          | Supabase redirects here with a session token; we set cookies and redirect to `/dashboard`       |
| `/dashboard`         | authenticated      | List of that user's orders + briefs, each with status and quick actions                         |
| `/dashboard/[id]`    | authenticated      | Single project page: timeline, attachments, invoices, kickoff-call link, change-request thread  |
| `/dashboard/files`   | authenticated      | All uploaded files across projects (Supabase Storage bucket)                                    |
| `/api/auth/*`        | system             | Supabase Auth callback handling                                                                 |
| `/api/uploads`       | authenticated POST | Signed-URL issuing for client uploads directly to Supabase Storage                              |

---

## `/login` page

Minimal. One field: email.

```
┌──────────────────────────────────────────┐
│                                          │
│   GetBuiltFast                           │
│                                          │
│   Check on your project                  │
│                                          │
│   Email: [________________]              │
│                                          │
│   [ Send me a magic link → ]             │
│                                          │
│   We'll email you a one-click login.     │
│   No password to remember.               │
│                                          │
└──────────────────────────────────────────┘
```

- Uses `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: "<origin>/auth/callback" } })`
- Confirmation state: "Check your email. Link expires in 60 min."
- Rate-limit: Supabase enforces by default, but also add a per-IP throttle (Vercel middleware) to blunt enumeration

---

## `/dashboard` page

Landing page after login.

```
┌───────────────────────────────────────────────────────────────┐
│ GetBuiltFast                             me@example.com  ▾    │
│                                                               │
│ ─────────────────────────────────────────────────────────────│
│                                                               │
│ Your projects                                                 │
│                                                               │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Aureveil landing page                                  │   │
│ │ Landing Page · €299 · Paid 2026-04-22                  │   │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━○──────                  │   │
│ │ Brief Received → In Design → In Build → Review → Live  │   │
│ │ [  Open project  ]   [  Upload files  ]                │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                               │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ Flexi Bookings SaaS                                    │   │
│ │ SaaS Dashboard · Brief received · pending quote        │   │
│ │ ●──────────────────────────────────────────            │   │
│ │ Brief Received → In Design → In Build → Review → Live  │   │
│ │ [  Open project  ]                                     │   │
│ └────────────────────────────────────────────────────────┘   │
│                                                               │
│ ─────────────────────────────────────────────────────────────│
│ Need something new?   [ Start a new brief → /start ]          │
└───────────────────────────────────────────────────────────────┘
```

- Each project card shows stage badges as a 5-dot progress timeline:
  **Brief Received → In Design → In Build → Review → Live**
- Current stage is a filled accent circle; completed stages are filled gray; future stages are empty
- "Open project" → `/dashboard/[id]`

---

## `/dashboard/[id]` single project page

```
┌───────────────────────────────────────────────────────────────┐
│ ← Back to dashboard                                           │
│                                                               │
│ Aureveil landing page               Status: In Design         │
│ Landing Page · €299                 Kickoff: 2026-04-22       │
│                                                               │
│ ─────────────────────────────────────────────────────────────│
│ Timeline                                                      │
│                                                               │
│   ●  Apr 22, 14:02  Brief received                            │
│   ●  Apr 22, 16:10  Payment received (€299 · Stripe)          │
│   ●  Apr 23, 09:00  Kickoff call scheduled — 15 min @ 10:00   │
│   ○  —              In design                                 │
│   ○  —              In build                                  │
│   ○  —              Review                                    │
│   ○  —              Live                                      │
│                                                               │
│ ─────────────────────────────────────────────────────────────│
│ Files                                                         │
│                                                               │
│   brand-assets.zip   4.2 MB    Apr 22                [ ↓ ]    │
│   reference-site.pdf 1.1 MB    Apr 22                [ ↓ ]    │
│   [ + Upload more ]                                           │
│                                                               │
│ ─────────────────────────────────────────────────────────────│
│ Quick actions                                                 │
│                                                               │
│   [ Request a change ]   [ Book a call ]   [ Download invoice ]│
└───────────────────────────────────────────────────────────────┘
```

- **Timeline** is a derived view over events (see data model below); no edit UI
- **Files** → `/api/uploads` issues a presigned Supabase Storage URL; the browser PUTs directly; on success the client calls a second endpoint that writes a row to `project_files`
- **Request a change** is a textarea that posts to a `change_requests` table and triggers an email to `hello@get-built-fast.com`
- **Book a call** deep-links to Zal's Cal.com / Zcal with the project ID as a query param
- **Download invoice** — Stripe Invoice URL from the original Checkout Session

---

## Data model additions

Fix 7's migration already created `leads` and `orders`. The dashboard needs:

```sql
-- Link auth.users → leads/orders via the email
-- Supabase creates the auth.users table automatically; we don't manage it.

-- Project = unit shown on dashboard. Multiple orders can belong to one project
-- (e.g., initial + maintenance + change orders).
create table projects (
  id uuid primary key default gen_random_uuid(),
  owner_email text not null,
  lead_id uuid references leads(id),
  name text not null,
  tier_key text,
  status text not null default 'brief_received',
    -- enum: brief_received | in_design | in_build | in_review | live | cancelled
  kickoff_at timestamp,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Timeline events (append-only, sorted chronologically)
create table project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  kind text not null,
    -- enum: brief | payment | kickoff_scheduled | stage_change | note
  title text not null,
  body text,
  metadata jsonb,
  created_at timestamp default now()
);

create table project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  storage_path text not null,   -- path in the 'client-uploads' bucket
  filename text not null,
  byte_size bigint,
  uploaded_by text not null,     -- email
  created_at timestamp default now()
);

create table change_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  author_email text not null,
  body text not null,
  status text default 'open',    -- open | in_progress | resolved
  created_at timestamp default now()
);
```

RLS policies (critical):
- `projects`: users can `select` only where `owner_email = auth.jwt()->>'email'`
- `project_events`, `project_files`, `change_requests`: users can `select`/`insert` only for projects whose `owner_email` matches their JWT email
- The Supabase service role key still bypasses RLS for our internal scripts and the webhook handler

Linking:
- When a Fix 7 submit comes in, upsert a `projects` row with `owner_email = body.email`, `lead_id = inserted lead id`, `name = first-40-chars-of-description or tier name`
- When a Fix 6 checkout.session.completed webhook fires with `metadata.lead_id`, find the corresponding project and append a `project_events` row of kind `payment`
- Stage transitions are driven manually by Zal for now (admin CLI or a single `/admin` page later)

---

## Storage

Supabase Storage bucket: `client-uploads`, private.

Upload flow:
1. Client hits "Upload" → `POST /api/uploads` with `{ projectId, filename, contentType, size }`
2. API route (server):
   - Verifies caller owns the project (RLS check via service role)
   - Rejects sizes > 50 MB (arbitrary cap, bump if Zal has a use case)
   - Calls `supabase.storage.from("client-uploads").createSignedUploadUrl(path)`
   - Returns `{ signedUrl, path, token }`
3. Client does `PUT` with the signed URL and the File body
4. On success, client POSTs to `/api/uploads/confirm` with `{ projectId, path, filename, size }` which inserts into `project_files`

Why not direct-to-Supabase-signed-upload from the client? Because we need a server-side permission check (does this user own this project?) before granting the upload.

---

## Auth

- Use `@supabase/ssr` for cookie-based session in the App Router
- Middleware at `/middleware.ts` refreshes the session on every request and gates `/dashboard/*`
- `/login` is anonymous; on session detected, redirect to `/dashboard`

---

## Out of scope for v1

- Stripe customer portal (self-serve subscription management) — add when we have >3 maintenance subscribers
- In-app messaging / comments — email is fine at <50 projects
- Admin view — Zal uses Supabase Studio + the project_events insert UI (SQL) until volume justifies building one
- Mobile app — responsive web is enough

---

## Build estimate

~5 working days:
1. Day 1: auth (`/login`, middleware, callback) + `projects` schema + RLS
2. Day 2: `/dashboard` list + `/dashboard/[id]` read-only timeline
3. Day 3: File uploads (API route + Supabase Storage + DB linking)
4. Day 4: Change requests + email hooks
5. Day 5: Polish, RLS smoke tests, responsive pass

---

## Open questions for Zal before build

1. **Who "owns" a project** — the email on the brief, or the email on the Stripe receipt? They can differ. Proposal: brief email is primary; Stripe receipt email is a secondary alias that can also log in and see the same project.
2. **Invoicing** — is the Stripe-hosted invoice enough, or do we need a Cinder Vale Ventures BV–branded PDF downloadable from the dashboard? (Branded PDF is +1 day.)
3. **Magic-link expiry** — Supabase default is 60 min. Some clients check email slowly. Bump to 24h? (Tradeoff: more room for a stale link to be forwarded.)
4. **Cancellation flow** — if a client clicks a "cancel project" button, do we just flag it and email Zal, or do we offer automated refund? Proposal: flag + email, manual refund case by case.
5. **Is the dashboard "optional" or "required after purchase"** — i.e., do we still support the current email-only flow for non-technical clients, or force dashboard signup? Proposal: optional. Send the magic link in the post-payment email, let them ignore it.

Zal's answers here shape v1 scope. Build starts once these five are settled.
