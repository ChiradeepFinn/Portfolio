import type { Track } from '@/lib/types';
import { musicWorld } from '@/lib/data/worlds';
import { isBlank } from '@/lib/present';
import { ArrowPill } from '@/components/ui/ArrowPill';
import { Waveform } from '@/components/music/Waveform';
import { IntroFrame, WorldHeadline, WorldIndex, WorldTags } from './WorldMarks';

/**
 * Listening-room opening. The waveform is a drawn signature, not a read of a file.
 * An audio element appears only when a track carries a real source.
 */
export function MusicIntro({ track }: { readonly track: Track | null }) {
  const playable = track?.listenUrl ?? null;
  const named = track && !track.isPlaceholder;

  return (
    <IntroFrame atmosphere="atmos-room">
      <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <div>
          <WorldIndex index={musicWorld.index} label={musicWorld.label} className="text-accent-purple" />
          <WorldHeadline
            headline={musicWorld.headline}
            className="mt-5 max-w-xl text-[clamp(2.3rem,5.4vw,4.2rem)]"
          />
          <p className="body-copy mt-6 max-w-xl">{musicWorld.lead}</p>
          <WorldTags tags={musicWorld.tags} className="mt-7" />
          <ArrowPill href={musicWorld.anchor} className="mt-8">
            {musicWorld.enter}
          </ArrowPill>
        </div>

        <figure className="border border-border bg-surface/70 px-5 py-5 sm:px-6">
          <figcaption className="flex items-baseline justify-between gap-4">
            <span className="eyebrow text-accent-purple">{named ? 'Featured' : 'Listening slot'}</span>
            {named && !isBlank(track.duration) ? <span className="meta">{track.duration}</span> : null}
          </figcaption>
          {named ? (
            <p className="display mt-4 text-[clamp(1.5rem,3vw,2.1rem)] text-foreground">{track.title}</p>
          ) : (
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              No recording is filed yet. The shape below is drawn. It is not a waveform of a track.
            </p>
          )}
          {named && !isBlank(track.note) ? <p className="mt-3 text-sm leading-relaxed text-muted">{track.note}</p> : null}
          <Waveform className="mt-6" progress={0} />
          {playable && named ? (
            <audio controls preload="none" className="mt-5 w-full" aria-label={`Play ${track.title}`}>
              <source src={playable} />
            </audio>
          ) : (
            <p className="meta mt-4">No playable audio</p>
          )}
        </figure>
      </div>
    </IntroFrame>
  );
}
