'use client';

export default function JournalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-6 pt-36 pb-20 sm:pt-44">
      <p className="eyebrow text-accent-blue">Guest journal</p>
      <p role="alert" className="mt-6 text-sm text-foreground">
        The journal could not be opened.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 text-sm text-muted underline decoration-border underline-offset-4 hover:text-foreground"
      >
        Try again
      </button>
    </div>
  );
}
