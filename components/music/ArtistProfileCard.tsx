import Image from 'next/image';

interface ArtistProfileCardProps {
  readonly name: string;
  readonly role: string;
  readonly image: string;
  readonly alt: string;
}

/**
 * Editorial portrait for the music working-order artists grid.
 * Photo + typographic caption — no card chrome, shadows, or info panels.
 */
export function ArtistProfileCard({ name, role, image, alt }: ArtistProfileCardProps) {
  return (
    <figure className="flex flex-col gap-2.5 sm:gap-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-border bg-surface">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 640px) 28vw, (max-width: 1024px) 22vw, 14vw"
          className="object-cover object-top"
        />
      </div>
      <figcaption className="min-w-0">
        <p className="font-display text-[0.78rem] leading-snug tracking-[-0.01em] text-foreground sm:text-[0.88rem]">
          {name}
        </p>
        <p className="meta mt-1 text-[0.58rem] tracking-[0.08em] sm:text-[0.62rem]">{role}</p>
      </figcaption>
    </figure>
  );
}
