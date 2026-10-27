'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { capitalizeDisplayName, characterLength, HONEYPOT_FIELD, LIMITS } from '@/lib/journal/validate';
import { cn } from '@/lib/utils';
import { JournalSignOut } from './JournalSignIn';
import { PeekRating } from './PeekRating';

const composerShell =
  'relative flex h-full min-h-52 w-full min-w-0 flex-col gap-4 rounded-[2rem] border border-border bg-surface px-5 py-5 text-left sm:px-6';

const fieldClass =
  'w-full border border-border bg-background text-sm text-foreground outline-none transition-[border-color,background-color] duration-200 placeholder:text-muted-2 focus:border-foreground';

const labelClass = 'text-[0.62rem] tracking-[0.14em] text-muted-2 uppercase';

const CONFETTI_COLORS = ['#2f7bff', '#f0678f', '#e07a3c', '#8b6cf6', '#f8c39a'];

function releaseConfetti(origin: { x: number; y: number }, rating: number) {
  const shared = {
    origin,
    colors: CONFETTI_COLORS,
    disableForReducedMotion: true,
    zIndex: 40,
  };
  void confetti({
    ...shared,
    particleCount: 28 + rating * 8,
    spread: 68,
    startVelocity: 34,
    scalar: 0.9,
    ticks: 200,
  });
  void confetti({
    ...shared,
    particleCount: 14 + rating * 4,
    spread: 110,
    startVelocity: 18,
    decay: 0.92,
    scalar: 0.7,
    ticks: 160,
  });
}

type Phase = 'idle' | 'publishing' | 'removing' | 'published' | 'removed' | 'error';

async function confirmed(response: Response, fallback: string): Promise<string | null> {
  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const record = payload && typeof payload === 'object' ? payload : null;
  const error =
    record &&
    'error' in record &&
    typeof record.error === 'string' &&
    record.error.length > 0 &&
    record.error.length < 300 &&
    !record.error.includes('\n')
      ? record.error
      : null;
  const ok = record !== null && 'ok' in record && record.ok === true;
  if (!response.ok || !ok) return error ?? fallback;
  return null;
}

export function JournalComposer({
  note,
  providerLabel,
  onRatingChange,
}: {
  readonly note: { readonly displayName: string; readonly body: string; readonly rating?: number | null } | null;
  readonly providerLabel: string;
  readonly onRatingChange?: (value: number) => void;
}) {
  const router = useRouter();
  const submitRef = useRef<HTMLButtonElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [displayName, setDisplayName] = useState(note?.displayName ? capitalizeDisplayName(note.displayName) : '');
  const [body, setBody] = useState(note?.body ?? '');
  const [rating, setRating] = useState(note?.rating && note.rating >= 1 ? note.rating : 0);
  const editing = note !== null;
  const busy = phase === 'publishing' || phase === 'removing';
  const count = characterLength(body);
  const over = count > LIMITS.body;

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1) {
      setPhase('error');
      setErrorMessage('Choose a mark before publishing.');
      return;
    }

    setPhase('publishing');
    setErrorMessage('');

    try {
      const response = await fetch('/api/journal', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          body,
          rating,
          [HONEYPOT_FIELD]: new FormData(event.currentTarget).get(HONEYPOT_FIELD),
        }),
      });
      const problem = await confirmed(
        response,
        editing ? 'The note could not be saved.' : 'The note could not be published.',
      );
      if (problem) throw new Error(problem);
      const rect = submitRef.current?.getBoundingClientRect();
      if (rect && rect.width > 0) {
        releaseConfetti(
          {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
          rating,
        );
      }
      setPhase('published');
      router.refresh();
    } catch (error) {
      setPhase('error');
      setErrorMessage(error instanceof Error ? error.message : 'The note could not be published.');
    }
  }

  async function remove() {
    setPhase('removing');
    setErrorMessage('');

    try {
      const response = await fetch('/api/journal', { method: 'DELETE' });
      const problem = await confirmed(response, 'The note could not be removed.');
      if (problem) throw new Error(problem);
      setPhase('removed');
      router.refresh();
    } catch (error) {
      setPhase('error');
      setErrorMessage(error instanceof Error ? error.message : 'The note could not be removed.');
    }
  }

  if (phase === 'published' || phase === 'removed') {
    return (
      <div className={composerShell} role="status">
        <p className="font-display text-lg italic text-foreground">
          {phase === 'removed' ? 'The note was removed.' : 'Your note is in the journal.'}
        </p>
      </div>
    );
  }

  return (
    <div className={composerShell}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-[1.45rem] leading-none tracking-[-0.02em] text-foreground italic">Your note</p>
          <p className="mt-1 text-xs text-muted">Signed in with {providerLabel}</p>
        </div>
        <JournalSignOut pill />
      </div>
      <form onSubmit={publish} className="flex flex-col gap-4" aria-busy={busy} noValidate>
      <PeekRating
        value={rating}
        onChange={(value) => {
          setRating(value);
          onRatingChange?.(value);
        }}
        disabled={busy}
      />

      <div className="grid gap-2">
        <label htmlFor="displayName" className={labelClass}>
          Name
        </label>
        <input
          id="displayName"
          name="displayName"
          value={displayName}
          onChange={(event) => setDisplayName(capitalizeDisplayName(event.target.value))}
          required
          minLength={2}
          maxLength={LIMITS.name}
          autoComplete="nickname"
          aria-describedby="display-name-hint"
          className={cn(fieldClass, 'h-11 rounded-full px-5')}
          disabled={busy}
        />
        <p id="display-name-hint" className="text-xs leading-snug text-muted-2">
          This is the only name that is published. Your email stays off the page.
        </p>
      </div>

      <div className="grid gap-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="journal-body" className={labelClass}>
            Note
          </label>
          <p className={cn('meta', over && 'text-accent-rose')}>
            {count} / {LIMITS.body}
          </p>
        </div>
        <textarea
          id="journal-body"
          name="body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          required
          minLength={12}
          maxLength={LIMITS.body}
          rows={3}
          placeholder="Write the note."
          className={cn(fieldClass, 'resize-y rounded-[1.25rem] px-4 py-3')}
          disabled={busy}
        />
      </div>

      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Website</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {phase === 'error' && (
        <p role="alert" className="text-sm text-accent-rose">
          {errorMessage}
        </p>
      )}

      <div className="mt-auto">
        <button
          ref={submitRef}
          type="submit"
          disabled={busy}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-foreground text-sm font-medium text-background transition-colors duration-200 hover:bg-accent-blue hover:text-white disabled:opacity-60"
        >
          {phase === 'publishing' ? 'Publishing' : editing ? 'Save' : 'Publish'}
        </button>
      </div>

      {editing && !confirmingRemove && (
        <button
          type="button"
          className="self-start text-sm text-muted underline decoration-border underline-offset-4 hover:text-foreground"
          onClick={() => setConfirmingRemove(true)}
          disabled={busy}
        >
          Take it down
        </button>
      )}

      {editing && confirmingRemove && (
        <div className="grid gap-3 border-t border-border pt-4">
          <p className="text-sm text-foreground">Take this note off the page?</p>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              className="text-sm text-accent-rose underline decoration-border underline-offset-4"
              onClick={remove}
              disabled={busy}
            >
              {phase === 'removing' ? 'Removing' : 'Remove it'}
            </button>
            <button
              type="button"
              className="text-sm text-muted underline decoration-border underline-offset-4"
              onClick={() => setConfirmingRemove(false)}
              disabled={busy}
            >
              Keep it
            </button>
          </div>
        </div>
      )}
      </form>
    </div>
  );
}
