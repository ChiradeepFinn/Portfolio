import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import Link from 'next/link';
import { getWriting } from '@/lib/content';
import { philosophyThemes, philosophyWorld } from '@/lib/data/worlds';
import { loadCollection, publicArticles } from '@/lib/mdx/files';
import { Section } from '@/components/layout/Section';
import { PhilosophyIntro } from '@/components/worlds/PhilosophyIntro';

export const metadata: Metadata = withCanonical('/philosophy', {
  title: 'Philosophy',
  description: philosophyWorld.lead,
});

export default async function PhilosophyPage() {
  const essays = (await getWriting()).filter((entry) => !entry.isPlaceholder);
  const filed = publicArticles(loadCollection('essays'));

  return (
    <>
      <PhilosophyIntro />

      <Section id="subjects" className="scroll-mt-28 pt-0" width="narrow" labelledBy="subjects-heading">
        <h2 id="subjects-heading" className="text-[0.95rem] text-foreground">
          Subjects
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Territory for the shelf. A line here is a subject, not an essay I have written.
        </p>
        <ol className="mt-8 grid gap-6">
          {philosophyThemes.map((theme, index) => (
            <li key={theme.title} className="border-t border-border pt-5">
              <p className="meta">{String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 font-display text-[1.25rem] text-foreground italic">{theme.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{theme.line}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 border-t border-border pt-8">
          <h2 className="text-[0.95rem] text-foreground">Essays</h2>
          {filed.length > 0 ? (
            <ul className="mt-6 grid gap-8">
              {filed.map((essay) => (
                <li key={essay.slug}>
                  <p className="meta">{essay.status === 'in-progress' ? 'In progress' : 'Essay'}</p>
                  <h3 className="mt-2 font-display text-[1.35rem] text-foreground">
                    <Link href={essay.href} className="transition-colors duration-200 hover:text-accent-blue">
                      {essay.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{essay.summary}</p>
                </li>
              ))}
            </ul>
          ) : null}
          {essays.length > 0 ? (
            <ul className="mt-6 grid gap-8">
              {essays.map((essay) => (
                <li key={essay.slug}>
                  <p className="meta">{essay.category}</p>
                  <h3 className="mt-2 font-display text-[1.35rem] text-foreground">{essay.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{essay.excerpt}</p>
                </li>
              ))}
            </ul>
          ) : filed.length === 0 ? (
            <p className="mt-4 text-sm leading-relaxed text-muted">No essay is filed on this shelf yet.</p>
          ) : null}
        </div>
      </Section>
    </>
  );
}
