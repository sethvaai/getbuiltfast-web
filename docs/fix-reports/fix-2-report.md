# Fix 2 — Pricing single source of truth

## Summary
Consolidated all pricing into one file. Services grid and Pricing table both now import from `app/data/pricing.ts`. Fixes the €799 vs €1,499 conflict for E-Commerce Store.

## Files touched
- `app/data/pricing.ts` (new) — 11 tiers with `key`, `name`, `priceLabel`, `priceFromEuros`, optional `highlight`/`recurring`
- `app/components/Products.tsx` — refactored to import `TIER` map, reference tiers by key (`landing_page`, `ecommerce`, `saas_dashboard`, `brand_website`, `booking_platform`, `ai_app`)
- `app/components/Pricing.tsx` — refactored to import `PRICING` array and `PricingTier` type; renders all 11 tiers in official order

## Commits
- `fix-2-pricing-consistency` branch, 1 commit

## PR
Not opened — push blocked.

## Verification
- `grep -rnE "€\s*[0-9]" app/` shows prices live only in `app/data/pricing.ts`, `app/components/Hero.tsx` (the "from €299" brand statement, aligned with the Landing Page tier), `app/layout.tsx` (meta description, same), and `app/components/ContactForm.tsx` (budget range options — unrelated, user-input buckets not tier prices).
- Only one E-Commerce Store price in the codebase: €1,499 in `pricing.ts`.
- The remaining €799 in `pricing.ts` is for Full Website (correct).
- Dev server `GET /` → 200, no compile errors.

## Design decisions
- Kept Services grid (`Products.tsx`) showing 6 flagship tiers with icons; Pricing table shows all 11. Rationale: the grid is a visual hero; adding 11 cards would be noisy. The full list belongs in the table.
- `priceFromEuros` is stored as integer euros (not cents) because the pricing is only used for display in this fix. Stripe integration (Fix 6) will compute cents at checkout time.

## Blockers
None.

## Next steps recommended
- Fix 6 will reuse `TIER[key].priceFromEuros * 100` when building Stripe line items.
- Fix 7 (quiz form) can use `PRICING` to drive the project-type selection step.
