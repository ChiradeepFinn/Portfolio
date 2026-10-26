import type { ReactNode } from 'react';
import type { JournalProvider } from '@/lib/journal/provider';

/**
 * Shared by the interactive tray and the noscript fallback on the journal page,
 * so the fallback stays server-rendered and ships no client JavaScript.
 */
export const JOURNAL_PROVIDERS: readonly { id: JournalProvider; label: string; mark: ReactNode }[] = [
  { id: 'google', label: 'Continue with Google', mark: <GoogleMark /> },
  { id: 'github', label: 'Continue with GitHub', mark: <GitHubMark /> },
];

export const providerButtonClass =
  'flex w-full items-center gap-3 rounded-full border border-border bg-background px-4 py-2.5 text-left text-sm text-foreground transition-[border-color,background-color,transform,opacity] duration-300 ease-cinematic hover:border-border-strong hover:bg-foreground/[0.04] active:scale-[0.98]';

export function JournalProviderForms() {
  return (
    <div className="grid gap-2.5">
      {JOURNAL_PROVIDERS.map((provider) => (
        <form key={provider.id} action="/auth/signin" method="post">
          <input type="hidden" name="provider" value={provider.id} />
          <button type="submit" className={providerButtonClass}>
            <span className="grid h-6 w-6 shrink-0 place-items-center">{provider.mark}</span>
            {provider.label}
          </button>
        </form>
      ))}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-4 w-4">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 22.294 24 17.797 24 12.5 24 5.87 18.627.5 12 .5z" />
    </svg>
  );
}
