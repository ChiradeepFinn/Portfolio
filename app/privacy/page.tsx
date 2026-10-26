import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { identity } from '@/lib/site';

export const metadata: Metadata = withCanonical('/privacy', {
  title: 'Privacy Policy',
  description:
    'What this site collects, why, who handles it, how long it is kept, and how to have it removed.',
});

const EFFECTIVE = '25 October 2026';

interface Clause {
  readonly label: string;
  readonly body: ReactNode;
}

export default function PrivacyPage() {
  const email = identity.email;

  const clauses: readonly Clause[] = [
    {
      label: 'Who is responsible',
      body: (
        <>
          <P>
            This site is run by {identity.name}, an individual based in {identity.location}. I decide what is collected
            and why, so I am the person responsible for it. There is no company, no team, and no data broker behind it.
          </P>
          <P>
            Every request in this policy goes to{' '}
            <a href={`mailto:${email}`} className="link-underline text-foreground">
              {email}
            </a>
            .
          </P>
        </>
      ),
    },
    {
      label: 'What is collected',
      body: (
        <>
          <P>
            The site asks for personal details through the contact form, and through the guest journal if you choose to
            sign in and leave a note. Hosting still records access logs, described below.
          </P>
          <Table
            rows={[
              {
                term: 'The contact form',
                text: 'Your name, email address, subject, and message. Only if you submit the form. Nothing is sent as you type. Delivery is through Resend; a database copy in Supabase is attempted afterwards and is best-effort.',
              },
              {
                term: 'Performance metrics',
                text: 'Vercel Speed Insights records anonymous measures of how a page loads and responds (for example Core Web Vitals). It is not used to build a marketing profile or a mailing list.',
              },
              {
                term: 'Your theme choice',
                text: 'Light or dark, kept in your browser’s local storage under one key. It never leaves your device and I cannot read it.',
              },
              {
                term: 'Abuse limit',
                text: 'If you submit the form, the server may keep a short-lived hash of your network address in memory so the form cannot be flooded. The hash is not written to the contact database, it is not a profile, and it disappears when the time window ends or the server process restarts.',
              },
              {
                term: 'Guest journal sign-in',
                text: 'Only if you choose Continue with Google or Continue with GitHub. That provider confirms the account to Supabase. The record can include the provider, a provider identifier, and the email address the provider shares. The journal page does not show the email. I do not receive your Google or GitHub password.',
              },
              {
                term: 'The note',
                text: 'The name you type and the note itself, if you publish one. Both are public. One account can have one note. Nothing is stored as you type.',
              },
              {
                term: 'Journal abuse limit',
                text: 'A separate short-lived hash, kept in memory on the server, so sign-in and publishing cannot be flooded. It is not written on the note, and it is not shared across every server process.',
              },
              {
                term: 'Server logs',
                text: 'The hosting provider records the request time, the page requested, your IP address, and your user agent in order to serve the site and defend it from abuse. I do not collect, export, or analyse these logs.',
              },
            ]}
          />
        </>
      ),
    },
    {
      label: 'What is not collected',
      body: (
        <>
          <List
            items={[
              'No advertising, retargeting, session-replay, or marketing pixels. None are installed.',
              'No product-analytics suite that builds a browse history about you. Vercel Speed Insights is limited to performance metrics, described above.',
              'No newsletter list. An account exists only if you choose Google or GitHub on the guest journal.',
              'No advertising cookies. The only cookie this site sets is the journal session described above, and only after you sign in.',
              'No fingerprinting, no cross-site tracking, and no attempt to work out who you are from how you browse.',
              'The typefaces are files served with this site. Opening a page does not call a third-party font service.',
              'No profiling for advertising, and no automated decision about you of any kind.',
              'No location, microphone, camera, or contact-list access.',
            ]}
          />
          <P>
            If any of this changes, this page changes first and the date at the top moves. Nothing new is switched on
            quietly.
          </P>
        </>
      ),
    },
    {
      label: 'Why it is used',
      body: (
        <>
          <P>
            Contact-form data is used for one purpose: to read your message and reply to it. It is not used for
            marketing, it is not added to any list, and I will not write to you about anything you did not ask about.
          </P>
          <P>
            The guest journal is there so a visitor can leave one public note. The sign-in exists so the page can keep
            that to one note per account, and so an unsigned note cannot be published. It is not used for advertising
            or a mailing list.
          </P>
          <P>
            The basis is your consent, which you give by choosing to submit the form or by choosing to sign in and
            publish a note. You can withdraw it at any time (see your rights, below). Server logs and Speed Insights are
            kept by Vercel on the basis of a legitimate interest in running and measuring the site safely and
            reliably.
          </P>
        </>
      ),
    },
    {
      label: 'Who else handles it',
      body: (
        <>
          <P>
            A contact message, and a guest-journal sign-in if you start one, pass through the services below. Each
            handles the data only to do the job described.
          </P>
          <Table
            rows={[
              {
                term: 'Supabase',
                text: 'May store a contact message after Resend accepts the email (best-effort). Also stores a guest note and the sign-in record if you use the journal. Portfolio content I publish can live there too; that is my content, not your message. The note text and the name you chose are readable by visitors. The email and the account id are not granted to the public API.',
              },
              {
                term: 'Google',
                text: 'Checks the sign-in if you choose Google. Used only for that sign-in. I never receive your Google password.',
              },
              {
                term: 'GitHub',
                text: 'Checks the sign-in if you choose GitHub. Used only for that sign-in. I never receive your GitHub password.',
              },
              {
                term: 'Resend',
                text: 'Delivers the contact message to my inbox as an email. A successful form submission means Resend accepted that email.',
              },
              {
                term: 'My email provider',
                text: 'Receives the message in my mailbox, where I read and reply to it.',
              },
              {
                term: 'Vercel',
                text: 'Hosts the site, keeps ordinary access logs, and runs Speed Insights for anonymous performance metrics.',
              },
            ]}
          />
          <P>
            I do not sell your data, rent it, or share it for anyone else’s use. It is disclosed to others only if the
            law requires it. These providers may process data on servers outside India, so your message can leave the
            country when you send it.
          </P>
        </>
      ),
    },
    {
      label: 'How long it is kept',
      body: (
        <>
          <List
            items={[
              'A message is kept for as long as the conversation is live, and for no more than twelve months after the last message in it.',
              'After that, any database copy is deleted. Copies in my mailbox are deleted at the same time.',
              'If Resend delivered the email but the database write failed, the only copy may be the one in my mailbox until I delete it.',
              'A published note stays until you remove it, I take it down, or you ask me to delete it.',
              'A note I hold back stays attached to the account so that account cannot publish another, until you ask me to delete the sign-in.',
              'Removing a note does not delete the sign-in. The sign-in stays until you email me and ask for it to be deleted.',
              'If you ask for deletion sooner, I delete it sooner (see below).',
              'Server logs and Speed Insights data follow Vercel’s own retention schedule, which I do not control.',
            ]}
          />
        </>
      ),
    },
    {
      label: 'Your rights',
      body: (
        <>
          <P>You may, at any time and without giving a reason:</P>
          <List
            items={[
              'ask what I hold about you, and receive a copy;',
              'have anything incorrect corrected;',
              'have your message and details deleted;',
              'withdraw your consent, or object to the way they are used;',
              'complain to the data-protection authority where you live.',
            ]}
          />
          <P>
            Email me from the address you used on the form, or from the address on the Google or GitHub account, so I can match the request. I will confirm
            receipt and act on it within 30 days, and normally much sooner. There is no charge, and I will not ask for
            ID beyond what is needed to confirm the request is yours.
          </P>
        </>
      ),
    },
    {
      label: 'How it is protected',
      body: (
        <>
          <List
            items={[
              'The site is served over HTTPS, so a message is encrypted on its way to me.',
              'The database key that can bypass these rules lives on the server only. It is never shipped to the browser, and the journal does not use it to publish a note.',
              'Message text is escaped before it is placed in an email, so a contact message cannot inject content into my inbox.',
              'The journal session cookie cannot be read by page scripts. A form posted from another site does not include it.',
              'A note is stored as text and shown as text. It is not rendered as HTML.',
              'Field lengths are capped, the address is checked, and a hidden field is used to ignore automated fills before anything is stored or emailed.',
              'One account can publish one note. That limit is enforced in the database, not only in the browser.',
              'Identical contact submissions close together may be collapsed so a second email is not sent. The journal has its own attempt limit. Rate limits are per server process unless a shared store is configured.',
            ]}
          />
          <P>
            No system is perfectly secure and I cannot promise that one is. If a breach affecting your data occurs, I
            will tell you and the relevant authority as the law requires.
          </P>
          <P>
            Do not send passwords, payment details, identity numbers, health information, or anything else sensitive
            through the form. It is not built for it.
          </P>
        </>
      ),
    },
    {
      label: 'Children',
      body: (
        <P>
          This site is not directed at anyone under 16. The contact form and the guest journal are not meant for them. If a child has sent a message, signed in, or left a note, email me and I will delete it.
        </P>
      ),
    },
    {
      label: 'Links to other sites',
      body: (
        <P>
          The site links to external profiles and project addresses, including GitHub, LinkedIn, Instagram, Snapchat,
          Discord, BandLab, and the live pages of the case studies. Once you follow a link, that site’s own policy
          applies, not this one. I am not responsible for what they collect.
        </P>
      ),
    },
    {
      label: 'Changes to this policy',
      body: (
        <P>
          This policy takes effect on {EFFECTIVE}. A change is made here, with the date above updated, before it applies.
          A change that would let me collect more than is listed here is not applied to messages you already sent.
        </P>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy policy."
        description="This site collects very little, and this page says exactly what."
        stamp={{ tag: 'Updated', text: '25 Oct 2026' }}
      />

      <Section className="pt-0">
        <div className="border-b border-border pb-10">
          <p className="max-w-2xl font-display text-[clamp(1.3rem,2.2vw,1.65rem)] leading-[1.4] text-foreground italic">
            If you do not use the contact form or the guest journal, this site does not ask you for a name or an email.
            The host still keeps ordinary access logs, and Vercel Speed Insights records anonymous performance metrics,
            both described below. A contact message is used to answer you and for nothing else.
          </p>
        </div>

        {clauses.map((clause, index) => (
          <section
            key={clause.label}
            className="grid gap-5 border-b border-border py-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-20 lg:py-16"
          >
            <h2 className="max-w-[12rem] text-[0.95rem] leading-snug text-muted lg:sticky lg:top-28 lg:self-start">
              <span className="mr-2 font-mono text-[0.7rem] text-muted-2">{String(index + 1).padStart(2, '0')}</span>
              {clause.label}
            </h2>
            <div className="min-w-0 max-w-2xl">{clause.body}</div>
          </section>
        ))}

        <p className="pt-10 text-sm text-muted">
          Questions about this policy:{' '}
          <a href={`mailto:${email}`} className="link-underline text-foreground">
            {email}
          </a>
          . See also the{' '}
          <Link href="/terms" className="link-underline text-foreground">
            terms of use
          </Link>
          .
        </p>
      </Section>
    </>
  );
}

function P({ children }: { readonly children: ReactNode }) {
  return <p className="mb-4 text-[1.02rem] leading-[1.75] text-muted last:mb-0">{children}</p>;
}

function List({ items }: { readonly items: readonly string[] }) {
  return (
    <ul className="mb-4 grid gap-3 last:mb-0">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[1.02rem] leading-[1.7] text-muted">
          <span aria-hidden="true" className="mt-[0.72rem] h-px w-3 shrink-0 bg-muted-2" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Table({ rows }: { readonly rows: readonly { readonly term: string; readonly text: string }[] }) {
  return (
    <dl className="mb-4 border-t border-border last:mb-0">
      {rows.map((row) => (
        <div key={row.term} className="grid gap-1 border-b border-border py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
          <dt className="text-sm font-medium text-foreground">{row.term}</dt>
          <dd className="text-[0.98rem] leading-[1.7] text-muted">{row.text}</dd>
        </div>
      ))}
    </dl>
  );
}
