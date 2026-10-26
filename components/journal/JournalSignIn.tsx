'use client';

import { useCallback, useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import type { JournalProvider } from '@/lib/journal/provider';
import { cn } from '@/lib/utils';
import { JOURNAL_PROVIDERS, providerButtonClass } from './JournalProviders';

function noticeCopy(notice: string): string {
  if (notice === 'rate') return 'Too many sign-in attempts. Wait a few minutes and try again.';
  if (notice === 'closed') return 'The journal is not open on this copy of the site.';
  return 'Sign-in did not start. Try again.';
}

export function JournalSignIn({
  titleId,
  onClose,
}: {
  readonly titleId?: string;
  readonly onClose?: () => void;
} = {}) {
  const [pending, setPending] = useState<JournalProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Without JS the form posts itself and the route answers with a handoff page.
   * With JS we ask for the authorize URL and navigate, which skips that hop.
   */
  const start = useCallback(async (event: FormEvent<HTMLFormElement>, provider: JournalProvider) => {
    event.preventDefault();
    setPending(provider);
    setError(null);

    try {
      const response = await fetch('/auth/signin', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(event.currentTarget),
        credentials: 'same-origin',
      });
      const payload = (await response.json()) as { ok?: boolean; url?: string; notice?: string };

      if (response.ok && payload.ok && typeof payload.url === 'string') {
        window.location.assign(payload.url);
        return;
      }
      setError(noticeCopy(typeof payload.notice === 'string' ? payload.notice : 'auth'));
    } catch {
      setError('Sign-in could not be reached. Check your connection and try again.');
    }
    setPending(null);
  }, []);

  const busy = pending !== null;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <p id={titleId} className="font-display text-[1.65rem] leading-none text-foreground">
          Come write one line.
        </p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-muted transition-[border-color,color,background-color] duration-300 ease-cinematic hover:border-border-strong hover:bg-foreground/[0.04] hover:text-foreground"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ×
            </span>
          </button>
        )}
      </div>
      <div className="mt-6 grid gap-2.5" aria-busy={busy}>
        {JOURNAL_PROVIDERS.map((provider) => (
          <form
            key={provider.id}
            action="/auth/signin"
            method="post"
            onSubmit={(event) => start(event, provider.id)}
          >
            <input type="hidden" name="provider" value={provider.id} />
            <button
              type="submit"
              disabled={busy}
              className={cn(
                providerButtonClass,
                'disabled:cursor-not-allowed disabled:active:scale-100',
                busy && pending !== provider.id && 'opacity-45',
              )}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center">
                {pending === provider.id ? (
                  <Loader2 size={14} strokeWidth={2} aria-hidden="true" className="animate-spin" />
                ) : (
                  provider.mark
                )}
              </span>
              {pending === provider.id ? 'Opening\u2026' : provider.label}
            </button>
          </form>
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-4 text-xs leading-relaxed text-accent-rose">
          {error}
        </p>
      )}
      <p className="mt-4 text-[0.78rem] leading-relaxed text-muted-2">
        One note for the account. Your name stays on the page. The email does not.
      </p>
    </div>
  );
}

export function JournalSignOut({ pill = false }: { readonly pill?: boolean }) {
  return (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        className={
          pill
            ? 'inline-flex min-h-8 items-center rounded-full border border-border px-3 text-xs text-muted transition-[border-color,color,background-color] duration-300 hover:border-border-strong hover:bg-foreground/[0.04] hover:text-foreground'
            : 'text-sm text-muted underline decoration-border underline-offset-4 transition-colors duration-300 hover:text-foreground'
        }
      >
        Sign out
      </button>
    </form>
  );
}
