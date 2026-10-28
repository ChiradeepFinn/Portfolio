-- Year the study was last touched. Shown as Updated in the case study header.
alter table public.projects
  add column if not exists updated text not null default '-';
