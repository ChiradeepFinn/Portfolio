-- Guest journal.
--
-- One note per auth user. Visitors can read published notes through the
-- guest_journal view: name, text, and time. The auth user id, email, and
-- provider are not granted to anon or authenticated.
--
-- Writes go through security definer functions in the private schema. The
-- functions take the author from auth.uid() and the provider from
-- app_metadata. They never trust user_metadata.
--
-- A note is published immediately. To hold one back, run this in the SQL
-- editor (it bypasses the API):
--   update public.guest_notes
--   set status = 'hidden', updated_at = now()
--   where id = '<note id>';
-- A held note stays tied to the account, so that account cannot publish another.

create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;
grant usage on schema private to authenticated;

create table if not exists public.guest_notes (
  id           uuid primary key default gen_random_uuid(),
  author_id    uuid not null references auth.users (id) on delete cascade,
  body         text not null,
  display_name text not null,
  provider     text not null,
  status       text not null default 'published',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint guest_notes_one_author unique (author_id),
  constraint guest_notes_provider check (provider in ('google', 'github')),
  constraint guest_notes_status check (status in ('published', 'hidden')),
  constraint guest_notes_body_len check (char_length(body) between 12 and 600),
  constraint guest_notes_name_len check (char_length(display_name) between 2 and 32)
);

create index if not exists guest_notes_published_created_idx
  on public.guest_notes (created_at desc)
  where status = 'published';

alter table public.guest_notes enable row level security;

revoke all on table public.guest_notes from public, anon, authenticated;
grant select (id, body, display_name, created_at, status)
  on public.guest_notes to anon, authenticated;
grant all on table public.guest_notes to service_role;

drop policy if exists guest_notes_select_published on public.guest_notes;
create policy guest_notes_select_published
  on public.guest_notes
  for select
  to anon, authenticated
  using (status = 'published');

create or replace view public.guest_journal
with (security_invoker = true) as
select id, body, display_name, created_at
from public.guest_notes
where status = 'published';

revoke all on table public.guest_journal from public, anon, authenticated;
grant select on table public.guest_journal to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Normalization and checks. Kept in private so the Data API cannot call them.
-- Limits match lib/journal/validate.ts: name 2–32, body 12–600, one link.
-- ---------------------------------------------------------------------------

create or replace function private.normalize_guest_name(raw text)
returns text
language sql
immutable
set search_path = ''
as $$
  select regexp_replace(btrim(coalesce(raw, '')), '[[:space:]]+', ' ', 'g');
$$;

create or replace function private.normalize_guest_body(raw text)
returns text
language sql
immutable
set search_path = ''
as $$
  select btrim(
    regexp_replace(
      regexp_replace(replace(coalesce(raw, ''), chr(13), ''), '[ \t]{2,}', ' ', 'g'),
      E'\\n{3,}',
      E'\\n\\n',
      'g'
    )
  );
$$;

create or replace function private.assert_guest_note(p_body text, p_name text)
returns void
language plpgsql
immutable
set search_path = ''
as $$
begin
  if p_body is null or p_name is null
     or char_length(p_body) < 12 or char_length(p_body) > 600
     or char_length(p_name) < 2 or char_length(p_name) > 32
     or regexp_replace(p_body, '[' || chr(10) || chr(9) || ']', '', 'g') ~ '[[:cntrl:]]'
     or p_name ~ '[[:cntrl:]]'
     or p_body ~ ('[' || chr(8234) || '-' || chr(8238) || ']')
     or p_body ~ ('[' || chr(8294) || '-' || chr(8297) || ']')
     or p_name ~ ('[' || chr(8234) || '-' || chr(8238) || ']')
     or p_name ~ ('[' || chr(8294) || '-' || chr(8297) || ']')
     or p_body ~ '(.)\1{11,}'
  then
    raise exception 'journal:invalid' using errcode = 'P0001';
  end if;

  if (
    select count(*)::int
    from regexp_matches(p_body, 'https?://|www\.', 'gi')
  ) > 1 then
    raise exception 'journal:links' using errcode = 'P0001';
  end if;

  if p_name ~ '[!@#$%^&*()_+=\[\]{}|\\:;"<>,?/`~]'
     or p_name ~* 'https?://|www\.'
     or lower(p_name) in ('chiradeep', 'chiradeep finn')
     or (p_name !~ '[A-Za-z]' and octet_length(p_name) = char_length(p_name))
  then
    raise exception 'journal:name' using errcode = 'P0001';
  end if;
end;
$$;

create or replace function private.guest_provider()
returns text
language plpgsql
stable
set search_path = ''
as $$
declare
  meta jsonb := coalesce(auth.jwt() -> 'app_metadata', '{}'::jsonb);
  latest text := meta ->> 'provider';
  providers jsonb := coalesce(meta -> 'providers', '[]'::jsonb);
begin
  if auth.uid() is null then
    raise exception 'journal:unauthenticated' using errcode = 'P0001';
  end if;

  if latest in ('google', 'github') then
    return latest;
  elsif providers ? 'github' then
    return 'github';
  elsif providers ? 'google' then
    return 'google';
  end if;

  raise exception 'journal:provider' using errcode = 'P0001';
end;
$$;

create or replace function private.submit_guest_note(p_body text, p_display_name text)
returns setof public.guest_notes
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  prov text;
  clean_body text;
  clean_name text;
begin
  if uid is null then
    raise exception 'journal:unauthenticated' using errcode = 'P0001';
  end if;

  prov := private.guest_provider();
  clean_body := private.normalize_guest_body(p_body);
  clean_name := private.normalize_guest_name(p_display_name);
  perform private.assert_guest_note(clean_body, clean_name);

  return query
    insert into public.guest_notes (author_id, body, display_name, provider, status)
    values (uid, clean_body, clean_name, prov, 'published')
    returning *;
exception
  when unique_violation then
    raise exception 'journal:exists' using errcode = 'P0001';
end;
$$;

create or replace function private.replace_guest_note(p_body text, p_display_name text)
returns setof public.guest_notes
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  clean_body text;
  clean_name text;
begin
  if uid is null then
    raise exception 'journal:unauthenticated' using errcode = 'P0001';
  end if;

  perform private.guest_provider();
  clean_body := private.normalize_guest_body(p_body);
  clean_name := private.normalize_guest_name(p_display_name);
  perform private.assert_guest_note(clean_body, clean_name);

  return query
    update public.guest_notes
    set body = clean_body,
        display_name = clean_name,
        updated_at = pg_catalog.now()
    where author_id = uid
      and status = 'published'
    returning *;

  if found then
    return;
  end if;

  if exists (
    select 1 from public.guest_notes
    where author_id = uid and status = 'hidden'
  ) then
    raise exception 'journal:held' using errcode = 'P0001';
  end if;

  raise exception 'journal:missing' using errcode = 'P0001';
end;
$$;

create or replace function private.remove_guest_note()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'journal:unauthenticated' using errcode = 'P0001';
  end if;

  perform private.guest_provider();

  delete from public.guest_notes
  where author_id = uid
    and status = 'published';

  if found then
    return;
  end if;

  if exists (
    select 1 from public.guest_notes
    where author_id = uid and status = 'hidden'
  ) then
    raise exception 'journal:held' using errcode = 'P0001';
  end if;

  raise exception 'journal:missing' using errcode = 'P0001';
end;
$$;

create or replace function private.current_guest_note()
returns setof public.guest_notes
language plpgsql
security definer
stable
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'journal:unauthenticated' using errcode = 'P0001';
  end if;

  return query
    select *
    from public.guest_notes
    where author_id = uid;
end;
$$;

revoke all on function private.normalize_guest_name(text) from public, anon, authenticated;
revoke all on function private.normalize_guest_body(text) from public, anon, authenticated;
revoke all on function private.assert_guest_note(text, text) from public, anon, authenticated;
revoke all on function private.guest_provider() from public, anon, authenticated;
revoke all on function private.submit_guest_note(text, text) from public, anon, authenticated;
revoke all on function private.replace_guest_note(text, text) from public, anon, authenticated;
revoke all on function private.remove_guest_note() from public, anon, authenticated;
revoke all on function private.current_guest_note() from public, anon, authenticated;

grant execute on function private.submit_guest_note(text, text) to authenticated;
grant execute on function private.replace_guest_note(text, text) to authenticated;
grant execute on function private.remove_guest_note() to authenticated;
grant execute on function private.current_guest_note() to authenticated;

-- Public wrappers. security invoker, fixed search_path, no author id in the result.
-- The Data API can call these. It cannot call the private helpers.

create or replace function public.submit_guest_note(p_body text, p_display_name text)
returns table (id uuid, body text, display_name text, created_at timestamptz, status text)
language sql
security invoker
set search_path = ''
as $$
  select n.id, n.body, n.display_name, n.created_at, n.status
  from private.submit_guest_note(p_body, p_display_name) as n;
$$;

create or replace function public.replace_guest_note(p_body text, p_display_name text)
returns table (id uuid, body text, display_name text, created_at timestamptz, status text)
language sql
security invoker
set search_path = ''
as $$
  select n.id, n.body, n.display_name, n.created_at, n.status
  from private.replace_guest_note(p_body, p_display_name) as n;
$$;

create or replace function public.remove_guest_note()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  perform private.remove_guest_note();
end;
$$;

create or replace function public.current_guest_note()
returns table (id uuid, body text, display_name text, created_at timestamptz, status text)
language sql
stable
security invoker
set search_path = ''
as $$
  select n.id, n.body, n.display_name, n.created_at, n.status
  from private.current_guest_note() as n;
$$;

revoke all on function public.submit_guest_note(text, text) from public, anon;
revoke all on function public.replace_guest_note(text, text) from public, anon;
revoke all on function public.remove_guest_note() from public, anon;
revoke all on function public.current_guest_note() from public, anon;

grant execute on function public.submit_guest_note(text, text) to authenticated;
grant execute on function public.replace_guest_note(text, text) to authenticated;
grant execute on function public.remove_guest_note() to authenticated;
grant execute on function public.current_guest_note() to authenticated;
