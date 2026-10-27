import { NextResponse, type NextRequest } from 'next/server';
import { markdownTwinDestination } from '@/lib/http/markdown-twins';
import { updateSession } from '@/lib/supabase/proxy';

export async function proxy(request: NextRequest) {
  const destination = markdownTwinDestination(request.nextUrl.pathname);
  if (destination) {
    const url = request.nextUrl.clone();
    url.pathname = destination;
    return NextResponse.rewrite(url);
  }

  const pathname = request.nextUrl.pathname;
  if (pathname === '/journal' || pathname.startsWith('/journal/') || pathname.startsWith('/auth/') || pathname === '/api/journal') {
    return updateSession(request);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    // Markdown twins only — HTML pages must not enter this path.
    // Escape `.` so path-to-regexp treats the suffix as literal.
    '/index.md',
    '/projects/:slug\\.md',
    '/philosophy/:slug\\.md',
    '/archive/research/:slug\\.md',
    // Journal auth session refresh (unchanged scope).
    '/journal',
    '/journal/:path*',
    '/auth/:path*',
    '/api/journal',
  ],
};
