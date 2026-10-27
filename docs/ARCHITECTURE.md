# Architecture

How this portfolio is put together, and how to change it without breaking the public site.

## Layout

| Path | Responsibility |
| --- | --- |
| `app/` | Routes, the contact API, and global styles. |
| `components/` | UI. Server components by default. Client components are the ones that need state or motion. |
| `lib/data/` | Typed records: projects, books, music, photography, certificates, navigation, and the two structured research studies. |
| `lib/content.ts` | Reads published Supabase rows and falls back to `lib/data/seed.ts`. |
| `lib/mdx/` | Long-form MDX: frontmatter validation, file loading, and the component registry. |
| `content/` | MDX source. Not a second copy of `lib/data/`. |
| `lib/contact/` | Contact validation, email rendering, rate limit, and database writes. |
| `lib/journal/` | Guest-journal validation, rate limit, and note reads and writes. |
| `lib/supabase/` | Anon read client, cookie session client, and service-role write client. |
| `supabase/` | SQL migrations and seed. Row level security stays enabled. |

## Structured data and MDX

Use TypeScript data for compact records: project cards, books, tracks, photographs, artworks, certificates, timeline rows, and navigation.

Use MDX for prose that is awkward to maintain as objects:

- `content/research/` renders at `/archive/research/[slug]`
- `content/essays/` renders at `/philosophy/[slug]`
- `content/case-studies/` renders inside `/projects/[slug]`

The two current investigations stay in `lib/data/research.ts`. They use the structured document layout (sections, schematics, inspected files). They are in progress, not publications. Do not add an MDX file with the same slug. The loader rejects that, because a record has one source.

Project case studies that already live in `lib/data/case-studies.ts` also stay there. An MDX case study is only for a project that does not already have that TypeScript study.

`content/essays/article-template.mdx` is an unpublished draft. Drafts are validated and compiled, and they are not linked, searched, or added to the sitemap. Requesting the slug returns 404.

### Add an article

1. Create `content/<collection>/<slug>.mdx`. The filename must match `slug`.
2. Add frontmatter:

```yaml
---
title: "Title"
slug: my-slug
summary: "One or two sentences."
publishedAt: "2026-10-13"
status: draft
tags:
  - topic
coverImage: /images/example.jpg
---
```

`title`, `slug`, `summary`, `publishedAt`, and `status` are required. `status` is `draft`, `in-progress`, or `published`. `tags` defaults to an empty list. `coverImage` is optional and must be a local path under `public/`, such as `/images/example.jpg`. Quote the date so it stays a string.

3. Write the body in Markdown. Do not repeat the title; the page renders it from frontmatter. Approved components:

- `<Callout title="Label">...</Callout>`
- `<Figure src="/images/example.jpg" alt="Description" caption="Caption" />`
- `<Citation id="1">Source, without inventing a publication.</Citation>`

4. Register the file in `lib/mdx/registry.ts`:

```ts
import Note, { frontmatter as noteFrontmatter } from '@/content/essays/my-slug.mdx';

// inside registries.essays
'my-slug': { Component: Note, frontmatter: noteFrontmatter },
```

The build fails if the files and the registry disagree, if frontmatter is invalid, or if two records share a slug. A missing public slug returns 404.

Images go in `public/images/` and are referenced by a root path. MDX is compiled from repository files only. There is no route that compiles submitted Markdown.

## Content loader

`lib/content.ts` is what pages call. If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are missing, or a query fails, the function returns the seed. The anon key can only read rows with `is_published = true`, because of row level security.

The research studies are not loaded from Supabase. Placeholder research rows in the database are ignored so they cannot hide the studies in code.

Do not change page caching to force freshness without checking which pages read Supabase. Those reads happen on the server during render.

## Contact

`POST /api/contact` accepts JSON:

`{ name, email, subject, message, company_website? }`

Success is `{ success: true }` with HTTP 200. **Success means Resend accepted the email.** The Supabase insert happens after that and is best effort. A failed insert still returns success, and the failure is logged without the message body. If `RESEND_API_KEY` is missing, the response is 503 and no email is sent, even when the database is configured.

| Status | When |
| --- | --- |
| 400 | Invalid JSON, failed validation, or unusable email headers |
| 413 | Body larger than 16 KB |
| 415 | Not JSON |
| 429 | Rate limit, with `Retry-After` |
| 502 | Resend rejected or failed |
| 503 | Email is not configured, or the rate-limit store could not answer |

Other HTTP methods are rejected by the App Router. The client shows the `error` string only when it is a short single-line message. It does not show stack traces.

A honeypot field, `company_website`, is off-screen and hidden from assistive tech. A filled value returns `{ success: true }` and sends nothing.

The same process remembers a successful send for 10 minutes so a double-click does not send twice. A recent identical database row also skips a second email. Neither check is shared across server instances. A failed send is not remembered, so a retry can try again.

The contact row no longer stores the user agent.

## Rate limit

Default: 5 requests per 10 minutes. Override with `CONTACT_RATE_LIMIT_MAX` and `CONTACT_RATE_LIMIT_WINDOW_SECONDS`. Invalid values fall back to the defaults.

The store is an in-memory map. On Vercel, and on serverless hosts generally, instances do not share that map, and a restart clears it. An in-memory limit is not production-wide protection. This project does not configure Redis, Upstash, or another shared store, and it does not pretend to.

When `VERCEL=1`, the key is a hash of `x-real-ip`, which Vercel sets. The raw address is not stored. In local development, and on any host that does not set `VERCEL=1`, forwarded IP headers are ignored and every caller shares one bucket. If the store throws or returns nothing, the route responds with 503 instead of allowing the request.

## Generated files

One published record has one source. `lib/feeds/` derives every other representation from it, so nothing is copied by hand and nothing drifts.

| URL | What it is |
| --- | --- |
| `/sitemap.xml` | Canonical public pages. `lastmod` only where a record carries a real date. |
| `/rss.xml` | RSS 2.0 for published records. Also reachable at `/feed.xml` and `/rss`. |
| `/llms.txt` | One line per published record, with the canonical URL. |
| `/llms-full.txt` | The same records with their Markdown inline. |
| `<page>.md` | The Markdown twin of one page. |

`lib/feeds/catalog.ts` is the single eligibility list: published projects, the research studies, and MDX that is not a draft. Reserved placeholder slots, drafts, and guest journal notes are never in it. Ordering is newest dated record first, then undated records in site order, so an unchanged site produces an unchanged file.

### Markdown twins

A published page answers at the same URL with `.md` appended: `/projects/sidequest.md`, `/philosophy/<slug>.md`, `/archive/research/<slug>.md`, and `/index.md` for the homepage. The rewrites in `next.config.ts` require the suffix, so the HTML routes are untouched, and they point at `app/api/md/[...path]/route.ts`. That handler also answers directly, which is why it strips a trailing `.md` from every segment.

A twin is built from the source the page renders, never from its HTML. MDX is read from disk and passed through `mdxToMarkdown()`; projects, case studies, and the research studies are serialized from the typed records. `mdxToMarkdown()` strips JSX with regular expressions, which is only safe because it never sees a fenced block or an inline code span - a code sample containing `<Suspense />` stays a code sample. Components that carry copy in their props or children (`Callout`, `Figure`, `Citation`) are expanded into Markdown first. **A new content-bearing MDX component needs a rule in `lib/feeds/mdx-to-markdown.ts`, or its text disappears from the twin.**

Twins answer `text/markdown`, a `Link` header naming the HTML page as canonical, and `X-Robots-Tag: noindex`, so a twin never competes with its own page in search. They are not listed in the sitemap. They are cached for an hour in the browser and six at the edge.

Content negotiation on `Accept: text/markdown` is deliberately not implemented. `proxy.ts` is scoped to the journal and auth paths, and widening it to inspect `Accept` on every HTML route is a larger change than the explicit `.md` URLs are worth.

### FAQ and TL;DR

The case studies already show a question list on the page; `faqGraph()` repeats that visible text as `FAQPage` structured data. No question or answer is written for the markup, and a page without questions does not get an empty graph. The TL;DR line in a twin is the record's own summary - it is not a second piece of copy to maintain.

### IndexNow

Not implemented, deliberately. IndexNow does not notify Google, publishing here is infrequent, and a working integration needs a hosted verification key plus a postbuild sitemap diff so a deploy does not resubmit unchanged URLs. The sitemap and the feed already cover discovery. Revisit if the publishing cadence rises.

Neither `llms.txt` nor `llms-full.txt` makes a model cite the site. They are a convenience for machine readers, and the files say so.

## Environment

Names only. Copy `.env.example` to `.env.local`. Never put the service-role key or the Resend key in a `NEXT_PUBLIC_` variable.

`lib/env.ts` is the typed read, validated with Zod. Every variable is optional, because the site renders from the seed with no environment at all and a fresh clone must still build. What is checked is the shape of a value that *was* set: a URL that does not parse, a secret with whitespace in it, a rate limit that is not a positive integer, a webhook that is not a Discord webhook. A bad value is dropped and named in the server log, so the feature that needs it reports "not configured" instead of failing mid-request. An empty string counts as unset - Vercel and `.env` files both produce one for a variable that was added and never filled in.

It is a server-side read. Code that runs in the browser keeps reading `process.env.NEXT_PUBLIC_*` directly, which is what the bundler can inline.

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. Public. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key. Public. RLS is the boundary. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only. Bypasses RLS for contact inserts. |
| `RESEND_API_KEY` | Server-only. Required before email succeeds. |
| `RESEND_FROM_EMAIL` | From header. Defaults to the Resend onboarding address. |
| `CONTACT_TO_EMAIL` | Inbox. Defaults to the address in `lib/site.ts`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata and every generated file. `https://chiradeep.me` in production. |
| `DISCORD_WEBHOOK_URL` | Optional. A delivered contact message pings this channel with the sender and subject only. |
| `CONTACT_RATE_LIMIT_MAX` | Optional. Default 5. |
| `CONTACT_RATE_LIMIT_WINDOW_SECONDS` | Optional. Default 600. |
| `JOURNAL_RATE_LIMIT_MAX` | Optional. Default 8 attempts per window for the guest journal. |
| `JOURNAL_RATE_LIMIT_WINDOW_SECONDS` | Optional. Default 600. |

## Local commands

```bash
npm install
npm run dev
npm run type-check
npm run lint
npm test
npm run build
```

`npm run lint` runs ESLint. Next.js 16 removed `next lint`, and the production build does not lint on its own.

The site renders from seed data with no environment variables. The contact form returns the not-configured error until `RESEND_API_KEY` is set. The guest journal says it is not open until the Supabase URL and key are set, and it cannot publish until `supabase/migrations/0004_guest_journal.sql` has been applied and Google and GitHub are enabled.

## Deployment

Vercel is the intended host. Do not commit `.env.local`. Set the variables above in the Vercel project. `chiradeep.me` is the production domain; point it at the Vercel project in the Vercel domain settings and at the DNS host. This repository does not change DNS.

CSS is linked, not inlined. `inlineCss` is left off: many routes share one stylesheet, returning visitors can cache it, and there is no measurement that says inlining would help. Images use AVIF and WebP through `next/image` where the components already do. MDX figures use a normal image for a local public path. Fraunces and Inter are loaded with `next/font` and served by this site.

The React Compiler is **not** enabled. Next 16 needs `babel-plugin-react-compiler` as a dev dependency before `reactCompiler` can be turned on, that package is not installed, and the change cannot be validated without a production build to compare against. Turning on a compiler whose output nobody has measured is not an improvement. Install the plugin, build before and after, compare the homepage JS, then decide.

## Motion that stops

Nothing animates where nobody is looking.

`usePauseOffscreen()` sets `data-offscreen` on an element while it is more than 200px outside the viewport or the tab is hidden, and one unlayered rule in `globals.css` pauses every CSS animation beneath it. The closing band uses it: 300 stars, each on its own infinite loop, sit at the foot of every page. Paused is not stopped - an animation keeps its position and resumes mid-loop, so coming back does not restart the sky.

`components/ui/globe.tsx` cannot work that way. cobe owns its own `requestAnimationFrame` loop and offers no pause, so the only way to stop the work is to destroy the instance: off screen or on a hidden tab the globe is destroyed, and it is rebuilt from the rotation kept in a ref when it comes back. Reduced motion is treated differently - the globe is still drawn, because removing it would take content away; it just stops turning. The 200px margin means it is drawing again before it is visible.

`components/ui/GradientASCII.jsx` already did all of this: intersection observer, page visibility, reduced motion, WebGL context loss, and texture disposal. It was left alone.

Analytics load on idle through `components/providers/DeferredAnalytics.tsx`, with a 3-second fallback. Neither script renders anything, so nothing moves; waiting for idle keeps two requests out of the window where the hero is still painting. Idle rather than first interaction, because Speed Insights reports Core Web Vitals from buffered entries and a visit without a click still counts.

The nav mark is eager but not `priority`. It is an unoptimized animated GIF of about 460 KB drawn at 40px, and it is never the largest contentful paint - the hero heading is, and that heading is server-rendered text with a CSS entrance.

## Authentication

The guest journal at `/journal` is the only visitor sign-in. Google and GitHub are the accepted providers. There is no email/password account, and there is no admin UI in this repository.

Authorization is enforced in Postgres. A note is inserted by a security-definer function that reads `auth.uid()` and `app_metadata`. It does not read `user_metadata`, which the account can edit. The public view exposes the chosen name, the note, and the time. It does not expose the account id, the email, or the provider. Row level security stays enabled. The service-role key is not used to publish a note.

The session lives in an httpOnly cookie and is refreshed on `/journal`, `/auth/*`, and `/api/journal` only. Other pages do not touch it.

Do not disable RLS to make a query work. Do not put the service-role key in a `NEXT_PUBLIC_` variable. `lib/supabase/admin.ts` still imports `server-only`.

## Guest journal

`/journal` lists published notes and, for a signed-in account, the form for that account’s single note.

Success is `{ ok: true }` from `POST`, `PATCH`, or `DELETE /api/journal`. Success means the database function confirmed the row. A missing Supabase configuration is 503. A honeypot fill is 400 and is not reported as published. The client shows a confirmation only after `ok` is true.

| Status | When |
| --- | --- |
| 400 | Invalid JSON, failed validation, or the hidden field was filled |
| 401 | Not signed in |
| 403 | The account is not Google or GitHub, or the note is held back |
| 404 | There is no note to change or remove |
| 409 | This account already has a note |
| 413 | Body larger than 8 KB |
| 415 | Not JSON |
| 429 | Rate limit, with `Retry-After` |
| 502 | The write could not be confirmed |
| 503 | Supabase is not configured, or the rate-limit store could not answer |

The attempt limit defaults to 8 requests per 10 minutes, overridden with `JOURNAL_RATE_LIMIT_MAX` and `JOURNAL_RATE_LIMIT_WINDOW_SECONDS`. It is in-memory and per process, same as the contact form. It is not a shared limit across server instances.

A published note can be held back from the SQL editor:

```sql
update public.guest_notes
set status = 'hidden', updated_at = now()
where id = '<note id>';
```

A held note stays tied to the account, so that account cannot publish another. Setup for providers, redirect URLs, and the migration is in `supabase/README.md`.

## Known limits

- Distributed rate limiting is not configured. The in-memory limit is per process.
- Duplicate-email suppression is per process, plus a 10-minute database check when Supabase is configured. Two instances can still both send if the first write has not landed.
- If email succeeds and the database write fails, the API still returns success. The message is in the inbox and not necessarily in Supabase.
- The service role can read and write `contact_messages`. It can also read `guest_notes`, including the account id. The journal publish path does not use it.
- The draft article template is not a published essay.
- The Lightbox type error reported from an earlier build (`initial` on `motion.div`) does not reproduce against `framer-motion` 13.1.1. The animation props are unchanged.
