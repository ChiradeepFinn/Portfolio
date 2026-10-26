import Link from 'next/link';
import { ChevronRight, Github, Globe } from 'lucide-react';
import type { Project } from '@/lib/types';
import { identity } from '@/lib/site';
import { CopyUrlButton } from './CopyUrlButton';
import { StackIcon } from './ProjectDetail';

/**
 * The opening of every case study: breadcrumb, title, one description,
 * then the fact grid and the stack pills. Those facts are not repeated below.
 */
export function CaseStudyHeader({
  project,
  kind,
}: {
  readonly project: Project;
  readonly kind?: string;
}) {
  const type = kind ? titleCase(kind) : project.category;
  const role = filled(project.role) ? project.role : identity.role;

  return (
    <header>
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[0.82rem] text-muted-2">
        <Link href="/" className="transition-colors duration-200 hover:text-foreground">
          Home
        </Link>
        <ChevronRight size={13} strokeWidth={1.75} aria-hidden="true" />
        <Link href="/projects" className="transition-colors duration-200 hover:text-foreground">
          Projects
        </Link>
        <ChevronRight size={13} strokeWidth={1.75} aria-hidden="true" />
        <span className="text-muted">{project.title}</span>
      </nav>

      <h1 className="display mt-7 text-[clamp(3.3rem,7vw,5.35rem)] text-foreground">{project.title}</h1>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
        <p className="max-w-xl text-[1.05rem] leading-[1.65] text-muted">{project.summary}</p>
        <CopyUrlButton />
      </div>

      <div className="mt-10 grid border-t border-border lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-8 py-8 lg:border-r lg:border-border lg:pr-12">
          <Fact term="Type" value={type} />
          <Fact term="Role" value={role} />
          <Fact term="Built" value={filled(project.year) ? project.year : '-'} />
          <Fact term="Updated" value="-" />
          <LinkFact term="Visit" href={project.liveUrl} icon="globe" />
          <LinkFact term="Source" href={project.repoUrl} icon="github" />
        </dl>

        <div className="border-t border-border py-8 lg:border-t-0 lg:py-8 lg:pl-12">
          <p className="text-[0.62rem] tracking-[0.16em] text-muted-2 uppercase">Tech stack</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-2.5 py-1 text-[0.68rem] font-medium tracking-[0.06em] text-foreground uppercase">
                  <StackIcon label={item} />
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

function Fact({ term, value }: { readonly term: string; readonly value: string }) {
  return (
    <div>
      <dt className="text-[0.62rem] tracking-[0.16em] text-muted-2 uppercase">{term}</dt>
      <dd className="mt-2 text-[0.98rem] font-medium tracking-[-0.01em] text-foreground">{value}</dd>
    </div>
  );
}

function LinkFact({
  term,
  href,
  icon,
}: {
  readonly term: string;
  readonly href: string | null;
  readonly icon: 'globe' | 'github';
}) {
  const label = href ? (icon === 'globe' ? hostLabel(href) : 'GitHub') : '-';

  return (
    <div>
      <dt className="text-[0.62rem] tracking-[0.16em] text-muted-2 uppercase">{term}</dt>
      <dd className="mt-2 text-[0.98rem] font-medium tracking-[-0.01em]">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-accent-blue transition-opacity duration-200 hover:opacity-80"
          >
            {icon === 'globe' ? (
              <Globe size={14} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Github size={14} strokeWidth={1.75} aria-hidden="true" />
            )}
            {label}
          </a>
        ) : (
          <span className="text-foreground">{label}</span>
        )}
      </dd>
    </div>
  );
}

function filled(value: string) {
  const trimmed = value.trim();
  return trimmed !== '' && trimmed !== '-' && trimmed !== '\u2014';
}

function titleCase(value: string) {
  return value.replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function hostLabel(url: string) {
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return url;
  }
}
