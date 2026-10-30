# Personal entity SEO + discoverability — design

**Date:** 2026-10-29  
**Status:** Superseded for identity — primary public name is now **Chiradeep Finn**, with alternate names **Finn** (preferred) and **Chiradeep** (owner-approved 2026-10-31). Structural SEO guidance below still applies; Chiradeep-only name policy does not.  
**Approved direction:** Scope **B**; homepage title hybrid with full name; Option **2** inline execution with per-task checkpoints  
**Production:** `https://chiradeep.me`  
**Repo:** `E:\1portfolio` (GitHub remote `ChiradeepFinn/Portfolio`, Vercel `chiradeep-portfolio`)

## Goal

Make `https://chiradeep.me` the clearest, most trustworthy official site for **Chiradeep**, and improve legitimate discoverability for related, accurate queries (portfolio, developer / creative technologist, AI and web work, projects, research, music, writing) **without** promising ranks, inventing credentials, or violating [Google Search Essentials](https://developers.google.com/search/docs/essentials).

Success looks like:

1. Consistent on-site identity: public name and site brand are both **Chiradeep**, reinforced by role, domain, location, and original work — not by a secondary surname or handle-as-name strategy.
2. Technical SEO remains correct and regression-tested (titles, descriptions, canonicals, robots, sitemap, JSON-LD, Markdown twin headers).
3. Search Console ownership and sitemap submission are documented as owner actions wherever account access is required.
4. No spam, cloaking, keyword stuffing, fake schema, paid links, or fabricated biography.

### Explicit non-use of a removed name string

Do **not** introduce the string the owner asked to remove from the SEO strategy into:

- identity fields
- metadata / titles / descriptions
- structured data (`name`, `alternateName`, or authored aliases)
- visible marketing copy added or rewritten for SEO
- automated tests that assert that string as a public identity
- external profile **display-name** recommendations

Existing third-party profile **URLs** already configured in `socialProfiles` may remain as `sameAs` / footer links because they are crawlable profile destinations, not display aliases. Do **not** promote path segments or handles from those URLs as `Person.alternateName` or as on-site public names. Do **not** recommend renaming external accounts in this project unless the owner separately asks.

Non-goals:

- Guaranteeing #1 for bare “Chiradeep” (name collision with other real people is expected; differentiate via domain, role, and work).
- Knowledge panels or rich-result guarantees from schema.
- Redesigning the portfolio’s visual system or stripping intentional motion.
- Changing Supabase auth/RLS, introducing paid SEO tools, or deploying without review.

## Baseline summary (evidence from 2026-10-29 audit)

Already strong in production:

- HTTPS apex preferred; `www` and HTTP redirect to `https://chiradeep.me`.
- Unique titles/descriptions/canonicals on sampled pages; `index,follow`.
- `robots.txt` allows public content; disallows `/api/`, `/auth/`; sitemap URL correct.
- Sitemap lists indexable public URLs (~26); Markdown twins are `noindex` with HTML canonical.
- Home JSON-LD: `Person` + `WebSite` + `WebPage`; About: `ProfilePage` with `Person` `mainEntity`.
- SSR contains the name; internal links use crawlable `href`s.

Gaps that matter for this mission:

| Gap | Evidence | Design response |
| --- | --- | --- |
| Exact-name competition | Other people named Chiradeep appear for bare-name queries | Strengthen **Chiradeep** + `chiradeep.me` + role + original work; no secondary-name SEO strategy |
| Search Console | No `google-site-verification` meta on live HTML | Owner verification checklist; optional env-based HTML tag already supported in layout |
| Homepage title | Live: `Chiradeep - Creative Technologist` | Adopt approved hybrid title |
| Homepage H1 | Slogan-only; name in secondary line | Preserve design; do not keyword-stuff the H1 |
| Regression coverage | `tests/seo.test.ts` covers graphs, not metadata/canonicals/sitemap/robots/twin headers | Expand automated SEO tests |
| CWV scores | Not measured in this audit | Measure when practical; do not invent scores |
| `Person.alternateName` risk | Current graph may include brand/firstName; must not add disallowed handle aliases | Only owner-approved aliases; default = none beyond what is already approved below |

Official docs informing this design (non-exhaustive): [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [Search Essentials](https://developers.google.com/search/docs/essentials), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Title links](https://developers.google.com/search/docs/appearance/title-link), [Snippets](https://developers.google.com/search/docs/appearance/snippet), [Canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), [Robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [Structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data), [ProfilePage](https://developers.google.com/search/docs/appearance/structured-data/profile-page) (standalone `/person` URL returned **404**; Person is documented as `mainEntity` of ProfilePage), [Site names](https://developers.google.com/search/docs/appearance/site-names), [Crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [Favicons](https://developers.google.com/search/docs/appearance/favicon-in-search), [Image SEO](https://developers.google.com/search/docs/appearance/google-images), [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals), [Search Console start](https://developers.google.com/search/docs/monitor-debug/search-console-start).

## Identity model

### Sole public identity

| Concept | Value |
| --- | --- |
| Public name | **Chiradeep** |
| Primary search target | **Chiradeep** (plus accurate modifiers such as portfolio, creative technologist, AI, web — only in natural copy where true) |
| Site brand / `WebSite.name` | **Chiradeep** |
| Role | **Creative Technologist** |
| Location | Karur, Tamil Nadu, India |
| Official site | `https://chiradeep.me` |
| Email | existing `identity.email` |
| UI brand mark | `CF°` (visual brand only; not a second public personal name) |

### Identity fields (no `fullName` field)

Keep `lib/site.ts` `identity` centered on Chiradeep. Do **not** add a `fullName` (or equivalent) field for a removed name.

| Field | Value | Purpose |
| --- | --- | --- |
| `name` | `Chiradeep` | Site name, Person schema `name`, authors, title template |
| `firstName` | `Chiradeep` | Hero “Hello, I’m …” |
| `brand` | `CF°` | Visual mark in UI |
| `role` | `Creative Technologist` | Unchanged |

### Approved `Person.alternateName` policy

- **Do not** auto-derive aliases from social handles, URL path segments, GitHub usernames, or LinkedIn slugs.
- **Do not** add any alias containing the removed name string.
- Until the owner explicitly approves additional aliases, `Person.alternateName` should be **omitted** or limited to values the owner has approved in writing.
- **Currently approved for schema aliases:** none beyond using `name: "Chiradeep"`. The UI brand `CF°` may remain in the product UI and in `WebSite.alternateName` as a site mark if already present; it is not a personal alias campaign. Prefer **not** stuffing `Person.alternateName` with `CF°` unless the owner later asks.

### Do not invent

Awards, employers, degrees, publications with DOIs, client logos, follower counts, ratings, or additional social accounts not already in `socialProfiles`.

## Metadata and visible identity

### Homepage title (option 3 — approved)

Absolute title:

`Chiradeep - Creative Technologist, AI & Web`

Update:

- `app/page.tsx` absolute title
- Root `metadata.title.default` in `app/layout.tsx` to the same string
- Home JSON-LD `WebPage.name` to match
- OG/Twitter titles via Next metadata only (no duplicate manual tags)

Title template for other pages remains `%s - Chiradeep`.

### Meta description

Keep first-person voice about **Chiradeep**. Do not insert the removed name. Refine only if needed for accuracy/length; no keyword lists.

### About page

- Keep ProfilePage JSON-LD.
- Visible copy and meta continue to identify **Chiradeep** only.
- Title stays in the existing pattern (`About` → `About - Chiradeep`) unless a small accuracy fix is needed. Do **not** retitle to a longer compound personal name.

### Homepage visible content (preserve design)

1. Keep H1 slogan as-is.
2. Keep identity line as Chiradeep (existing voice).
3. No SEO badges, keyword chips, or hidden text.
4. Footer / contact copy remain Chiradeep-only for personal naming.

### Other indexable pages

Touch metadata only where inaccurate, duplicate, or missing. Preserve visual design, animations, and portfolio structure everywhere.

## Structured data

Rules:

- JSON-LD only via existing `JsonLd` + `lib/seo.ts` helpers.
- Must match visible content.
- No FAQ markup on pages that do not show those FAQs.
- No `aggregateRating`, reviews, invented job titles beyond `Creative Technologist`.

### Person

- `name`: `Chiradeep`
- `alternateName`: omit by default (see alias policy above)
- `url`: absolute `/about`
- `sameAs`: https profile URLs from `socialProfiles` only (exclude `mailto:`)
- Keep accurate `jobTitle`, `description`, `image`, `knowsAbout`, address locality already present

### WebSite / WebPage (home)

- Single `@graph` on home.
- `WebSite.name`: `Chiradeep`
- `WebSite.alternateName`: may keep `chiradeep.me`, `Chiradeep Portfolio`, and existing site marks that do **not** introduce the removed personal-name string as a Person alias.
- `WebPage.name`: approved homepage title string.

### ProfilePage (about)

- `@type: ProfilePage` with `mainEntity` = Person named Chiradeep.

### Article / CreativeWork / Breadcrumb / Contact FAQ

- Keep patterns; Person/author display names stay **Chiradeep**.
- Do not expand schema types solely for SEO.

## Technical SEO (hardening)

In scope:

1. Canonical origin via `NEXT_PUBLIC_SITE_URL` / `configuredOrigin()` / `publicOrigin()` / `metadataBase`. `withCanonical()` keeps **relative** `alternates.canonical` / `openGraph.url`; Next resolves absolutes via `metadataBase` — do not change that contract unless separately approved.
2. Robots + sitemap correctness; exclude drafts, placeholders, `/api/*`, Markdown twins from sitemap using real filters; `lastmod` only with real dates.
3. Markdown twins: preserve exact current success headers (`Content-Type`, `Vary`, `Cache-Control`, `X-Robots-Tag`, `Link`); regression-test them.
4. Existing redirects and host canonicalization.
5. Favicon / lang / site name — fix only if broken.

Out of scope unless blocking: CWV redesigns, URL renames, IndexNow, paid services, animation removal.

## Legitimate authority

Code may keep footer / about / links pointing at configured `socialProfiles` and make the official site URL obvious.

Owner actions (not performed by the agent without account access):

1. Verify Google Search Console for `chiradeep.me` (domain property preferred, or URL-prefix + HTML tag via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` without overwriting unrelated tokens).
2. Submit `https://chiradeep.me/sitemap.xml`.
3. URL Inspection on `/`, `/about`, `/projects`, and key project pages; request indexing only where appropriate.
4. On external profiles: set **display name to Chiradeep** where the platform allows; set website to `https://chiradeep.me`; keep bios accurate. Do **not** recommend adopting a removed secondary name as the public display name.
5. Link real repositories/demos back to case-study URLs on chiradeep.me where appropriate.
6. Do **not** buy links, spam forums, or create fake profiles.

## Performance, mobile, accessibility

- Preserve visual design and animations.
- Measure CWV with real tools when available; fix only evidenced regressions from this work.

## Testing and validation

### Automated (required)

Expand SEO regression coverage for:

1. Homepage absolute title = `Chiradeep - Creative Technologist, AI & Web`.
2. Person `name` = `Chiradeep`; `WebSite.name` = `Chiradeep`; omit `Person.alternateName` unless the owner later approves aliases.
3. `sameAs` = verified https profile URLs from `socialProfiles` only (no mailto).
4. `withCanonical` relative canonical + OG url consistency for sample paths (actual contract).
5. Sitemap eligibility via real `publicArticles` / `publishedProjects` rules; no `.md` twin paths.
6. Robots: sitemap URL uses configured origin; disallows `/api/` and `/auth/`.
7. Markdown twin success headers preserved exactly when extracting a helper.
8. Existing `tests/feeds.test.ts` / other suites stay green.
9. Never introduce the removed secondary name into implementation, SEO copy, schema aliases, or tests.

### Manual / live (post-deploy)

- Curl or view-source for `/`, `/about`, `/projects`, `/robots.txt`, `/sitemap.xml`, `/index.md`, `/rss.xml`.
- Schema syntax check on home + about (no rich-result promise).

### Search Console (owner)

- [ ] Property verified  
- [ ] Sitemap submitted  
- [ ] Important URLs inspected  
- [ ] Queries/impressions reviewed after crawl delay  
- [ ] Manual actions / security clean  

## Implementation phases (after plan approval)

1. Metadata + schema identity consistency (Chiradeep-only) + homepage title.  
2. Restrained copy consistency only if needed — design-preserving.  
3. Extract testable helpers where required; add regression tests; run test/typecheck/lint/build.  
4. Owner GSC checklist document (no fake submission claims).  
5. Owner reviews diff → authorize commit/deploy → live validation.

Safety gates:

- Inline execution with a review checkpoint after each task.
- No commits, pushes, or deployments without **separate** explicit owner authorization; default end state is local uncommitted changes.
- No secrets in the tree; no RLS changes; no force-push.
- Do not change unrelated application behavior.

## Classification preview

| Work | Classification |
| --- | --- |
| Titles, Chiradeep-only Person/WebSite consistency, tests | Implemented and tested (after coding) |
| Live production curl checks | Implemented but not yet verified in production until post-deploy |
| GSC verify / sitemap submit / URL Inspection / query reports | Requires external account access |
| Secondary-name SEO / handle-as-Person.alternateName | Not recommended (owner rejected) |
| H1 keyword rewrite / stuffing | Not recommended under Google’s guidance |
| Buying links / fake entities | Not recommended |
| Full CWV overhaul | Deferred unless measured regressions appear |

## Decisions locked by this revision

| Decision | Choice |
| --- | --- |
| Scope | **B** |
| Homepage title | `Chiradeep - Creative Technologist, AI & Web` |
| Sole public identity | **Chiradeep** |
| Secondary personal name in SEO | **Removed entirely** from strategy |
| Person / About naming | **Chiradeep** only |
| Person.alternateName | No auto handles; only explicitly approved aliases (none required now) |
| Design / motion / structure | Preserve |

## Spec self-review

- Removed prior fullName / secondary-name strategy and conflicting external display-name advice.
- Alias policy is explicit; sameAs vs alternateName distinction documented.
- Test surface matches owner validation requirements.
- Paired plan path: `docs/superpowers/plans/2026-10-29-seo-personal-entity-authority.md`.

---

**Review gate:** Approve this revised spec and the implementation plan before any application code, commit, or deploy.
