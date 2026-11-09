import { portfolioAgentSkillMarkdown } from '@/lib/feeds/ard';
import { publicOrigin } from '@/lib/feeds/origin';

export async function GET() {
  const base = await publicOrigin();

  return new Response(portfolioAgentSkillMarkdown(base), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400',
    },
  });
}
