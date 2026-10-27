import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import { ArrowUpRight } from 'lucide-react';
import { identity, socialProfiles } from '@/lib/site';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { GradientWord } from '@/components/ui/GradientWord';

export const metadata: Metadata = withCanonical('/links', {
  title: 'Links',
  description:
    "Find Chiradeep's social profiles, contact links, and ways to follow the work across GitHub, LinkedIn, Instagram, and more.",
});

export default function LinksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Links"
        title={
          <>
            Everywhere else <GradientWord>I exist.</GradientWord>
          </>
        }
        width="narrow"
      />

      <Section className="pt-0" width="narrow">
        <ul className="grid gap-px overflow-hidden rounded-card border border-border bg-border">
          {socialProfiles.map((profile, index) => (
            <li key={profile.label}>
              <Reveal delay={index * 0.04}>
                {/* Profiles without a confirmed URL render as inert rows rather
                    than links that go nowhere. */}
                {profile.href ? (
                  <a
                    href={profile.href}
                    target={profile.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-4 bg-surface px-6 py-5 transition-colors duration-300 hover:bg-surface-2"
                  >
                    <span className="text-sm text-foreground">{profile.label}</span>
                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                      className="shrink-0 text-muted-2 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                    />
                  </a>
                ) : (
                  <div className="flex items-center justify-between gap-4 bg-surface px-6 py-5">
                    <span className="text-sm text-muted-2">{profile.label}</span>
                    <span className="meta shrink-0">Not linked yet</span>
                  </div>
                )}
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="body-copy mt-10">
          The quickest route is still email:{' '}
          <a href={`mailto:${identity.email}`} className="link-underline text-foreground">
            {identity.email}
          </a>
        </p>
      </Section>
    </>
  );
}
