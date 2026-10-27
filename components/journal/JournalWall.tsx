'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { ArrowPill } from '@/components/ui/ArrowPill';
import { JournalComposer } from './JournalComposer';
import { JournalEntries, journalSlipClass, type JournalSlipNote } from './JournalEntries';
import { JournalSignOut } from './JournalSignIn';
import { JournalTray } from './JournalTray';

type ListState = 'ready' | 'unconfigured' | 'missing' | 'unavailable';

type OwnState =
  | { readonly status: 'signed-out' }
  | { readonly status: 'wrong-provider' }
  | { readonly status: 'unread' }
  | { readonly status: 'hidden' }
  | {
      readonly status: 'ready';
      readonly note: { readonly id: string; readonly displayName: string; readonly body: string; readonly rating: number | null } | null;
    };

export function JournalWall({
  notes,
  truncated,
  listState,
  canSignIn,
  yoursId,
  providerLabel,
  own,
}: {
  readonly notes: readonly JournalSlipNote[];
  readonly truncated: boolean;
  readonly listState: ListState;
  readonly canSignIn: boolean;
  readonly yoursId: string | null;
  readonly providerLabel: string | null;
  readonly own: OwnState;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const signedOut = own.status === 'signed-out';
  const showLeave = canSignIn && signedOut;
  const storedRating = own.status === 'ready' ? (own.note?.rating ?? 0) : 0;
  const [liveRating, setLiveRating] = useState(storedRating);
  const shownNotes = notes.map((note) =>
    yoursId && note.id === yoursId && liveRating >= 1 ? { ...note, rating: liveRating } : note,
  );

  let lead: ReactNode = null;
  if (own.status === 'ready' && providerLabel) {
    lead = (
      <JournalComposer
        key={own.note?.id ?? 'new'}
        note={own.note}
        providerLabel={providerLabel}
        onRatingChange={setLiveRating}
      />
    );
  } else if (own.status === 'wrong-provider') {
    lead = (
      <div className={journalSlipClass(0, 'gap-4')}>
        <p className="text-sm leading-relaxed text-muted">This page only accepts a Google or GitHub sign-in.</p>
        <JournalSignOut />
      </div>
    );
  } else if (own.status === 'unread') {
    lead = (
      <div className={journalSlipClass(0, 'gap-4')} role="alert">
        <p className="text-sm text-accent-rose">Your note could not be read. Nothing new was published.</p>
        <JournalSignOut />
      </div>
    );
  } else if (own.status === 'hidden') {
    lead = (
      <div className={journalSlipClass(0, 'gap-4')}>
        <p className="text-sm leading-relaxed text-muted">
          A note from this account is held back and is not on the page. It cannot be replaced from here.
        </p>
        <JournalSignOut />
      </div>
    );
  }

  return (
    <div>
      <p className="mb-7 text-right text-[0.62rem] font-medium tracking-[0.2em] text-muted-2 uppercase sm:mb-9">
        A quick note&hellip;
      </p>
      <div className="flex w-full items-center justify-between gap-4">
        <div className="min-w-0 max-w-xl flex-1">
          <h2 className="display text-[clamp(1.5rem,3.2vw,2.55rem)] text-foreground">Leave a line.</h2>
          <p className="mt-2 font-display text-[1.05rem] italic text-muted">Come write one line.</p>
        </div>
        {showLeave && (
          <div className="shrink-0">
            <ArrowPill onClick={() => setOpen(true)} expanded={open} controls="journal-login-tray">
              Leave a note
            </ArrowPill>
          </div>
        )}
      </div>
      {showLeave && <JournalTray open={open} onClose={close} />}

      <div className="mt-10 border-t border-border pt-10 sm:mt-12 sm:pt-12">
        {listState === 'ready' ? (
          <JournalEntries notes={shownNotes} truncated={truncated} yoursId={yoursId} lead={lead} />
        ) : listState === 'unconfigured' ? (
          <p className="text-sm text-muted">
            The journal is not open on this copy of the site. Notes are not being stored.
          </p>
        ) : listState === 'missing' ? (
          <p className="text-sm text-muted">
            The journal table is not in the database yet. Nothing can be published until that migration has been applied.
          </p>
        ) : (
          <div className="grid gap-6">
            <p role="alert" className="text-sm text-accent-rose">
              The notes could not be loaded. Refresh the page before assuming the margin is empty.
            </p>
            {lead}
          </div>
        )}
      </div>
    </div>
  );
}
