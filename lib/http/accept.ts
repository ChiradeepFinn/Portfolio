/**
 * `Accept` helpers for Markdown content negotiation.
 *
 * Agents that send `Accept: text/markdown` should receive the twin (or a
 * Markdown 404), not HTML. Quality values decide the preference when both
 * `text/markdown` and `text/html` are listed. A bare star-slash-star Accept
 * never counts as a Markdown preference - that would steal normal browser
 * navigations.
 */

function parseParts(accept: string): readonly { type: string; q: number }[] {
  return accept
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [rawType, ...params] = part.split(';').map((piece) => piece.trim());
      let q = 1;
      for (const param of params) {
        const match = /^q=(0(\.\d+)?|1(\.0+)?)$/i.exec(param);
        if (match) q = Number(match[1]);
      }
      return { type: rawType.toLowerCase(), q };
    });
}

function qualityExact(accept: string, mime: string): number | null {
  let best: number | null = null;
  for (const part of parseParts(accept)) {
    if (part.type !== mime) continue;
    if (best === null || part.q > best) best = part.q;
  }
  return best;
}

function qualityHtml(accept: string): number | null {
  let best: number | null = null;
  for (const part of parseParts(accept)) {
    const matches = part.type === 'text/html' || part.type === 'text/*' || part.type === '*/*';
    if (!matches) continue;
    // Exact text/html beats wildcards when qualities tie.
    const score = part.q + (part.type === 'text/html' ? 0.002 : part.type === 'text/*' ? 0.001 : 0);
    if (best === null || score > best) best = score;
  }
  return best;
}

/** True when the client explicitly prefers Markdown over HTML. */
export function prefersMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false;
  const markdown = qualityExact(acceptHeader, 'text/markdown');
  if (markdown === null) return false;
  const html = qualityHtml(acceptHeader);
  if (html === null) return true;
  return markdown + 0.002 >= html;
}
