# Phase 6 — Portfolio performance engineering report

**Project:** `e:\1portfolio` (Chiradeep portfolio)  
**Date:** 2026-10-22  
**Constraint honored:** No animation/transition/Framer Motion/keyframe/motion-timing changes.

**Overall status: PARTIAL** — high-impact media optimizations shipped; Lighthouse and final build/lint blocked by this Windows environment (`node_modules` corruption / EPERM).

---

## 1. Baseline Lighthouse (by route / device)

**Not obtained. No scores invented.**

| Attempt | Result |
|---------|--------|
| PowerShell splat + lighthouse@12.8.2 | Failed (`Please provide a url`) |
| npx CLI batch | Hung; exit `-1` / `4294967295`; no reports |
| Home mobile smoke (LH 13.x, 45s max-wait, 210s hard kill) | Timeout; site warmup **200** on `:3011`; no `.report.json` |

### Exact local commands (user)

```bat
cd /d e:\1portfolio
npm ci
set NEXT_DIST_DIR=.next-serve-audit
set NODE_ENV=production
npm run build
npm run start -- -p 3011
```

```bat
npx lighthouse http://127.0.0.1:3011/ --only-categories=performance --form-factor=mobile --screenEmulation.mobile=true --output=json --output=html --output-path=performance-audit/baseline/home-mobile --chrome-flags="--headless=new --disable-gpu --no-sandbox" --max-wait-for-load=45000 --disable-storage-reset
```

Repeat desktop + `/projects`, `/music`, `/archive/books`, `/archive/research`, `/archive/photography`, `/archive/artwork`.

---

## 2. Bottlenecks (evidence-backed)

| Issue | Evidence | Expected impact |
|-------|----------|-----------------|
| Nav GIF was ~4MB `unoptimized` + `priority` | File bytes + `BrandMark` | LCP / weight every non-About page |
| Photos 6000×4000 ~6.5–7MB each | sharp + disk | Photography transfer / cold image optimize |
| Artwork PNG bytes behind `.jpg` names | sharp `format: png` | Gallery weight |
| Motion stack (Lenis, framer-motion, RAF walls) | deps + `'use client'` | TBT/INP — **left untouched** |

---

## 3. Changes implemented

### Media (done — verified on disk 2026-10-22)

Backups: `performance-audit/image-backups/`  
Log: `performance-audit/image-optimization-log.json`

| Path | Before → After (approx) |
|------|-------------------------|
| `public/images/photography/IMG_8556.JPG` | ~6.5MB → **247KB** |
| `public/images/photography/IMG_9659[1].JPG` | ~7.0MB → **203KB** |
| `public/brand/1000054925.gif` | ~4.0MB → **460KB** (160px, 73 frames kept) |
| `public/brand/logo.jpg` | ~156KB → **10KB** (256px) |
| 21× `public/images/artwork/*.jpg` | PNG-as-jpg → real JPEG (**~85–92% smaller**) |

### Code (confirmed present; no animation edits)

- `components/archive/Masonry.tsx` — `sizes` + `priority={index < 2}`
- `components/home/ProfileHi.tsx` — `priority` + `sizes="56px"`
- `components/nav/NavShell.tsx` — `sizes="80px"`
- `app/layout.tsx` — `next/font` + `display: 'swap'`
- `next.config.ts` — AVIF/WebP image formats

Audit helpers (non-product): `performance-audit/optimize-images.mjs`, `performance-audit/run-lighthouse.mjs`, `performance-audit/00-animation-protection-boundaries.md`

---

## 4. Before / after (disk weight only)

| | Before | After | Δ |
|--|--------|-------|---|
| Photo pair | ~13.8MB | ~0.45MB | ≈ −97% |
| Brand GIF | ~4.0MB | ~0.46MB | ≈ −88% |
| Artwork set (21) | hundreds KB each as PNG | ~12–49KB JPEG | ≈ −85–92%/file |
| Lighthouse | — | — | **unmeasured** |

---

## 5. Regressions / unresolved / limits

- **Lighthouse:** cannot complete on this host (Chrome headless hang).
- **npm / build (current):** after failed installs, `node_modules/next` is **missing**; `@opentelemetry/api` was restored via `npm pack`+extract (`build/src/baggage/utils.js` present) but **full `npm run build` still fails** (`'next' is not recognized`). Root cause: **EPERM** during `npm install` on locked `node_modules\.typescript-eslint-*` (AV/editor), exit **-4048**.
- Earlier in audit: production build **did succeed** once (`NEXT_DIST_DIR=.next-serve-audit`, Next 16.2.4).
- Earlier: `tsc --noEmit` **passed**; `eslint .` **hung**.
- Animations: **unchanged**.

---

## 6. Verification checklist

| Check | Status |
|-------|--------|
| Media opts on disk | **Yes** (sizes above) |
| Animation configs untouched | **Yes** |
| `tsc --noEmit` | **Passed** earlier |
| `eslint` | **Not completed** (hang) |
| Final `npm run build` | **Blocked** — corrupted `node_modules` / EPERM |
| Lighthouse | **Not completed** |

---

## 7. Animation bottlenecks left unresolved (protected)

Lenis; Framer Motion (Reveal, BlurText, Masonry, trays, lightbox, PillNav); DriftWall / BounceCards / CircularCarousel / LogoLoop / GradientASCII; `app/globals.css` keyframes; GuestLogPrompt CSS; canvas-confetti.

---

## 8. Ranked next steps (user machine)

1. **High / low risk:** Close editors locking `node_modules`, pause AV briefly, run `npm ci` then `npm run build` / `npm run lint`.
2. **High / low:** Run Lighthouse commands in §1; save under `performance-audit/baseline/`.
3. **Med:** Optional smaller WebP brand mark if GIF still heavy in Network panel.
4. **Med / needs approval:** Lazy-load below-fold motion hosts without changing timings.
5. **Low:** Vercel Speed Insights for real-user CWV.

---

## User recovery (copy-paste)

```bat
cd /d e:\1portfolio
rmdir /s /q node_modules
npm ci
npm run type-check
npm run lint
npm run build
```
