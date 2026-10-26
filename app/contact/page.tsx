import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import {
  ArrowUpRight,
  Circle,
  Gamepad2,
  Ghost,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Music2,
  type LucideIcon,
} from 'lucide-react';
import { identity, socialProfiles } from '@/lib/site';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { ContactForm } from '@/components/contact/ContactForm';
import { LocalTime } from '@/components/contact/LocalTime';
import { Reveal } from '@/components/ui/Reveal';
import { GradientWord } from '@/components/ui/GradientWord';

/** Same intentional lucide map as Footer — only the social set needed here. */
const socialIcons: Record<string, LucideIcon> = {
  Instagram,
  Github,
  Linkedin,
  Ghost,
  Gamepad2,
  Music2,
  Mail,
};

function SocialIcon({ name }: { readonly name: string }) {
  const Icon = socialIcons[name] ?? Circle;
  return <Icon size={15} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />;
}

export const metadata: Metadata = withCanonical('/contact', {
  title: 'Contact',
  description: 'Start a conversation.',
});

const faqs = [
  {
    question: 'What is worth emailing about?',
    answer:
      'A clear ask with context: a product surface that needs design and engineering together, a creative-tech build, or a music or visual collaboration. Mass outreach and "let\'s sync sometime" notes get a slower reply, if any.',
  },
  {
    question: 'How fast do you respond, and where?',
    answer:
      'Email first. I usually reply within a few days. Instagram, Discord, and the rest are fine for casual notes - they are slower when something actually needs an answer.',
  },
  {
    question: 'Can I use work from the archive?',
    answer:
      'Ask before you publish it. Name the piece, where it would appear, and whether the use is personal, editorial, or commercial. Personal and editorial reuse is usually fine with credit; commercial use needs a conversation first.',
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Say something. <GradientWord>I actually read these.</GradientWord>
          </>
        }
        description="Work, collaboration, a question, or a record you think I should hear - all of it is welcome."
        atmosphere="atmos-spotlight"
      />

      <Section className="pt-0">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <p className="eyebrow text-accent-blue">Direct</p>
              <a
                href={`mailto:${identity.email}`}
                className="link-underline mt-4 inline-flex text-sm break-all text-foreground"
              >
                {identity.email}
              </a>
              <LocalTime place={identity.location} />

              <p className="eyebrow mt-12 text-accent-blue">Availability</p>
              <p className="body-copy mt-4 text-[0.95rem]">
                Open to conversations. I answer email before anything else, so start there if it matters.
              </p>

              <p className="eyebrow mt-12 text-accent-blue">Elsewhere</p>
              <ul className="mt-4 grid gap-2.5">
                {socialProfiles.map((profile) => (
                  <li key={profile.label}>
                    {profile.href ? (
                      <a
                        href={profile.href}
                        target={profile.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-foreground"
                      >
                        <SocialIcon name={profile.icon} />
                        {profile.label}
                        <ArrowUpRight
                          size={12}
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm text-muted-2">
                        <SocialIcon name={profile.icon} />
                        {profile.label} - not linked yet
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section border="top" width="narrow">
        <p className="eyebrow text-accent-blue">Before you write</p>
        <dl className="mt-8 grid gap-8">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-t border-border pt-6">
              <dt className="text-sm text-foreground">{faq.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-2">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </>
  );
}
