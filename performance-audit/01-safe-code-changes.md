# Safe code remediations (animation-protected)

**Scope:** High-confidence performance fixes that do **not** alter Framer Motion / GSAP / Lenis / CSS keyframe timing, variants, or visual motion behavior.  
**Out of scope here:** Public image binary rewrites (other agent), full Lighthouse (other agent).

## Dependency

| Item | Status |
|------|--------|
| `zod` | Declared in `package.json` (`^4.1.12`). `node_modules/zod` was corrupted/incomplete (EPERM/EBUSY during `npm i`); restored by extracting `zod@4.1.12` tarball into `node_modules/zod` so MDX/`lib/*` schema imports resolve. If CI still fails on zod, run a clean `npm install` when nothing else locks `node_modules`. |

## Files changed

| File | Change | Why animation-safe |
|------|--------|--------------------|
| `components/layout/BrandMark.tsx` | Default `decoding="async"`; keep `unoptimized` for GIF | Decoding hint only; does not stop or alter GIF frames |
| `components/layout/GuestLogPrompt.tsx` | `sizes="136px"` on BrandMark | Responsive hint for `next/image`; no CSS motion change (`GuestLogPrompt.css` untouched) |
| `components/layout/Footer.tsx` | `loading="lazy"` on below-fold BrandMark | Footer mark is not LCP; nav mark still `priority` |
| `components/mdx/LongformArticle.tsx` | Cover `<img>` → `next/image` + `sizes` | Static article cover; no motion wrappers |
| `components/mdx/components.tsx` | MDX `Figure` `<img>` → `next/image` + `sizes` | Static prose figures; no motion |
| `components/ui/safari.tsx` | Screen `<img>` → `next/image` `fill` + `sizes` | Device chrome only; StudyDevices hover CSS untouched |
| `components/ui/DriftWall.jsx` | Intrinsic `width`/`height` on tile `<img>` | No RAF/CSS/transition edits; attributes only (component currently unused in app routes) |
| `components/ui/BounceCards.jsx` | Intrinsic size + `loading`/`decoding` on `<img>` | No spring/RAF/CSS edits; image attrs only |
| `components/archive/Masonry.tsx` | `priority={index < 2}` on gallery `Image` | Preload hint only; `motion.*` / transitions unchanged |
| `components/journal/JournalEntries.tsx` | `decoding="async"` on avatar `<img>` | External avatars stay raw `<img>` (no `remotePatterns`); decode hint only |
| `components/ui/avatar-circles.tsx` | `decoding="async"` on avatar `<img>` | Same as journal avatars |
| `components/home/HomeWorlds.tsx` | `dynamic()` for `PictureBounce` | Code-split below-fold host; BounceCards props/physics unchanged |
| `components/projects/CaseStudyAtmosphere.tsx` | `dynamic()` for `GradientASCII` | Code-split WebGL chunk; all GradientASCII props identical |
| `components/nav/NavShell.tsx` | `dynamic()` for `SearchPalette` / `ExploreTray` | Async chunks; panels still always mounted so AnimatePresence exit behavior is unchanged |

## Deferred (animation-risk or low confidence)

| Item | Reason | Recommendation (do not implement without approval) |
|------|--------|-----------------------------------------------------|
| DriftWall / BounceCards → `next/image` | CSS selectors target `img`; infinite copies / springs may interact with Image wrappers | After visual QA, optional `next/image` with `fill` + matching CSS |
| LogoLoop raw `<img>` | Continuous marquee engine | Keep raw img; optimize source assets only |
| Conditional mount of Search/Explore panels | Would risk breaking AnimatePresence exit | Only if exit animations are redesigned |
| Android SVG `<image href>` | Not an HTML img; next/image does not apply | Serve smaller screenshot files (other agent) |
| SmoothScrollProvider / Lenis / BlurText / Reveal / MagneticLink / etc. | Explicit motion stack | Profile main-thread cost; tune only with explicit approval |
| Brand GIF binary shrink | Owned by image agent | Keep `unoptimized` so animation frames survive |
| Inter → non-default font swap | Design identity | Not a perf quick win without brand decision |
| Remote avatars via `next/image` | Needs `images.remotePatterns` for host allowlist | Add patterns for known OAuth avatar hosts, then migrate |

## Remaining recommendations (safe / ops)

1. Confirm gallery/project screenshots are already WebP/AVIF-sized after the image agent runs.
2. Keep `priority` only on true above-fold marks (nav BrandMark, first masonry tiles, hero portrait if applicable).
3. Consider a route-level `loading.tsx` skeleton where TTFB feels slow — layout chrome only, no motion.
4. After Lighthouse agent lands, re-check LCP element on `/`, `/archive/photography`, and a project study page.
