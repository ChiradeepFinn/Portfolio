import { buildArdManifest } from '@/lib/feeds/ard';
import { publicOrigin } from '@/lib/feeds/origin';

export async function GET() {
  const base = await publicOrigin();
  const body = JSON.stringify(buildArdManifest(base), null, 2);

  return new Response(body, {
    headers: {
      'Content-Type': 'application/ard+json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400',
    },
  });
}
