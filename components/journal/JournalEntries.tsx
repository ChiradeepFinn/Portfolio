import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatJournalDate } from '@/lib/journal/format';
import { JOURNAL_MARKS, journalMarkLabel } from '@/lib/journal/mark';
import { capitalizeDisplayName } from '@/lib/journal/validate';
import type { ReactNode } from 'react';

export interface JournalSlipNote {
  readonly id: string;
  readonly body: string;
  readonly displayName: string;
  readonly createdAt: string;
  readonly rating: number | null;
  readonly avatarUrl: string | null;
}

function NotePortrait({ name, src }: { readonly name: string; readonly src: string | null }) {
  const letter = Array.from(name.trim())[0]?.toUpperCase() ?? '·';
  return (
    <span
      aria-hidden="true"
      className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border border-border-strong bg-background font-display text-2xl leading-none text-foreground italic"
    >
      {src ? (
        // The address is copied from the signed-in account and checked as https before it reaches the page.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          width={64}
          height={64}
          decoding="async"
          className="size-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        letter
      )}
    </span>
  );
}

export function journalSlipClass(index: number, className?: string): string {
  const paper = index % 2 === 0 ? 'bg-surface' : 'bg-surface-2';
  return cn(
    'relative flex w-full min-w-0 flex-col gap-3 rounded-[2rem] border border-border px-5 py-4 text-left sm:px-6',
    paper,
    className,
  );
}

export function JournalEntries({
  notes,
  truncated,
  yoursId,
  lead,
}: {
  readonly notes: readonly JournalSlipNote[];
  readonly truncated: boolean;
  readonly yoursId: string | null;
  readonly lead?: ReactNode;
}) {
  if (!lead && notes.length === 0) {
    return <p className="border-t border-border pt-8 text-sm text-muted">Nothing in the margin yet.</p>;
  }

  return (
    <div>
      {/*
        Equal columns + full-width slips keep the gap between every card exact
        (row and column). New notes inherit the same rhythm automatically.
      */}
      <ul className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-6">
        {lead ? <li className="min-w-0">{lead}</li> : null}
        {notes.map((note, index) => {
          const date = formatJournalDate(note.createdAt);
          const slipIndex = lead ? index + 1 : index;
          const name = capitalizeDisplayName(note.displayName);
          return (
            <li key={note.id} className={journalSlipClass(slipIndex)}>
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-display text-2xl leading-none tracking-[-0.03em] text-foreground italic">
                    {name}
                  </p>
                  {note.id === yoursId && <p className="meta mt-1.5">Yours</p>}
                </div>
                <NotePortrait name={name} src={note.avatarUrl} />
              </div>
              {note.rating !== null && journalMarkLabel(note.rating) && (
                <div className="flex items-center gap-2.5" aria-label={`${journalMarkLabel(note.rating)}, ${note.rating} of 5`}>
                  <span className="flex items-center gap-1" aria-hidden="true">
                    {JOURNAL_MARKS.map((mark) => {
                      const filled = mark.value <= (note.rating ?? 0);
                      return (
                        <Heart
                          key={mark.value}
                          strokeWidth={1.6}
                          fill={filled ? 'currentColor' : 'transparent'}
                          className={filled ? 'h-3.5 w-3.5 text-accent-rose' : 'h-3.5 w-3.5 text-muted-2'}
                        />
                      );
                    })}
                  </span>
                  <span className="font-display text-sm italic text-muted">{journalMarkLabel(note.rating)}</span>
                </div>
              )}
              <p className="max-w-[36ch] text-[0.95rem] leading-relaxed whitespace-pre-wrap text-foreground [overflow-wrap:anywhere]">
                {note.body}
              </p>
              {date && (
                <time dateTime={note.createdAt} className="meta mt-auto pt-1">
                  {date}
                </time>
              )}
            </li>
          );
        })}
      </ul>
      {truncated && <p className="mt-6 text-sm text-muted-2">Showing the latest 80 notes.</p>}
    </div>
  );
}
