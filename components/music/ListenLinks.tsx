import { ArrowUpRight } from 'lucide-react';
import { listenProfiles } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * Outbound listening profiles. Same row as the links page: a confirmed href
 * leaves the site, a null href stays an inert row that says so.
 */
export function ListenLinks({ className }: { readonly className?: string }) {
  return (
    <ul className={cn('grid gap-px overflow-hidden border border-border bg-border', className)}>
      {listenProfiles.map((profile) => (
        <li key={profile.label} className="bg-surface">
          {profile.href ? (
            <a
              href={profile.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-300 hover:bg-surface-2"
            >
              <span className="text-sm text-foreground">{profile.label}</span>
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="shrink-0 text-muted-2 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
              />
            </a>
          ) : (
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm text-muted-2">{profile.label}</span>
              <span className="meta shrink-0">Soon...</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
