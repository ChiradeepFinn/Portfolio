# SEO personal entity authority — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden technical SEO and Chiradeep-only identity consistency on chiradeep.me, with regression tests and an owner Search Console checklist — without secondary-name SEO, design changes, commits, or deploys until the owner authorizes them.

**Architecture:** Keep Next.js Metadata API + `lib/seo.ts` JSON-LD as the single SEO surface. Extract small pure helpers (homepage title constant, Markdown twin response headers, sitemap entry collection) so eligibility and headers are unit-tested without a live server. Preserve SSR, motion, and page structure.

**Tech Stack:** Next.js App Router 16, React 19, TypeScript, existing `node:test` + `tsx` suite, Vercel hosting, optional `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.

**Spec:** `docs/superpowers/specs/2026-10-29-seo-personal-entity-authority-design.md`

## Global Constraints

- Sole public identity and primary search target: **Chiradeep**.
- Do not introduce the removed secondary name anywhere in implementation, SEO content, schema aliases, or tests (including negative regexes that spell that string).
- Homepage title exactly: `Chiradeep - Creative Technologist, AI & Web`.
- `WebSite.name` and `Person.name`: **Chiradeep**.
- `Person.alternateName`: omit by default; no auto-derived handle aliases.
- `sameAs`: only verified `https://` URLs already listed in `socialProfiles`; exclude `mailto:`.
- `withCanonical()` currently stores **relative** path strings for `alternates.canonical` and `openGraph.url` (for example `"/about"`). Absolute resolution for the HTML `<link rel="canonical">` is done by Next via `metadataBase`. Tests must assert that actual contract unless the owner later approves changing it.
- Markdown twin success headers must preserve today’s exact `Content-Type`, `Vary`, `Cache-Control`, `X-Robots-Tag`, and `Link` values from `app/api/md/[...path]/route.ts` before extraction.
- Sitemap exclusion tests must use real filters: `publicArticles` / `isPublicStatus` (drops `status: 'draft'`), `publishedProjects` (drops `isPlaceholder`), and no `.md` twin paths — not guessed placeholder project slugs.
- Preserve visual design, animations, and portfolio structure.
- Approach B only.
- **No commits, pushes, or deployments** without separate explicit owner authorization. Leave all work local and uncommitted unless told otherwise.
- Do not claim Search Console submission or indexing without owner confirmation.
- Do not change unrelated application behavior.

## File map

| Path | Responsibility |
| --- | --- |
| `lib/seo.ts` | `HOME_PAGE_TITLE`, `personNode`, `homeGraph`, `withCanonical` |
| `lib/site.ts` | Identity (Chiradeep-only; no fullName field) |
| `lib/http/markdown-twin-headers.ts` (create) | Exact twin success header map |
| `lib/feeds/sitemap-entries.ts` (create) | Sitemap entry collector |
| `app/api/md/[...path]/route.ts` | Use twin header helper |
| `app/sitemap.xml/route.ts` | Use collector |
| `app/robots.ts` | Policy unchanged |
| `app/layout.tsx` / `app/page.tsx` | Homepage title metadata |
| `tests/seo.test.ts` | Expanded regressions |
| `docs/superpowers/reports/2026-10-29-seo-gsc-owner-checklist.md` (create) | Owner GSC steps |

## Verified contracts (do not assume otherwise)

### `withCanonical(path, meta)`

From `lib/seo.ts` (2026-10-29):

- `alternates.canonical` = the `path` argument as passed (relative site path such as `'/'` or `'/about'`).
- `openGraph.url` = the same relative `path`.
- Absolute URLs in the rendered document come from Next `metadataBase` (`NEXT_PUBLIC_SITE_URL` / fallback), not from string concatenation inside `withCanonical`.

### Markdown twin success headers (current route)

From `app/api/md/[...path]/route.ts` success branch:

- `Content-Type`: `text/markdown; charset=utf-8`
- `Vary`: `Accept`
- `Cache-Control`: `public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400`
- `X-Robots-Tag`: `noindex`
- `Link`: `` `<${absolute(base, canonical)}>; rel="canonical"` ``

### Sitemap eligibility (current route)

- Static public HTML paths listed in the route.
- Research study paths from `getResearchStudies()`.
- MDX paths from `publicArticles(loadCollection(...))` only (drafts excluded; real draft on disk: `content/essays/article-template.mdx` → href `/philosophy/article-template`).
- Project paths from `publishedProjects(getProjects())` only (`!isPlaceholder && slug.length > 0`).
- No Markdown twin paths; no `/api/*`.

---

### Task 1: Homepage title + Chiradeep-only Person schema

**Files:**
- Modify: `lib/seo.ts`
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `tests/seo.test.ts`

**Interfaces:**
- Produces: `export const HOME_PAGE_TITLE = 'Chiradeep - Creative Technologist, AI & Web'`
- Produces: `personNode()` with `name: 'Chiradeep'` and **no** `alternateName` property
- Produces: `homeGraph()` WebPage `name === HOME_PAGE_TITLE`, WebSite `name === 'Chiradeep'`

- [ ] **Step 1: Write failing tests**

Valid TypeScript for `tests/seo.test.ts` (use clear parameter names; no autolink angle-brackets in assertions beyond normal strings):

```typescript
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  HOME_PAGE_TITLE,
  homeGraph,
  personNode,
  siteDescription,
  withCanonical,
} from '../lib/seo';
import { identity } from '../lib/site';

it('exports the approved homepage title constant', () => {
  assert.equal(HOME_PAGE_TITLE, 'Chiradeep - Creative Technologist, AI & Web');
});

it('names the person Chiradeep only and omits alternateName', () => {
  assert.equal(identity.name, 'Chiradeep');
  assert.equal('fullName' in identity, false);
  const person = personNode();
  assert.equal(person.name, 'Chiradeep');
  assert.equal(Object.hasOwn(person, 'alternateName'), false);
});

it('aligns WebSite and WebPage names with approved branding', () => {
  const graph = homeGraph();
  const siteNode = graph['@graph'].find((node) => node['@type'] === 'WebSite') as {
    name: string;
    alternateName?: readonly string[];
  };
  const pageNode = graph['@graph'].find((node) => node['@type'] === 'WebPage') as {
    name: string;
  };
  assert.ok(siteNode);
  assert.ok(pageNode);
  assert.equal(siteNode.name, 'Chiradeep');
  assert.equal(pageNode.name, HOME_PAGE_TITLE);
  const allowedSiteAlts = new Set(['CF°', 'Chiradeep Portfolio', 'chiradeep.me']);
  for (const alt of siteNode.alternateName ?? []) {
    assert.ok(allowedSiteAlts.has(alt), `unexpected WebSite.alternateName: ${alt}`);
  }
});
```

Keep existing `siteDescription` / ProfilePage tests; update only if they conflict.

- [ ] **Step 2: Run `node ./node_modules/tsx/dist/cli.mjs --test tests/seo.test.ts` — expect FAIL**

- [ ] **Step 3: Implement**

1. Add `HOME_PAGE_TITLE` to `lib/seo.ts`.
2. Remove `alternateName` from `personNode()`.
3. Set home `WebPage.name` to `HOME_PAGE_TITLE`.
4. Keep `WebSite.alternateName` as the existing site marks only: `identity.brand`, `'Chiradeep Portfolio'`, `'chiradeep.me'`.
5. `app/page.tsx`: `title: { absolute: HOME_PAGE_TITLE }`.
6. `app/layout.tsx`: `title.default = HOME_PAGE_TITLE`.
7. Do not edit Hero H1. Do not add a fullName field.

- [ ] **Step 4: Re-run SEO tests — expect PASS**

- [ ] **Step 5: Checkpoint — show diff to owner; do not commit; wait before Task 2**

---

### Task 2: Canonical helper regression tests

**Files:**
- Modify: `tests/seo.test.ts`
- Modify: `lib/seo.ts` only if a real bug is found (prefer no change)

**Interfaces:**
- Assert the **actual** contract: relative paths.

```typescript
it('sets relative canonical and openGraph url to the path argument', () => {
  for (const path of ['/', '/about', '/projects'] as const) {
    const meta = withCanonical(path, {
      title: 'Sample',
      description: 'Sample description for tests.',
    });
    assert.equal(meta.alternates?.canonical, path);
    const openGraph = meta.openGraph as { url?: string };
    assert.equal(openGraph.url, path);
  }
});

it('keeps sameAs as https profile urls from socialProfiles only', () => {
  const person = personNode();
  assert.ok(Array.isArray(person.sameAs));
  for (const url of person.sameAs) {
    assert.equal(url.startsWith('https://'), true);
    assert.equal(url.startsWith('mailto:'), false);
  }
});
```

- [ ] **Step 1: Add tests**
- [ ] **Step 2: Run SEO tests — expect PASS**
- [ ] **Step 3: Checkpoint — show diff; do not commit; wait before Task 3**

---

### Task 3: Markdown twin header helper + tests

**Files:**
- Create: `lib/http/markdown-twin-headers.ts`
- Modify: `app/api/md/[...path]/route.ts`
- Modify: `tests/seo.test.ts`

**Baseline to preserve (copy exactly from current success branch):**

```typescript
{
  'Content-Type': 'text/markdown; charset=utf-8',
  Vary: 'Accept',
  'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400',
  'X-Robots-Tag': 'noindex',
  Link: `<${absolute(base, canonical)}>; rel="canonical"`,
}
```

```typescript
import { absolute } from '../lib/feeds/paths';
import { markdownTwinSuccessHeaders } from '../lib/http/markdown-twin-headers';

it('preserves markdown twin success headers including cache and Vary', () => {
  const base = 'https://chiradeep.me';
  const canonicalPath = '/projects/sidequest';
  const headers = markdownTwinSuccessHeaders(base, canonicalPath);
  assert.equal(headers['Content-Type'], 'text/markdown; charset=utf-8');
  assert.equal(headers.Vary, 'Accept');
  assert.equal(
    headers['Cache-Control'],
    'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400',
  );
  assert.equal(headers['X-Robots-Tag'], 'noindex');
  const expectedLink = '<' + absolute(base, canonicalPath) + '>; rel="canonical"';
  assert.equal(headers.Link, expectedLink);
});
```

- [ ] **Step 1: Write failing test**
- [ ] **Step 2: Implement helper; wire route success branch only; leave 404 headers unchanged**
- [ ] **Step 3: Run SEO + feeds tests — expect PASS**
- [ ] **Step 4: Checkpoint — show diff; do not commit; wait before Task 4**

---

### Task 4: Sitemap eligibility collector + tests

**Files:**
- Create: `lib/feeds/sitemap-entries.ts`
- Modify: `app/sitemap.xml/route.ts`
- Modify: `tests/seo.test.ts`

**Test against real rules:**

```typescript
import { collectSitemapEntries } from '../lib/feeds/sitemap-entries';
import { loadCollection, publicArticles } from '../lib/mdx/files';
import { getProjects } from '../lib/content';
import { publishedProjects } from '../lib/feeds/catalog';

it('excludes draft mdx that publicArticles already drops', async () => {
  const essays = loadCollection('essays');
  const draft = essays.find((article) => article.status === 'draft');
  assert.ok(draft, 'expected a draft essay fixture on disk');
  assert.equal(
    publicArticles(essays).some((article) => article.slug === draft.slug),
    false,
  );
  const entries = await collectSitemapEntries();
  assert.equal(
    entries.some((entry) => entry.path === draft.href),
    false,
  );
});

it('excludes placeholder projects the same way publishedProjects does', async () => {
  const all = await getProjects();
  const published = publishedProjects(all);
  const entries = await collectSitemapEntries();
  const projectPaths = entries
    .map((entry) => entry.path)
    .filter((path) => path.startsWith('/projects/') && path !== '/projects');
  for (const path of projectPaths) {
    const slug = path.slice('/projects/'.length);
    assert.ok(published.some((project) => project.slug === slug));
  }
  for (const project of all.filter((item) => item.isPlaceholder)) {
    assert.equal(
      entries.some((entry) => entry.path === `/projects/${project.slug}`),
      false,
    );
  }
});

it('never lists markdown twins or api paths', async () => {
  const entries = await collectSitemapEntries();
  for (const entry of entries) {
    assert.equal(entry.path.endsWith('.md'), false);
    assert.equal(entry.path.startsWith('/api/'), false);
  }
});
```

- [ ] **Step 1: Write tests**
- [ ] **Step 2: Extract `collectSitemapEntries` from the route without changing eligibility**
- [ ] **Step 3: Run SEO + feeds tests — expect PASS**
- [ ] **Step 4: Checkpoint — show diff; do not commit; wait before Task 5**

---

### Task 5: Robots configuration tests

**Files:**
- Modify: `tests/seo.test.ts`
- Prefer not changing `app/robots.ts`

```typescript
import robots from '../app/robots';

it('disallows api and auth and points sitemap at the configured origin', () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = 'https://chiradeep.me';
  try {
    const doc = robots();
    assert.equal(doc.sitemap, 'https://chiradeep.me/sitemap.xml');
    const rules = Array.isArray(doc.rules) ? doc.rules : [doc.rules];
    const starRule = rules.find((rule) => rule.userAgent === '*');
    assert.ok(starRule);
    const disallow = starRule.disallow;
    const disallowList = Array.isArray(disallow) ? disallow : [disallow];
    assert.ok(disallowList.includes('/api/'));
    assert.ok(disallowList.includes('/auth/'));
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previous;
  }
});
```

- [ ] **Step 1: Add test; run SEO tests — expect PASS**
- [ ] **Step 2: Checkpoint — show diff; do not commit; wait before Task 6**

---

### Task 6: Owner Search Console checklist (docs only)

**Files:**
- Create: `docs/superpowers/reports/2026-10-29-seo-gsc-owner-checklist.md`

Contents: domain or URL-prefix verification; optional `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`; submit `https://chiradeep.me/sitemap.xml`; URL Inspection for `/`, `/about`, `/projects`, key projects; Performance / Pages / CWV monitoring; Manual Actions + Security clean. Every item marked **Requires owner** until the owner confirms otherwise. No secrets. No false “submitted” claims.

- [ ] **Step 1: Write checklist**
- [ ] **Step 2: Checkpoint — show diff; do not commit; wait before Task 7**

---

### Task 7: Full local verification gate

- [ ] **Step 1:** `npm test`
- [ ] **Step 2:** `npm run type-check`
- [ ] **Step 3:** `npm run lint`
- [ ] **Step 4:** `npm run build`
- [ ] **Step 5:** Stop. Provide changed-file list, results, outstanding issues, GSC owner actions. **All changes remain local and uncommitted. No deploy.**

---

### Task 8 (only after separate deploy authorization)

Live curl validation of meta, robots, sitemap, and `/index.md` headers. Record evidence. Do not invent GSC metrics.

---

## Plan self-review

- Spec identity rules reconciled: Chiradeep-only; removed name never introduced.
- Test examples use valid TypeScript parameter names and string concatenation for `Link` headers.
- Canonical tests document and assert relative-path contract.
- Sitemap tests use `publicArticles` / `publishedProjects` / real draft fixture.
- Twin headers preserve Cache-Control and Vary exactly.
- Commits/pushes/deploys explicitly gated out of the default execution path.
