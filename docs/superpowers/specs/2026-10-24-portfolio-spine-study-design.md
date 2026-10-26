# Portfolio spine study — design

**Approved:** 2026-10-24 (approach 2, honest `01`–`06`)

## Goal

Fold “How this site is built” into the projects timeline spine so it reads as study `01`, matching STEM’s `ProjectDetail` layout. Reverse study order so Sidequest is last (`06`).

## Spine order (top → bottom)

| #  | Entry        | Notes                                      |
|----|--------------|--------------------------------------------|
| 01 | Portfolio    | Site stack; not a `/projects/[slug]` link  |
| 02 | STEM         | Existing study (was last)                  |
| 03 | Path         |                                            |
| 04 | Framework    |                                            |
| 05 | Synesthesia  |                                            |
| 06 | Sidequest    | Existing study (was first)                 |

Five product studies + the site = six entries. No forced `07`.

## Portfolio block

- Same article grid as timeline studies (`lg:grid-cols-2`, wide gutter), `facing="card"`.
- **Card:** blueprint field (diagram tone), hook stating the stack as fact; schematic of the six tools (no device mockups); not linked.
- **Copy:** italic title with timeline dash, short summary, spark highlights = tool notes, stack chips.
- Remove the standalone bottom section (eyebrow + LogoLoop + card grid).

## Copy / nav

- Update `projectsWorld` headline/lead for six spine entries (five studies + this site).
- Intro jump links: Portfolio first (`#portfolio`), then reversed studies.

## Out of scope

- Changing DB/seed order for other pages (featured still Sidequest-first).
- New case-study route for the portfolio itself.
