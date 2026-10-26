-- The published name is Chiradeep. Guest notes cannot use it.
-- Databases that already applied 0004 keep the previous check until this runs.

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
