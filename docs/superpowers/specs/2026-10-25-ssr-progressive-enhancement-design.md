# SSR + progressive enhancement — design

**Approved:** 2026-10-25 (approach 1 — CSS-first; preference B — less JS, intentional motion)

## Goal

Ship meaningful page content in the initial server HTML, shrink client React hydration, and keep the portfolio’s visual design and animation *identity*. Prefer CSS for entrances and decorative motion; keep small Client Components only where state, pointer, media, or browser APIs are required.

Success is **not** a vanity “90% SSR” label. Report real Server vs Client component counts, what remains client-side and why, and before/after production First Load JS plus a short rendering check.

## Constraints

- Preserve typography, spacing, responsive layouts, and overall motion feel.
- Prefer CSS animations/transitions when they replace JS without a lifeless result.
- Do not hide essential content behind `opacity: 0` waiting on hydration.
- Honor `prefers-reduced-motion`, keyboard navigation, and existing a11y.
- No hydration mismatches, duplicate trees, layout shifts, or nav regressions.
- Incremental refactors; reuse components; do not rewrite pages wholesale.
- `app/layout.tsx` and `app/page.tsx` stay Server Components.

## Baseline (pre-change)

Approximate current state under `components/` (source only, excluding `.next*` / `.vercel-upload`):

- ~48 Client Components (`'use client'`)
- ~48 Server Components (no directive)

Pages under `app/` are already mostly Server Components; client cost comes from shared islands pulled into layout/home (nav, Lenis wrapper, Framer text/reveal/pills, video, bounce cards).

Capture exact counts and `/` First Load JS from `next build` **before** Phase 1 lands, then again after.

## Approach (chosen)

**CSS-first progressive enhancement**, phased:

1. Homepage + root layout + nav + global providers + above-the-fold.
2. Same patterns on remaining routes where practical.

Rejected:

- Thin Framer wrappers only (keeps too much JS).
- Aggressive demotion of Lenis / magnetic / reveals sitewide (breaks identity).

## Architecture

### Boundaries

| Layer | Role |
|--------|------|
| Server pages/layouts | Data, SEO, static structure, readable copy/media markup |
| Server presentational components | Sections, headings, lists, images — no hooks |
| Client islands | Interaction, pointer lean, overlays, players, scroll library |
| CSS | Entrances, gradient flow, hover/focus transitions, reduced-motion |

### Layout tree

- Keep root layout async Server Component.
- Note: Server Components passed as `children` into a Client parent remain server-rendered (RSC slots). Still prefer Lenis as a **leaf** client module (no UI, effect-only) so the layout tree stays easy to reason about; optional `dynamic(..., { ssr: false })` if it reduces unused client graph.
- `ClosingBand`: avoid `usePathname` pulling CTA chrome into a client-only path. Prefer `app/contact/layout.tsx` omitting the band, or a tiny client gate around a server-friendly `NebulaCta` shell.
- `NavShell`: split into server chrome (logo link structure) + client islands for pill nav / search / explore. Search index stays server-built and passed as serializable props.
- Remove leftover debug probes (e.g. Cursor ref ingest) from nav if still present.

### Motion mapping (Phase 1 targets)

| Component | Today | Target |
|-----------|--------|--------|
| `BlurText` | Framer stagger | CSS keyframe stagger on words/chars; final text always in HTML |
| `Reveal` | Framer `whileInView` | **Phase 1 decision:** CSS entrance for above-the-fold / immediate sections; for scroll-triggered sections use one shared tiny client `Reveal` **only if** CSS scroll-driven animations are insufficient in target browsers. Do not leave Framer on `Reveal` if a CSS or ~20-line IO island works |
| `GradientWord` / `GradientText` | JS gradient animate | CSS `background-size` / keyframe flow; same color tokens in `globals.css` |
| `ArrowPill` | Framer magnetic lean | **Phase 1 default:** keep magnetic lean as a small client island (identity). Revisit CSS-only hover if First Load JS still dominated by Framer after other demotions |
| Lenis (`SmoothScrollProvider`) | Parent of all content | Leaf client; reduced-motion skips init |
| `IntroVideo` / `FilmPlayer` | Client | Stay client; keep below-fold split / existing dynamic where present |
| `PictureBounce` / `ArtworkCards` | Client | Stay client; keep/strengthen `dynamic()` below fold |
| Search / Explore trays | Client + dynamic | Stay client islands |
| Forms, journal composer, lightbox | Client | Out of Phase 1 except shared primitives reused on home |

**Hard rule:** Initial paint must be readable without JS. Animation enhances; it does not gate content.

## Phase 1 scope (home + shared shell)

In scope:

- `app/layout.tsx`, `app/page.tsx`
- Nav (`NavShell`, related)
- `SmoothScrollProvider`
- `ClosingBand` / `NebulaCta` boundary cleanup
- Home: `Hero`, featured sections’ shared primitives (`BlurText`, `Reveal`, `GradientWord`, `ArrowPill` usage)
- CSS additions in `globals.css` (or a focused motion stylesheet imported from layout) with `prefers-reduced-motion`

Out of scope for Phase 1:

- Full journal / archive / contact / timeline rewrites
- Changing content copy, routes, or design system tokens arbitrarily
- Replacing Lenis unless measurement shows it dominates main-thread cost *and* a lighter alternative keeps feel (document if deferred)

## Phase 2

Apply the same split/CSS patterns to projects, worlds, about, archive, journal, contact where the same primitives appear. Do not force client demotion of true interactive surfaces (composer, masonry+lightbox, forms).

## Validation

Before merge of Phase 1:

1. Recount Client vs Server under `components/` (+ note `app/` client files like `error.tsx`).
2. `next build` — First Load JS for `/` (and layout shared JS) before/after.
3. Manual: home + one inner route; nav search/explore; reduced-motion; keyboard to primary CTAs.
4. Confirm no hydration warnings in production build / browser console on `/`.
5. Spot-check view-source / disable-JS: hero and section copy still present.

## Reporting

Final report must include:

- Exact Server / Client counts after change
- List of remaining Client Components and why each stays client
- Bundle / First Load JS delta for `/`
- Honest statement that ~90% is a **practical target by component count where safe**, not a claimed performance score

## Non-goals

- Claiming “90% SSR” from file count alone
- Removing intentional motion for score-chasing
- Edge runtime or CDN config changes
- CMS / data-layer migrations
