import 'server-only';

import { z } from 'zod';
import { createSessionClient } from '@/lib/supabase/session';
import { getReadClient } from '@/lib/supabase/server';
import { mapJournalError } from './errors';
import { journalProvider, type JournalProvider } from './provider';
import type { JournalDraft } from './validate';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const publicRow = z.object({
  id: z.string().regex(UUID),
  body: z.string().min(1).max(600),
  display_name: z.string().min(1).max(32),
  created_at: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Bad date'),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  avatar_url: z.string().max(400).nullable().optional(),
});

const ownRow = publicRow.extend({
  status: z.enum(['published', 'hidden']),
});

export interface PublicNote {
  readonly id: string;
  readonly body: string;
  readonly displayName: string;
  readonly createdAt: string;
  readonly rating: number | null;
  readonly avatarUrl: string | null;
}

export interface OwnNote extends PublicNote {
  readonly status: 'published' | 'hidden';
}

export type NotesResult =
  | { readonly ok: true; readonly notes: readonly PublicNote[]; readonly truncated: boolean }
  | { readonly ok: false; readonly reason: 'unconfigured' | 'missing' | 'unavailable' };

export type OwnNoteResult = { readonly ok: true; readonly note: OwnNote | null } | { readonly ok: false };

export interface JournalSession {
  readonly configured: boolean;
  readonly signedIn: boolean;
  readonly provider: JournalProvider | null;
}

const PAGE_SIZE = 80;

function publicAvatar(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || value.length > 400) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function toPublic(row: z.infer<typeof publicRow>): PublicNote {
  return {
    id: row.id,
    body: row.body,
    displayName: row.display_name,
    createdAt: row.created_at,
    rating: row.rating ?? null,
    avatarUrl: publicAvatar(row.avatar_url),
  };
}

export async function listGuestNotes(): Promise<NotesResult> {
  const supabase = getReadClient();
  if (!supabase) return { ok: false, reason: 'unconfigured' };

  const listed = await supabase
    .from('guest_journal')
    .select('id, body, display_name, created_at, rating, avatar_url')
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE + 1);

  const { data, error } = listed.error
    ? await supabase
        .from('guest_journal')
        .select('id, body, display_name, created_at')
        .order('created_at', { ascending: false })
        .limit(PAGE_SIZE + 1)
    : listed;

  if (error || !Array.isArray(data)) {
    const code = error && 'code' in error ? String(error.code) : '';
    console.error('[journal] public read failed', code || 'unknown');
    const missing = code === 'PGRST205' || code === '42P01' || code === 'PGRST204';
    return { ok: false, reason: missing ? 'missing' : 'unavailable' };
  }

  const notes: PublicNote[] = [];
  for (const row of data) {
    const parsed = publicRow.safeParse(row);
    if (parsed.success) notes.push(toPublic(parsed.data));
  }

  if (data.length > 0 && notes.length === 0) {
    console.error('[journal] public rows failed validation');
    return { ok: false, reason: 'unavailable' };
  }

  const truncated = notes.length > PAGE_SIZE;
  return { ok: true, notes: truncated ? notes.slice(0, PAGE_SIZE) : notes, truncated };
}

export async function readSessionPortrait(): Promise<string | null> {
  const supabase = await createSessionClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const meta = data.user.user_metadata;
  if (!meta || typeof meta !== 'object') return null;
  const record = meta as Record<string, unknown>;
  const raw = record.avatar_url ?? record.picture;
  return publicAvatar(typeof raw === 'string' ? raw : null);
}

export async function readJournalSession(): Promise<JournalSession> {
  const supabase = await createSessionClient();
  if (!supabase) return { configured: false, signedIn: false, provider: null };

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return { configured: true, signedIn: false, provider: null };

  return {
    configured: true,
    signedIn: true,
    provider: journalProvider(data.claims.app_metadata),
  };
}

export async function readOwnNote(): Promise<OwnNoteResult> {
  const supabase = await createSessionClient();
  if (!supabase) return { ok: false };

  const { data, error } = await supabase.rpc('current_guest_note');
  if (error) {
    console.error('[journal] own note failed');
    return { ok: false };
  }

  const rows = Array.isArray(data) ? data : data ? [data] : [];
  if (rows.length === 0) return { ok: true, note: null };

  const parsed = ownRow.safeParse(rows[0]);
  if (!parsed.success) {
    console.error('[journal] own note failed validation');
    return { ok: false };
  }

  return { ok: true, note: { ...toPublic(parsed.data), status: parsed.data.status } };
}

export async function verifiedJournalUser(): Promise<
  | { readonly ok: true; readonly provider: JournalProvider; readonly userId: string }
  | { readonly ok: false; readonly status: number; readonly error: string }
> {
  const supabase = await createSessionClient();
  if (!supabase) {
    return {
      ok: false,
      status: 503,
      error: 'The journal is not open on this copy of the site.',
    };
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { ok: false, status: 401, error: 'Sign in before leaving a note.' };
  }

  const provider = journalProvider(data.user.app_metadata);
  if (!provider) {
    return { ok: false, status: 403, error: 'Use Google or GitHub to leave a note.' };
  }

  return { ok: true, provider, userId: data.user.id };
}

async function writeNote(
  fn: 'submit_guest_note' | 'replace_guest_note',
  draft: JournalDraft,
  fallback: string,
): Promise<{ readonly ok: true } | { readonly ok: false; readonly status: number; readonly error: string }> {
  const supabase = await createSessionClient();
  if (!supabase) {
    return { ok: false, status: 503, error: 'The journal is not open on this copy of the site.' };
  }

  const withMark = await supabase.rpc(fn, {
    p_body: draft.body,
    p_display_name: draft.displayName,
    p_rating: draft.rating,
  });
  const oldSignature =
    withMark.error &&
    'code' in withMark.error &&
    (String(withMark.error.code) === 'PGRST202' || String(withMark.error.code) === '42883');
  const { data, error } = oldSignature
    ? await supabase.rpc(fn, {
        p_body: draft.body,
        p_display_name: draft.displayName,
      })
    : withMark;

  if (error) {
    console.error('[journal] write rejected');
    return { ok: false, ...mapJournalError(error.message, fallback) };
  }

  const rows = Array.isArray(data) ? data : data ? [data] : [];
  const parsed = ownRow.safeParse(rows[0]);
  if (!parsed.success || parsed.data.status !== 'published') {
    console.error('[journal] write was not confirmed');
    return {
      ok: false,
      status: 502,
      error: 'The note was not confirmed. Refresh the page before trying again.',
    };
  }

  return { ok: true };
}

export function submitGuestNote(draft: JournalDraft) {
  return writeNote('submit_guest_note', draft, 'The note could not be published.');
}

export function replaceGuestNote(draft: JournalDraft) {
  return writeNote('replace_guest_note', draft, 'The note could not be saved.');
}

export async function removeGuestNote(): Promise<
  { readonly ok: true } | { readonly ok: false; readonly status: number; readonly error: string }
> {
  const supabase = await createSessionClient();
  if (!supabase) {
    return { ok: false, status: 503, error: 'The journal is not open on this copy of the site.' };
  }

  const { error } = await supabase.rpc('remove_guest_note');
  if (error) {
    console.error('[journal] remove rejected');
    return { ok: false, ...mapJournalError(error.message, 'The note could not be removed.') };
  }

  return { ok: true };
}
