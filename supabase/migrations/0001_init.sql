-- Chiradeep portfolio - initial schema.
--
-- Replaces the previous Prisma + local SQLite setup. Content tables are
-- readable by anonymous visitors only when `is_published` is true; contact
-- messages are write-only from the server using the service role, so a leaked
-- anon key can never read someone's message.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

create table if not exists public.projects (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  category       text not null default '-',
  year           text not null default '-',
  status         text not null default '-',
  role           text not null default '-',
  summary        text not null default '',
  description    text not null default '',
  highlights     text[] not null default '{}',
  stack          text[] not null default '{}',
  tone           text not null default 'blue' check (tone in ('blue', 'rose', 'teal')),
  live_url       text,
  repo_url       text,
  featured       boolean not null default false,
  is_placeholder boolean not null default true,
  is_published   boolean not null default true,
  position       integer not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists public.tracks (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  mood           text not null default '-',
  duration       text not null default '-:-',
  year           text not null default '-',
  note           text not null default '',
  listen_url     text,
  featured       boolean not null default false,
  is_placeholder boolean not null default true,
  is_published   boolean not null default true,
  position       integer not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists public.books (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  index_label    text not null default '-',
  title          text not null,
  subtitle       text not null default '',
  synopsis       text not null default '',
  excerpt        text not null default '',
  year           text,
  publisher      text,
  is_placeholder boolean not null default true,
  is_published   boolean not null default true,
  position       integer not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists public.artworks (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null default 'Untitled',
  medium         text not null default '-',
  year           text not null default '-',
  size           text not null default 'square' check (size in ('tall', 'wide', 'square')),
  featured       boolean not null default false,
  is_placeholder boolean not null default true,
  is_published   boolean not null default true,
  position       integer not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists public.photographs (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null default 'Untitled frame',
  place          text not null default '-',
  captured       text not null default '-',
  camera         text,
  size           text not null default 'square' check (size in ('tall', 'wide', 'square')),
  featured       boolean not null default false,
  is_placeholder boolean not null default true,
  is_published   boolean not null default true,
  position       integer not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists public.research_papers (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  question       text not null default '',
  title          text not null,
  abstract       text not null default '',
  field          text not null default '-',
  status         text not null default '-',
  year           text,
  pdf_url        text,
  featured       boolean not null default false,
  is_placeholder boolean not null default true,
  is_published   boolean not null default true,
  position       integer not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists public.writing_entries (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  category       text not null default '-',
  excerpt        text not null default '',
  published      text,
  featured       boolean not null default false,
  is_placeholder boolean not null default true,
  is_published   boolean not null default true,
  position       integer not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists public.certifications (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  issuer         text not null default '-',
  year           text not null default '-',
  note           text not null default '',
  verify_url     text,
  is_placeholder boolean not null default true,
  is_published   boolean not null default true,
  position       integer not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists public.timeline_items (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  year           text not null default '-',
  title          text not null,
  note           text not null default '',
  is_placeholder boolean not null default true,
  is_published   boolean not null default true,
  position       integer not null default 0,
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Contact messages
-- ---------------------------------------------------------------------------

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

-- ---------------------------------------------------------------------------
-- Row level security
--
-- Content: anonymous visitors may read published rows and nothing else. There
-- is no anon insert/update/delete policy, so the anon key cannot write.
-- Messages: no anon policy at all. Only the service role (which bypasses RLS)
-- can insert, and nobody can read them through the API.
-- ---------------------------------------------------------------------------

alter table public.projects         enable row level security;
alter table public.tracks           enable row level security;
alter table public.books            enable row level security;
alter table public.artworks         enable row level security;
alter table public.photographs      enable row level security;
alter table public.research_papers  enable row level security;
alter table public.writing_entries  enable row level security;
alter table public.certifications   enable row level security;
alter table public.timeline_items   enable row level security;
alter table public.contact_messages enable row level security;

do $$
declare
  content_table text;
begin
  foreach content_table in array array[
    'projects', 'tracks', 'books', 'artworks', 'photographs',
    'research_papers', 'writing_entries', 'certifications', 'timeline_items'
  ]
  loop
    execute format('drop policy if exists "public read published" on public.%I', content_table);
    execute format(
      'create policy "public read published" on public.%I for select to anon, authenticated using (is_published = true)',
      content_table
    );
  end loop;
end
$$;
