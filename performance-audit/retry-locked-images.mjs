/**
 * Retry EPERM-locked media via optimize-to-temp then replace.
 * Does not touch animation/React code.
 */
import {
  mkdirSync,
  copyFileSync,
  writeFileSync,
  readFileSync,
  renameSync,
  unlinkSync,
  existsSync,
  statSync,
} from 'node:fs';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';

const root = path.resolve('.');
const backupRoot = path.join(root, 'performance-audit', 'image-backups');
const logPath = path.join(root, 'performance-audit', 'image-optimization-log.json');
const results = [];

function backup(rel) {
  const src = path.join(root, rel);
  const dest = path.join(backupRoot, rel);
  mkdirSync(path.dirname(dest), { recursive: true });
  if (!existsSync(dest)) copyFileSync(src, dest);
}

function atomicReplace(destPath, buf) {
  const dir = path.dirname(destPath);
  const tmp = path.join(dir, `.opt-${randomBytes(6).toString('hex')}.tmp`);
  const bak = path.join(dir, `.opt-old-${randomBytes(6).toString('hex')}.bak`);
  writeFileSync(tmp, buf);
  try {
    // Prefer rename dance: move locked file aside, then put new one in place
    try {
      renameSync(destPath, bak);
    } catch {
      // If rename fails (locked), try direct overwrite
      try {
        writeFileSync(destPath, buf);
        unlinkSync(tmp);
        return 'direct-write';
      } catch (e2) {
        unlinkSync(tmp);
        throw e2;
      }
    }
    try {
      renameSync(tmp, destPath);
    } catch {
      copyFileSync(tmp, destPath);
      unlinkSync(tmp);
    }
    try {
      unlinkSync(bak);
    } catch {
      // leave .bak if delete blocked; caller can clean later
    }
    return 'rename-replace';
  } catch (e) {
    // Fallback: write outside public and report path for manual swap
    const fallback = path.join(tmpdir(), `portfolio-opt-${path.basename(destPath)}`);
    writeFileSync(fallback, buf);
    if (existsSync(tmp)) {
      try {
        unlinkSync(tmp);
      } catch {
        /* ignore */
      }
    }
    // restore original if we moved it
    if (existsSync(bak) && !existsSync(destPath)) {
      try {
        renameSync(bak, destPath);
      } catch {
        /* ignore */
      }
    }
    const err = new Error(`${e.message} (optimized buffer saved to ${fallback})`);
    err.fallback = fallback;
    throw err;
  }
}

async function optimizePhoto(rel, maxEdge = 2200, quality = 82) {
  const src = path.join(root, rel);
  const before = statSync(src).size;
  const meta = await sharp(src).metadata();
  const long = Math.max(meta.width || 0, meta.height || 0);
  if (long <= maxEdge && before < 400 * 1024) {
    results.push({ file: rel, action: 'skip', reason: 'already reasonable', before });
    return;
  }
  backup(rel);
  const pipeline = sharp(src).rotate();
  if (long > maxEdge) {
    if ((meta.width || 0) >= (meta.height || 0))
      pipeline.resize({ width: maxEdge, withoutEnlargement: true });
    else pipeline.resize({ height: maxEdge, withoutEnlargement: true });
  }
  const buf = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
  const method = atomicReplace(src, buf);
  results.push({
    file: rel,
    action: 'resize-jpeg',
    before,
    after: buf.length,
    dims: `${meta.width}x${meta.height}`,
    savedPct: Math.round((1 - buf.length / before) * 100),
    method,
  });
}

async function optimizeBrandGif(rel, width = 160) {
  const src = path.join(root, rel);
  const before = statSync(src).size;
  const meta = await sharp(src, { animated: true }).metadata();
  if ((meta.width || 0) <= width && before < 200 * 1024) {
    results.push({ file: rel, action: 'skip', reason: 'gif already small', before, fromWidth: meta.width });
    return;
  }
  backup(rel);
  const buf = await sharp(src, { animated: true })
    .resize({ width, withoutEnlargement: true })
    .gif({ effort: 7 })
    .toBuffer();
  const method = atomicReplace(src, buf);
  results.push({
    file: rel,
    action: 'gif-resize',
    before,
    after: buf.length,
    pages: meta.pages,
    fromWidth: meta.width,
    toWidth: width,
    savedPct: Math.round((1 - buf.length / before) * 100),
    method,
  });
}

async function optimizeLogo(rel, maxW = 256) {
  const src = path.join(root, rel);
  const before = statSync(src).size;
  const meta = await sharp(src).metadata();
  if ((meta.width || 0) <= maxW) {
    results.push({ file: rel, action: 'skip', reason: 'logo width ok', before, dims: `${meta.width}x${meta.height}` });
    return;
  }
  backup(rel);
  const buf = await sharp(src)
    .resize({ width: maxW, withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  const method = atomicReplace(src, buf);
  results.push({
    file: rel,
    action: 'logo-resize',
    before,
    after: buf.length,
    dims: `${meta.width}x${meta.height}`,
    savedPct: Math.round((1 - buf.length / before) * 100),
    method,
  });
}

async function runOne(label, fn) {
  try {
    await fn();
    console.log('OK', label);
  } catch (e) {
    console.error('FAIL', label, e.message);
    results.push({ file: label, action: 'error', error: e.message, fallback: e.fallback });
  }
}

async function main() {
  mkdirSync(backupRoot, { recursive: true });

  await runOne('public/images/photography/IMG_8556.JPG', () =>
    optimizePhoto('public/images/photography/IMG_8556.JPG'),
  );
  await runOne('public/images/photography/IMG_9659[1].JPG', () =>
    optimizePhoto('public/images/photography/IMG_9659[1].JPG'),
  );
  await runOne('public/brand/1000054925.gif', () => optimizeBrandGif('public/brand/1000054925.gif', 160));
  await runOne('public/brand/logo.jpg', () => optimizeLogo('public/brand/logo.jpg', 256));

  // Merge into existing log: replace entries for these files
  let prev = [];
  try {
    prev = JSON.parse(readFileSync(logPath, 'utf8'));
  } catch {
    prev = [];
  }
  const keys = new Set(results.map((r) => r.file.replace(/\\/g, '/')));
  const merged = prev.filter((r) => !keys.has(String(r.file).replace(/\\/g, '/')));
  for (const r of results) merged.push(r);
  writeFileSync(logPath, JSON.stringify(merged, null, 2));

  const changed = results.filter((x) => x.action && !['skip', 'error'].includes(x.action));
  const saved = changed.reduce((s, x) => s + (x.before - x.after), 0);
  console.log(JSON.stringify({ changed: changed.length, savedBytes: saved, results }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
