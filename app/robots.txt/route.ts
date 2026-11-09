import { robotsTxtBody } from '@/lib/feeds/robots-txt';
import { configuredOrigin } from '@/lib/http/origin';

export function GET() {
  const site = configuredOrigin() ?? 'http://localhost:3000';
  return new Response(robotsTxtBody(site), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400',
    },
  });
}
