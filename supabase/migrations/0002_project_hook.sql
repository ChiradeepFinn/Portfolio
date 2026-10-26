-- Card headline for a project study. Separate from the summary, which is the
-- paragraph in the detail column.

alter table public.projects
  add column if not exists hook text not null default '';
