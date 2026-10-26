/**
 * Lighthouse batch runner (programmatic API — more reliable on Windows than CLI).
 * Usage: node performance-audit/run-lighthouse.mjs <baseline|after>
 */
import { mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const phase = process.argv[2] === 'after' ? 'after' : 'baseline';
const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3010';
const chromePath =
  process.env.CHROME_PATH ||
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('performance-audit', phase);
mkdirSync(outDir, { recursive: true });

const routes = [
  { name: 'home', path: '/' },
  { name: 'projects', path: '/projects' },
  { name: 'music', path: '/music' },
  { name: 'books', path: '/archive/books' },
  { name: 'research', path: '/archive/research' },
  { name: 'photography', path: '/archive/photography' },
  { name: 'artwork', path: '/archive/artwork' },
];

const formFactors = ['mobile', 'desktop'];

const chromeFlags = [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-extensions',
  '--disable-background-networking',
];

function scoreOf(cat) {
  if (!cat || cat.score == null) return null;
  return Math.round(cat.score * 100);
}

function summarize() {
  const rows = [];
  for (const file of readdirSync(outDir).filter((f) => f.endsWith('.report.json'))) {
    const report = JSON.parse(readFileSync(path.join(outDir, file), 'utf8'));
    const audits = report.audits || {};
    const cats = report.categories || {};
    const transfer = audits['total-byte-weight']?.numericValue;
    const jsTransfer = audits['network-requests']?.details?.items
      ?.filter((i) => i.resourceType === 'Script' || i.mimeType?.includes('javascript'))
      ?.reduce((sum, i) => sum + (i.transferSize || 0), 0);
    rows.push({
      file,
      slug: file.replace('.report.json', ''),
      performance: scoreOf(cats.performance),
      accessibility: scoreOf(cats.accessibility),
      bestPractices: scoreOf(cats['best-practices']),
      seo: scoreOf(cats.seo),
      // legacy alias used by older summaries
      score: scoreOf(cats.performance),
      FCP: audits['first-contentful-paint']?.numericValue ?? null,
      LCP: audits['largest-contentful-paint']?.numericValue ?? null,
      TBT: audits['total-blocking-time']?.numericValue ?? null,
      CLS: audits['cumulative-layout-shift']?.numericValue ?? null,
      SI: audits['speed-index']?.numericValue ?? null,
      TTI: audits['interactive']?.numericValue ?? null,
      INP: audits['interaction-to-next-paint']?.numericValue ?? null,
      TTFB: audits['server-response-time']?.numericValue ?? null,
      transferBytes: transfer ?? null,
      jsTransferBytes: jsTransfer ?? null,
      formFactor: report.configSettings?.formFactor,
      url: report.finalDisplayedUrl || report.requestedUrl,
    });
  }
  const summaryPath = path.join(outDir, 'summary.json');
  writeFileSync(summaryPath, JSON.stringify(rows, null, 2));
  console.log(`Wrote ${summaryPath}`);
  for (const row of rows.sort((a, b) => a.file.localeCompare(b.file))) {
    console.log(
      [
        row.slug,
        `perf=${row.performance}`,
        `a11y=${row.accessibility}`,
        `bp=${row.bestPractices}`,
        `seo=${row.seo}`,
        `FCP=${row.FCP != null ? Math.round(row.FCP) : '-'}`,
        `LCP=${row.LCP != null ? Math.round(row.LCP) : '-'}`,
        `TBT=${row.TBT != null ? Math.round(row.TBT) : '-'}`,
        `CLS=${row.CLS != null ? Number(row.CLS).toFixed(3) : '-'}`,
        `SI=${row.SI != null ? Math.round(row.SI) : '-'}`,
      ].join(' | '),
    );
  }
  return rows;
}

async function runOne(lighthouse, chromeLauncher, slug, url, formFactor) {
  const outBase = path.join(outDir, slug);
  console.log(`=== Lighthouse ${slug} ===`);
  const chrome = await chromeLauncher.launch({ chromePath, chromeFlags });
  try {
    const isMobile = formFactor === 'mobile';
    const flags = {
      port: chrome.port,
      output: ['json', 'html'],
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor,
      screenEmulation: isMobile
        ? {
            mobile: true,
            width: 412,
            height: 823,
            deviceScaleFactor: 1.75,
            disabled: false,
          }
        : {
            mobile: false,
            width: 1350,
            height: 940,
            deviceScaleFactor: 1,
            disabled: false,
          },
      throttlingMethod: 'devtools',
      maxWaitForLoad: 45000,
      disableStorageReset: true,
    };
    if (!isMobile) {
      flags.throttling = {
        rttMs: 40,
        throughputKbps: 10240,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
        cpuSlowdownMultiplier: 1,
      };
    }

    const result = await Promise.race([
      lighthouse(url, flags),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`timeout 180s for ${slug}`)), 180000),
      ),
    ]);

    const report = result.lhr;
    writeFileSync(`${outBase}.report.json`, JSON.stringify(report, null, 2));
    if (result.report) {
      const html = Array.isArray(result.report) ? result.report[1] || result.report[0] : result.report;
      // When output is ['json','html'], report is [jsonString, htmlString]
      const htmlOut = Array.isArray(result.report)
        ? result.report.find((r) => typeof r === 'string' && r.includes('<!DOCTYPE')) || result.report[result.report.length - 1]
        : result.report;
      writeFileSync(`${outBase}.report.html`, htmlOut);
    }
    const perf = scoreOf(report.categories?.performance);
    console.log(`OK ${slug} perf=${perf}`);
    return true;
  } catch (err) {
    console.error(`FAILED ${slug}`, err?.message || err);
    return false;
  } finally {
    try {
      await chrome.kill();
    } catch {
      /* ignore */
    }
  }
}

async function main() {
  const lighthouse = (await import('lighthouse')).default;
  const chromeLauncher = await import('chrome-launcher');

  let ok = 0;
  let fail = 0;
  for (const ff of formFactors) {
    for (const route of routes) {
      const slug = `${route.name}-${ff}`;
      const url = `${base}${route.path}`;
      // Skip if already have a fresh report and SKIP_EXISTING=1
      if (process.env.SKIP_EXISTING === '1' && existsSync(path.join(outDir, `${slug}.report.json`))) {
        console.log(`SKIP existing ${slug}`);
        ok += 1;
        continue;
      }
      if (await runOne(lighthouse, chromeLauncher, slug, url, ff)) ok += 1;
      else fail += 1;
    }
  }

  summarize();
  console.log(`ALL AUDITS DONE ok=${ok} fail=${fail}`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('RUNNER FAIL', err?.message || err);
  process.exit(1);
});
