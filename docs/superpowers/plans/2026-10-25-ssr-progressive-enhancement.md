# SSR Progressive Enhancement — Phase 1 Implementation Plan

> **For agentic workers:** Execute task-by-task. Spec: `docs/superpowers/specs/2026-10-25-ssr-progressive-enhancement-design.md`.

**Goal:** CSS-first progressive enhancement on homepage + root layout so meaningful HTML is server-rendered and hydration/JS shrink without losing motion identity.

**Architecture:** Convert `BlurText`, `Reveal`, `GradientWord` to server+CSS; leaf Lenis; slim ClosingBand/Nav; keep ArrowPill client; measure before/after.

**Tech Stack:** Next.js App Router, CSS keyframes, Framer only where still required (ArrowPill, ProfileHi, etc.).

## Global Constraints

- Preserve visual design, animation identity, routes, content.
- `app/layout.tsx` and `app/page.tsx` stay Server Components.
- Never hide meaningful content until client animation init.
- No indiscriminate `ssr: false`; no deploy; Phase 2 only after Phase 1 validation.

## Baseline vs Phase 1 (fair A/B; revalidated 2026-10-25)

Next.js 16.2.4 Turbopack does not print a First Load JS table. Metric: sum of uncompressed on-disk JS chunks referenced by prerendered `server/app/index.html` for `/`.

| Metric | Before (Framer primitives) | After (Phase 1) | Delta |
|--------|----------------------------|-----------------|-------|
| `'use client'` total (components+app+lib) | 50 | **45** | −5 |
| components Client / Server | 48 / 48 | **43 / 51** | −5 / +3 |
| `/` homepage JS (15 scripts) | 926.5 kB | **917.6 kB** | **−8.9 kB** |
| All `static/**/*.js` | 1130.5 kB (31) | **1102.3 kB** (30) | **−28.2 kB** |
| Hero `opacity:0` inline spans | 30 | **0** | fixed |
| `blur-text` / `gradient-word` in HTML | 0 | 24 / 15 | SSR classes present |

Builds: `.next-ssr-before` (before), `.next-ssr-phase1-v2` (after revalidate). `next start :3460` → `/` `/projects` `/about` 200; hero readable; no content gated on JS opacity. Server share of `components/` ≈ **54%** (51/94) — **not** ~90%; that target is not claimed. Phase 2 not started.

---

### Task 0: Baseline build

- [ ] Run `npm run build`, record `/` First Load JS and any pre-existing errors
- [ ] Write numbers into this plan / report notes

### Task 1: CSS motion primitives

- [ ] Add CSS for blur-text, reveal, gradient-word (+ reduced-motion)
- [ ] Rewrite `BlurText`, `Reveal`, `GradientWord` as Server Components (drop Framer)
- [ ] Replace or stub `GradientText` usage for `GradientWord` path

### Task 2: Layout shell

- [ ] Leaf `SmoothScrollProvider` (effect-only, keep children as RSC slots)
- [ ] `ClosingBand` via contact layout omit or tiny gate + server NebulaCta if possible
- [ ] Nav: remove debug probe; optional server chrome split if low-risk

### Task 3: Validate + report

- [ ] Production build; recount; compare First Load JS
- [ ] Manual a11y / reduced-motion / hydration spot-check
- [ ] Written report (no Phase 2)
