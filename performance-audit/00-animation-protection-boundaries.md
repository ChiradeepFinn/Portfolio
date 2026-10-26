# Animation protection boundaries (Phase 1)

**Rule:** Do not modify animation/transition behavior, configs, or libraries without explicit user approval.

## Stack versions (from package.json)

| Package | Version |
|---------|---------|
| next | ^16.2.4 |
| react / react-dom | 19.2.4 |
| typescript | ^5 |
| tailwindcss | ^4 |
| framer-motion | ^13.1.1 |
| motion | ^13.5.1 |
| lenis | ^1.1.16 |
| tw-animate-css | ^1.4.0 |

## Framer Motion / Motion (DO NOT EDIT props/variants/transitions)

- `components/archive/Lightbox.tsx` — AnimatePresence, motion
- `components/archive/Masonry.tsx` — motion, whileInView entrance
- `components/about/AboutTimeline.tsx` — useReducedMotion
- `components/journal/JournalReel.tsx` — useReducedMotion
- `components/contact/ContactForm.tsx` — AnimatePresence, motion
- `components/nav/ExploreTray.tsx` — AnimatePresence, motion
- `components/books/BookPlate.tsx` — useReducedMotion
- `components/nav/PillNav.tsx` — motion (layout indicator)
- `components/home/ProfileHi.tsx` — AnimatePresence, motion (wave)
- `components/ui/Reveal.tsx` — motion entrance
- `components/ui/BlurText.tsx` — motion (hero LCP text)
- `components/ui/globe.tsx` — motion/react springs
- `components/journal/JournalTray.tsx` — AnimatePresence, motion
- `components/ui/ArrowPill.tsx` — motion springs
- `components/timeline/TimelineJourney.tsx` — useReducedMotion
- `components/nav/SearchPalette.tsx` — AnimatePresence, motion
- `components/home/ArtworkCards.tsx` — motion
- `components/ui/RevealText.tsx` — motion
- `components/ui/MagneticLink.tsx` — motion springs

## CSS keyframes / animated CSS (DO NOT EDIT animation rules)

- `app/globals.css` — breathe, drift, wave, badge-glow, status-pulse-*, eyebrow-live-glow, star-*, timeline-rise, transition tokens
- `components/ui/DriftWall.css`
- `components/ui/BounceCards.css`
- `components/ui/CircularCarousel.css`
- `components/ui/LogoLoop.css`
- `components/ui/GradientASCII.css`
- `components/ui/GradientText.css`
- `components/ui/PeekRating.css`
- `components/layout/GuestLogPrompt.css`

## RAF / scroll / custom motion engines (DO NOT EDIT timing/behavior)

- `components/providers/SmoothScrollProvider.tsx` — Lenis
- `components/ui/DriftWall.jsx` — continuous RAF scroll wall
- `components/ui/BounceCards.jsx` — spring physics
- `components/ui/CircularCarousel.jsx`
- `components/ui/LogoLoop.tsx`
- `components/ui/GradientASCII.jsx` — WebGL/canvas animation
- `components/home/PictureBounce.jsx`
- `components/about/AboutPortraits.tsx` (BounceCards host)
- `components/projects/CaseStudyAtmosphere.tsx` (GradientASCII host)
- `components/ui/confetti.tsx` — canvas-confetti
- `components/layout/GuestLogPrompt.tsx` — CSS engine animation
- `components/nav/useScrolled.ts` — scroll-linked UI state

## Brand motion media (optimize size only; do not remove animation)

- `public/brand/1000054925.gif` — animated nav mark (~4MB, `unoptimized` in BrandMark)
- `lib/media.ts` — `brandLogo()` switches still vs GIF

## Safe optimization zones (allowed)

- Image/media file size and `next/image` usage (without changing hover/lightbox/motion wrappers)
- Font loading (`next/font` already in use)
- Server vs client boundaries that do not wrap motion
- Unused deps after verification
- Prefetch / loading.tsx / shared layout (not page-transition wrappers)
