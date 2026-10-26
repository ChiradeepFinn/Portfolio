import { cn } from '@/lib/utils';

export interface AvatarCircleItem {
  readonly imageUrl?: string | null;
  readonly name: string;
  readonly profileUrl?: string;
}

interface AvatarCirclesProps {
  readonly className?: string;
  /** Extra people beyond the visible stack (renders as +N). */
  readonly numPeople?: number;
  readonly avatarUrls: readonly AvatarCircleItem[];
}

function Initial({ name }: { readonly name: string }) {
  const letter = Array.from(name.trim())[0]?.toUpperCase() ?? '·';
  return (
    <span className="grid size-full place-items-center bg-surface font-display text-sm leading-none text-foreground italic">
      {letter}
    </span>
  );
}

function CircleFace({ item }: { readonly item: AvatarCircleItem }) {
  return (
    <span
      title={item.name}
      className="relative inline-flex size-9 overflow-hidden rounded-full border border-border-strong bg-background"
    >
      {item.imageUrl ? (
        // Addresses are https-checked before they reach the page.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt=""
          width={36}
          height={36}
          decoding="async"
          className="size-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <Initial name={item.name} />
      )}
    </span>
  );
}

export function AvatarCircles({ numPeople, className, avatarUrls }: AvatarCirclesProps) {
  if (avatarUrls.length === 0 && !(numPeople && numPeople > 0)) return null;

  return (
    <div
      className={cn('z-10 flex items-center -space-x-2.5', className)}
      role="list"
      aria-label="Recent guests"
    >
      {avatarUrls.map((item, index) => {
        const key = `${item.name}-${item.imageUrl ?? 'initial'}-${index}`;
        const face = <CircleFace item={item} />;
        if (item.profileUrl) {
          return (
            <a
              key={key}
              role="listitem"
              href={item.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
              aria-label={item.name}
            >
              {face}
            </a>
          );
        }
        return (
          <span key={key} role="listitem" className="relative inline-flex rounded-full" aria-label={item.name}>
            {face}
          </span>
        );
      })}
      {(numPeople ?? 0) > 0 && (
        <span
          role="listitem"
          className="relative flex size-9 items-center justify-center rounded-full border border-border-strong bg-foreground text-[0.65rem] font-medium tracking-wide text-background"
          aria-label={`${numPeople} more`}
        >
          +{numPeople}
        </span>
      )}
    </div>
  );
}
