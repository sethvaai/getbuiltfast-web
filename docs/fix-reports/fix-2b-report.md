# Fix 2b — Landing Page price correction €299→€499

## Summary
Zal corrected the Landing Page entry price mid-session: the original brief said €299, the official rate is €499. Propagated the correction across every branch that references it.

## Rollout per branch
- `fix-2-pricing-consistency` (commit `61508b7`) — single-source `app/data/pricing.ts` updated; `Hero.tsx` and `layout.tsx` brand statements updated
- `fix-7-multi-step-form` (commit `226ffd9`) — identical copy of `pricing.ts` + the pre-refactor hardcoded `€299` in `Pricing.tsx` and `Products.tsx` (which exist on fix-7 because it branched off main before Fix 2)
- `fix-6-stripe-checkout` (commit `0f357a0`) — identical copy of `pricing.ts` + hardcoded Pricing/Products fallbacks + the `TIERS` array in `scripts/stripe-create-products.mjs` so the Stripe product-catalog script ships with the correct amount

## Files touched (union across all three branches)
- `app/data/pricing.ts` — `landing_page` priceFromEuros 299→499
- `app/components/Hero.tsx` — brand statement "from €299" → "from €499"
- `app/layout.tsx` — meta description + OG description
- `app/components/Pricing.tsx` — hardcoded row on fix-7/fix-6 (superseded by Fix 2)
- `app/components/Products.tsx` — hardcoded card on fix-7/fix-6 (superseded by Fix 2)
- `scripts/stripe-create-products.mjs` — TIERS array on fix-6

## Not touched (deliberate)
- `app/components/ContactForm.tsx` budget bucket `"€299–€499"` — this is a user-input budget range, not a tier promise. The mismatch with actual pricing tiers is a small cosmetic issue, not a broken commitment. Left for a follow-up cleanup that rebalances the budget buckets around the new price floor.

## Verification
- `grep -rn "€299\|priceFromEuros: 299\|From €299\|from €299\|euros: 299" app/ scripts/` → on each of the three branches, only the ContactForm budget bucket remains. Every price-tier reference has been updated.
- Dev server still compiles on each branch (homepage 200 after switch).

## Merge order reminder
Fix 2 (with Fix 2b) should merge before Fix 7 and Fix 6. If Fix 7/Fix 6 merge first and Fix 2 merges after, the three identical copies of `pricing.ts` will collapse cleanly because their content matches. The hardcoded fallbacks in Pricing/Products on fix-7 and fix-6 will be replaced by Fix 2's single-source refactor when Fix 2 merges in any order.
