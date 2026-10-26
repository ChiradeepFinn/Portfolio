# Phase 6 — Portfolio performance engineering report

**Project:** `e:\1portfolio` (Chiradeep portfolio)  
**Stack:** Next.js 16.2.4, React 19.2.4, TypeScript 5, Tailwind 4, framer-motion 13 / motion 13, Lenis  
**Constraint:** No animation / transition / Framer Motion / keyframe changes.

---

## 1. Baseline Lighthouse (by route / device)

**Not available.** Lighthouse CLI is not workable in this agent environment.

| Attempt | Result |
|---------|--------|
| PowerShell `npx` + `@args` | Immediate fail (`Please provide a url`) |
| `cmd /c` Lighthouse 12.8.2 batch | Hung; no reports |
| Hard-timeout smoke ×2 vs `http://127.0.0.1:3011/` | Warmup **200**; Lighthouse **TIMEOUT 210s**; no `.report.json` |

**No Performance / FCP / LCP / TBT / CLS / SI scores are reported here** (would be fabricated).

Local commands: see `performance-audit/LIGHTHOUSE-LIMITATION.md`.

Production server for attempts: `NEXT_DIST_DIR=.next-serve-audit`, port **3011** (warmup OK).

---

## 2. Bottlenecks (measurement-supported without Lighthouse)

| Bottleneck | Evidence | Likely CWV impact |
|------------|----------|-------------------|
| Photography masters **6000×4000** | Was **6.5–7.0 MB** each (`IMG_8556.JPG`, `IMG_9659[1].JPG`) | LCP / page weight on `/archive/photography` (even with `next/image`, decode + first optimize cost) |
| Artwork files labeled `.jpg` but **PNG** | Many **190–400 KB** PNG payloads | Transfer / LCP on `/archive/artwork` |
| Animated nav mark GIF **800×800×73**, **~4.0 MB**, `unoptimized` + `priority` | `public/brand/1000054925.gif` via `BrandMark` / `NavShell` | **Every route** network weight; competes with LCP |
| Still logo **1024×1024** for **40–64px** display | `logo.jpg` ~156 KB | About-route logo transfer |
| Heavy client motion stack | `framer-motion`, Lenis, DriftWall RAF, BounceCards, GradientASCII, etc. | TBT / INP / hydration (protected — not changed) |
| Large Fraunces weight set (300–600 + italic) | `app/layout.tsx` `next/font` | Font bytes / FCP (left unchanged — design risk) |

---

## 3. Changes implemented (paths + why)

### Media (primary wins)

| Asset | Change | Why |
|-------|--------|-----|
| `public/images/photography/IMG_8556.JPG` | 6000×4000 / ~6.5 MB → **2200×1467 / ~247 KB** (−96%) | Display-sized JPEG; masonry/lightbox still use `next/image` |
| `public/images/photography/IMG_9659[1].JPG` | 6000×4000 / ~7.1 MB → **2200×1467 / ~203 KB** (−97%) | Same |
| `public/images/artwork/*.jpg` (21 PNG-as-jpg) | Re-encoded to real JPEG (~79–92% smaller each) | Same filenames/paths; layout unchanged |
| `public/brand/1000054925.gif` | 800px / ~4.0 MB → **160px / ~460 KB** (−88%), **73 frames kept** | Displayed at 40px; animation preserved as media, not code |
| `public/brand/logo.jpg` | 1024² / ~156 KB → **256² / ~10 KB** (−94%) | Matches small mark usage |

Backups + log: `performance-audit/image-backups/`, `performance-audit/image-optimization-log.json`.

Helpers (not required at runtime): `performance-audit/optimize-images.mjs`, `performance-audit/run-lighthouse.mjs`, `performance-audit/smoke-lighthouse.mjs`.

### Code / image component posture (already in place / verified)

- `components/archive/Masonry.tsx` — `next/image` + `sizes` + `priority={index < 2}` (above-fold gallery).
- `components/archive/Lightbox.tsx` — `next/image` with explicit width/height/sizes.
- `components/home/ProfileHi.tsx` — profile `priority` + `sizes="56px"`.
- `components/nav/NavShell.tsx` — brand `priority` + `sizes="80px"`.
- `app/layout.tsx` — fonts via `next/font` + `display: 'swap'` (unchanged).
- `next.config.ts` — `images.formats: ['image/avif','image/webp']` (unchanged).

**No Framer Motion / CSS keyframe / Lenis / DriftWall / BounceCards timing edits.**

---

## 4. Before / after (file weight — measured)

| Item | Before | After | Δ |
|------|--------|-------|---|
| Photo IMG_8556 | 6 667 098 B | 252 606 B | **−96%** |
| Photo IMG_9659[1] | 7 115 292 B | 207 363 B | **−97%** |
| Brand GIF | 4 093 750 B | 471 174 B | **−88%** |
| Brand logo | 159 301 B | 9 758 B | **−94%** |
| Artwork PNG→JPEG (21 files) | ~5–6 MB class aggregate | typically **12–49 KB** each | **~80–92%** each |

Lighthouse before/after: **N/A** (CLI blocked).

---

## 5. Regressions, unresolved, testing limits

- **Lighthouse:** blocked; no CWV regression/improvement numbers.
- **Full `npm run lint`:** hung/slow when scanning entire tree (likely `.next*` noise); scoped `npx eslint app components lib` reports **pre-existing** React Compiler / hooks / `no-img` issues in motion UI — **not introduced by media work**; left alone to protect animations.
- **`npm run type-check`:** **pass** (`tsc --noEmit` exit 0).
- **Production build:** run after media changes (see verification section below).
- **Visual QA:** not browser-automated end-to-end; GIF still animates (frame count preserved); photography aspect preserved (3:2).
- **Locked files** initially blocked rewrite while server held handles; completed after stop/rename-replace.

---

## 6. Verification confirmation

| Check | Result |
|-------|--------|
| TypeScript (`npm run type-check`) | **Pass** |
| Lint (`npm run lint` full) | Incomplete / hung; scoped eslint shows **pre-existing** errors |
| Production build | See build exit in session after this report |
| Navigation / interactive | Not fully re-walked in browser automation this pass |
| Animation configs | **Unchanged** by design |

---

## 7. Animation-related bottlenecks left unresolved (protected)

1. **Lenis** smooth scroll (`SmoothScrollProvider`) — main-thread rAF.
2. **Framer Motion** page/UI presence (Reveal, BlurText hero, Masonry entrance, Lightbox, SearchPalette, etc.).
3. **DriftWall** continuous column rAF + raw `<img>` (if used on a route).
4. **BounceCards / CircularCarousel / LogoLoop / GradientASCII** custom engines — also `@next/next/no-img-element` warnings; swapping to `next/image` risks layout/animation behavior → needs approved design pass.
5. **Hero `BlurText` staggered motion** — may delay perceived LCP text paint; do not simplify without approval.
6. **GuestLogPrompt / star / timeline CSS keyframes** in `globals.css` — leave intact.
7. **Nav GIF** still ~460 KB unoptimized animated asset — further cut (WebP/APNG, fewer frames) needs visual approval.

---

## 8. Recommended next steps (impact / risk / effort)

| Rank | Action | Impact | Risk | Effort |
|------|--------|--------|------|--------|
| 1 | Run Lighthouse locally using `LIGHTHOUSE-LIMITATION.md` | High (truthful CWV) | Low | Low |
| 2 | Optional: animated mark → compressed WebP/APNG or fewer frames | High (global) | Med (look) | Med |
| 3 | Dynamic-import heavy below-fold widgets **without** changing motion props | Med | Med | Med |
| 4 | Approve-only: `content-visibility` / IO pause for DriftWall when offscreen | Med | Med | Med |
| 5 | Trim Fraunces weights after usage audit | Med | Med (typography) | Low |
| 6 | Fix pre-existing eslint React Compiler findings **outside** animation cores | Low–Med | Low | Med |
| 7 | Add `.eslintignore` / flat-config ignores for `.next*` so `npm run lint` finishes | Low | Low | Low |

---

## Animation protection boundaries (summary)

Documented in `performance-audit/00-animation-protection-boundaries.md`. All listed motion files were left behaviorally intact.
