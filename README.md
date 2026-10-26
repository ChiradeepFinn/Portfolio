# Chiradeep - Portfolio

A multidisciplinary portfolio where technology, music, photography, writing,
research, and art are treated as expressions of one practice rather than six
separate careers.

## Stack

| Layer      | Choice                                            |
| ---------- | ------------------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19, TypeScript)     |
| Styling    | Tailwind CSS v4, CSS-first tokens in `app/globals.css` |
| Motion     | Framer Motion, Lenis for smooth scroll            |
| Data       | Supabase (Postgres + RLS), typed seed fallback    |
| Mail       | Resend                                            |
| Typography | Fraunces (display) + Inter (interface)            |

## Getting started

`E:\Portfolio` is on FAT32. Node cannot install `node_modules` reliably there
(ENOTEMPTY / 8.3-name failures). Develop from the NTFS copy:

```bash
cd D:\Portfolio
npm install
cp .env.example .env.local   # optional for local work
npm run dev
```

Keep source in sync with `robocopy E:\Portfolio D:\Portfolio /E /XD node_modules .next`.

The site runs without any environment variables: `lib/content.ts` falls back to
the typed seed in `lib/data/seed.ts` when Supabase is not configured. The
contact form returns a clear "not configured" error until `RESEND_API_KEY` is
set. A successful submission means the email was accepted. See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Database

See [`supabase/README.md`](supabase/README.md) for schema, row level security,
and setup. This replaces the earlier Prisma + SQLite arrangement.

## Content and placeholders

The original site was lost, and nothing was invented to fill the gap. Every
content row carries `is_placeholder`, and the UI renders those as labelled
reserved slots (`components/ui/SlotFrame.tsx`) rather than fake projects,
publications, or credentials.

To replace a placeholder: update the row in Supabase (or the matching entry in
`lib/data/seed.ts`) and set `is_placeholder = false`. No component changes are
needed - layouts are already at their final proportions.

## Structure

```
app/                  routes, including api/contact
components/
content/              long-form MDX (research, essays, case studies)
lib/
  content.ts          content access with seed fallback
  mdx/                frontmatter validation and the MDX registry
  contact/            validation, email, rate limit, storage
  supabase/           read client and service-role client
  data/               typed records, including the two research studies
supabase/             migrations and seed SQL
docs/ARCHITECTURE.md  how to add content and how contact delivery works
```

## Conventions

- Motion animates transform and opacity only, and every animated component
  respects `prefers-reduced-motion`.
- One container system (`shell`, `shell-wide`, `shell-narrow`) so wide desktops
  keep editorial margins instead of stretching edge to edge.
- The hero is locked: `components/home/Hero.tsx` and the `.horizon*` rules in
  `app/globals.css` are the established design and should not be redesigned
  without an explicit decision to do so.
