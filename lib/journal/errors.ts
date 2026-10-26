const JOURNAL_ERRORS: Record<string, { status: number; error: string }> = {
  'journal:unauthenticated': { status: 401, error: 'Sign in before leaving a note.' },
  'journal:provider': { status: 403, error: 'Use Google or GitHub to leave a note.' },
  'journal:exists': { status: 409, error: 'This account already left its note.' },
  'journal:invalid': { status: 400, error: 'Check the name and the note, then try again.' },
  'journal:links': { status: 400, error: 'A note can include one link at most.' },
  'journal:name': { status: 400, error: 'Choose a name that can be shown on the page.' },
  'journal:held': { status: 403, error: 'This note is held back and is not on the page.' },
  'journal:missing': { status: 404, error: 'There is no note from this account to change.' },
};

export function mapJournalError(
  message: string | undefined,
  fallback: string,
): { status: number; error: string } {
  const code = message?.match(/journal:[a-z]+/)?.[0];
  if (code && JOURNAL_ERRORS[code]) return JOURNAL_ERRORS[code];
  return { status: 500, error: fallback };
}
