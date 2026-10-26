import { cn } from '@/lib/utils';

/**
 * A fixed amplitude figure used as the visual signature of the music sections.
 *
 * The shape is deterministic and decorative - it is not derived from an audio
 * file, so it never implies a track that does not exist yet.
 */
const AMPLITUDES = [
  12, 20, 34, 26, 44, 58, 38, 30, 52, 70, 48, 36, 24, 40, 62, 84, 66, 44, 28, 20, 32, 50, 72, 90, 68, 46,
  30, 22, 38, 56, 74, 54, 34, 26, 42, 60, 40, 28, 18, 30, 46, 64, 44, 30, 22, 16, 26, 38, 24, 14,
] as const;

interface WaveformProps {
  readonly className?: string;
  /** 0–1. Bars before this point read as played. */
  readonly progress?: number;
}

export function Waveform({ className, progress = 0 }: WaveformProps) {
  const playedUntil = Math.floor(AMPLITUDES.length * progress);

  return (
    <div
      aria-hidden="true"
      className={cn('flex h-12 w-full items-center gap-[3px] overflow-hidden', className)}
    >
      {AMPLITUDES.map((amplitude, index) => (
        <span
          key={index}
          style={{ height: `${amplitude}%` }}
          className={cn(
            'w-full min-w-[2px] flex-1 rounded-full transition-colors duration-300',
            index < playedUntil ? 'bg-accent-purple/70' : 'bg-track',
          )}
        />
      ))}
    </div>
  );
}
