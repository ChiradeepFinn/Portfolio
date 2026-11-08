/**
 * Hand the browser to an external OAuth authorize URL without a 3xx redirect.
 *
 * Chrome enforces CSP `form-action` across the whole redirect chain after a
 * form POST. A 303 to Supabase (then Google/GitHub) is blocked when the policy
 * is `form-action 'self'`. A 200 document with Refresh / meta refresh / link is
 * a normal navigation, so the same-origin form POST stays allowed and the
 * provider redirect does not need to be listed in form-action.
 */
export function oauthHandoffHtml(authorizeUrl: string): string {
  const safe = escapeHtmlAttr(authorizeUrl);
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=${safe}"><title>Continuing sign-in</title><style>
html,body{margin:0;min-height:100%;background:#000;color:#f4f4f4;font-family:Georgia,'Times New Roman',serif}
body{display:grid;place-items:center;padding:2.5rem 1.25rem;text-align:center}
p{margin:0;font-size:clamp(1.35rem,3vw,1.85rem);letter-spacing:-0.02em}
.hint{margin-top:0.85rem;font-family:ui-sans-serif,system-ui,sans-serif;font-size:0.85rem;line-height:1.5;color:#8d8d97}
a{color:inherit}
.track{margin:1.75rem auto 0;height:1px;width:10rem;max-width:42vw;overflow:hidden;background:rgba(255,255,255,0.08)}
.bar{display:block;height:100%;width:42%;background:#f4f4f4;opacity:0.55;transform:translateX(-120%)}
@media (prefers-reduced-motion:no-preference){.bar{animation:sweep 1.45s cubic-bezier(0.16,1,0.3,1) infinite}}
@media (prefers-reduced-motion:reduce){.bar{width:100%;opacity:0.35;transform:none}}
@keyframes sweep{from{transform:translateX(-120%)}to{transform:translateX(280%)}}
</style></head><body><div><p>Continuing sign-in.</p><p class="hint">Taking you to the provider. <a href="${safe}">Continue</a> if nothing moves.</p><div class="track" aria-hidden="true"><span class="bar"></span></div></div></body></html>`;
}

export function oauthHandoffResponse(authorizeUrl: string): Response {
  return new Response(oauthHandoffHtml(authorizeUrl), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      Refresh: `0;url=${authorizeUrl}`,
    },
  });
}

function escapeHtmlAttr(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
