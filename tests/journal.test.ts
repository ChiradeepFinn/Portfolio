import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { oauthHandoffHtml, oauthHandoffResponse } from '../lib/http/oauth-handoff';
import { allowsMutation, configuredOrigin, requestOrigin } from '../lib/http/origin';
import { mapJournalError } from '../lib/journal/errors';
import { formatJournalDate } from '../lib/journal/format';
import { journalActorKey, journalRateLimit, readJournalRateLimitConfig } from '../lib/journal/rate-limit';
import { journalProvider } from '../lib/journal/provider';
import { capitalizeDisplayName, honeypotTripped, parseJournalPayload } from '../lib/journal/validate';
import { MemoryRateLimitStore } from '../lib/contact/rate-limit';

const valid = {
  displayName: 'Ada Lovelace',
  body: 'A short note left in the margin of the page.',
  rating: 3,
};

describe('journal validation', () => {
  it('accepts a normal note and trims the name', () => {
    const result = parseJournalPayload({ ...valid, displayName: '  Ada   Lovelace  ' });
    assert.equal(result.ok, true);
    if (!result.ok || result.honeypot) return;
    assert.equal(result.value.displayName, 'Ada Lovelace');
  });

  it('capitalizes the first letter of a name', () => {
    assert.equal(capitalizeDisplayName('mina'), 'Mina');
    assert.equal(capitalizeDisplayName('Mina'), 'Mina');
    const result = parseJournalPayload({ ...valid, displayName: 'mina' });
    assert.equal(result.ok, true);
    if (!result.ok || result.honeypot) return;
    assert.equal(result.value.displayName, 'Mina');
  });

  it('rejects a short note, a long name, an email-shaped name, and the site name', () => {
    assert.equal(parseJournalPayload({ ...valid, body: 'too short' }).ok, false);
    assert.equal(parseJournalPayload({ ...valid, displayName: 'a'.repeat(33) }).ok, false);
    assert.equal(parseJournalPayload({ ...valid, displayName: 'ada@example.com' }).ok, false);
    assert.equal(parseJournalPayload({ ...valid, displayName: 'Chiradeep' }).ok, false);
  });

  it('allows one link and rejects a second', () => {
    const one = parseJournalPayload({ ...valid, body: 'See https://example.com/page for the record.' });
    assert.equal(one.ok, true);
    const two = parseJournalPayload({
      ...valid,
      body: 'See https://example.com and https://other.example for more.',
    });
    assert.equal(two.ok, false);
  });

  it('rejects control tricks, repeated noise, and a non-object', () => {
    assert.equal(parseJournalPayload({ ...valid, body: `${'a'.repeat(12)}` + 'a'.repeat(12) }).ok, false);
    assert.equal(parseJournalPayload({ ...valid, displayName: 'Ada\u202E' }).ok, false);
    assert.equal(parseJournalPayload(['nope']).ok, false);
    assert.equal(parseJournalPayload(null).ok, false);
  });

  it('requires a mark from one to five', () => {
    assert.equal(parseJournalPayload({ ...valid, rating: 0 }).ok, false);
    assert.equal(parseJournalPayload({ ...valid, rating: 6 }).ok, false);
    assert.equal(parseJournalPayload({ ...valid, rating: 1.5 }).ok, false);
    const result = parseJournalPayload(valid);
    assert.equal(result.ok, true);
    if (!result.ok || result.honeypot) return;
    assert.equal(result.value.rating, 3);
  });

  it('marks a honeypot without treating it as a note', () => {
    assert.equal(honeypotTripped({ contact_website: 'https://spam.test' }), true);
    const tripped = parseJournalPayload({ ...valid, contact_website: 'https://spam.test' });
    assert.equal(tripped.ok && tripped.honeypot, true);
    assert.equal('value' in tripped, false);
  });
});

describe('journal provider', () => {
  it('accepts google or github from app metadata only', () => {
    assert.equal(journalProvider({ provider: 'google' }), 'google');
    assert.equal(journalProvider({ provider: 'email', providers: ['email', 'github'] }), 'github');
    assert.equal(journalProvider({ provider: 'email', providers: ['email'], user_metadata: { provider: 'github' } }), null);
    assert.equal(journalProvider(null), null);
  });
});

describe('journal errors', () => {
  it('maps known database codes and hides anything else', () => {
    assert.equal(mapJournalError('journal:exists', 'fallback').status, 409);
    assert.equal(mapJournalError('relation guest_notes does not exist', 'fallback').error, 'fallback');
    assert.equal(mapJournalError('journal:exists\nDETAIL: secret', 'fallback').error, 'This account already left its note.');
  });
});

describe('journal origin', () => {
  it('uses a configured https origin and refuses a foreign host', () => {
    assert.equal(configuredOrigin({ NEXT_PUBLIC_SITE_URL: 'https://chiradeep.me/journal' }), 'https://chiradeep.me');
    assert.equal(configuredOrigin({ NEXT_PUBLIC_SITE_URL: 'http://example.com' }), null);
    const request = { headers: new Headers({ host: 'evil.example' }) };
    assert.equal(requestOrigin(request, {}), null);
    assert.equal(requestOrigin({ headers: new Headers({ host: 'localhost:3000' }) }, {}), 'http://localhost:3000');
    assert.equal(
      allowsMutation(
        { headers: new Headers({ origin: 'https://chiradeep.me' }) },
        { NEXT_PUBLIC_SITE_URL: 'https://chiradeep.me' },
      ),
      true,
    );
    assert.equal(
      allowsMutation(
        { headers: new Headers({ origin: 'https://evil.example' }) },
        { NEXT_PUBLIC_SITE_URL: 'https://chiradeep.me' },
      ),
      false,
    );
    assert.equal(allowsMutation({ headers: new Headers() }, { NEXT_PUBLIC_SITE_URL: 'https://chiradeep.me' }), false);
    assert.equal(allowsMutation({ headers: new Headers({ origin: 'http://localhost:3000' }) }, {}), true);
  });
});

describe('journal oauth handoff', () => {
  it('returns a same-document handoff instead of a cross-origin redirect', async () => {
    const url =
      'https://example.supabase.co/auth/v1/authorize?provider=google&redirect_to=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback';
    const html = oauthHandoffHtml(url);
    assert.match(html, /meta http-equiv="refresh"/);
    assert.match(html, /href="https:\/\/example\.supabase\.co\/auth\/v1\/authorize\?provider=google&amp;redirect_to=/);
    assert.equal(html.includes('<script'), false);

    const response = oauthHandoffResponse(url);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
    assert.equal(response.headers.get('refresh'), `0;url=${url}`);
    assert.match(response.headers.get('content-type') ?? '', /text\/html/);
    assert.equal(await response.text(), html);
  });

  it('keeps CSP form-action on self so OAuth must use the handoff', () => {
    const config = readFileSync(new URL('../next.config.ts', import.meta.url), 'utf8');
    assert.match(config, /form-action 'self'/);
    assert.doesNotMatch(config, /form-action 'self' https:/);
  });
});

describe('journal sign-in route', () => {
  const route = readFileSync(new URL('../app/auth/signin/route.ts', import.meta.url), 'utf8');

  it('answers fetch callers with the authorize url and form posts with the handoff', () => {
    assert.match(route, /accept.*application\/json/s);
    assert.match(route, /\{ ok: true, url: data\.url \}/);
    assert.match(route, /oauthHandoffResponse\(data\.url\)/);
  });

  it('reports every refusal as a notice both callers understand', () => {
    assert.match(route, /fail\('closed', 503\)/);
    assert.match(route, /fail\('rate', 429\)/);
    assert.match(route, /journal\?notice=\$\{notice\}/);
  });
});

describe('journal sign-in tray', () => {
  const tray = readFileSync(new URL('../components/journal/JournalSignIn.tsx', import.meta.url), 'utf8');

  it('posts with fetch, shows a pending provider, and navigates itself', () => {
    assert.match(tray, /event\.preventDefault\(\)/);
    assert.match(tray, /Accept: 'application\/json'/);
    assert.match(tray, /window\.location\.assign\(payload\.url\)/);
    assert.match(tray, /Opening/);
    assert.match(tray, /disabled=\{busy\}/);
  });

  it('keeps a native form post so sign-in still works without JavaScript', () => {
    assert.match(tray, /action="\/auth\/signin"\s+method="post"/);
    const fallback = readFileSync(new URL('../components/journal/JournalProviders.tsx', import.meta.url), 'utf8');
    assert.doesNotMatch(fallback, /'use client'/);
    assert.match(fallback, /action="\/auth\/signin" method="post"/);
  });
});

describe('journal rate limit', () => {
  it('falls back on invalid config and hashes the account id', () => {
    assert.deepEqual(readJournalRateLimitConfig({ JOURNAL_RATE_LIMIT_MAX: '0' }), {
      limit: 8,
      windowMs: 600_000,
    });
    const key = journalActorKey('11111111-1111-1111-1111-111111111111');
    assert.equal(key.startsWith('user:'), true);
    assert.equal(key.includes('11111111'), false);

    const store = new MemoryRateLimitStore();
    const config = { limit: 1, windowMs: 60_000 };
    assert.equal(journalRateLimit('a', 0, config, store).allowed, true);
    assert.equal(journalRateLimit('a', 1, config, store).allowed, false);
  });
});

describe('journal date', () => {
  it('formats in Asia/Kolkata', () => {
    assert.equal(formatJournalDate('2026-10-13T20:30:00.000Z'), '14 Oct 2026');
  });
});

describe('journal migration', () => {
  it('enables rls, keeps the author id off the public view, and matches the field limits', () => {
    const sql = readFileSync(new URL('../supabase/migrations/0004_guest_journal.sql', import.meta.url), 'utf8');
    assert.match(sql, /enable row level security/);
    assert.match(sql, /security_invoker = true/);
    assert.match(sql, /security definer/);
    assert.match(sql, /char_length\(body\) between 12 and 600/);
    assert.match(sql, /char_length\(display_name\) between 2 and 32/);
    assert.match(sql, /user_metadata/);
    assert.doesNotMatch(sql, /grant select \(id, body, display_name, created_at, status, author_id\)/i);
    assert.match(sql, /guest_journal/);
    assert.equal(sql.includes('author_id'), true);
    assert.equal(sql.includes('select id, body, display_name, created_at'), true);
  });
});
