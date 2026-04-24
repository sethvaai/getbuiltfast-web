# Fix 8 — Branded favicon

## Summary
Replaced default Next.js template favicon with GBF-branded icon (cyan lightning bolt on dark bg, matching the site's accent `#00D4FF` and `--bg #0A0A0A`).

## Files touched
- `app/icon.svg` (new) — 32x32 SVG, lightning bolt in `#00D4FF` on rounded dark square
- `app/apple-icon.tsx` (new) — 180x180 PNG via `ImageResponse` from `next/og` for iOS home screen
- `app/favicon.ico` (deleted) — default Next.js template icon

## Commits
- `80aa235` on branch `fix-8-favicon`

## PR
Not opened — push blocked.

## Verification
- Dev server on `http://localhost:3000`
- `curl /icon.svg` → 200
- `curl /apple-icon` → 200
- `curl /` HTML contains:
  - `<link rel="icon" href="/icon.svg?..." sizes="any" type="image/svg+xml"/>`
  - `<link rel="apple-touch-icon" href="/apple-icon?..." type="image/png" sizes="180x180"/>`
- Next.js 16 file-convention system auto-wires these; no manual edit to `app/layout.tsx` needed.

## Design rationale
Lightning bolt > "GBF" text because:
- Reads clearly at 16×16 in browser tabs
- Reinforces the "fast delivery" brand promise
- Matches the only accent color in the site's palette

## Blockers
None (beyond session-wide push auth issue).

## Next steps recommended
- Zal: open site in a browser after push, verify tab icon renders on Chrome / Safari / Firefox
- Consider an `opengraph-image.tsx` in a follow-up for social share previews (separate fix)
