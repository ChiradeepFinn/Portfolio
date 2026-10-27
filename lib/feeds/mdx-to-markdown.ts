/**
 * MDX source to plain Markdown.
 *
 * The twins are built from the MDX file, not from rendered HTML, so headings,
 * links, lists, and code survive exactly as written. Only the JSX has to go.
 *
 * Stripping JSX with regular expressions is safe here because the stripper
 * never sees a fenced block or an inline code span: those are held out and put
 * back afterwards. A code sample containing `<Suspense />` stays a code sample.
 *
 * Components that carry copy in their props or children are expanded into real
 * Markdown first, so their text is not dropped with the tag. Every component in
 * `components/mdx/components.tsx` that holds content needs a rule here.
 */

const FENCE = /^(?:\s{0,3})(`{3,}|~{3,})/;
const PLACEHOLDER = /\u0000(\d+)\u0000/g;

export function mdxToMarkdown(source: string): string {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let prose: string[] = [];
  let fence: string | null = null;

  const flush = () => {
    if (prose.length === 0) return;
    out.push(transformProse(prose.join('\n')));
    prose = [];
  };

  for (const line of lines) {
    if (fence) {
      out.push(line);
      if (line.trim().startsWith(fence)) fence = null;
      continue;
    }

    const opening = FENCE.exec(line);
    if (opening) {
      flush();
      fence = opening[1];
      out.push(line);
      continue;
    }

    prose.push(line);
  }

  flush();
  // Blank lines are collapsed per prose segment, never across a fence: a code
  // sample keeps the spacing it was written with.
  return out.join('\n').trim();
}

function transformProse(text: string): string {
  const spans: string[] = [];
  let guarded = text.replace(/(`+)(?:[\s\S]*?)\1/g, (match) => {
    spans.push(match);
    return `\u0000${spans.length - 1}\u0000`;
  });

  guarded = expandComponents(guarded);
  guarded = stripJsx(guarded);
  guarded = guarded.replace(/\n{3,}/g, '\n\n');

  return guarded.replace(PLACEHOLDER, (_, index) => spans[Number(index)] ?? '');
}

function expandComponents(text: string): string {
  return text
    .replace(/<Callout\b([^>]*)>([\s\S]*?)<\/Callout>/g, (_, attributes: string, body: string) => {
      const title = attribute(attributes, 'title');
      const inner = stripJsx(dedent(body)).trim();
      const content = [title ? `**${title}**` : '', inner].filter(Boolean).join('\n\n');
      return `\n\n${quote(content)}\n\n`;
    })
    .replace(/<Figure\b([^>]*?)\/>/g, (_, attributes: string) => {
      const src = attribute(attributes, 'src');
      if (!src) return '';
      const alt = attribute(attributes, 'alt') ?? '';
      const caption = attribute(attributes, 'caption');
      return `\n\n![${alt}](${src})${caption ? `\n\n*${caption}*` : ''}\n\n`;
    })
    .replace(/<Citation\b([^>]*)>([\s\S]*?)<\/Citation>/g, (_, attributes: string, body: string) => {
      const id = attribute(attributes, 'id');
      const inner = stripJsx(dedent(body)).trim();
      return `\n\n${id ? `[${id}] ` : ''}${inner}\n\n`;
    });
}

/** Component tags, MDX comments, and import/export statements. Lowercase HTML is valid Markdown and stays. */
function stripJsx(text: string): string {
  return text
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')
    .replace(/^(?:import|export)\s[^\n]*\n?/gm, '')
    .replace(/<\/?[A-Z][A-Za-z0-9.]*(?:\s[^<>]*?)?\/?>/g, '');
}

function attribute(attributes: string, name: string): string | undefined {
  const quoted = new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`).exec(attributes)
    ?? new RegExp(`\\b${name}\\s*=\\s*'([^']*)'`).exec(attributes)
    ?? new RegExp(`\\b${name}\\s*=\\s*\\{\\s*["'\`]([^"'\`]*)["'\`]\\s*\\}`).exec(attributes);
  return quoted?.[1]?.trim() || undefined;
}

function dedent(block: string): string {
  const lines = block.split('\n').filter((line) => line.trim().length > 0);
  if (lines.length === 0) return block;
  const indent = Math.min(...lines.map((line) => line.length - line.trimStart().length));
  return block
    .split('\n')
    .map((line) => line.slice(Math.min(indent, line.length - line.trimStart().length)))
    .join('\n');
}

function quote(content: string): string {
  return content
    .split('\n')
    .map((line) => (line.trim().length > 0 ? `> ${line}` : '>'))
    .join('\n');
}
