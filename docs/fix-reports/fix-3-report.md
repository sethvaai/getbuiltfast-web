# Fix 3 — Contact form centering

## Summary
Narrowed and tightened the "Start Your Project" form so it reads as explicitly centered at any viewport.

## Files touched
- `app/components/ContactForm.tsx`
  - Container width: `max-w-2xl` (672px) → `max-w-xl` (576px ≈ the 600px target)
  - Section padding: `px-6` → `px-4 sm:px-6` (tighter on ≤639px, original 24px on ≥640px)
  - `mx-auto` preserved

## Commits
- `fix-3-form-centering` branch, 1 commit

## PR
Not opened — push blocked.

## Verification
- Dev server `GET /` → 200
- Breakpoint math (no browser available for visual test):
  - 375px: `px-4` → 16px each side → 343px usable, card fills and feels centered within viewport
  - 768px: 576px card in 768px viewport → ~96px each side, clearly centered
  - 1440px: 576px card in 1440px viewport → ~432px each side, hard-centered
- Zal should still eye-check on real hardware — I cannot run a real browser here.

## Blockers
None.

## Next steps recommended
- If Fix 7 (quiz wizard) replaces this form entirely, this single-step form becomes the fallback. Keep the centering there as well.
