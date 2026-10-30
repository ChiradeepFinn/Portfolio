import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import robots from '../app/robots';
import { getProjects } from '../lib/content';
import { publishedProjects } from '../lib/feeds/catalog';
import { absolute } from '../lib/feeds/paths';
import { collectSitemapEntries } from '../lib/feeds/sitemap-entries';
import { markdownTwinSuccessHeaders } from '../lib/http/markdown-twin-headers';
import { loadCollection, publicArticles } from '../lib/mdx/files';
import {
  HOME_PAGE_TITLE,
  articleGraph,
  breadcrumbGraph,
  contactPageGraph,
  homeGraph,
  personNode,
  profilePageGraph,
  siteDescription,
  withCanonical,
} from '../lib/seo';
import { identity, socialProfiles } from '../lib/site';

describe('seo structured data', () => {
  it('keeps the site description first-person and concise', () => {
    assert.match(siteDescription, /^I'm Chiradeep/);
    assert.ok(siteDescription.length <= 160);
  });

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

  it('emits WebSite + Person for site name guidance', () => {
    const graph = homeGraph();
    const types = graph['@graph'].map((node) => node['@type']);
    assert.ok(types.includes('Person'));
    assert.ok(types.includes('WebSite'));
    assert.ok(types.includes('WebPage'));
    const site = graph['@graph'].find((node) => node['@type'] === 'WebSite') as {
      name: string;
      alternateName: string[];
    };
    assert.equal(site.name, 'Chiradeep');
    assert.ok(site.alternateName.includes('chiradeep.me'));
    const person = graph['@graph'].find((node) => node['@type'] === 'Person') as {
      description: string;
    };
    assert.equal(person.description, siteDescription);
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

  it('marks About as a ProfilePage', () => {
    const page = profilePageGraph();
    assert.equal(page['@type'], 'ProfilePage');
    assert.equal(page.mainEntity['@type'], 'Person');
    assert.equal(page.mainEntity.name, 'Chiradeep');
    assert.equal(Object.hasOwn(page.mainEntity, 'alternateName'), false);
  });

  it('builds breadcrumb trails with positions and omits item on the last crumb', () => {
    const crumbs = breadcrumbGraph([
      { name: 'Archive', path: '/archive' },
      { name: 'Photography' },
    ]);
    assert.ok(crumbs);
    assert.equal(crumbs.itemListElement.length, 2);
    assert.equal(crumbs.itemListElement[0]?.position, 1);
    assert.ok('item' in (crumbs.itemListElement[0] ?? {}));
    assert.equal(crumbs.itemListElement[1]?.name, 'Photography');
    assert.equal('item' in (crumbs.itemListElement[1] ?? {}), false);
  });

  it('refuses a single-crumb trail', () => {
    assert.equal(breadcrumbGraph([{ name: 'Home' }]), null);
  });

  it('nests ContactPage with visible FAQ copy', () => {
    const graph = contactPageGraph([
      { question: 'What is worth emailing about?', answer: 'A clear ask with context.' },
    ]);
    const types = graph['@graph'].map((node) => node['@type']);
    assert.ok(types.includes('ContactPage'));
    assert.ok(types.includes('FAQPage'));
  });

  it('omits invented article dates', () => {
    const article = articleGraph({
      path: '/philosophy/field-notes',
      headline: 'Field notes',
      description: 'A note.',
    });
    assert.equal('datePublished' in article, false);
  });

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
    const expected = socialProfiles
      .map((profile) => profile.href)
      .filter((href): href is string => typeof href === 'string' && href.startsWith('https://'));
    assert.deepEqual(person.sameAs, expected);
    for (const url of person.sameAs) {
      assert.equal(url.startsWith('https://'), true);
      assert.equal(url.startsWith('mailto:'), false);
    }
  });

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
});
