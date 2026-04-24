# Fix 5 — Light mode audit

## Summary
Replaced every hardcoded dark color in `Portfolio`, `Pricing`, and `Nav` with theme-responsive CSS variables. Portfolio section and mockup chassis now invert correctly in light mode.

## Files touched
- `app/globals.css` — added `--bg-alt`, `--text-faint`, `--border-subtle`, `--hover-tint`, `--mockup-chassis` (+ `-border`, `-detail`), `--mockup-screen-empty`, `--arrow-bg`, `--arrow-border` for both `[data-theme="dark"]` and `[data-theme="light"]`
- `app/components/Portfolio.tsx` — all `#0a0a0a` / `#1a1a1a` / `#333` / `#222` / `#444` / `#3a3a3a` / `#fff` / `rgba(255,255,255,…)` / `rgba(0,0,0,0.6)` replaced with vars
- `app/components/Pricing.tsx` — section bg, title, row text, row borders, header text, CTA button, all swapped to vars
- `app/components/Nav.tsx` — theme-toggle pill bg `rgba(255,255,255,0.05)` → `var(--hover-tint)` (desktop and mobile)

## Commits
- `fix-5-light-mode-audit` branch, 1 commit

## PR
Not opened — push blocked.

## Verification
- `grep -rn '"#1a1a1a\|"#333\|"#222\|"#444\|"#0a0a0a\|"#0f0f0f\|"#fff"\|rgba(255,255,255' app/components/ app/page.tsx` → **zero hits**
- Dev server `GET /` → 200, no compile errors
- Intentionally kept:
  - `rgba(0,0,0,0.5)` iPhone drop-shadow (shadows are dark in both modes)
  - `#000` label text on `var(--accent)` for the "Popular" badge and buttons (accent is cyan in both themes → dark text is readable)
  - `#ff6b6b` error text (error red works in both modes)

## Design decisions
- Light-mode mockup chassis = `#d4d4d4` silver (matches real MacBook aluminum better than black)
- Light-mode empty screen = `#e8e8e8` instead of `#000` so unloaded portfolio screens aren't a jarring black hole
- Light-mode arrow buttons = semi-opaque white `rgba(255,255,255,0.85)` with 15% black border — mirrors the dark-mode semi-opaque-black equivalent

## Blockers
None.

## Not verified (needs Zal in a browser)
- Actual visual contrast in light mode at real viewports
- Light-mode hover states on all buttons — I only changed base colors, relied on the existing hover logic using `var(--accent)` which is already theme-aware

## Next steps recommended
- Screenshot pass in both themes after Zal pushes
- If the light-mode chassis looks too gray, bump to `#e6e6e6` or add a subtle gradient in a follow-up
