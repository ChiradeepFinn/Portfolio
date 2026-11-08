import type { Metadata } from 'next';
import { Suspense } from 'react';
import { preconnect, prefetchDNS, preload } from 'react-dom';
import { contactPageGraph, withCanonical } from '@/lib/seo';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  ArrowUpRight,
  Circle,
  Facebook,
  Gamepad2,
  Ghost,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Music2,
  Youtube,
  type LucideIcon,
} from 'lucide-react';
import { calBookingOptions, calEmbedSrc } from '@/lib/cal';
import { identity, socialProfiles } from '@/lib/site';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { BookingEmbed } from '@/components/contact/BookingEmbed';
import { ContactForm } from '@/components/contact/ContactForm';
import { LocalTime } from '@/components/contact/LocalTime';
import { Reveal } from '@/components/ui/Reveal';
import { GradientWord } from '@/components/ui/GradientWord';

/** Same intentional lucide map as Footer: only the social set needed here. */
const socialIcons: Record<string, LucideIcon> = {
  Instagram,
  Github,
  Linkedin,
  Ghost,
  Gamepad2,
  Music2,
  Mail,
  Youtube,
  Facebook,
};

function SocialIcon({ name }: { readonly name: string }) {
  const Icon = socialIcons[name] ?? Circle;
  return <Icon size={15} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />;
}

export const metadata: Metadata = withCanonical('/contact', {
  title: 'Contact',
  description:
    'Get in touch with Chiradeep about freelance work, collaborations, or a full-time role across AI, web, and creative technology.',
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

function warmCalBookingHints() {
  preconnect('https://cal.com');
  preconnect('https://app.cal.com');
  prefetchDNS('https://cal.com');
  prefetchDNS('https://app.cal.com');
  for (const option of calBookingOptions()) {
    preload(calEmbedSrc(option.calLink), { as: 'document' });
  }
}

export default function ContactPage() {
  warmCalBookingHints();

  return (
    <>
      <JsonLd data={contactPageGraph(faqs)} />
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Say something. <GradientWord>I actually read these.</GradientWord>
          </>
        }
        description="Work, collaboration, a question, or a record you think I should hear - all of it is welcome."
        atmosphere="atmos-spotlight"
        density="compact"
      />

      <Section className="pt-0">
        <div className="grid items-stretch gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <Reveal className="h-full min-h-0">
            <Suspense
              fallback={
                <div
                  className="grid w-full max-w-full gap-4 sm:gap-[1.125rem]"
                  aria-busy="true"
                  aria-label="Loading contact form"
                >
                  <div className="h-8 border-b border-border" />
                  <div className="h-8 border-b border-border" />
                  <div className="h-8 border-b border-border" />
                  <div className="min-h-[5.25rem] border-b border-border" />
                </div>
              }
            >
              <ContactForm />
            </Suspense>
          </Reveal>

          <Reveal className="h-full min-h-0" delay={0.08}>
            <div className="h-full border-t border-border pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <p className="eyebrow text-muted-2">Direct</p>
              <a
                href={`mailto:${identity.email}`}
                className="link-underline mt-4 inline-flex text-sm break-all text-foreground"
              >
                {identity.email}
              </a>
              <LocalTime place={identity.location} />

              <p className="eyebrow mt-12 text-muted-2">Availability</p>
              <p className="body-copy mt-4 text-[0.95rem]">
                Open to conversations. I answer email before anything else, so start there if it matters.
              </p>

              <p className="eyebrow mt-12 text-muted-2">Elsewhere</p>
              <ul className="mt-4 grid gap-2.5">
                {socialProfiles.map((profile) => (
                  <li key={profile.label}>
                    {profile.href ? (
                      <a
                        href={profile.href}
                        target={profile.href.startsWith('mailto:') ? undefined : '_blank'}
                        rel={profile.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
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

      <Section border="top">
        <Reveal>
          <BookingEmbed />
        </Reveal>
      </Section>

      <Section border="top" width="narrow">
        <p className="eyebrow text-muted-2">Before you write</p>
        <div className="mt-8 border-b border-border">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-t border-border">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-sm text-foreground [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span aria-hidden="true" className="mt-0.5 shrink-0 font-mono text-sm text-muted-2 group-open:hidden">
                  +
                </span>
                <span aria-hidden="true" className="mt-0.5 hidden shrink-0 font-mono text-sm text-muted-2 group-open:inline">
                  −
                </span>
              </summary>
              <p className="max-w-2xl pb-5 text-sm leading-relaxed text-muted-2">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
