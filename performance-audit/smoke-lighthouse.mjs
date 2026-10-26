/**
 * Single-route Lighthouse smoke using programmatic API (more reliable on Windows).
 * Usage: node performance-audit/smoke-lighthouse.mjs [url] [outSlug]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const url = process.argv[2] || 'http://127.0.0.1:3010/';
const slug = process.argv[3] || 'home-desktop-smoke';
const outDir = path.resolve('performance-audit', 'baseline');
mkdirSync(outDir, { recursive: true });

const chromePath =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  console.log('SMOKE start', url);
  let lighthouse;
  let chromeLauncher;
  try {
    lighthouse = (await import('lighthouse')).default;
  } catch {
    // Resolve via npx cache is unreliable; try require after ensuring install
    console.error('lighthouse module missing — install with: npm i -D lighthouse chrome-launcher');
    process.exit(2);
  }
  try {
    chromeLauncher = await import('chrome-launcher');
  } catch {
    console.error('chrome-launcher missing');
    process.exit(2);
  }

  const chrome = await chromeLauncher.launch({
    chromePath,
    chromeFlags: [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-background-networking',
    ],
  });
  console.log('Chrome port', chrome.port);

  try {
    const result = await Promise.race([
      lighthouse(url, {
        port: chrome.port,
        output: ['json', 'html'],
        logLevel: 'error',
        onlyCategories: ['performance'],
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        throttlingMethod: 'devtools',
        maxWaitForLoad: 45000,
        disableStorageReset: true,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SMOKE timeout after 180s')), 180000),
      ),
    ]);

    const report = result.lhr;
    const jsonPath = path.join(outDir, `${slug}.report.json`);
    writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    if (result.report) {
      writeFileSync(path.join(outDir, `${slug}.report.html`), Array.isArray(result.report) ? result.report[0] : result.report);
    }

    const score = Math.round((report.categories?.performance?.score ?? 0) * 100);
    const a = report.audits || {};
    console.log('SMOKE OK', {
      score,
      FCP: Math.round(a['first-contentful-paint']?.numericValue ?? 0),
      LCP: Math.round(a['largest-contentful-paint']?.numericValue ?? 0),
      TBT: Math.round(a['total-blocking-time']?.numericValue ?? 0),
      CLS: Number(a['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3),
      SI: Math.round(a['speed-index']?.numericValue ?? 0),
      path: jsonPath,
    });
  } finally {
    await chrome.kill();
  }
}

main().catch((err) => {
  console.error('SMOKE FAIL', err?.message || err);
  process.exit(1);
});
