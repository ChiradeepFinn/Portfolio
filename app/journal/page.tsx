import type { Metadata } from 'next';
import { withCanonical } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/layout/Section';
import { JournalAvatarCircles } from '@/components/journal/JournalAvatarCircles';
import { JournalReel } from '@/components/journal/JournalReel';
import { JournalProviderForms } from '@/components/journal/JournalProviders';
import { JournalWall } from '@/components/journal/JournalWall';
import { listGuestNotes, readJournalSession, readOwnNote, readSessionPortrait } from '@/lib/journal/notes';

export const metadata: Metadata = withCanonical('/journal', {
  title: 'Guest journal',
  description: 'One public note per Google or GitHub account. The email address stays off the page.',
});

export const dynamic = 'force-dynamic';

function noticeCopy(value: string | undefined): string | null {
  if (value === 'auth') return 'Sign-in did not finish. Nothing was published.';
  if (value === 'signout') return 'Sign-out did not finish. Try again.';
  if (value === 'rate') return 'Too many sign-in attempts. Wait a few minutes and try again.';
  if (value === 'closed') return 'The journal is not open on this copy of the site. Nothing was published.';
  return null;
}

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string | string[] }>;
}) {
  const params = await searchParams;
  const notice = noticeCopy(typeof params.notice === 'string' ? params.notice : undefined);

  const notesPromise = listGuestNotes();
  const session = await readJournalSession();
  const [notes, own] = await Promise.all([
    notesPromise,
    session.signedIn ? readOwnNote() : Promise.resolve({ ok: true as const, note: null }),
  ]);

  const canSignIn = session.configured && (notes.ok || notes.reason === 'unavailable');
  const yoursId = own.ok && own.note?.status === 'published' ? own.note.id : null;
  const portrait = yoursId ? await readSessionPortrait() : null;
  const wallNotes = notes.ok
    ? notes.notes.map((note) =>
        portrait && note.id === yoursId && !note.avatarUrl ? { ...note, avatarUrl: portrait } : note,
      )
    : [];
  const providerLabel = session.provider === 'github' ? 'GitHub' : session.provider === 'google' ? 'Google' : null;

  const ownState = !session.signedIn
    ? ({ status: 'signed-out' } as const)
    : !session.provider
      ? ({ status: 'wrong-provider' } as const)
      : !own.ok
        ? ({ status: 'unread' } as const)
        : own.note?.status === 'hidden'
          ? ({ status: 'hidden' } as const)
          : ({
              status: 'ready' as const,
              note: own.note
                ? {
                    id: own.note.id,
                    displayName: own.note.displayName,
                    body: own.note.body,
                    rating: own.note.rating,
                  }
                : null,
            } as const);

  return (
    <>
      <PageHeader
        eyebrow="Guest journal"
        eyebrowPlacement="aside"
        live
        title="Leave one line in the margin."
        description="The name you choose is public. Your email is not. One note for each Google or GitHub account."
      >
        <JournalAvatarCircles notes={wallNotes} />
      </PageHeader>

      <Section border="top" className="pt-0">
        {notice && (
          <p role="alert" className="mb-8 text-sm text-accent-rose">
            {notice}
          </p>
        )}
        {notes.ok && <JournalReel notes={wallNotes} />}
        <JournalWall
          notes={wallNotes}
          truncated={notes.ok ? notes.truncated : false}
          listState={notes.ok ? 'ready' : notes.reason}
          canSignIn={canSignIn}
          yoursId={yoursId}
          providerLabel={providerLabel}
          own={ownState}
        />
        {canSignIn && !session.signedIn && (
          <noscript>
            <div className="mt-8 max-w-sm">
              <JournalProviderForms />
              <p className="mt-4 text-xs leading-relaxed text-muted-2">
                Publishing a note needs JavaScript. Signing in does not.
              </p>
            </div>
          </noscript>
        )}
      </Section>
    </>
  );
}
