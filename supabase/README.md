# Supabase

This replaces the earlier Prisma + local SQLite setup. The site reads content
through `lib/content.ts`, which falls back to the typed seed in
`lib/data/seed.ts` when no credentials are present - so a fresh clone runs
without a database.

## Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Run `migrations/0001_init.sql` in the SQL editor.
4. Run `seed.sql` to load the placeholder rows.

## Security model

- The anon key is public by design. Row level security is the boundary.
- Content tables expose a single `select` policy limited to `is_published = true`.
  There is no anon insert, update, or delete policy anywhere.
- `contact_messages` has **no** anon policy. Only the service role can write to
  it, and nothing can read it through the API.
- `SUPABASE_SERVICE_ROLE_KEY` is only read in `lib/supabase/admin.ts`, which
  imports `server-only`. Importing it from a client component is a build error.

## Guest journal

The journal is a separate table from the content tables. Apply
`migrations/0004_guest_journal.sql` in the SQL editor after `0001_init.sql`.
Do not put secrets in that file or in the repository.

### Providers

In the Supabase dashboard, under Authentication:

1. Enable the Google provider and the GitHub provider. Leave email/password
   sign-ups off. The database rejects any account that is not Google or GitHub.
2. Set the site URL to the real origin (`http://localhost:3000` locally,
   `https://chiradeep.me` in production). Add these redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://chiradeep.me/auth/callback`
3. Google Cloud and GitHub both need the Supabase callback, not the site
   callback: `https://<project-ref>.supabase.co/auth/v1/callback`.
   Put the client id and client secret in the Supabase provider settings.
   Do not commit them.

`NEXT_PUBLIC_SITE_URL` must be that same site origin. The sign-in route will
not follow a `Host` header for any other machine.

### What a visitor can do

- Anyone can read published notes: the chosen name, the text, and the time.
- A signed-in Google or GitHub account can publish one note, revise it, or
  remove it.
- The account id and email are not granted to the anon or authenticated API
  roles. The page never asks the browser to display the email.
- Publishing goes through `private` functions. Those functions set the author
  from `auth.uid()` and the provider from `app_metadata`.

### Holding a note back

Publishing is immediate. To take one off the page without letting that account
post a replacement, run this in the SQL editor:

```sql
update public.guest_notes
set status = 'hidden', updated_at = now()
where id = '<note id>';
```

The note id is the `id` column. It is not the account id.

### Local behaviour

With no Supabase URL and key, `/journal` says the journal is not open and the
API returns 503. It does not pretend a note was saved. After the keys are set,
the page still cannot list or publish notes until the migration has been run
and the two providers work. A failed sign-in returns to `/journal` with a
fixed error. It does not echo the provider's error text.

## Replacing placeholder content

Every content row has `is_placeholder`. Update a row with the real values and
set `is_placeholder = false`; the UI stops rendering the reserved-slot
treatment and shows the content normally. No component changes are needed.
