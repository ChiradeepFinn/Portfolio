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
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${safe}"><title>Continuing sign-in</title></head><body><p><a href="${safe}">Continue</a></p></body></html>`;
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
