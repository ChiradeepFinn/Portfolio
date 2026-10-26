import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import type { ResearchBlock, ResearchStudy } from '@/lib/data/research';
import { Schematic } from './Schematic';

/**
 * One document layout for both investigations. The case-study pages use the
 * same idea: a sticky section name, then the prose, so a long page stays
 * scannable without becoming a dashboard.
 */
export function ResearchDocument({
  study,
  previous,
  next,
}: {
  readonly study: ResearchStudy;
  readonly previous?: ResearchStudy;
  readonly next?: ResearchStudy;
}) {
  return (
    <article>
      <header>
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[0.82rem] text-muted-2">
          <Link href="/archive" className="transition-colors duration-200 hover:text-foreground">
            Archive
          </Link>
          <ChevronRight size={13} strokeWidth={1.75} aria-hidden="true" />
          <Link href="/archive/research" className="transition-colors duration-200 hover:text-foreground">
            Research
          </Link>
          <ChevronRight size={13} strokeWidth={1.75} aria-hidden="true" />
          <span aria-current="page" className="text-muted">
            {study.index}
          </span>
        </nav>

        <div className="mt-10 flex items-baseline justify-between gap-6">
          <p className="meta">{study.index}</p>
          <p className="text-sm font-medium text-foreground">{study.status}</p>
        </div>

        <h1 className="display mt-5 max-w-4xl text-balance text-[clamp(2.05rem,4.4vw,3.55rem)] leading-[1.08] text-foreground">
          {study.title}
        </h1>

        <p className="mt-6 max-w-2xl font-display text-[clamp(1.2rem,2.1vw,1.55rem)] leading-snug text-foreground italic">
          {study.question}
        </p>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">{study.domains.join(' · ')}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-2">{study.progress}</p>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
          <div>
            <p className="eyebrow text-accent-blue">{study.overviewLabel}</p>
            <p className="body-copy mt-4 max-w-2xl">{study.overview}</p>
            {study.overviewNote ? <p className="mt-4 max-w-2xl text-sm text-muted-2">{study.overviewNote}</p> : null}
          </div>
          <Schematic kind={study.figure} />
        </div>
      </header>

      <nav aria-label="On this page" className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-5">
        {study.sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="text-[0.78rem] text-muted-2 transition-colors duration-200 hover:text-foreground"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <div>
        {study.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="grid scroll-mt-28 gap-5 border-t border-border py-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-20 lg:py-20"
          >
            <h2 className="max-w-[12rem] text-[0.95rem] leading-snug text-muted lg:sticky lg:top-28 lg:self-start">
              {section.label}
            </h2>
            <div className="grid min-w-0 gap-8">
              {section.blocks.map((block, index) => (
                <BlockView key={`${section.id}-${block.type}-${index}`} block={block} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <nav aria-label="Other investigations" className="grid border-t border-border sm:grid-cols-2">
        {previous ? (
          <StudyLink study={previous} direction="previous" />
        ) : (
          <span className="hidden sm:block" />
        )}
        {next ? <StudyLink study={next} direction="next" /> : null}
      </nav>
    </article>
  );
}

function StudyLink({
  study,
  direction,
}: {
  readonly study: ResearchStudy;
  readonly direction: 'previous' | 'next';
}) {
  const isNext = direction === 'next';

  return (
    <Link
      href={`/archive/research/${study.slug}`}
      className={isNext ? 'group py-8 sm:pl-8' : 'group border-b border-border py-8 sm:border-r sm:border-b-0 sm:pr-8'}
    >
      <span className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.14em] text-muted-2 uppercase">
        {isNext ? null : <ArrowLeft size={13} aria-hidden="true" />}
        {isNext ? 'Next' : 'Previous'}
        {isNext ? <ArrowRight size={13} aria-hidden="true" /> : null}
      </span>
      <span className="mt-3 block font-display text-[1.15rem] leading-[1.3] text-foreground italic">
        {study.title}
      </span>
    </Link>
  );
}

function BlockView({ block }: { readonly block: ResearchBlock }) {
  switch (block.type) {
    case 'prose':
      return (
        <div className="grid max-w-2xl gap-4">
          {block.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-[1.02rem] leading-[1.75] text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      );
    case 'callout':
      return (
        <aside className="max-w-2xl border-l border-border pl-5">
          <p className="text-[0.68rem] tracking-[0.14em] text-muted-2 uppercase">{block.kicker}</p>
          <p className="mt-2 text-[1.02rem] leading-[1.75] text-foreground">{block.text}</p>
        </aside>
      );
    case 'list':
      return (
        <ul className="grid max-w-2xl gap-3">
          {block.items.map((item) => (
            <li key={item} className="text-[1.02rem] leading-[1.7] text-muted">
              {item}
            </li>
          ))}
        </ul>
      );
    case 'questions':
      return (
        <div className="max-w-2xl">
          {block.provisional && block.note ? <p className="mb-6 text-sm leading-relaxed text-muted-2">{block.note}</p> : null}
          <ol className="grid gap-8">
            {block.items.map((item) => (
              <li key={item.id}>
                <p className="meta">
                  {item.id}
                  {block.provisional ? ' · Provisional' : null}
                </p>
                <p className="mt-2 font-display text-[1.25rem] leading-snug text-foreground italic">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      );
    case 'ordered':
      return (
        <ol className="grid max-w-2xl gap-7">
          {block.items.map((item, index) => (
            <li key={item.title} className="grid grid-cols-[2.4rem_minmax(0,1fr)] gap-3 sm:gap-4">
              <span className="meta pt-1">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-[1.02rem] font-medium text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-[1.02rem] leading-[1.7] text-muted">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      );
    case 'definitions':
      return (
        <dl className="grid max-w-2xl gap-6">
          {block.items.map((item) => (
            <div key={item.term}>
              <dt className="text-[0.98rem] font-medium text-foreground">{item.term}</dt>
              <dd className="mt-1.5 text-[1.02rem] leading-[1.7] text-muted">{item.detail}</dd>
            </div>
          ))}
        </dl>
      );
    case 'table':
      return (
        <div className="max-w-3xl">
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={block.caption}>
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <caption className="caption-bottom py-3 text-left text-[0.78rem] leading-relaxed text-muted-2">
                {block.caption}
              </caption>
              <thead>
                <tr className="border-b border-border text-[0.68rem] tracking-[0.14em] text-muted-2 uppercase">
                  {block.columns.map((column) => (
                    <th key={column} scope="col" className="py-3 pr-6 font-medium">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row.join('|')} className="border-b border-border">
                    {row.map((cell, cellIndex) =>
                      cellIndex === 0 ? (
                        <th key={`${cellIndex}-${cell}`} scope="row" className="py-4 pr-6 align-top font-medium text-foreground">
                          {cell}
                        </th>
                      ) : (
                        <td key={`${cellIndex}-${cell}`} className="py-4 pr-6 align-top text-muted">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case 'cards':
      return (
        <div className="grid max-w-2xl gap-px border border-border bg-border">
          {block.items.map((item) => (
            <article key={item.title} className="bg-background px-5 py-6 sm:px-6">
              <p className="meta">{item.kicker}</p>
              <h3 className="mt-3 font-display text-[1.45rem] leading-snug text-foreground italic">{item.title}</h3>
              <p className="mt-3 text-[1.02rem] leading-[1.7] text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      );
    case 'records':
      return (
        <ul className="max-w-2xl border-t border-border">
          {block.items.map((item) => (
            <li
              key={item.label}
              className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <span className="text-[0.98rem] text-foreground">{item.label}</span>
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-sm text-foreground"
                >
                  {item.value}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <span className="text-sm text-muted-2 sm:text-right">{item.value}</span>
              )}
            </li>
          ))}
        </ul>
      );
    case 'columns':
      return (
        <div className="max-w-2xl">
          <p className="text-[0.68rem] tracking-[0.14em] text-muted-2 uppercase">Inspected file</p>
          <p className="mt-2 font-mono text-[0.78rem] leading-relaxed break-all text-foreground">{block.file}</p>
          <p className="mt-4 text-sm text-muted">{block.rowsLabel}</p>
          <ol className="mt-5 grid gap-2">
            {block.names.map((name, index) => (
              <li key={`${index}-${name}`} className="border-t border-border py-2">
                <code className="whitespace-pre font-mono text-[0.85rem] text-foreground">{`"${name}"`}</code>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{block.note}</p>
        </div>
      );
    case 'pending':
      return (
        <div className="max-w-2xl border border-border px-6 py-7">
          <p className="eyebrow">{block.kicker}</p>
          <p className="mt-4 text-[1.02rem] leading-[1.75] text-muted">{block.text}</p>
        </div>
      );
    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}
