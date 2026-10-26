import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildContactEmail, escapeHtml } from '../lib/contact/email';
import { rateLimitKey } from '../lib/contact/client-key';
import { createIdempotencyCache } from '../lib/contact/idempotency';
import { decideRateLimit, MemoryRateLimitStore, type RateLimitStore } from '../lib/contact/rate-limit';
import { honeypotTripped, parseContactPayload } from '../lib/contact/validate';

const valid = {
  name: 'Ada',
  email: 'Ada@Example.com',
  subject: 'Hello',
  message: 'This is a real message.',
};

describe('contact validation', () => {
  it('accepts a normal payload and lowercases the email', () => {
    const result = parseContactPayload(valid);
    assert.equal(result.ok, true);
    if (!result.ok || result.honeypot) return;
    assert.equal(result.value.email, 'ada@example.com');
  });

  it('rejects a missing field, a bad email, a short message, and an oversized name', () => {
    assert.equal(parseContactPayload({ ...valid, name: '  ' }).ok, false);
    assert.equal(parseContactPayload({ ...valid, email: 'not-an-email' }).ok, false);
    assert.equal(parseContactPayload({ ...valid, message: 'short' }).ok, false);
    const longName = parseContactPayload({ ...valid, name: 'a'.repeat(121) });
    assert.equal(longName.ok, false);
  });

  it('rejects header breaks and non-objects', () => {
    const broken = parseContactPayload({ ...valid, subject: 'Hello\r\nBcc: spam@example.com' });
    assert.equal(broken.ok, false);
    assert.equal(parseContactPayload(['nope']).ok, false);
    assert.equal(parseContactPayload(null).ok, false);
  });

  it('treats a filled honeypot as a bot and an empty one as a person', () => {
    assert.equal(honeypotTripped({ company_website: 'https://spam.test' }), true);
    const tripped = parseContactPayload({ ...valid, company_website: 'https://spam.test' });
    assert.equal(tripped.ok && tripped.honeypot, true);
    assert.equal(honeypotTripped({ company_website: '   ' }), false);
  });
});

describe('contact email', () => {
  it('escapes html and refuses header breaks in configured addresses', () => {
    assert.equal(escapeHtml(`<script>"&'</script>`), '&lt;script&gt;&quot;&amp;&#39;&lt;/script&gt;');
    const email = buildContactEmail(
      { name: 'A <b>', email: 'a@example.com', subject: 'Hi', message: 'Line one\nLine <two>' },
      { RESEND_FROM_EMAIL: 'Portfolio <from@example.com>', CONTACT_TO_EMAIL: 'to@example.com' },
    );
    assert.ok(!('error' in email));
    if ('error' in email) return;
    assert.equal(email.subject, 'Portfolio - Hi');
    assert.match(email.html, /&lt;b&gt;/);
    assert.match(email.html, /Line one<br\/>Line &lt;two&gt;/);
    assert.equal(email.replyTo, 'a@example.com');

    const injected = buildContactEmail(
      { name: 'Ada', email: 'a@example.com', subject: 'Hi', message: 'Long enough message.' },
      { RESEND_FROM_EMAIL: 'bad\r\nfrom@example.com', CONTACT_TO_EMAIL: 'to@example.com' },
    );
    assert.ok('error' in injected);
  });
});

describe('rate limit', () => {
  it('allows the configured number of requests and then blocks', () => {
    const store = new MemoryRateLimitStore();
    const config = { limit: 2, windowMs: 60_000 };
    assert.equal(decideRateLimit(store, 'a', 0, config).allowed, true);
    assert.equal(decideRateLimit(store, 'a', 1, config).allowed, true);
    const blocked = decideRateLimit(store, 'a', 2, config);
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.unavailable, false);
    assert.equal(blocked.retryAfterSeconds, 60);
    assert.equal(decideRateLimit(store, 'b', 2, config).allowed, true);
  });

  it('fails closed when the store cannot answer', () => {
    const store: RateLimitStore = { increment: () => null };
    const decision = decideRateLimit(store, 'a', 0, { limit: 5, windowMs: 1000 });
    assert.equal(decision.allowed, false);
    assert.equal(decision.unavailable, true);
  });
});

describe('client key', () => {
  it('ignores forwarded addresses unless the process is on Vercel', () => {
    const headers = { get: (name: string) => (name === 'x-real-ip' ? '203.0.113.8' : null) };
    assert.equal(rateLimitKey({ headers }, {}), 'unverified-origin');
    const keyed = rateLimitKey({ headers }, { VERCEL: '1' });
    assert.notEqual(keyed, '203.0.113.8');
    assert.match(keyed, /^ip:[a-f0-9]{24}$/);
  });
});

describe('idempotency', () => {
  it('runs a successful attempt once and retries a failed one', async () => {
    const now = 0;
    const cache = createIdempotencyCache<{ success: boolean }>(1000, () => now);
    let calls = 0;
    const work = () => {
      calls += 1;
      return Promise.resolve({ success: calls > 1 });
    };
    const first = await cache.run('k', work, (value) => value.success);
    const second = await cache.run('k', work, (value) => value.success);
    assert.equal(first.success, false);
    assert.equal(second.success, true);
    assert.equal(calls, 2);
    const third = await cache.run('k', work, (value) => value.success);
    assert.equal(third.success, true);
    assert.equal(calls, 2);
  });
});
