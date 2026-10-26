# Portfolio spine study Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** Put the site stack on the projects spine as `01`, reverse studies so Sidequest is `06`, match STEM study styling.

**Architecture:** New `PortfolioStudy` component mirrors `ProjectDetail` timeline layout with a blueprint card + tool schematic. Projects page reverses study list for display only and prepends the portfolio entry.

**Tech Stack:** Next.js App Router, existing `Reveal` / design tokens, no new deps.

## Global Constraints

- Honest numbering `01`–`06` (no fake seventh).
- Do not reverse `seedProjects` / DB order — display reverse on `/projects` only.
- Portfolio card is not a case-study link.
- Preserve alternating `facing` on the spine.

---

### Task 1: PortfolioStudy component

**Files:**
- Create: `components/projects/PortfolioStudy.tsx`

- [ ] Build article matching timeline `ProjectDetail` grid
- [ ] Blueprint card + six-tool schematic from existing brand paths
- [ ] Copy column: title, summary, spark rows, chips (reuse `StackIcon`)

### Task 2: Wire projects page + copy

**Files:**
- Modify: `app/projects/page.tsx`
- Modify: `lib/data/worlds.ts`

- [ ] Reverse projects for spine + jump links; prepend `#portfolio`
- [ ] Remove bottom LogoLoop / grid section
- [ ] Update `projectsWorld` for six spine entries

### Task 3: Verify

- [ ] `/projects` shows `01` Portfolio … `06` Sidequest with alternating facing
