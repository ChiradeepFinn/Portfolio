'use client';

import { useCallback, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/** Ruled field — hairline under the value, no filled SaaS box. */
const fieldClass =
  'w-full border-0 border-b border-border bg-transparent px-0 py-3 text-[0.95rem] leading-snug text-foreground outline-none transition-[border-color] duration-200 placeholder:text-muted-2 focus:border-foreground focus-visible:outline-none disabled:opacity-60';

const labelClass = 'meta uppercase';

async function readErrorMessage(response: Response): Promise<string> {
  const fallback =
    response.status === 429
      ? 'Too many messages. Please wait a few minutes and try again.'
      : 'Your message could not be sent. Please try again.';

  try {
    const payload: unknown = await response.json();
    if (
      payload &&
      typeof payload === 'object' &&
      'error' in payload &&
      typeof payload.error === 'string' &&
      payload.error.length > 0 &&
      payload.error.length < 300 &&
      !payload.error.includes('\n')
    ) {
      return payload.error;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

/** The ring draws, then the check. Reduced motion shows the finished mark. */
function SentMark({ reduce }: { readonly reduce: boolean }) {
  const draw = reduce ? { duration: 0 } : { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <span className="mx-auto grid h-11 w-11 place-items-center text-accent-blue" aria-hidden="true">
      <svg viewBox="0 0 44 44" className="h-11 w-11">
        <motion.circle
          cx="22"
          cy="22"
          r="20.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity={0.55}
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={draw}
        />
        <motion.path
          d="M13.5 22.5 19.2 28.2 30.5 15.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={reduce ? { duration: 0 } : { duration: 0.32, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </span>
  );
}

function Field({
  id,
  label,
  children,
  className,
}: {
  readonly id: string;
  readonly label: string;
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <div className={cn('grid gap-2', className)}>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const reduce = useReducedMotion();
  const busy = status === 'submitting';

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      form.reset();
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong.');
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="border-t border-border pt-10 text-center sm:pt-12"
        >
          <SentMark reduce={reduce === true} />
          <p className="display mt-5 text-2xl text-foreground">Message sent.</p>
          <p className="body-copy mt-3">Thanks for reaching out - I&apos;ll reply as soon as I can.</p>
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="link-underline mt-7 text-sm text-muted transition-colors duration-200 hover:text-foreground"
          >
            Send another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={false}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
          className="relative grid gap-8 sm:gap-9"
          aria-busy={busy}
          // WebMCP Declarative API (Chrome origin trial / flag). No-op in browsers without it.
          toolname="submit_contact"
          tooldescription="Send Chiradeep a contact message about freelance work, collaborations, or a full-time role. Fills the on-page form; the visitor still confirms send."
        >
          <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-8">
            <Field id="name" label="Name">
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={120}
                autoComplete="name"
                disabled={busy}
                className={fieldClass}
                toolparamdescription="Visitor's name"
              />
            </Field>
            <Field id="email" label="Email">
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
                disabled={busy}
                className={fieldClass}
                toolparamdescription="Visitor's reply-to email address"
              />
            </Field>
          </div>

          <Field id="subject" label="Subject">
            <input
              id="subject"
              name="subject"
              type="text"
              required
              maxLength={160}
              disabled={busy}
              className={fieldClass}
              toolparamdescription="Short subject line for the message"
            />
          </Field>

          <Field id="message" label="Message">
            <textarea
              id="message"
              name="message"
              rows={7}
              required
              minLength={10}
              maxLength={5000}
              disabled={busy}
              className={cn(fieldClass, 'min-h-[10.5rem] resize-y pb-4')}
              toolparamdescription="The message body. Include context for the ask."
            />
          </Field>

          <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="company_website">Company website</label>
            <input
              id="company_website"
              name="company_website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          {status === 'error' && (
            <p role="alert" className="text-sm text-accent-rose">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className={cn(
              'group mt-1 inline-flex w-fit max-w-full items-center gap-2 rounded-pill border border-border bg-wash py-1 pr-1 pl-4',
              'text-[0.8rem] font-medium text-foreground transition-[border-color,background-color,opacity] duration-300',
              'hover:border-border-strong hover:bg-foreground/[0.04]',
              'focus-visible:border-border-strong focus-visible:bg-foreground/[0.04] focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm',
            )}
          >
            <span className="min-w-0 transition-transform duration-500 motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-visible:translate-x-0.5">
              {busy ? 'Sending' : 'Send message'}
            </span>
            <span className="relative grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full bg-foreground text-background transition-colors duration-300 group-hover:bg-accent-blue group-focus-visible:bg-accent-blue sm:h-8 sm:w-8">
              {busy ? (
                <Loader2 size={14} strokeWidth={2} aria-hidden="true" className="animate-spin" />
              ) : (
                <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
              )}
            </span>
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
