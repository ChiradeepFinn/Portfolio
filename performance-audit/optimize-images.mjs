/**
 * Safe media optimization (no animation code changes):
 * - Resize oversized photography JPEGs (max 2200px long edge)
 * - Re-encode mislabeled PNG-as-.jpg artwork to real JPEG
 * - Downscale animated brand GIF to 160px (displayed at 40px; 4x DPR)
 * Backups go to performance-audit/image-backups/
 */
import { mkdirSync, copyFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('.');
const backupRoot = path.join(root, 'performance-audit', 'image-backups');
const log = [];

function backup(rel) {
  const src = path.join(root, rel);
  const dest = path.join(backupRoot, rel);
  mkdirSync(path.dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}

async function optimizePhoto(rel, maxEdge = 2200, quality = 82) {
  const src = path.join(root, rel);
  const before = statSync(src).size;
  const meta = await sharp(src).metadata();
  const long = Math.max(meta.width || 0, meta.height || 0);
  if (long <= maxEdge && before < 400 * 1024) {
    log.push({ file: rel, action: 'skip', reason: 'already reasonable', before });
    return;
  }
  backup(rel);
  const pipeline = sharp(src).rotate();
  if (long > maxEdge) {
    if ((meta.width || 0) >= (meta.height || 0)) pipeline.resize({ width: maxEdge, withoutEnlargement: true });
    else pipeline.resize({ height: maxEdge, withoutEnlargement: true });
  }
  const buf = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer();
  const { writeFileSync: w } = await import('node:fs');
  w(src, buf);
  const after = buf.length;
  log.push({
    file: rel,
    action: 'resize-jpeg',
    before,
    after,
    dims: `${meta.width}x${meta.height}`,
    savedPct: Math.round((1 - after / before) * 100),
  });
}

async function fixArtworkPngAsJpg(rel, quality = 85) {
  const src = path.join(root, rel);
  const before = statSync(src).size;
  const meta = await sharp(src).metadata();
  if (meta.format !== 'png') {
    // Still recompress large "jpg" that are fine
    if (before > 180 * 1024) {
      backup(rel);
      const buf = await sharp(src).jpeg({ quality, mozjpeg: true }).toBuffer();
      writeFileSync(src, buf);
      log.push({
        file: rel,
        action: 'recompress-jpeg',
        before,
        after: buf.length,
        format: meta.format,
        savedPct: Math.round((1 - buf.length / before) * 100),
      });
    } else {
      log.push({ file: rel, action: 'skip', format: meta.format, before });
    }
    return;
  }
  backup(rel);
  const buf = await sharp(src).jpeg({ quality, mozjpeg: true }).toBuffer();
  writeFileSync(src, buf);
  log.push({
    file: rel,
    action: 'png-to-jpeg',
    before,
    after: buf.length,
    dims: `${meta.width}x${meta.height}`,
    savedPct: Math.round((1 - buf.length / before) * 100),
  });
}

async function optimizeBrandGif(rel, width = 160) {
  const src = path.join(root, rel);
  const before = statSync(src).size;
  const meta = await sharp(src, { animated: true }).metadata();
  backup(rel);
  // Keep animation; shrink frames for 40px display (4x = 160)
  const buf = await sharp(src, { animated: true })
    .resize({ width, withoutEnlargement: true })
    .gif({ effort: 7 })
    .toBuffer();
  writeFileSync(src, buf);
  log.push({
    file: rel,
    action: 'gif-resize',
    before,
    after: buf.length,
    pages: meta.pages,
    fromWidth: meta.width,
    toWidth: width,
    savedPct: Math.round((1 - buf.length / before) * 100),
  });
}

async function main() {
  mkdirSync(backupRoot, { recursive: true });

  // Photography: only the two 6000px monsters for sure; also any >2.5MB
  const photoDir = path.join(root, 'public/images/photography');
  for (const name of readdirSync(photoDir)) {
    if (name.startsWith('.')) continue;
    const rel = path.join('public/images/photography', name);
    const full = path.join(root, rel);
    try {
      const st = statSync(full);
      const meta = await sharp(full).metadata();
      const long = Math.max(meta.width || 0, meta.height || 0);
      if (long > 2400 || st.size > 500 * 1024) await optimizePhoto(rel);
      else log.push({ file: rel, action: 'skip', before: st.size, dims: `${meta.width}x${meta.height}` });
    } catch (e) {
      log.push({ file: rel, action: 'error', error: e.message });
    }
  }

  const artDir = path.join(root, 'public/images/artwork');
  for (const name of readdirSync(artDir)) {
    if (name.startsWith('.')) continue;
    const rel = path.join('public/images/artwork', name);
    try {
      await fixArtworkPngAsJpg(rel);
    } catch (e) {
      log.push({ file: rel, action: 'error', error: e.message });
    }
  }

  try {
    await optimizeBrandGif('public/brand/1000054925.gif', 160);
  } catch (e) {
    log.push({ file: 'public/brand/1000054925.gif', action: 'error', error: e.message });
  }

  // Still logo downscale if huge for 40–64px use
  try {
    const logoRel = 'public/brand/logo.jpg';
    const meta = await sharp(path.join(root, logoRel)).metadata();
    if ((meta.width || 0) > 256) {
      backup(logoRel);
      const buf = await sharp(path.join(root, logoRel))
        .resize({ width: 256, withoutEnlargement: true })
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer();
      const before = statSync(path.join(root, logoRel)).size;
      writeFileSync(path.join(root, logoRel), buf);
      log.push({
        file: logoRel,
        action: 'logo-resize',
        before,
        after: buf.length,
        dims: `${meta.width}x${meta.height}`,
        savedPct: Math.round((1 - buf.length / before) * 100),
      });
    }
  } catch (e) {
    log.push({ file: 'public/brand/logo.jpg', action: 'error', error: e.message });
  }

  const summaryPath = path.join(root, 'performance-audit', 'image-optimization-log.json');
  writeFileSync(summaryPath, JSON.stringify(log, null, 2));
  const changed = log.filter((x) => x.action && !['skip', 'error'].includes(x.action));
  console.log(`Optimized ${changed.length} files. Log: ${summaryPath}`);
  for (const row of changed) {
    console.log(
      `${row.action} ${row.file}: ${Math.round(row.before / 1024)}KB → ${Math.round(row.after / 1024)}KB (−${row.savedPct}%)`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
