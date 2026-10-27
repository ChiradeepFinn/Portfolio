import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { prefersMarkdown } from '../lib/http/accept';
import {
  agentNotFoundMarkdown,
  isKnownPublicPath,
  markdownNegotiationDestination,
} from '../lib/http/agent-markdown';

describe('prefersMarkdown', () => {
  it('accepts a plain markdown preference', () => {
    assert.equal(prefersMarkdown('text/markdown'), true);
  });

  it('prefers markdown when its q is higher than html', () => {
    assert.equal(prefersMarkdown('text/html;q=0.8, text/markdown;q=1'), true);
  });

  it('keeps html when markdown is weaker', () => {
    assert.equal(prefersMarkdown('text/html, text/markdown;q=0.1'), false);
  });

  it('ignores missing, html-only, and wildcard-only accepts', () => {
    assert.equal(prefersMarkdown(null), false);
    assert.equal(prefersMarkdown('text/html'), false);
    assert.equal(prefersMarkdown('*/*'), false);
    assert.equal(
      prefersMarkdown('text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'),
      false,
    );
  });
});

describe('markdown negotiation destinations', () => {
  it('maps twin-capable HTML paths', () => {
    assert.equal(markdownNegotiationDestination('/'), '/api/md/index');
    assert.equal(markdownNegotiationDestination('/projects/sidequest'), '/api/md/projects/sidequest');
    assert.equal(markdownNegotiationDestination('/philosophy/a-note'), '/api/md/philosophy/a-note');
    assert.equal(
      markdownNegotiationDestination('/archive/research/music-emotion-recognition'),
      '/api/md/archive/research/music-emotion-recognition',
    );
  });

  it('leaves non-twin pages alone', () => {
    assert.equal(markdownNegotiationDestination('/about'), null);
    assert.equal(markdownNegotiationDestination('/contact'), null);
  });
});

describe('agent 404 markdown', () => {
  it('treats unknown paths as agent 404 candidates', () => {
    assert.equal(isKnownPublicPath('/__ora-404-probe-test'), false);
    assert.equal(isKnownPublicPath('/about'), true);
    assert.equal(isKnownPublicPath('/projects/sidequest'), true);
  });

  it('links recovery surfaces', () => {
    const body = agentNotFoundMarkdown('https://chiradeep.me', '/missing');
    assert.match(body, /# Not found/);
    assert.match(body, /llms\.txt/);
    assert.match(body, /sitemap\.xml/);
    assert.ok(body.length > 20);
  });
});
