# Fix 9 — Client dashboard wireframe (docs only)

## Summary
Wrote `docs/client-dashboard-wireframe.md`. Textual wireframe of the /login + /dashboard flow, data model, file-upload strategy, and open questions. No code.

## Files touched
- `docs/client-dashboard-wireframe.md` (new)

## Commits
- `fix-9-wireframe-only` branch, 1 commit

## PR
Not opened — push blocked.

## What's in the wireframe
- 6 routes sketched with ASCII screen layouts
- 4 new Supabase tables drafted with SQL + RLS notes
- File upload flow: signed-URL-via-server so we can enforce ownership
- Auth: Supabase magic link with @supabase/ssr cookie session
- ~5-day build estimate
- **5 open questions** Zal must answer before implementation starts:
  1. Project ownership: brief email vs. Stripe receipt email
  2. Invoicing: Stripe-hosted vs. branded CVV PDF
  3. Magic-link expiry: 60min vs. 24h
  4. Cancellation flow: manual refund vs. automated
  5. Is dashboard signup optional or required post-purchase

## Blockers
None — this is docs-only.

## Next steps recommended
- Zal reviews the wireframe
- Zal answers the 5 open questions (or amends them)
- Then we scope Phase 1 implementation
