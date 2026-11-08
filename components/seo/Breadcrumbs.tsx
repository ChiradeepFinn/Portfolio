import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { BreadcrumbCrumb } from '@/lib/seo';

/**
 * Visible trail that must match BreadcrumbList JSON-LD names and order.
 */
export function Breadcrumbs({ crumbs }: { readonly crumbs: readonly BreadcrumbCrumb[] }) {
  if (crumbs.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[0.82rem] text-muted-2">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={`${crumb.name}-${index}`} className="inline-flex items-center gap-1.5">
            {index > 0 ? <ChevronRight size={13} strokeWidth={1.75} aria-hidden="true" /> : null}
            {!isLast && crumb.path ? (
              <Link href={crumb.path} className="transition-colors duration-200 hover:text-foreground">
                {crumb.name}
              </Link>
            ) : (
              <span aria-current={isLast ? 'page' : undefined} className="text-muted">
                {crumb.name}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
