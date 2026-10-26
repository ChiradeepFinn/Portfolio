import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/ui/Reveal';
import { StudyDevices } from '@/components/projects/StudyDevices';
import { getStudyScreens } from '@/lib/data/study-screens';

type TitleTag = 'h1' | 'h2' | 'h3';

const fields: Record<string, string> = {
  sidequest:
    'radial-gradient(72% 68% at 0% 0%, rgba(255,255,255,0.42), transparent 44%), radial-gradient(78% 72% at 100% 100%, rgba(74,8,32,0.78), transparent 54%), linear-gradient(128deg, #ffd6e8 0%, #ff6ea6 18%, #ef2d78 44%, #9d174d 70%, #4c1028 100%)',
  synesthesia:
    'radial-gradient(72% 68% at 0% 0%, rgba(255,255,255,0.4), transparent 44%), radial-gradient(78% 72% at 100% 100%, rgba(36,12,78,0.78), transparent 54%), linear-gradient(128deg, #ddd6fe 0%, #a78bfa 18%, #7c3aed 44%, #5b21b6 70%, #2e1065 100%)',
  framework:
    'radial-gradient(72% 68% at 0% 0%, rgba(255,255,255,0.4), transparent 44%), radial-gradient(78% 72% at 100% 100%, rgba(68,22,6,0.76), transparent 54%), linear-gradient(128deg, #fde0c4 0%, #f0a05a 18%, #d46a1e 46%, #9a3412 72%, #431407 100%)',
  path: 'radial-gradient(72% 68% at 0% 0%, rgba(255,255,255,0.4), transparent 44%), radial-gradient(78% 72% at 100% 100%, rgba(12,24,68,0.78), transparent 54%), linear-gradient(128deg, #dbeafe 0%, #60a5fa 18%, #2563eb 46%, #1e3a8a 72%, #172554 100%)',
  stem: 'radial-gradient(72% 68% at 0% 0%, rgba(255,255,255,0.32), transparent 44%), radial-gradient(78% 72% at 100% 100%, rgba(8,28,24,0.78), transparent 54%), linear-gradient(128deg, #d5e4de 0%, #5f8f84 18%, #2f5e54 46%, #16332e 72%, #0c1c19 100%)',
};

/** The lightest stop of each study card, so the mark reads as that field. */
const sparkColor: Record<string, string> = {
  sidequest: 'text-[#ff5c98]',
  synesthesia: 'text-[#a78bfa]',
  framework: 'text-[#f0a05a]',
  path: 'text-[#60a5fa]',
  stem: 'text-[#5f8f84]',
};

/**
 * The study block: a colored card with the idea and a product frame, and a
 * column that states the mechanism, four constraints, and the stack.
 */
export function ProjectDetail({
  project,
  linked = true,
  titleAs = 'h3',
  facing = 'card',
  timeline = false,
}: {
  readonly project: Project;
  readonly linked?: boolean;
  readonly titleAs?: TitleTag;
  /**
   * `card` leads with the study frame. `copy` leads with the mechanism,
   * so a timeline can trade the two sides without restacking the study.
   */
  readonly facing?: 'card' | 'copy';
  /** Equal columns with a center gutter, so a spine can run between them. */
  readonly timeline?: boolean;
}) {
  const Title = titleAs;
  const copyLeads = facing === 'copy';

  return (
    <article
      className={cn(
        'grid items-start gap-8',
        timeline
          ? 'lg:grid-cols-2 lg:gap-x-28 xl:gap-x-36'
          : cn(
              'lg:gap-x-14 xl:gap-x-16',
              copyLeads
                ? 'lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]'
                : 'lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]',
            ),
      )}
    >
      {linked ? (
        <Link
          href={`/projects/${project.slug}`}
          className={cn(
            'group relative block rounded-[1.65rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue',
            copyLeads && 'lg:order-2',
          )}
        >
          <StudyCard project={project} linked />
          {timeline ? null : <CardMark side={copyLeads ? 'start' : 'end'} />}
        </Link>
      ) : (
        <div className={cn('relative', copyLeads && 'lg:order-2')}>
          <StudyCard project={project} linked={false} />
          {timeline ? null : <CardMark side={copyLeads ? 'start' : 'end'} />}
        </div>
      )}

      <div className={cn('lg:pt-1', copyLeads && 'lg:order-1')}>
        <Reveal>
          <Title className="display text-[clamp(2.05rem,3.3vw,2.85rem)] text-foreground italic">
            {linked ? (
              <Link href={`/projects/${project.slug}`} className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue">
                <TitleText title={project.title} marked={timeline} />
              </Link>
            ) : (
              <TitleText title={project.title} marked={timeline} />
            )}
          </Title>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-5 max-w-[34rem] text-[0.98rem] leading-[1.65] text-muted">{project.summary}</p>
        </Reveal>

        {project.highlights.length > 0 && (
          <Reveal delay={0.16}>
            <ul className="mt-7 grid max-w-[34rem] gap-3.5">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-[0.95rem] leading-[1.55] text-foreground/90">
                  <Spark slug={project.slug} />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {project.stack.length > 0 && (
          <Reveal delay={0.24}>
            <ul className="mt-8 flex max-w-[36rem] flex-wrap gap-2">
              {project.stack.map((item) => (
                <li key={item}>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border-strong bg-chrome px-2.5 py-[0.4rem] text-[0.68rem] font-medium tracking-[0.11em] text-foreground uppercase">
                    <StackIcon label={item} />
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </article>
  );
}

/** The colored study card on its own, used as the case-study hero. */
export function ProjectHero({ project }: { readonly project: Project }) {
  return <StudyCard project={project} linked={false} />;
}

function StudyCard({ project, linked }: { readonly project: Project; readonly linked: boolean }) {
  const field = fields[project.slug] ?? fields.sidequest;

  return (
    <div
      className={cn(
        // overflow-hidden keeps Safari/Android chrome inside the rounded shell
        'flex h-full flex-col overflow-hidden rounded-[1.65rem] border border-black/40 bg-[length:280%_280%] bg-[position:0%_0%] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-7',
        linked &&
          'transition-[background-position,box-shadow] duration-700 ease-cinematic hover:bg-[position:100%_100%] hover:shadow-[0_32px_72px_rgba(0,0,0,0.4)]',
      )}
      style={{ backgroundImage: field }}
    >
      <div className="flex items-start justify-between gap-5">
        <p className="max-w-[34rem] font-display text-[clamp(1.45rem,2.1vw,1.95rem)] leading-[1.18] font-normal tracking-[-0.02em] text-white">
          {project.hook}
        </p>
        {linked ? (
          <ArrowRight
            size={22}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-1 shrink-0 text-white transition-transform duration-300 ease-cinematic group-hover:translate-x-1"
          />
        ) : null}
      </div>
      {/* Gap under hook ≈ ref phoneTop (~26% of card) */}
      <div className="mt-5 sm:mt-6">
        <Study project={project} lift={linked} />
      </div>
    </div>
  );
}

function TitleText({ title, marked }: { readonly title: string; readonly marked: boolean }) {
  return (
    <>
      {title}
      {marked ? (
        <span className="ml-2.5 font-sans text-[0.72em] font-normal text-muted-2 not-italic">-</span>
      ) : null}
    </>
  );
}

/**
 * The title's dash, moved into the gutter on the card's inner edge and held
 * on the headline's line. It follows the card when the columns trade sides.
 */
function CardMark({ side }: { readonly side: 'start' | 'end' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute top-[1.15rem] hidden font-sans text-[clamp(1.48rem,2.38vw,2.05rem)] leading-none font-normal text-muted-2 lg:block',
        side === 'end'
          ? 'left-full translate-x-[calc(1.75rem-50%)] xl:translate-x-[calc(2rem-50%)]'
          : 'right-full -translate-x-[calc(1.75rem-50%)] xl:-translate-x-[calc(2rem-50%)]',
      )}
    >
      -
    </span>
  );
}

function Spark({ slug }: { readonly slug: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn('mt-[0.28rem] h-3.5 w-3.5 shrink-0', sparkColor[slug] ?? sparkColor.sidequest)}
    >
      <path fill="currentColor" d="M8 0.6 9.15 6.05 14.6 8 9.15 9.95 8 15.4 6.85 9.95 1.4 8 6.85 6.05Z" />
    </svg>
  );
}

/** Brand ink for each tool. The label stays neutral; only the mark is colored. */
const stackIconColor: Record<string, string> = {
  'next.js': 'text-foreground',
  react: 'text-[#61dafb]',
  'react native': 'text-[#61dafb]',
  typescript: 'text-[#3178c6]',
  'tailwind css': 'text-[#38bdf8]',
  supabase: 'text-[#3ecf8e]',
  postgresql: 'text-[#6c9bd2]',
  ai: 'text-[#8b6cf6]',
  motion: 'text-[#f472b6]',
  expo: 'text-[#a78bfa]',
  'generative media': 'text-[#fb7185]',
  'computer vision': 'text-[#2dd4bf]',
  'graph data': 'text-[#f5b942]',
  'web audio': 'text-[#4ade80]',
  resend: 'text-foreground',
};

export function StackIcon({ label }: { readonly label: string }) {
  const key = label.toLowerCase();
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={cn('h-3.5 w-3.5 shrink-0', stackIconColor[key] ?? 'text-foreground')}
    >
      {icon(key)}
    </svg>
  );
}

function icon(key: string): ReactNode {
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2 } as const;

  if (key === 'next.js') {
    return <path fill="currentColor" d="M3 2.5h3.1L9.2 9V2.5H13v11h-3.1L6.8 6.6v6.9H3z" />;
  }
  if (key === 'react') {
    return (
      <>
        <circle cx="8" cy="8" r="1.35" fill="currentColor" />
        <ellipse cx="8" cy="8" rx="6.2" ry="2.35" {...stroke} />
        <ellipse cx="8" cy="8" rx="6.2" ry="2.35" {...stroke} transform="rotate(60 8 8)" />
        <ellipse cx="8" cy="8" rx="6.2" ry="2.35" {...stroke} transform="rotate(120 8 8)" />
      </>
    );
  }
  if (key === 'react native') {
    return (
      <>
        <rect x="4.2" y="1.6" width="7.6" height="12.8" rx="1.6" {...stroke} />
        <path {...stroke} strokeLinecap="round" d="M7 12.6h2" />
      </>
    );
  }
  if (key === 'typescript') {
    return (
      <>
        <rect x="1.6" y="1.6" width="12.8" height="12.8" rx="2" {...stroke} />
        <path fill="currentColor" d="M4.2 6.2h3.1V7.4H6.4v4.2H5.1V7.4H4.2zm4 0h3.6v1.2h-1.2v3H9.4v-3H8.2z" />
      </>
    );
  }
  if (key === 'tailwind css') {
    return (
      <path
        {...stroke}
        strokeLinecap="round"
        d="M2 10.2c1.6-2.8 2.8-2.8 4.4 0s2.8 2.8 4.4 0 2.8-2.8 4.2 0"
      />
    );
  }
  if (key === 'supabase') {
    return <path fill="currentColor" d="M8.8 1.5 3.2 9.1h4.2L6.6 14.5 13 6.4H8.6z" />;
  }
  if (key === 'postgresql') {
    return (
      <>
        <ellipse cx="8" cy="4" rx="4.6" ry="1.7" {...stroke} />
        <path {...stroke} d="M3.4 4v7.2c0 1 2 1.8 4.6 1.8s4.6-.8 4.6-1.8V4" />
      </>
    );
  }
  if (key === 'ai') {
    return <path fill="currentColor" d="M8 1.2 9 6.1 13.8 8 9 9.9 8 14.8 7 9.9 2.2 8 7 6.1Z" />;
  }
  if (key === 'motion') {
    return (
      <path
        {...stroke}
        strokeLinecap="round"
        d="M2.5 5h7M2.5 8h11M2.5 11h8"
      />
    );
  }
  if (key === 'expo') {
    return (
      <path
        {...stroke}
        strokeLinecap="round"
        d="M5.5 3.5H3.5v2.5M10.5 3.5h2v2.5M5.5 12.5H3.5v-2.5M10.5 12.5h2v-2.5"
      />
    );
  }
  if (key === 'generative media') {
    return (
      <>
        <rect x="2" y="3" width="7.5" height="7.5" rx="1" {...stroke} />
        <rect x="6.5" y="5.5" width="7.5" height="7.5" rx="1" {...stroke} />
      </>
    );
  }
  if (key === 'computer vision') {
    return (
      <>
        <path {...stroke} d="M1.8 8s2.4-3.6 6.2-3.6S14.2 8 14.2 8s-2.4 3.6-6.2 3.6S1.8 8 1.8 8z" />
        <circle cx="8" cy="8" r="1.6" {...stroke} />
      </>
    );
  }
  if (key === 'graph data') {
    return (
      <>
        <circle cx="4" cy="11" r="1.5" {...stroke} />
        <circle cx="8" cy="4" r="1.5" {...stroke} />
        <circle cx="12.5" cy="10.5" r="1.5" {...stroke} />
        <path {...stroke} d="M5.2 10.1 7 5.4M9.2 5.1l2.2 4.2M5.4 11h5.5" />
      </>
    );
  }
  if (key === 'web audio') {
    return (
      <path
        fill="currentColor"
        d="M2 7h1.4v2H2zm2.2-2h1.4v6H4.2zm2.2 1.2h1.4v3.6H6.4zM8.6 3.5h1.4v9H8.6zM10.8 6h1.4v4h-1.4zM13 7.2h1.2v1.6H13z"
      />
    );
  }
  if (key === 'resend') {
    return (
      <path
        fill="currentColor"
        d="M2.2 2.2h7.2c2.4 0 3.8 1.3 3.8 3.2S11.8 8.6 9.4 8.6H7.8L13.8 13.8H9.6L5 9.4c-.35-.32-.5-.68-.5-1 0-.45.32-.84.94-1.02l2.4-.64c.9-.24 1.52-.9 1.52-1.78 0-1.12-.9-1.76-2.04-1.76H2.2z"
      />
    );
  }
  return <rect x="3" y="3" width="10" height="10" rx="1.5" {...stroke} />;
}

function Study({ project, lift = false }: { readonly project: Project; readonly lift?: boolean }) {
  const set = getStudyScreens(project);

  return (
    <div className="relative overflow-hidden">
      <StudyDevices slug={project.slug} set={set} lift={lift} />
    </div>
  );
}

