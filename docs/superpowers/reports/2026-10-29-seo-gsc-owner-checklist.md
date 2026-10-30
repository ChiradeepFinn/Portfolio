# Google Search Console — owner checklist

**Site:** `https://chiradeep.me`  
**Date:** 2026-10-29  
**Status:** All items require owner account access unless you mark them Completed.

The agent does not have your Search Console session. Do not paste verification tokens into chat. Prefer setting `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in Vercel env (already read by `app/layout.tsx`) if you use the HTML-tag method.

## 1. Verify ownership

| Step | Status |
| --- | --- |
| Prefer a **Domain** property for `chiradeep.me` (DNS TXT at the registrar) | Requires owner |
| Or use a **URL-prefix** property `https://chiradeep.me` | Requires owner |
| If using HTML tag verification: set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in production env without overwriting unrelated tokens; redeploy | Requires owner |
| Confirm Search Console shows the property as verified | Requires owner |

## 2. Sitemap

| Step | Status |
| --- | --- |
| Open Sitemaps → add `https://chiradeep.me/sitemap.xml` | Requires owner |
| Confirm the sitemap is fetched without fatal errors | Requires owner |
| Spot-check that listed URLs match public pages (no drafts / twins) | Requires owner |

## 3. URL Inspection

| Step | Status |
| --- | --- |
| Inspect `https://chiradeep.me/` | Requires owner |
| Inspect `https://chiradeep.me/about` | Requires owner |
| Inspect `https://chiradeep.me/projects` | Requires owner |
| Inspect top project case-study URLs | Requires owner |
| Request indexing only where the live tool shows missing or stale indexing | Requires owner |

## 4. Ongoing monitoring (after crawl delay — days to weeks)

| Step | Status |
| --- | --- |
| Pages / indexing report: fix coverage errors if any | Requires owner |
| Performance: queries, impressions, clicks for “Chiradeep” and related terms | Requires owner |
| Core Web Vitals / page experience when field data appears | Requires owner |
| Manual Actions: confirm clean | Requires owner |
| Security Issues: confirm clean | Requires owner |

## Notes

- `site:` operator results are not a complete index report.
- Schema and titles help clarity; they do not guarantee rankings or a knowledge panel.
- Official site name and Person identity on the site are **Chiradeep** only.
