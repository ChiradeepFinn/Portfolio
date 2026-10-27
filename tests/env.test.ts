import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { parseEnv } from '../lib/env';

describe('environment', () => {
  it('treats an empty or whitespace value as unset', () => {
    const { env, problems } = parseEnv({
      RESEND_API_KEY: '',
      CONTACT_TO_EMAIL: '   ',
    });

    assert.equal(env.RESEND_API_KEY, undefined);
    assert.equal(env.CONTACT_TO_EMAIL, undefined);
    assert.deepEqual(problems, []);
  });

  it('trims a value that was set', () => {
    const { env } = parseEnv({ NEXT_PUBLIC_SITE_URL: ' https://chiradeep.me ' });
    assert.equal(env.NEXT_PUBLIC_SITE_URL, 'https://chiradeep.me');
  });

  it('accepts a missing environment', () => {
    const { env, problems } = parseEnv({});
    assert.deepEqual(problems, []);
    assert.equal(env.NEXT_PUBLIC_SUPABASE_URL, undefined);
  });

  it('reads an optional positive integer and refuses anything else', () => {
    assert.equal(parseEnv({ CONTACT_RATE_LIMIT_MAX: '5' }).env.CONTACT_RATE_LIMIT_MAX, 5);
    assert.equal(parseEnv({ CONTACT_RATE_LIMIT_MAX: 'five' }).problems.length, 1);
    assert.equal(parseEnv({ CONTACT_RATE_LIMIT_MAX: '0' }).problems.length, 1);
    assert.equal(parseEnv({ CONTACT_RATE_LIMIT_MAX: '-3' }).problems.length, 1);
  });

  it('accepts only a discord webhook for the discord webhook', () => {
    const good = parseEnv({ DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/1/abc' });
    assert.equal(good.env.DISCORD_WEBHOOK_URL, 'https://discord.com/api/webhooks/1/abc');
    assert.deepEqual(good.problems, []);

    assert.equal(parseEnv({ DISCORD_WEBHOOK_URL: 'https://example.com/hook' }).problems.length, 1);
    assert.equal(parseEnv({ DISCORD_WEBHOOK_URL: 'http://discord.com/api/webhooks/1/abc' }).problems.length, 1);
  });

  it('drops one bad value and keeps the rest', () => {
    const { env, problems } = parseEnv({
      NEXT_PUBLIC_SITE_URL: 'not a url',
      RESEND_API_KEY: 're_live_key',
    });

    assert.equal(problems.length, 1);
    assert.match(problems[0], /NEXT_PUBLIC_SITE_URL/);
    assert.equal(env.NEXT_PUBLIC_SITE_URL, undefined);
    assert.equal(env.RESEND_API_KEY, 're_live_key');
  });

  it('refuses a secret with whitespace in it', () => {
    assert.equal(parseEnv({ SUPABASE_SERVICE_ROLE_KEY: 'two words' }).problems.length, 1);
  });
});
