# Content infrastructure + performance — implementation report

**Date:** 2026-10-26  
**Scope:** Plan “Portfolio Content Infrastructure + Performance” (Wave 1 then Wave 2)  
**Stack preserved:** Next.js App Router, Supabase Auth + RLS, Resend. No Prisma / better-auth.

## Verification status (measured vs not)

| Check | Result |
| --- | --- |
| Production `npm run build` | **Not run.** Agent shell on this machine hung with zero output (including `echo` / `npm test`). |
| `npm test` (including new `feeds` / `env` suites) | **Not run** for the same reason. |
| Live curl of `/rss.xml`, `.md`, `/llms.txt` | **Not run.** |
| Lighthouse / First Load JS before–after | **Not measured.** Prior SSR Phase 1 baseline remains the last measured homepage JS figure (~917.6 kB chunk sum). |
| Static review / lint diagnostics on edited paths | No IDE linter errors reported on the touched feed, env, globe, analytics, and layout files. |

Treat claims below as **implemented in source**, not as **verified by build or browser** until you run the commands in “How to validate locally”.

---

## Wave 1 — Content infrastructure

### What changed

- **`lib/feeds/`** — single derivation layer: catalog, MDX→Markdown stripper, TS serializers (projects / case studies / research), RSS builder, llms builders, twin path helpers, shared XML escaping.
- **Markdown twins** — `app/api/md/[...path]/route.ts` + `beforeFiles` rewrites in `next.config.ts` for `/index.md`, `/projects/:slug.md`, `/philosophy/:slug.md`, `/archive/research/:slug.md`. Responses: `text/markdown`, `X-Robots-Tag: noindex`, `Link: <html>; rel="canonical"`, 1h / 6h cache.
- **RSS** — `app/rss.xml/route.ts`; redirects `/feed.xml` and `/rss` → `/rss.xml`. Absolute URLs from `configuredOrigin()` / `publicOrigin()`.
- **`llms.txt` / `llms-full.txt`** — App Router routes; static `public/llms.txt` removed so generated routes win. Index states limitations (no citation/indexing guarantee). Full file inlines twins for catalog entries only.
- **FAQ JSON-LD** — `faqGraph()` on project pages that already render case-study FAQs. No fabricated Q&A.
- **Sitemap** — `lastmod` when MDX has `publishedAt`; placeholder projects filtered; twins / `/api/*` not listed.
- **Robots** — allow public site; disallow `/api/`; named AI agents allowed explicitly; twins rely on `noindex` headers, not blanket `Disallow: *.md`.
- **Discovery** — RSS alternate in root metadata; footer links for RSS + llms.txt; Markdown alternates on project / essay / research / home (`/index.md`).
- **IndexNow** — deferred; documented in `docs/ARCHITECTURE.md`.
- **Tests authored** — `tests/feeds.test.ts`, `tests/env.test.ts` (not executed here).

### Draft / private exclusion

- Catalog uses `publicArticles` (drops `draft`) and `publishedProjects` (drops `isPlaceholder`).
- Guest journal notes are not in the catalog.
- The only on-disk MDX file (`content/essays/article-template.mdx`, `status: draft`) must not appear in RSS / llms when validation is run.

---

## Wave 2 — Performance

### What changed

- **SSR leftovers** — Phase 1 CSS `BlurText` / `Reveal` / `GradientWord` left as-is. Lenis leaf already correct; **visibility pause** added so rAF stops on hidden tabs. ClosingBand remains the small pathname gate (contact omits CTA).
- **Globe** — `components/ui/globe.tsx` destroys the cobe instance off-screen / when the tab is hidden; rebuilds with rotation preserved; reduced motion stops spin but keeps the draw.
- **CSS offscreen pause** — `usePauseOffscreen` + global `[data-offscreen]` rule; used on NebulaCta starfield.
- **GradientASCII** — already had IO / visibility / reduced motion; now loaded with `dynamic(..., { ssr: false })` from case-study atmosphere.
- **LCP** — hero heading remains SSR + CSS entrance; nav brand GIF no longer uses `priority` (eager only) so it does not preempt hero text in the critical path.
- **Analytics** — `DeferredAnalytics` loads Vercel Analytics + Speed Insights after idle (3s fallback); failures do not affect the page.
- **React Compiler** — **not enabled.** `babel-plugin-react-compiler` is not installed; documented in ARCHITECTURE.
- **Env Zod** — `lib/env.ts`; empty string = unset; used by contact delivery + Discord notify + Supabase config.
- **Discord** — `lib/notify/discord.ts` no-throw, no-op without `DISCORD_WEBHOOK_URL`; subject/name/email only after successful Resend send.

---

## Files by group

| Group | Paths |
| --- | --- |
| Feeds core | `lib/feeds/*` |
| Feed routes | `app/api/md/[...path]/route.ts`, `app/rss.xml/route.ts`, `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts` |
| Config / SEO | `next.config.ts`, `app/robots.ts`, `app/sitemap.xml/route.ts`, `lib/seo.ts`, `lib/site.ts`, `docs/ARCHITECTURE.md`, `.env.example` |
| Pages / chrome | `app/layout.tsx`, `app/page.tsx`, `app/projects/[slug]/page.tsx`, `app/philosophy/[slug]/page.tsx`, `app/archive/research/[slug]/page.tsx`, `components/layout/Footer.tsx` |
| Perf | `components/ui/globe.tsx`, `lib/use-pause-offscreen.ts`, `app/globals.css`, `components/layout/NebulaCta.tsx`, `components/providers/SmoothScrollProvider.tsx`, `components/providers/DeferredAnalytics.tsx`, `components/nav/NavShell.tsx`, `components/projects/CaseStudyAtmosphere.tsx` |
| Backend patterns | `lib/env.ts`, `lib/notify/discord.ts`, `lib/supabase/config.ts`, `app/api/contact/route.ts` |
| Tests | `tests/feeds.test.ts`, `tests/env.test.ts`, `package.json` (test script) |
| Removed | `public/llms.txt` |

---

## How to validate locally

```bash
cd E:\1portfolio
npm test
npm run build
# then, with NEXT_PUBLIC_SITE_URL=https://chiradeep.me if you want absolute URLs:
npx next start
# curl or browser:
#   /rss.xml  /llms.txt  /llms-full.txt  /index.md  /projects/sidequest.md
#   /robots.txt  /sitemap.xml
```

Confirm: draft `article-template` absent from RSS and llms; twin headers include `noindex` + canonical Link; contact still succeeds without `DISCORD_WEBHOOK_URL`.

---

## Deliberately deferred

- IndexNow  
- Accept: text/markdown negotiation  
- Shared/distributed rate limiting (Upstash)  
- React Compiler  
- Migrating auth/DB away from Supabase  
- Deploy / DNS / real Discord test pings  

---

## Remaining client islands (why they stay)

Nav shell (panels, ⌘K), Lenis, NebulaCta stars, ProfileHi wave, IntroVideo / FilmPlayer, BounceCards / PictureBounce, CaseStudyAtmosphere WebGL, journal composer / sign-in, contact form, archive lightbox / masonry, search / explore trays, ArrowPill magnetic lean, Globe (when mounted). None of these gate essential copy behind hydration for the hero (CSS `BlurText`).
