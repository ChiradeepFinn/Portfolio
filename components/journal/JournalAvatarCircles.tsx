import { AvatarCircles } from '@/components/ui/avatar-circles';
import { capitalizeDisplayName } from '@/lib/journal/validate';

const MAX_SHOWN = 7;

interface JournalAuthor {
  readonly id: string;
  readonly displayName: string;
  readonly avatarUrl: string | null;
}

/**
 * Stack of recent unique guest-journal authors under the page intro.
 * Fed from the same note list as the wall; `router.refresh()` after submit
 * re-renders the server page and updates the circles.
 */
export function JournalAvatarCircles({ notes }: { readonly notes: readonly JournalAuthor[] }) {
  if (notes.length === 0) return null;

  const seen = new Set<string>();
  const authors: JournalAuthor[] = [];
  for (const note of notes) {
    if (seen.has(note.id)) continue;
    seen.add(note.id);
    authors.push(note);
  }

  if (authors.length === 0) return null;

  const total = authors.length;
  const shown = authors.slice(0, MAX_SHOWN);
  const extra = total - shown.length;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <AvatarCircles
        avatarUrls={shown.map((author) => ({
          name: capitalizeDisplayName(author.displayName),
          imageUrl: author.avatarUrl,
        }))}
        numPeople={extra > 0 ? extra : undefined}
      />
      <p className="meta text-muted">{total}+ people were complimented</p>
    </div>
  );
}
