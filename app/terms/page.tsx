import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { identity } from '@/lib/site';

export const metadata: Metadata = withCanonical('/terms', {
  title: 'Terms of Use',
  description:
    'Who runs this portfolio, what the work on it is, and how it may be read, quoted, and contacted.',
});

const EFFECTIVE = '13 October 2026';
const UPDATED = '25 October 2026';

interface Clause {
  readonly id: string;
  readonly label: string;
  readonly body: ReactNode;
}

export default function TermsPage() {
  const email = identity.email;

  const clauses: readonly Clause[] = [
    {
      id: 'who-runs-the-site',
      label: 'Who runs the site',
      body: (
        <>
          <P>
            This site is run by {identity.name}, an individual based in {identity.location}. There is no company, no
            registered business, and no legal representative behind it. These terms do not create one.
          </P>
          <P>
            Questions about them go to{' '}
            <a href={`mailto:${email}`} className="link-underline text-foreground">
              {email}
            </a>
            .
          </P>
        </>
      ),
    },
    {
      id: 'what-this-site-contains',
      label: 'What this site contains',
      body: (
        <>
          <P>
            The site is a personal portfolio: projects, software, research, music, books, photography, artwork, and
            writing. The projects page includes case studies and a spine entry for this site itself — how it is built —
            so the portfolio is treated as work, not only as a frame around other work. Some of it is finished. Some of
            it is still being made. The guest journal is a public page of notes left by visitors. A page that says the
            work is in progress means exactly that. It is a record of the current state, not a finished result and not a
            publication.
          </P>
          <P>
            Nothing here is an offer of a commercial service, a product for sale, or a professional engagement. Reading
            a project does not hire me, and a prototype is not a promise that the same thing can be built for someone
            else. Pages change as the work changes.
          </P>
        </>
      ),
    },
    {
      id: 'guest-journal',
      label: 'Guest journal',
      body: (
        <>
          <P>
            If you sign in with Google or GitHub and leave a note, the name you choose and the note are published for
            anyone to read. Your email is not. One account, one note. I can take a note off the page if it is spam,
            abusive, or otherwise not something I am willing to host. Taking it down does not by itself delete the
            sign-in. Email me if you want the sign-in deleted as well.
          </P>
          <P>Do not post someone else’s personal information, and do not present the note as if you were me.</P>
        </>
      ),
    },
    {
      id: 'intellectual-property',
      label: 'Intellectual property',
      body: (
        <>
          <P>
            Unless a page says otherwise, original text, images, music, and other work I publish here are mine. That is
            not a claim that every file on the site is exclusively mine. Material that belongs to someone else stays
            with them. Software keeps the licence that ships with it, including the licence on a dependency or on an
            example that names another author.
          </P>
          <P>You may:</P>
          <List
            items={[
              'read the site, and share a link to a page;',
              'quote a short passage, with credit and a link back to the page;',
              'use software only within the licence that applies to that software.',
            ]}
          />
          <P>
            You may not copy a project, a photograph, a track, or a text and present it as your own, and you may not
            remove a credit or a licence notice. If a page does not name a licence for the code, do not assume there is
            one. Silence is not permission to copy it.
          </P>
          <P>
            Rights the law already gives you stay in place. That includes fair dealing and any other exception that
            applies where you are. This section does not take those rights away. If you want to use something beyond
            ordinary reading and a short quotation, ask first.
          </P>
        </>
      ),
    },
    {
      id: 'research',
      label: 'Research',
      body: (
        <>
          <P>
            Research pages describe investigations. They include work that is still being planned and work that has not
            been published in a journal or other venue. A status of “in progress” means the study is not finished. A
            status of “done” means the study was carried out. It does not, by itself, mean the work has a venue, a DOI,
            an affiliation, or peer review. The page says so when one of those is true.
          </P>
          <P>
            Methods, figures, and notes may be preliminary. Do not cite a page as a published paper, and do not treat a
            result here as settled fact, as professional advice, or as something you should act on. Datasets, papers,
            and tools named on those pages belong to their authors. Mentioning them does not give you their rights, and
            it is not an endorsement.
          </P>
        </>
      ),
    },
    {
      id: 'software',
      label: 'Software and prototypes',
      body: (
        <>
          <P>
            Code, technical examples, prototypes, and demonstrations are shown so the work can be read. They may be
            incomplete, out of date, or unsuitable to run against data you care about. A linked repository is governed
            by the licence in that repository, when it has one.
          </P>
          <P>
            An example is not a warranty that the software works, is secure, is fit for a purpose, or will be kept
            running. Do not rely on a prototype for anything that could affect people, money, health, or safety. If you
            run code you found here, you do so for yourself, within the licence that applies, and you are responsible
            for what you do with it.
          </P>
        </>
      ),
    },
    {
      id: 'creative-work',
      label: 'Music, books, and images',
      body: (
        <>
          <P>
            Music on the site is original composition, demo, and production work. A title is listed when there is a
            recording to name. Books on the shelf are published writing. If an edition detail is missing from the page,
            it is missing from the record, not an invitation to invent one. Photographs and artwork appear when the
            files are part of this portfolio. An empty frame is a placeholder, not a work you can take.
          </P>
          <P>
            Listening, looking, and reading here are welcome. That does not transfer copyright. It does not let you
            reproduce, sell, redistribute, or train a model on the work, except where a licence on the page allows it
            or the law already does. A collaborator, a sample, a platform, or another rightsholder may still have
            rights in a piece. Those rights stay where they are.
          </P>
        </>
      ),
    },
    {
      id: 'acceptable-use',
      label: 'Acceptable use',
      body: (
        <>
          <P>You may browse the site, follow its links, and send a genuine message. You may not:</P>
          <List
            items={[
              'attack, probe, or disrupt the site, its host, or the services that carry a message;',
              'try to reach the database, the server, my inbox, or anyone else’s message;',
              'flood the contact form, or try to get around the limit on repeated submissions;',
              'send malware, or use the form to deceive someone;',
              'scrape or automate requests in a way that degrades the site;',
              'impersonate me, or remove a notice that says who made a work;',
              'use the site to harass a person.',
            ]}
          />
          <P>
            The site is not directed at anyone under 16. That limit, and what happens if a child’s message arrives, is
            described in the privacy policy.
          </P>
        </>
      ),
    },
    {
      id: 'contact',
      label: 'The contact form',
      body: (
        <>
          <P>
            The form is a way to write to me. It takes a name, an email address, a subject, and a message, and only when
            you choose to submit it. Nothing is sent as you type. Sending a message is not an order, a booking, or an
            agreement that I will do work. I read what arrives and I try to reply. I do not promise a reply, a time, or
            that I am available.
          </P>
          <P>
            What happens to the message is set out in the{' '}
            <Link href="/privacy" className="link-underline text-foreground">
              privacy policy
            </Link>
            . In short: Resend delivers it to my inbox as an email. A successful send means Resend accepted that email.
            After that, the server tries to keep a copy in Supabase; that write is best-effort and is not required for
            the form to report success. The database is not open to the public or to browsers. If email is not
            configured, or the provider rejects the message, the form says so and the message is not treated as sent.
          </P>
          <P>
            Repeated or automated submissions can be refused or ignored. Identical submissions close together may be
            collapsed so a second email is not sent. To limit flooding, the server may keep a short-lived hash of a
            network address in memory. The hash is not written into the contact record, it is not a profile, and it is
            not shared across every server process. A hidden field is used to drop automated fills before anything is
            stored or emailed. Do not send passwords, payment details, identity numbers, health information, or anything
            else sensitive. The form is not built for it.
          </P>
          <P>
            A message is used to answer you. It is not added to a marketing list. The privacy policy explains how long
            it is kept and how to ask for it to be deleted.
          </P>
        </>
      ),
    },
    {
      id: 'external-links',
      label: 'Links and other services',
      body: (
        <>
          <P>
            The site links to external profiles and project addresses, including GitHub, LinkedIn, Instagram, Snapchat,
            Discord, BandLab, and the live pages of the case studies. Once you follow a link, that site’s own terms and
            privacy policy apply. I do not control what they collect, and I am not responsible for it.
          </P>
          <P>A message you submit is handled only by the services named in the privacy policy:</P>
          <List
            items={[
              'Supabase, which may store a contact message after delivery, and a guest note and sign-in if you use the journal;',
              'Google or GitHub, if you choose one of them to sign in on the journal;',
              'Resend, which delivers a contact message as email;',
              'my email provider, which receives it;',
              'Vercel, which hosts the site and may record access logs and anonymous performance metrics (Speed Insights).',
            ]}
          />
          <P>
            The host records ordinary access logs: the request time, the page requested, an IP address, and a user
            agent. I do not collect, export, or analyse those logs for my own marketing. Vercel Speed Insights measures
            how pages perform; it is not advertising and it is not a mailing list. The privacy policy describes it.
            The site sets a cookie only after you sign in on the guest journal, so that page can keep your session. It
            is not an advertising cookie. A light or dark theme choice stays in your browser’s local storage and does
            not leave your device. No advertising or retargeting tags are installed.
          </P>
        </>
      ),
    },
    {
      id: 'availability',
      label: 'Availability',
      body: (
        <P>
          The site is offered as it stands. I may change a page, remove one, or take the site down for maintenance,
          without notice. I do not promise that a page, a demo, a file, or an external link will stay available or free
          of errors. There is no service agreement to breach when something is down.
        </P>
      ),
    },
    {
      id: 'liability',
      label: 'Disclaimers and liability',
      body: (
        <>
          <P>
            Needs legal review. The next paragraph is an attempt to describe liability without taking away rights the
            law keeps. It has not been reviewed by a lawyer. It is not legal advice, and a court may not read it the
            way it is written.
          </P>
          <P>
            Except for a warranty or a right that applicable law does not let me exclude, the site and its contents are
            provided without a warranty of accuracy, completeness, fitness for a purpose, or non-infringement.
            Research, prototypes, and unfinished work are especially likely to be incomplete or wrong.
          </P>
          <P>
            To the extent the law allows, I am not liable for loss or damage that comes from using the site, relying on
            something written here, following a link, or running software you found here. This does not exclude or
            limit liability that the law does not allow an individual to exclude or limit. Where those rules apply,
            that can include liability for fraud, or for death or personal injury caused by negligence. If the law
            where you are gives you a right that cannot be waived, that right remains.
          </P>
        </>
      ),
    },
    {
      id: 'applicable-law',
      label: 'Law and disputes',
      body: (
        <>
          <P>
            Needs legal review. This section does not choose a court or a legal system. It should be read by a lawyer
            before anyone relies on it. It is not legal advice.
          </P>
          <P>
            I live in {identity.location}, and I wrote these terms there as an individual. They do not appoint a court,
            an arbitrator, a mediator, or any other formal process, and they do not claim that one law governs every
            reader. If you have a complaint about the site, write to me first and I will try to resolve it directly.
            Which law applies, and where a claim can be heard, depends on the facts and on rules I cannot set aside by
            writing a sentence here.
          </P>
        </>
      ),
    },
    {
      id: 'changes',
      label: 'Changes to these terms',
      body: (
        <P>
          These terms take effect on {EFFECTIVE}. They were last updated on {UPDATED}. A change is published on this
          page, and the dates above move, before I treat the new text as current. If you keep using the site after that
          date, you are using it under the updated terms. If you do not accept a change, stop using the site. A change
          here does not rewrite the privacy policy. That page has its own date.
        </P>
      ),
    },
    {
      id: 'contact-details',
      label: 'Contact',
      body: (
        <P>
          {identity.name}. {identity.location}.{' '}
          <a href={`mailto:${email}`} className="link-underline text-foreground">
            {email}
          </a>
          .
        </P>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Terms"
        title="Terms of use."
        description="How this site may be read, and what the work on it is and is not."
        stamp={{ tag: 'Updated', text: '25 Oct 2026' }}
      />

      <Section className="pt-0">
        <div className="border-b border-border pb-10">
          <p className="max-w-2xl font-display text-[clamp(1.3rem,2.2vw,1.65rem)] leading-[1.4] text-foreground italic">
            These terms cover use of this personal portfolio. They are not a contract for paid work, and they are not
            legal advice. The notes on liability and on disputes are marked where a lawyer should still look.
          </p>
        </div>

        <nav aria-label="On this page" className="border-b border-border py-10">
          <p className="font-mono text-[0.7rem] tracking-[0.08em] text-muted-2 uppercase">On this page</p>
          <ol className="mt-5 grid gap-x-10 gap-y-2 sm:grid-cols-2">
            {clauses.map((clause, index) => (
              <li key={clause.id}>
                <a
                  href={`#${clause.id}`}
                  className="inline-flex items-baseline gap-3 py-1 text-[0.95rem] leading-snug text-muted hover:text-foreground"
                >
                  <span className="font-mono text-[0.7rem] text-muted-2">{String(index + 1).padStart(2, '0')}</span>
                  <span className="link-underline">{clause.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {clauses.map((clause, index) => (
          <section
            key={clause.id}
            id={clause.id}
            aria-labelledby={`${clause.id}-heading`}
            className="grid scroll-mt-28 gap-5 border-b border-border py-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-20 lg:py-16"
          >
            <h2
              id={`${clause.id}-heading`}
              className="max-w-[12rem] text-[0.95rem] leading-snug text-muted lg:sticky lg:top-28 lg:self-start"
            >
              <span className="mr-2 font-mono text-[0.7rem] text-muted-2">{String(index + 1).padStart(2, '0')}</span>
              {clause.label}
            </h2>
            <div className="min-w-0 max-w-2xl">{clause.body}</div>
          </section>
        ))}

        <p className="pt-10 text-sm text-muted">
          Questions about these terms:{' '}
          <a href={`mailto:${email}`} className="link-underline text-foreground">
            {email}
          </a>
          . See also the{' '}
          <Link href="/privacy" className="link-underline text-foreground">
            privacy policy
          </Link>
          , or return to the{' '}
          <Link href="/" className="link-underline text-foreground">
            portfolio
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
