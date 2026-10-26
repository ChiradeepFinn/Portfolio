import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { loadCollection } from '../lib/mdx/files';
import { assertSlugSetsMatch, ContentError, parseFrontmatter } from '../lib/mdx/schema';

function writeArticle(root: string, collection: string, name: string, frontmatter: string, body = 'Hello.') {
  const directory = path.join(root, 'content', collection);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(
    path.join(directory, name),
    `---\n${frontmatter}\n---\n\n${body}\n`,
    'utf8',
  );
}

describe('mdx frontmatter', () => {
  it('accepts a complete article and fills missing tags', () => {
    const article = parseFrontmatter(
      {
        title: 'A note',
        slug: 'a-note',
        summary: 'Short.',
        publishedAt: '2026-10-13',
        status: 'in-progress',
      },
      'content/essays/a-note.mdx',
    );
    assert.deepEqual(article.tags, []);
    assert.equal(article.status, 'in-progress');
  });

  it('rejects a missing title, a bad date, and a remote cover', () => {
    assert.throws(
      () =>
        parseFrontmatter(
          { slug: 'a-note', summary: 'Short.', publishedAt: '2026-10-13', status: 'draft' },
          'content/essays/a-note.mdx',
        ),
      ContentError,
    );
    assert.throws(
      () =>
        parseFrontmatter(
          {
            title: 'A note',
            slug: 'a-note',
            summary: 'Short.',
            publishedAt: '2026-02-31',
            status: 'draft',
          },
          'content/essays/a-note.mdx',
        ),
      ContentError,
    );
    assert.throws(
      () =>
        parseFrontmatter(
          {
            title: 'A note',
            slug: 'a-note',
            summary: 'Short.',
            publishedAt: '2026-10-13',
            status: 'draft',
            coverImage: 'https://example.com/a.jpg',
          },
          'content/essays/a-note.mdx',
        ),
      ContentError,
    );
  });

  it('requires the registry to list the same slugs as the files', () => {
    assert.doesNotThrow(() => assertSlugSetsMatch('essays', ['a'], ['a']));
    assert.throws(() => assertSlugSetsMatch('essays', ['a'], []), /not registered: a/);
  });
});

describe('mdx files', () => {
  it('reads a valid file and rejects a reserved research slug', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-mdx-'));
    writeArticle(
      root,
      'essays',
      'field-notes.mdx',
      ['title: "Field notes"', 'slug: field-notes', 'summary: "A note."', 'publishedAt: "2026-10-13"', 'status: draft'].join(
        '\n',
      ),
    );
    const articles = loadCollection('essays', root);
    assert.equal(articles.length, 1);
    assert.equal(articles[0]?.slug, 'field-notes');
    assert.equal(articles[0]?.href, '/philosophy/field-notes');

    writeArticle(
      root,
      'research',
      'music-emotion-recognition.mdx',
      [
        'title: "Duplicate"',
        'slug: music-emotion-recognition',
        'summary: "Should not exist beside the TypeScript study."',
        'publishedAt: "2026-10-13"',
        'status: in-progress',
      ].join('\n'),
    );
    assert.throws(() => loadCollection('research', root), /lib\/data\/research\.ts/);
  });

  it('rejects a filename that does not match the slug', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-mdx-'));
    writeArticle(
      root,
      'essays',
      'wrong-name.mdx',
      ['title: "Nope"', 'slug: right-name', 'summary: "No."', 'publishedAt: "2026-10-13"', 'status: draft'].join('\n'),
    );
    assert.throws(() => loadCollection('essays', root), /must be named right-name\.mdx/);
  });
});
