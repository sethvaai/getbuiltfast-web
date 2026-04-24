# Fix 6 — Stripe Checkout (test-mode first)

## Summary
Added a functional Stripe Checkout integration: server routes, success/cancel pages, webhook handler, and a one-shot product-creation script with a hard test-mode safety gate. No live or test keys were touched during this work — everything was built and smoke-tested with missing keys to verify graceful degradation.

## Files touched
New:
- `app/lib/stripe.ts` — lazy Stripe client (`getStripe()` returns null if no key); `isTestMode()` helper
- `app/api/checkout/route.ts` — POST → creates Checkout Session with inline price_data from `TIER[tierKey]`; handles `maintenance` as subscription, others as one-time
- `app/api/stripe-webhook/route.ts` — POST → verifies with `stripe.webhooks.constructEvent`, on `checkout.session.completed` writes to `orders` table (skips if Supabase not set)
- `app/success/page.tsx` — reads `session_id`, retrieves session via Stripe SDK, renders product/amount/email summary
- `app/cancel/page.tsx` — friendly cancel screen; CTAs to `/start` and pricing anchor
- `scripts/stripe-create-products.mjs` — optional one-shot script that creates all 11 products in test mode, with a hardcoded `sk_test_` prefix check that blocks live keys
- `app/data/pricing.ts` — copied from Fix 2 branch (identical copy; will merge cleanly)

Modified:
- `app/components/Pricing.tsx` — "Get Started" button: `scrollIntoView(#contact)` → POST `/api/checkout`, redirect to `session.url`, fall back to `/start` on 503

Dependency:
- `stripe` added to runtime deps

## Commits
- `fix-6-stripe-checkout` branch, 1 commit

## PR
Not opened — push blocked.

## Verification
- `GET /success` → 200, renders without session_id (shows the header only)
- `GET /cancel` → 200
- `POST /api/checkout {"tier":"landing_page"}` without keys → 503 `{"error":"Stripe not configured..."}`
- "Get Started" button path verified in code: 503 → `window.location.href = "/start"` (non-blocking fallback)

## Design decisions
- **Inline `price_data` instead of a Stripe product catalog** — lets each Checkout Session carry its own price copy, avoids a product-catalog drift issue if Zal later changes a tier price in `pricing.ts` without re-running the migration script
- **`orders.stripe_session_id` has a `unique` constraint + `resolution=merge-duplicates`** — webhook retries are idempotent
- **`sk_test_` gate in the product-creation script** — hard-coded refusal, not an env var. Someone running `STRIPE_SECRET_KEY=sk_live_... node scripts/...` will hit a `process.exit(1)` before any API call
- **Graceful fallback on 503** — if Stripe keys are unset, the pricing page still works: clicking "Get Started" sends visitors to the brief wizard instead of showing an error
- **Webhook handler only handles `checkout.session.completed` today** — other event types return 200 `{received: true}` so retries don't pile up. Add `invoice.paid` for the maintenance subscription in a follow-up

## Blockers (LIVE activation gate)
1. **Set Vercel env** (test keys first):
   - `STRIPE_SECRET_KEY=sk_test_…`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_…`
   - `STRIPE_WEBHOOK_SECRET=whsec_…` (from Stripe dashboard after creating the webhook endpoint targeting `https://www.get-built-fast.com/api/stripe-webhook`)
2. **Optional:** `node scripts/stripe-create-products.mjs` to populate a catalog in Stripe dashboard. Not required for checkout to work.
3. **Full test round-trip in test mode:**
   - Fill the brief at `/start`, submit
   - Hit "Get Started" on any pricing tier
   - Pay with `4242 4242 4242 4242`, any future expiry, any CVC
   - Confirm `/success` renders with the correct product/amount
   - Confirm an `orders` row appears in Supabase with `status='paid'` and the right `stripe_session_id`
   - Confirm Stripe dashboard shows the test session
4. **DO NOT flip to live keys** until step 3 passes end-to-end. Explicit Zal approval required for live activation.

## Not verified
- Webhook signature verification path (needs a real webhook secret + Stripe CLI `stripe listen` locally or a deployed URL)
- Subscription flow for `maintenance` tier — logic branches to `mode: "subscription"` with `recurring.interval: month` but end-to-end testing needs test keys

## Next steps recommended
- Add `invoice.paid` handler to track recurring maintenance charges
- Add a transactional email on `checkout.session.completed` so the customer gets an immediate receipt+next-steps (currently they rely on Stripe's default email)
- Link the brief-wizard submission flow to optionally bounce the user to Checkout in one step: after Fix 7's submit, show "Pay to lock a slot" alongside "We'll email you shortly"
