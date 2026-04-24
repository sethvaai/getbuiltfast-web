# Fix 4 — Portfolio mockup screenshots

## Summary
Filled the empty-black portfolio mockups with real screenshots of all 5 demo sites, swapped `object-fit` to `contain` so nothing crops at any breakpoint, and checked in the capture script so the screenshots can be regenerated.

## Files touched
- `scripts/screenshot-portfolio.mjs` (new) — puppeteer script
- `public/portfolio/luxstay.jpg` (new, 1440×900, 157 KB)
- `public/portfolio/urbanthreads.jpg` (new, 1440×900, 87 KB)
- `public/portfolio/flowmetrics.jpg` (new, 1440×900, 88 KB)
- `public/portfolio/mindspace.jpg` (new, 750×1624, 40 KB — 375×812 @ 2x)
- `public/portfolio/aureveil.jpg` (new, 1440×900, 83 KB)
- `app/components/Portfolio.tsx` — `objectFit: "cover"` → `"contain"` in both mockups
- `package.json` + `package-lock.json` — added `puppeteer` as devDep

## Commits
- `fix-4-portfolio-mockups` branch, 1 commit

## PR
Not opened — push blocked.

## Verification
- All 5 demo URLs returned HTTP 200 at capture time
- Each file verified via `sips -g pixelWidth -g pixelHeight`
- `curl /portfolio/luxstay.jpg` → 200 (static serving works)
- `curl /` → 200 after change

## Design decisions
- **Viewport choice:** macbook shots at 1440×900 (matches the 16:10 mockup container exactly); mobile shot at 375×812 with deviceScaleFactor 2 (retina iPhone). Both aspect ratios align closely with their respective mockup containers so `contain` yields zero visible letterbox for desktop and a tiny edge gap for mobile.
- **Why `contain` over `cover`:** user explicitly asked for no crop. `cover` was hiding content on the mobile shot because 1:2.17 image ≠ 1:1.77 container.
- **Why check in the script:** rerun when a demo site redesigns. `node scripts/screenshot-portfolio.mjs` regenerates everything in ~20s.

## Blockers
None.

## Not verified (needs Zal in a browser)
- Whether each captured screenshot shows the "best" frame of each demo site. Some sites may have animations that landed in an awkward state. Zal should eye-check and rerun with `node scripts/screenshot-portfolio.mjs` if any look off.
- Letterbox bars on the mobile frame — in light mode Fix 5 makes the backdrop `#e8e8e8` which is fine; in dark mode it's `#000` which may feel heavy. Consider a subtle blur-backdrop fill in a follow-up if needed.

## Next steps recommended
- Once Fix 5 + Fix 4 are both merged, the mockup letterbox backdrop will pick up `var(--mockup-screen-empty)` automatically.
- If the mindspace demo is just a concept and not a real product, consider swapping for a real client case study to strengthen social proof.
