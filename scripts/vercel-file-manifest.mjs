/**
 * Build a Vercel deployment file list from .vercel-upload.
 * Outputs JSON: [{ file, sha, size }] for create_deployment UploadedFile refs,
 * and writes per-file .b64 only when --encode is passed (large).
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.vercel-upload');
const outManifest = path.resolve('scripts/.vercel-file-manifest.json');

function walk(dir, base = '') {
  const entries = [];
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const rel = path.posix.join(base, name.replaceAll('\\', '/'));
    const st = fs.statSync(abs);
    if (st.isDirectory()) entries.push(...walk(abs, rel));
    else {
      const buf = fs.readFileSync(abs);
      const sha = crypto.createHash('sha1').update(buf).digest('hex');
      entries.push({ file: rel, sha, size: buf.length, abs });
    }
  }
  return entries;
}

const files = walk(root);
fs.writeFileSync(
  outManifest,
  JSON.stringify(
    files.map(({ file, sha, size }) => ({ file, sha, size })),
    null,
    2,
  ),
);
console.log(`files=${files.length} totalBytes=${files.reduce((n, f) => n + f.size, 0)}`);
console.log(`manifest=${outManifest}`);
