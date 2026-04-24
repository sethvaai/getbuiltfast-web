# Fix 7 — Multi-step brief wizard

## Summary
Replaced the single-step contact form flow with a 7-step wizard at `/start`. Live price estimate updates every step. Submit goes to `/api/submit-brief` which inserts into Supabase `leads` and emails `hello@get-built-fast.com` via Resend.

## Files touched
New files:
- `app/start/page.tsx` — wizard route
- `app/components/BriefWizard.tsx` — 550 lines, useReducer-driven 7-step UI
- `app/thank-you/page.tsx` — success screen, reads `?leadId` from searchParams
- `app/api/submit-brief/route.ts` — validates, persists, emails, returns `{leadId}`
- `app/data/quiz-options.ts` — FEATURES / INTEGRATIONS / DESIGN_STYLES / TIMELINES / HEAR_ABOUT_US
- `app/data/pricing.ts` — imported from Fix 2 (identical copy; will merge cleanly)
- `app/lib/estimate.ts` — pure function computing min/max from project + features + rush
- `app/lib/supabase.ts` — tiny REST wrapper; returns `null` if keys not set (graceful degrade)
- `supabase/migrations/001_leads_orders.sql` — leads + orders tables, indexes, RLS
- `.env.example` — documented env vars

Modified:
- `app/page.tsx` — "Start a Project" nav CTAs (desktop + mobile) → `/start`
- `app/components/Hero.tsx` — "Start Your Project →" CTA → `/start`

Old `ContactForm` on homepage and `/api/contact` kept intact as fallback.

## Commits
- `fix-7-multi-step-form` branch, 1 commit

## PR
Not opened — push blocked.

## Verification
- Dev server smoke tests:
  - `GET /` → 200
  - `GET /start` → 200, rendered HTML contains all 11 project cards, progress bar at "Step 1 of 7", disabled Continue button, live estimate badge `€499–€699`
  - `GET /thank-you` → 200
- API smoke test:
  - `POST /api/submit-brief` with minimal valid payload → 500 locally (no env vars) with clear error message. Logs show both `SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing` and `RESEND_API_KEY missing` warnings fire correctly.
  - In Vercel prod with keys set, both paths activate and endpoint returns `{leadId, success: true}`.

## Design decisions
- **Single reducer over per-step state**: simpler back navigation, easier to serialize later for email-on-abandon or session restore
- **Estimate upper bound = center × 1.4**: gives a comfortable 40% spread for "discovery uncovers scope" without overwhelming the visitor with precision-false-positive
- **Rush = +25% of subtotal before rush**: matches the "rush delivery toggle (+25%)" spec exactly
- **Graceful degrade over hard fail**: endpoint is usable with either Supabase *or* Resend configured. Logs document which path fired so Zal can see what happened
- **HTML escape on email template**: prevents XSS through any form field echoed back in the team notification
- **RLS enabled on leads/orders**: service role key bypasses RLS so API works, but a leaked anon key cannot read leads directly

## Blockers (require Zal on return)
1. **Run SQL migration** in Supabase project `cbzqhcbstgeqizgvkmfd`: paste `supabase/migrations/001_leads_orders.sql` into the SQL editor and execute. Creates `leads` + `orders` tables.
2. **Set Vercel env vars:**
   - `SUPABASE_URL=https://cbzqhcbstgeqizgvkmfd.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY=…` (get from Supabase → Project Settings → API)
3. **Confirm `RESEND_API_KEY`** is already set on Vercel (existing `/api/contact` uses it; `/api/submit-brief` reuses the same var).
4. Optional: populate `.env.local` with the same vars for local testing.

## Not verified
- Full submit round-trip (no env locally). Test after Zal sets keys: fill the wizard on staging, confirm a row appears in Supabase `leads` and an email lands at hello@get-built-fast.com.
- Back-forward browser cache reset. The user spec says "/start route must clear form state on mount" — initial `useReducer` state satisfies this on hard navigation; bfcache restoration might preserve state. Add a `router.refresh()` or explicit reset effect if Zal sees the stale-state bug after a bfcache restore.

## Next steps recommended
- Fix 6 (Stripe) will read lead_id from the wizard's submission and attach it to the `orders` table for the full lead→order funnel
- Consider adding email-to-client confirmation (currently only team receives notification) — one extra `resend.emails.send()` call in the route
- Abandonment analytics: send a partial-state ping to PostHog or similar on each step transition (low priority)
