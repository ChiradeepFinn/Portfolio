import type { ReactNode } from 'react';
import type { CaseStudyContent, CodePanel } from '@/lib/data/case-studies';

/**
 * The case-study order used on the reference pages: the problem, then each
 * mechanism, the stack, the hard part, the trade-offs, what would change,
 * and questions.
 */
export function CaseStudy({ study }: { readonly study: CaseStudyContent }) {
  return (
    <div>
      <StudyRow label={study.problemLabel}>
        {study.problemLines && study.problemLines.length > 0 ? (
          <ul className="mb-6 grid gap-1">
            {study.problemLines.map((line) => (
              <li key={line} className="font-display text-[1.35rem] leading-snug text-foreground italic">
                {line}
              </li>
            ))}
          </ul>
        ) : null}
        <Prose paragraphs={study.problem} />
      </StudyRow>

      {study.features.map((feature) => (
        <StudyRow key={feature.label} label={feature.label}>
          <Prose paragraphs={feature.body} />
          {feature.code ? <CodeBlock panel={feature.code} /> : null}
          {feature.diagram ? <Diagram diagram={feature.diagram} /> : null}
        </StudyRow>
      ))}

      <StudyRow label="The hard part">
        <h3 className="text-[1.2rem] font-medium tracking-[-0.02em] text-foreground">{study.hard.title}</h3>
        <p className="mt-4 max-w-2xl text-[1.02rem] leading-[1.75] text-muted">{study.hard.problem}</p>
        <p className="mt-6 text-[0.68rem] tracking-[0.14em] text-muted-2 uppercase">Solution</p>
        <p className="mt-2 max-w-2xl text-[1.02rem] leading-[1.75] text-foreground/90">{study.hard.solution}</p>
      </StudyRow>

      <StudyRow label="Trade-offs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[0.68rem] tracking-[0.14em] text-muted-2 uppercase">
                <th className="py-3 pr-6 font-medium">Decision</th>
                <th className="py-3 pr-6 font-medium">Choice</th>
                <th className="py-3 font-medium">Why</th>
              </tr>
            </thead>
            <tbody>
              {study.tradeoffs.map((row) => (
                <tr key={row.decision} className="border-b border-border">
                  <th className="py-4 pr-6 align-top font-medium text-foreground">{row.decision}</th>
                  <td className="py-4 pr-6 align-top text-foreground/90">{row.choice}</td>
                  <td className="py-4 align-top text-muted">{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StudyRow>

      <StudyRow label="What I’d change">
        <ul className="grid max-w-2xl gap-3">
          {study.changes.map((item) => (
            <li key={item} className="text-[1.02rem] leading-[1.7] text-muted">
              {item}
            </li>
          ))}
        </ul>
      </StudyRow>

      <StudyRow label={study.faqLabel}>
        <div className="border-b border-border">
          {study.faq.map((item) => (
            <details key={item.question} className="group border-t border-border">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[1.02rem] text-foreground [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span aria-hidden="true" className="mt-0.5 shrink-0 font-mono text-sm text-muted-2 group-open:hidden">
                  +
                </span>
                <span aria-hidden="true" className="mt-0.5 hidden shrink-0 font-mono text-sm text-muted-2 group-open:inline">
                  -
                </span>
              </summary>
              <p className="max-w-2xl pb-5 text-[1.02rem] leading-[1.75] text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </StudyRow>
    </div>
  );
}

function StudyRow({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <section className="grid gap-5 border-t border-border py-14 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-20 lg:py-20">
      <h2 className="max-w-[12rem] text-[0.95rem] leading-snug text-muted lg:sticky lg:top-28 lg:self-start">{label}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

function Prose({ paragraphs }: { readonly paragraphs: readonly string[] }) {
  return (
    <div className="grid max-w-2xl gap-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-[1.02rem] leading-[1.75] text-muted">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function Diagram({ diagram }: { readonly diagram: string }) {
  return (
    <pre className="code-panel mt-6 max-w-2xl overflow-x-auto rounded-xl px-5 py-4 font-mono text-[0.84rem] leading-relaxed whitespace-pre">
      {diagram}
    </pre>
  );
}

function CodeBlock({ panel }: { readonly panel: CodePanel }) {
  return (
    <figure className="code-panel mt-6 max-w-2xl overflow-hidden rounded-xl px-4 pt-3.5 pb-4">
      <figcaption className="code-file inline-flex rounded-md px-2 py-1 font-mono text-[0.72rem]">{panel.file}</figcaption>
      <pre className="mt-3 overflow-x-auto font-mono text-[0.84rem] leading-[1.7]">
        <code>{highlight(panel.code)}</code>
      </pre>
    </figure>
  );
}

const KEYWORDS = new Set(['type', 'const', 'return', 'export', 'string', 'number']);

function highlight(source: string): ReactNode[] {
  return source.split('\n').map((line, index) => (
    <span key={`${index}-${line}`} className="block">
      {paint(line, index)}
    </span>
  ));
}

function paint(line: string, index: number): ReactNode {
  const commentAt = line.indexOf('//');
  if (commentAt === 0 || (commentAt > 0 && line.slice(0, commentAt).trim() === '')) {
    return <span className="tok-note">{line || ' '}</span>;
  }

  const parts: ReactNode[] = [];
  const token = /('(?:\\'|[^'])*'|"(?:\\"|[^"])*"|\/\/.*$|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;
  let cursor = 0;
  let match: RegExpExecArray | null = token.exec(line);
  let part = 0;

  while (match) {
    if (match.index > cursor) {
      parts.push(<span key={`${index}-t-${part++}`}>{line.slice(cursor, match.index)}</span>);
    }
    const value = match[0];
    const className = value.startsWith('//')
      ? 'tok-note'
      : value.startsWith("'") || value.startsWith('"')
        ? 'tok-str'
        : KEYWORDS.has(value)
          ? 'tok-key'
          : /^[A-Z]/.test(value)
            ? 'tok-name'
            : undefined;
    parts.push(
      <span key={`${index}-m-${part++}`} className={className}>
        {value}
      </span>,
    );
    cursor = match.index + value.length;
    if (value.startsWith('//')) break;
    match = token.exec(line);
  }

  if (cursor < line.length) parts.push(<span key={`${index}-e`}>{line.slice(cursor)}</span>);
  return parts.length > 0 ? parts : ' ';
}
