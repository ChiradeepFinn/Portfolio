# Lighthouse limitation (this environment)

Lighthouse CLI could **not** complete against the local production server on this Windows agent host.

## What was tried

1. `npx lighthouse@12.8.2` via PowerShell `@args` — failed immediately (`Please provide a url`; argv mangling).
2. Node `cmd /c` batch runner pinning 12.8.2 — hung with no report.
3. Hard-timeout smoke (210s) against `http://127.0.0.1:3011/` with Lighthouse 13.x:
   - Warmup `Invoke-WebRequest` → **200 OK**
   - Lighthouse headless → **TIMEOUT**, no `.report.json` / `.report.html`
4. Repeat smoke → same pattern (WARMUP 200 → SMOKE TIMEOUT 210s).

**No Performance scores or CWV numbers were recorded.** Do not invent them.

## Exact commands to run locally (your machine)

With a production server already serving (example port 3011):

```bash
# Terminal A
set NEXT_DIST_DIR=.next-serve-audit
set NODE_ENV=production
npm run build
npm run start -- -p 3011
```

```bash
# Terminal B — mobile homepage
npx lighthouse "http://127.0.0.1:3011/" ^
  --only-categories=performance ^
  --form-factor=mobile ^
  --screenEmulation.mobile=true ^
  --output=json --output=html ^
  --output-path=performance-audit/baseline/home-mobile ^
  --chrome-flags="--headless=new --disable-gpu --no-sandbox" ^
  --max-wait-for-load=45000 ^
  --disable-storage-reset
```

```bash
# Desktop homepage
npx lighthouse "http://127.0.0.1:3011/" ^
  --only-categories=performance ^
  --form-factor=desktop ^
  --screenEmulation.mobile=false ^
  --screenEmulation.width=1350 --screenEmulation.height=940 ^
  --output=json --output=html ^
  --output-path=performance-audit/baseline/home-desktop ^
  --chrome-flags="--headless=new --disable-gpu --no-sandbox" ^
  --max-wait-for-load=45000 ^
  --disable-storage-reset
```

Repeat for `/projects`, `/music`, `/archive/books`, `/archive/research`, `/archive/photography`, `/archive/artwork`.

Or use Chrome DevTools → Lighthouse (Performance) on the same URLs after `npm run build` + `npm start`.
