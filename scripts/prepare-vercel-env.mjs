import fs from 'node:fs';

const text = fs.readFileSync('.env.local', 'utf8');
const env = {};

for (const line of text.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const i = trimmed.indexOf('=');
  if (i < 0) continue;
  const key = trimmed.slice(0, i).trim();
  let value = trimmed.slice(i + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

const keys = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'CONTACT_TO_EMAIL',
];

const missing = keys.filter((key) => !env[key]);
if (missing.length) {
  console.error(`Missing keys: ${missing.join(', ')}`);
  process.exit(1);
}

env.NEXT_PUBLIC_SITE_URL = 'https://chiradeep.me';

const payload = [...keys, 'NEXT_PUBLIC_SITE_URL'].map((key) => ({
  key,
  value: env[key],
  type: key.startsWith('NEXT_PUBLIC_') ? 'plain' : 'encrypted',
  target: ['production', 'preview', 'development'],
}));

fs.writeFileSync('.vercel-env-payload.json', JSON.stringify(payload));
console.log(`Prepared ${payload.length} env vars.`);
console.log(payload.map((item) => `${item.key}:${item.type}:${item.value.length}`).join('\n'));
