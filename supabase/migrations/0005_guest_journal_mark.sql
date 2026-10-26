-- The mark and the portrait travel with the note.
-- The mark comes from the writer. The portrait is copied from the signed-in
-- account inside the database, never from the request body.

alter table public.guest_notes
  add column if not exists rating smallint,
  add column if not exists avatar_url text;

alter table public.guest_notes drop constraint if exists guest_notes_rating;
alter table public.guest_notes
  add constraint guest_notes_rating check (rating is null or rating between 1 and 5);

alter table public.guest_notes drop constraint if exists guest_notes_avatar;
alter table public.guest_notes
  add constraint guest_notes_avatar check (
    avatar_url is null
    or (
      char_length(avatar_url) between 12 and 400
      and avatar_url ~ '^https://'
      and avatar_url !~ '[[:space:]]'
    )
  );

grant select (rating, avatar_url) on public.guest_notes to anon, authenticated;

create or replace view public.guest_journal
with (security_invoker = true) as
select id, body, display_name, created_at, rating, avatar_url
from public.guest_notes
where status = 'published';

create or replace function private.guest_avatar()
returns text
language plpgsql
stable
set search_path = ''
as $$
declare
  meta jsonb := coalesce(auth.jwt() -> 'user_metadata', '{}'::jsonb);
  raw text := coalesce(meta ->> 'avatar_url', meta ->> 'picture', '');
begin
  if raw is null
     or char_length(raw) < 12
     or char_length(raw) > 400
     or raw !~ '^https://'
     or raw ~ '[[:space:]]'
     or raw ~ '[[:cntrl:]]'
  then
    return null;
  end if;
  return raw;
end;
$$;

revoke all on function private.guest_avatar() from public, anon, authenticated;

drop function if exists public.submit_guest_note(text, text);
drop function if exists public.replace_guest_note(text, text);
drop function if exists public.current_guest_note();
drop function if exists private.submit_guest_note(text, text);
drop function if exists private.replace_guest_note(text, text);
drop function if exists private.current_guest_note();

create or replace function private.submit_guest_note(p_body text, p_display_name text, p_rating smallint)
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
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'journal:invalid' using errcode = 'P0001';
  end if;

  prov := private.guest_provider();
  clean_body := private.normalize_guest_body(p_body);
  clean_name := private.normalize_guest_name(p_display_name);
  perform private.assert_guest_note(clean_body, clean_name);

  return query
    insert into public.guest_notes (author_id, body, display_name, provider, status, rating, avatar_url)
    values (uid, clean_body, clean_name, prov, 'published', p_rating, private.guest_avatar())
    returning *;
exception
  when unique_violation then
    raise exception 'journal:exists' using errcode = 'P0001';
end;
$$;

create or replace function private.replace_guest_note(p_body text, p_display_name text, p_rating smallint)
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
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'journal:invalid' using errcode = 'P0001';
  end if;

  perform private.guest_provider();
  clean_body := private.normalize_guest_body(p_body);
  clean_name := private.normalize_guest_name(p_display_name);
  perform private.assert_guest_note(clean_body, clean_name);

  return query
    update public.guest_notes
    set body = clean_body,
        display_name = clean_name,
        rating = p_rating,
        avatar_url = private.guest_avatar(),
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

revoke all on function private.submit_guest_note(text, text, smallint) from public, anon, authenticated;
revoke all on function private.replace_guest_note(text, text, smallint) from public, anon, authenticated;
revoke all on function private.current_guest_note() from public, anon, authenticated;

grant execute on function private.submit_guest_note(text, text, smallint) to authenticated;
grant execute on function private.replace_guest_note(text, text, smallint) to authenticated;
grant execute on function private.current_guest_note() to authenticated;

create or replace function public.submit_guest_note(p_body text, p_display_name text, p_rating smallint)
returns table (
  id uuid,
  body text,
  display_name text,
  created_at timestamptz,
  status text,
  rating smallint,
  avatar_url text
)
language sql
security invoker
set search_path = ''
as $$
  select n.id, n.body, n.display_name, n.created_at, n.status, n.rating, n.avatar_url
  from private.submit_guest_note(p_body, p_display_name, p_rating) as n;
$$;

create or replace function public.replace_guest_note(p_body text, p_display_name text, p_rating smallint)
returns table (
  id uuid,
  body text,
  display_name text,
  created_at timestamptz,
  status text,
  rating smallint,
  avatar_url text
)
language sql
security invoker
set search_path = ''
as $$
  select n.id, n.body, n.display_name, n.created_at, n.status, n.rating, n.avatar_url
  from private.replace_guest_note(p_body, p_display_name, p_rating) as n;
$$;

create or replace function public.current_guest_note()
returns table (
  id uuid,
  body text,
  display_name text,
  created_at timestamptz,
  status text,
  rating smallint,
  avatar_url text
)
language sql
stable
security invoker
set search_path = ''
as $$
  select n.id, n.body, n.display_name, n.created_at, n.status, n.rating, n.avatar_url
  from private.current_guest_note() as n;
$$;

revoke all on function public.submit_guest_note(text, text, smallint) from public, anon;
revoke all on function public.replace_guest_note(text, text, smallint) from public, anon;
revoke all on function public.current_guest_note() from public, anon;

grant execute on function public.submit_guest_note(text, text, smallint) to authenticated;
grant execute on function public.replace_guest_note(text, text, smallint) to authenticated;
grant execute on function public.current_guest_note() to authenticated;
