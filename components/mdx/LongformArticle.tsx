import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Section } from '@/components/layout/Section';
import type { ArticleMeta } from '@/lib/mdx/files';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function formatDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  const label = MONTHS[(month ?? 1) - 1] ?? value;
  return `${day} ${label} ${year}`;
}

function statusLabel(status: ArticleMeta['status']): string {
  if (status === 'in-progress') return 'In progress';
  if (status === 'published') return 'Published';
  return 'Draft';
}

export function LongformArticle({ meta, children }: { readonly meta: ArticleMeta; readonly children: ReactNode }) {
  const parent = meta.collection === 'research'
    ? { href: '/archive/research', label: 'Research' }
    : { href: '/philosophy', label: 'Philosophy' };

  return (
    <Section className="pt-32 sm:pt-36">
      <article>
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[0.82rem] text-muted-2">
          {meta.collection === 'research' ? (
            <>
              <Link href="/archive" className="transition-colors duration-200 hover:text-foreground">
                Archive
              </Link>
              <ChevronRight size={13} strokeWidth={1.75} aria-hidden="true" />
            </>
          ) : null}
          <Link href={parent.href} className="transition-colors duration-200 hover:text-foreground">
            {parent.label}
          </Link>
          <ChevronRight size={13} strokeWidth={1.75} aria-hidden="true" />
          <span aria-current="page" className="text-muted">
            {meta.title}
          </span>
        </nav>

        <div className="mt-10 flex items-baseline justify-between gap-6">
          <p className="meta">{formatDate(meta.publishedAt)}</p>
          <p className="text-sm font-medium text-foreground">{statusLabel(meta.status)}</p>
        </div>

        <h1 className="display mt-5 max-w-4xl text-balance text-[clamp(2.05rem,4.4vw,3.55rem)] leading-[1.08] text-foreground">
          {meta.title}
        </h1>
        <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-muted">{meta.summary}</p>
        {meta.tags.length > 0 ? <p className="mt-4 text-sm text-muted-2">{meta.tags.join(' · ')}</p> : null}
        {meta.coverImage ? (
          <Image
            src={meta.coverImage}
            alt={`Cover for ${meta.title}`}
            width={1600}
            height={900}
            sizes="(min-width: 768px) 48rem, 100vw"
            className="mt-10 h-auto w-full max-w-3xl"
          />
        ) : null}

        <div className="article-prose mt-14 border-t border-border pt-12">{children}</div>
      </article>
    </Section>
  );
}

export function MdxProse({ children }: { readonly children: ReactNode }) {
  return <div className="article-prose mt-16 border-t border-border pt-12">{children}</div>;
}
