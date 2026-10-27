import { NextResponse, type NextRequest } from 'next/server';
import { prefersMarkdown } from '@/lib/http/accept';
import {
  agentNotFoundMarkdown,
  isKnownPublicPath,
  markdownNegotiationDestination,
} from '@/lib/http/agent-markdown';
import { markdownTwinDestination } from '@/lib/http/markdown-twins';
import { configuredOrigin } from '@/lib/http/origin';
import { updateSession } from '@/lib/supabase/proxy';

function withAcceptVary(response: NextResponse): NextResponse {
  const existing = response.headers.get('Vary');
  if (!existing) {
    response.headers.set('Vary', 'Accept');
  } else if (!/\bAccept\b/i.test(existing)) {
    response.headers.set('Vary', `${existing}, Accept`);
  }
  return response;
}

function rewriteTo(request: NextRequest, pathname: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return withAcceptVary(NextResponse.rewrite(url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accept = request.headers.get('accept');
  const wantsMarkdown = prefersMarkdown(accept);

  // Explicit `.md` twins (unchanged).
  const twinFile = markdownTwinDestination(pathname);
  if (twinFile) return rewriteTo(request, twinFile);

  // Content negotiation: HTML twin paths answer as Markdown when asked.
  if (wantsMarkdown) {
    const negotiated = markdownNegotiationDestination(pathname);
    if (negotiated) return rewriteTo(request, negotiated);

    if (!isKnownPublicPath(pathname)) {
      const base = configuredOrigin() ?? request.nextUrl.origin;
      return new NextResponse(agentNotFoundMarkdown(base, pathname), {
        status: 404,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          Vary: 'Accept',
          'X-Robots-Tag': 'noindex',
          'Cache-Control': 'no-store',
        },
      });
    }
  }

  if (
    pathname === '/journal' ||
    pathname.startsWith('/journal/') ||
    pathname.startsWith('/auth/') ||
    pathname === '/api/journal'
  ) {
    return updateSession(request);
  }

  // Twin-capable HTML pages advertise Accept variance even when serving HTML.
  if (markdownNegotiationDestination(pathname)) {
    return withAcceptVary(NextResponse.next({ request }));
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    /*
     * Run on document routes. Skip Next internals and common static assets so
     * Accept negotiation does not pay a tax on every image request.
     */
    '/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|mp4|webm|txt|xml)$).*)',
  ],
};
