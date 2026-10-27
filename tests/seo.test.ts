import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  articleGraph,
  breadcrumbGraph,
  contactPageGraph,
  homeGraph,
  profilePageGraph,
  siteDescription,
} from '../lib/seo';

describe('seo structured data', () => {
  it('keeps the site description first-person and concise', () => {
    assert.match(siteDescription, /^I'm Chiradeep/);
    assert.ok(siteDescription.length <= 160);
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
  });

  it('marks About as a ProfilePage', () => {
    const page = profilePageGraph();
    assert.equal(page['@type'], 'ProfilePage');
    assert.equal(page.mainEntity['@type'], 'Person');
    assert.equal(page.mainEntity.name, 'Chiradeep');
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
});
