import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { robotsDocument } from '../lib/feeds/robots-txt';
import { getProjects } from '../lib/content';
import { publishedProjects } from '../lib/feeds/catalog';
import { absolute } from '../lib/feeds/paths';
import { collectSitemapEntries } from '../lib/feeds/sitemap-entries';
import { markdownTwinSuccessHeaders } from '../lib/http/markdown-twin-headers';
import { loadCollection, publicArticles } from '../lib/mdx/files';
import {
  HOME_PAGE_TITLE,
  META_DESCRIPTION_MAX,
  META_DESCRIPTION_MIN,
  PAGE_TITLE_MAX,
  articleGraph,
  breadcrumbGraph,
  contactPageGraph,
  fitDocumentTitle,
  fitMetaDescription,
  homeGraph,
  personNode,
  profilePageGraph,
  projectGraph,
  siteDescription,
  withCanonical,
} from '../lib/seo';
import { getResearchStudies } from '../lib/content';
import { identity, personAlternateNames, socialProfiles } from '../lib/site';

function assertMetaDescriptionLength(description: string, label: string) {
  assert.ok(
    description.length >= META_DESCRIPTION_MIN,
    `${label} description too short (${description.length}): ${description}`,
  );
  assert.ok(
    description.length <= META_DESCRIPTION_MAX,
    `${label} description too long (${description.length}): ${description}`,
  );
}

describe('seo structured data', () => {
  it('keeps the site description first-person and within snippet bounds', () => {
    assert.match(siteDescription, /^I'm Chiradeep Finn/);
    assert.match(siteDescription, /Finn for short/);
    assertMetaDescriptionLength(siteDescription, 'siteDescription');
  });

  it('fits long copy into the meta description window without inventing text', () => {
    const long =
      'This project examines whether writers judgments align with independent evaluators across human-only and AI-assisted ideation conditions using a public experimental dataset and exploratory measures that require independent validation afterward.';
    const fitted = fitMetaDescription(long);
    assert.ok(fitted.endsWith('…'));
    assert.ok(fitted.length <= META_DESCRIPTION_MAX);
    assert.ok(fitted.length >= META_DESCRIPTION_MIN - 15);
    assert.equal(fitMetaDescription('Short enough already.').endsWith('…'), false);
  });

  it('fits long document titles under the SERP window and keeps the brand suffix', () => {
    const long =
      'Beyond Genre Classification: Evaluating Machine Learning Models for Music Emotion Recognition Across Instrumental and Vocal Audio';
    const fitted = fitDocumentTitle(long);
    assert.ok(fitted.length <= PAGE_TITLE_MAX, `title too long (${fitted.length}): ${fitted}`);
    assert.ok(fitted.startsWith('Beyond Genre'));
    assert.ok(fitted.includes(identity.name));
    assert.equal(fitDocumentTitle('Sidequest'), `Sidequest - ${identity.name}`);
  });

  it('keeps research study document titles within the SERP window', () => {
    for (const study of getResearchStudies()) {
      const title = fitDocumentTitle(study.title);
      assert.ok(title.length <= PAGE_TITLE_MAX, `${study.slug}: ${title.length} ${title}`);
    }
  });

  it('exports the approved homepage title constant', () => {
    assert.equal(HOME_PAGE_TITLE, 'Chiradeep Finn - Creative Technologist, AI & Web');
    assert.ok(HOME_PAGE_TITLE.length <= PAGE_TITLE_MAX);
  });

  it('keeps static route titles unique and under the SERP window with the brand template', async () => {
    const { readdir, readFile } = await import('node:fs/promises');
    const path = await import('node:path');
    const brandSuffix = ` - ${identity.name}`;

    async function collectPages(dir: string): Promise<string[]> {
      const entries = await readdir(dir, { withFileTypes: true });
      const files: string[] = [];
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...(await collectPages(full)));
        else if (entry.name === 'page.tsx') files.push(full);
      }
      return files;
    }

    const pages = await collectPages(path.join(process.cwd(), 'app'));
    const titles = new Map<string, string>();

    for (const file of pages) {
      const source = await readFile(file, 'utf8');
      if (!source.includes('withCanonical(')) continue;
      if (source.includes('generateMetadata')) continue;

      const absolute = source.match(/title:\s*\{\s*absolute:\s*HOME_PAGE_TITLE\s*\}/);
      if (absolute) {
        titles.set(path.relative(process.cwd(), file), HOME_PAGE_TITLE);
        continue;
      }

      const literal = source.match(/title:\s*(['"`])([^'"`]+)\1/);
      if (!literal?.[2]) continue;
      const documentTitle = `${literal[2]}${brandSuffix}`;
      assert.ok(
        documentTitle.length <= PAGE_TITLE_MAX,
        `${path.relative(process.cwd(), file)} title too long (${documentTitle.length}): ${documentTitle}`,
      );
      titles.set(path.relative(process.cwd(), file), documentTitle);
    }

    assert.ok(titles.size >= 15, `expected static titles, got ${titles.size}`);
    const unique = new Set(titles.values());
    assert.equal(unique.size, titles.size, 'static page titles must be unique');
  });

  it('routes the archive Philosophy door to /philosophy', async () => {
    const { readFile } = await import('node:fs/promises');
    const source = await readFile(new URL('../app/archive/page.tsx', import.meta.url), 'utf8');
    assert.match(source, /label:\s*'Philosophy'[\s\S]*?href:\s*'\/philosophy'/);
    assert.equal(/label:\s*'Philosophy'[\s\S]*?href:\s*'\/about'/.test(source), false);
  });

  it('requires target=_blank external anchors to include noopener noreferrer', async () => {
    const { readdir, readFile } = await import('node:fs/promises');
    const path = await import('node:path');

    async function collectSources(dir: string): Promise<string[]> {
      const entries = await readdir(dir, { withFileTypes: true });
      const files: string[] = [];
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === 'node_modules' || entry.name === '.next') continue;
          files.push(...(await collectSources(full)));
        } else if (/\.(tsx|jsx|ts|js)$/.test(entry.name)) files.push(full);
      }
      return files;
    }

    const roots = ['app', 'components'].map((name) => path.join(process.cwd(), name));
    for (const root of roots) {
      for (const file of await collectSources(root)) {
        const source = await readFile(file, 'utf8');
        if (!source.includes('target="_blank"') && !source.includes("target='_blank'")) continue;
        const rel = path.relative(process.cwd(), file);
        assert.ok(
          /rel=\{[^}]*noopener noreferrer|rel=["']noopener noreferrer["']|rel=["']noreferrer noopener["']/.test(
            source,
          ),
          `${rel} opens a new tab without noopener noreferrer`,
        );
      }
    }
  });

  it('names the person Chiradeep Finn with Finn and Chiradeep alternates', () => {
    assert.equal(identity.name, 'Chiradeep Finn');
    assert.equal(identity.preferredName, 'Finn');
    assert.equal(identity.shortName, 'Chiradeep');
    assert.equal(identity.firstName, 'Finn');
    assert.deepEqual([...personAlternateNames], ['Finn', 'Chiradeep']);
    const person = personNode();
    assert.equal(person.name, 'Chiradeep Finn');
    assert.deepEqual(person.alternateName, ['Finn', 'Chiradeep']);
    assert.equal(person.givenName, 'Chiradeep');
    assert.equal(person.familyName, 'Finn');
    assert.match(person.url, /\/$/);
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
    assert.equal(site.name, 'Chiradeep Finn');
    assert.ok(site.alternateName.includes('chiradeep.me'));
    const person = graph['@graph'].find((node) => node['@type'] === 'Person') as {
      description: string;
      alternateName: string[];
    };
    assert.equal(person.description, siteDescription);
    assert.deepEqual(person.alternateName, ['Finn', 'Chiradeep']);
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
    assert.equal(siteNode.name, 'Chiradeep Finn');
    assert.equal(pageNode.name, HOME_PAGE_TITLE);
    const allowedSiteAlts = new Set([identity.preferredName, 'Chiradeep Portfolio', 'chiradeep.me']);
    for (const alt of siteNode.alternateName ?? []) {
      assert.ok(allowedSiteAlts.has(alt), `unexpected WebSite.alternateName: ${alt}`);
    }
  });

  it('marks About as a ProfilePage with the same Person entity', () => {
    const page = profilePageGraph();
    assert.equal(page['@type'], 'ProfilePage');
    assert.equal(page.mainEntity['@type'], 'Person');
    assert.equal(page.mainEntity.name, 'Chiradeep Finn');
    assert.deepEqual(page.mainEntity.alternateName, ['Finn', 'Chiradeep']);
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

  it('types software projects as SoftwareApplication without invented ratings', async () => {
    const projects = publishedProjects(await getProjects());
    const sample = projects[0];
    assert.ok(sample, 'expected at least one published project');
    const graph = projectGraph(sample);
    assert.equal(graph['@type'], 'SoftwareApplication');
    assert.equal('aggregateRating' in graph, false);
    assert.equal('offers' in graph, false);
    assert.equal(graph.author['@id'].includes('#person'), true);
  });

  it('sets relative canonical and openGraph url to the path argument', () => {
    for (const path of ['/', '/about', '/projects'] as const) {
      const meta = withCanonical(path, {
        title: 'Sample',
        description: 'Sample description for tests.',
      });
      assert.equal(meta.alternates?.canonical, path);
      const openGraph = meta.openGraph as { url?: string; siteName?: string };
      assert.equal(openGraph.url, path);
      assert.equal(openGraph.siteName, identity.name);
    }
  });

  it('fills openGraph and twitter title/description from page metadata when omitted', () => {
    const description =
      'Selected projects and case studies by Chiradeep Finn across AI, web, and creative technology builds.';
    const meta = withCanonical('/projects', {
      title: 'Projects',
      description,
    });
    const openGraph = meta.openGraph as { title?: string; description?: string };
    const twitter = meta.twitter as {
      title?: string;
      description?: string;
      card?: string;
      site?: string;
    };
    assert.equal(openGraph.title, 'Projects');
    assert.equal(openGraph.description, description);
    assert.equal(twitter.title, 'Projects');
    assert.equal(twitter.description, description);
    assert.equal(twitter.card, 'summary_large_image');
    assert.equal('site' in twitter, false);
  });

  it('does not invent a Twitter site handle when no X profile exists', () => {
    assert.equal(
      socialProfiles.some((profile) => /twitter|x\.com/i.test(profile.label) || /twitter\.com|x\.com/i.test(profile.href ?? '')),
      false,
    );
  });

  it('keeps static page metadata descriptions inside the snippet window', async () => {
    const { readdir, readFile } = await import('node:fs/promises');
    const path = await import('node:path');
    const {
      artworkWorld,
      booksWorld,
      musicWorld,
      photographyWorld,
    } = await import('../lib/data/worlds');

    const worldLeads: Record<string, string> = {
      'musicWorld.lead': musicWorld.lead,
      'booksWorld.lead': booksWorld.lead,
      'photographyWorld.lead': photographyWorld.lead,
      'artworkWorld.lead': artworkWorld.lead,
      siteDescription,
    };

    async function collectPages(dir: string): Promise<string[]> {
      const entries = await readdir(dir, { withFileTypes: true });
      const files: string[] = [];
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...(await collectPages(full)));
        else if (entry.name === 'page.tsx') files.push(full);
      }
      return files;
    }

    const pages = await collectPages(path.join(process.cwd(), 'app'));
    let checked = 0;

    for (const file of pages) {
      const source = await readFile(file, 'utf8');
      if (!source.includes('withCanonical(')) continue;

      const worldRef = source.match(
        /description:\s*\n?\s*((?:music|books|photography|artwork)World\.lead|siteDescription)\b/,
      );
      const literal = source.match(/description:\s*\n?\s*(['"`])([\s\S]*?)\1/);

      let description: string | undefined;
      if (worldRef) {
        description = worldLeads[worldRef[1] ?? ''];
      } else if (literal) {
        description = literal[2]?.replace(/\s+/g, ' ').trim();
      }

      // Dynamic generateMetadata pages are covered by fitMetaDescription instead.
      if (!description) continue;
      assertMetaDescriptionLength(description, path.relative(process.cwd(), file));
      checked += 1;
    }

    assert.ok(checked >= 15, `expected to audit static metadata pages, checked ${checked}`);
  });

  it('includes the HTML sitemap route among public indexable entries', async () => {
    const entries = await collectSitemapEntries();
    assert.ok(entries.some((entry) => entry.path === '/'));
    assert.ok(entries.some((entry) => entry.path === '/about'));
    assert.ok(entries.some((entry) => entry.path === '/sitemap'));
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
      const doc = robotsDocument();
      assert.equal(doc.sitemap, 'https://chiradeep.me/sitemap.xml');
      assert.equal(doc.agentmap, 'https://chiradeep.me/.well-known/ard.json');
      const rules = Array.isArray(doc.rules) ? doc.rules : [doc.rules];
      const starRule = rules.find((rule) => rule.userAgent === '*');
      assert.ok(starRule);
      const disallow = starRule.disallow;
      const disallowList = Array.isArray(disallow) ? disallow : [disallow];
      assert.ok(disallowList.includes('/api/'));
      assert.ok(disallowList.includes('/auth/'));
      for (const blocked of disallowList) {
        assert.equal(typeof blocked === 'string' && /\.(css|js|png|jpe?g|webp|svg|ico)$/i.test(blocked), false);
        assert.equal(blocked === '/_next/' || blocked === '/_next/static/', false);
      }
      const oai = rules.find((rule) => rule.userAgent === 'OAI-SearchBot');
      assert.ok(oai);
      assert.equal(oai.allow, '/');
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = previous;
    }
  });

  it('defaults openGraph images with width and height via withCanonical', () => {
    const meta = withCanonical('/about', {
      title: 'About',
      description:
        "I'm Chiradeep Finn, Finn for short: a creative technologist from Karur. Who I am, what I build, and what drives the work across AI, web, music, and the arts.",
    });
    const images = (meta.openGraph as { images?: readonly { url: string; width: number; height: number }[] }).images;
    assert.ok(images && images.length > 0);
    assert.equal(images[0]?.width, 1200);
    assert.equal(images[0]?.height, 630);
  });

  it('keeps the footer legal Sitemap link on the HTML sitemap route', async () => {
    const { footerLegal } = await import('../lib/site');
    const sitemap = footerLegal.find((link) => link.label === 'Sitemap');
    assert.ok(sitemap);
    assert.equal(sitemap.href, '/sitemap');
  });
});
