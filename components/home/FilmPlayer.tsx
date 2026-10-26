'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';
import {
  loadYouTubeIframeApi,
  youtubePlayerState,
  type YouTubePlayer,
} from '@/lib/youtube-iframe';
import { Maximize2, Minimize2, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilmPlayerHandle {
  /** Start or stop the film. `reveal` brings the frame into view first. */
  toggle: (options?: { reveal?: boolean }) => void;
}

interface FilmPlayerProps {
  /** 11-character id from youtube.com/watch?v=THIS. */
  readonly youtubeId: string;
  readonly onPlaybackChange?: (playing: boolean) => void;
}

const chromeHoldMs = 2400;

function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

function safeDuration(player: YouTubePlayer | null) {
  if (!player) return 0;
  try {
    const length = player.getDuration();
    return Number.isFinite(length) && length > 0 ? length : 0;
  } catch {
    return 0;
  }
}

function ratioFromPointer(event: ReactPointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  if (rect.width <= 0) return 0;
  return Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
}

/**
 * The introduction film. The picture is the frame; the transport sits on it
 * and steps back while the film is playing, returning for a pause, a pointer,
 * or the keyboard. Driven by a YouTube id.
 */
export const FilmPlayer = forwardRef<FilmPlayerHandle, FilmPlayerProps>(function FilmPlayer(
  { youtubeId, onPlaybackChange },
  ref,
) {
  const youtube = youtubeId.trim();
  const reduce = useHydratedReducedMotion();
  const figureRef = useRef<HTMLElement>(null);
  const youtubeHostRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<YouTubePlayer | null>(null);
  const playingRef = useRef(false);
  const onPlaybackChangeRef = useRef(onPlaybackChange);
  const reduceRef = useRef(reduce);
  const scrubbing = useRef(false);
  const pendingPlay = useRef(false);
  const hideTimer = useRef<number | null>(null);

  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [chrome, setChrome] = useState(true);
  const [preview, setPreview] = useState<number | null>(null);

  useEffect(() => {
    onPlaybackChangeRef.current = onPlaybackChange;
  }, [onPlaybackChange]);

  useEffect(() => {
    reduceRef.current = reduce;
  }, [reduce]);

  const publish = useCallback((next: boolean) => {
    playingRef.current = next;
    setPlaying(next);
    onPlaybackChangeRef.current?.(next);
  }, []);

  const clearHide = useCallback(() => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  const armHide = useCallback(() => {
    setChrome(true);
    clearHide();
    hideTimer.current = window.setTimeout(() => {
      hideTimer.current = null;
      const frame = figureRef.current;
      if (scrubbing.current || reduceRef.current) return;
      if (!playingRef.current) return;
      const active = document.activeElement;
      if (active instanceof HTMLElement && frame?.contains(active) && active.tagName !== 'DIV') return;
      setChrome(false);
    }, chromeHoldMs);
  }, [clearHide]);

  const play = useCallback(() => {
    if (failed || !youtube) return;
    const player = youtubePlayerRef.current;
    if (!player) {
      pendingPlay.current = true;
      return;
    }
    pendingPlay.current = false;
    player.playVideo();
  }, [failed, youtube]);

  const toggle = useCallback(
    (options?: { reveal?: boolean }) => {
      const frame = figureRef.current;
      if (failed || !youtube) return;

      if (options?.reveal && frame) {
        const rect = frame.getBoundingClientRect();
        const inView = rect.top >= 72 && rect.bottom <= window.innerHeight - 16;
        if (!inView) frame.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (playingRef.current) {
        pendingPlay.current = false;
        youtubePlayerRef.current?.pauseVideo();
      } else {
        play();
      }
    },
    [failed, play, youtube],
  );

  useImperativeHandle(ref, () => ({ toggle }), [toggle]);

  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      const player = youtubePlayerRef.current;
      if (!player) return;
      try {
        const time = player.getCurrentTime();
        const length = player.getDuration();
        const fraction = player.getVideoLoadedFraction();
        if (Number.isFinite(time)) setCurrent(time);
        if (Number.isFinite(length) && length > 0) setDuration(length);
        if (Number.isFinite(fraction)) setBuffered(Math.min(1, Math.max(0, fraction)));
      } catch {
        // Player methods throw before the iframe is ready.
      }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(() => {
    const node = figureRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) youtubePlayerRef.current?.pauseVideo();
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onFullscreenChange() {
      setFullscreen(document.fullscreenElement === figureRef.current);
    }
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => clearHide, [clearHide]);

  useEffect(() => {
    if (!youtube) {
      setFailed(true);
      return;
    }

    const host = youtubeHostRef.current;
    if (!host) return;

    let cancelled = false;
    setReady(false);
    setFailed(false);
    setCurrent(0);
    setDuration(0);
    setBuffered(0);
    setBuffering(false);
    publish(false);

    const mount = document.createElement('div');
    mount.className = 'h-full w-full';
    host.appendChild(mount);

    function readLength(player: YouTubePlayer) {
      try {
        const length = player.getDuration();
        if (Number.isFinite(length) && length > 0) setDuration(length);
      } catch {
        // Duration is unavailable until the iframe has cued the film.
      }
    }

    function onState(state: number) {
      if (cancelled) return;
      const player = youtubePlayerRef.current;
      if (state === youtubePlayerState.buffering) {
        setBuffering(true);
        return;
      }
      if (state === youtubePlayerState.playing) {
        setBuffering(false);
        setReady(true);
        if (player) readLength(player);
        if (!playingRef.current) {
          publish(true);
          armHide();
        }
        return;
      }
      if (state === youtubePlayerState.paused || state === youtubePlayerState.ended) {
        setBuffering(false);
        if (playingRef.current) {
          publish(false);
          clearHide();
          setChrome(true);
        }
        if (!player) return;
        try {
          const time = state === youtubePlayerState.ended ? player.getDuration() : player.getCurrentTime();
          if (Number.isFinite(time)) setCurrent(time);
        } catch {
          // The clock catches up on the next poll.
        }
        return;
      }
      if (state === youtubePlayerState.cued) {
        setReady(true);
        if (player) readLength(player);
      }
    }

    function onYouTubeMessage(event: MessageEvent) {
      if (cancelled) return;
      let frame: HTMLIFrameElement | null = null;
      try {
        frame = youtubePlayerRef.current?.getIframe() ?? null;
      } catch {
        return;
      }
      if (!frame || event.source !== frame.contentWindow) return;

      let payload: { event?: string; info?: unknown } | null = null;
      if (typeof event.data === 'string') {
        try {
          payload = JSON.parse(event.data) as { event?: string; info?: unknown };
        } catch {
          return;
        }
      } else if (event.data && typeof event.data === 'object') {
        payload = event.data as { event?: string; info?: unknown };
      }
      if (!payload?.event) return;

      if (payload.event === 'onStateChange') {
        const state = Number(payload.info);
        if (Number.isFinite(state)) onState(state);
        return;
      }

      if (payload.event !== 'infoDelivery' || !payload.info || typeof payload.info !== 'object') return;
      const info = payload.info as {
        currentTime?: number;
        duration?: number;
        videoLoadedFraction?: number;
        playerState?: number;
      };
      if (typeof info.playerState === 'number') onState(info.playerState);
      if (typeof info.duration === 'number' && info.duration > 0) setDuration(info.duration);
      if (typeof info.videoLoadedFraction === 'number') {
        setBuffered(Math.min(1, Math.max(0, info.videoLoadedFraction)));
      }
      if (typeof info.currentTime === 'number' && Number.isFinite(info.currentTime)) setCurrent(info.currentTime);
    }

    window.addEventListener('message', onYouTubeMessage);

    loadYouTubeIframeApi()
      .then(() => {
        if (cancelled || !host.isConnected || !window.YT) return;
        const player = new window.YT.Player(mount, {
          videoId: youtube,
          host: 'https://www.youtube-nocookie.com',
          width: '100%',
          height: '100%',
          playerVars: {
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            iv_load_policy: 3,
            origin: window.location.origin,
            enablejsapi: 1,
          },
          events: {
            onReady: (event) => {
              if (cancelled) return;
              setReady(true);
              readLength(event.target);
              if (pendingPlay.current) {
                pendingPlay.current = false;
                event.target.playVideo();
              }
              try {
                setMuted(event.target.isMuted());
                const iframe = event.target.getIframe();
                iframe.style.position = 'absolute';
                iframe.style.inset = '0';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.pointerEvents = 'none';
                iframe.tabIndex = -1;
                iframe.setAttribute('aria-hidden', 'true');
              } catch {
                // The frame is usable even if the iframe node is not ready to style.
              }
            },
            onStateChange: (event) => onState(event.data),
            onError: () => {
              if (!cancelled) setFailed(true);
            },
          },
        });
        if (cancelled) {
          player.destroy();
          return;
        }
        youtubePlayerRef.current = player;
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      window.removeEventListener('message', onYouTubeMessage);
      const player = youtubePlayerRef.current;
      youtubePlayerRef.current = null;
      try {
        player?.destroy();
      } catch {
        // The iframe can already be gone when the section unmounts.
      }
      host.replaceChildren();
      publish(false);
    };
  }, [armHide, clearHide, publish, youtube]);

  function seek(next: number) {
    const player = youtubePlayerRef.current;
    const length = duration > 0 ? duration : safeDuration(player);
    if (!player || length <= 0) return;
    const time = Math.min(Math.max(0, next), length);
    player.seekTo(time, true);
    setCurrent(time);
  }

  function toggleMuted() {
    const player = youtubePlayerRef.current;
    if (!player) return;
    try {
      if (player.isMuted()) player.unMute();
      else player.mute();
      setMuted(player.isMuted());
    } catch {
      // Mute is ignored until the iframe has loaded.
    }
  }

  async function toggleFullscreen() {
    const frame = figureRef.current;
    if (!frame) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      if (typeof frame.requestFullscreen === 'function') {
        await frame.requestFullscreen();
      }
    } catch {
      // The browser can refuse fullscreen without a direct gesture.
    }
  }

  function onStageClick() {
    if (playing && !chrome && !reduce) {
      armHide();
      return;
    }
    toggle();
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const target = event.target;
    const onSlider = target instanceof HTMLInputElement;
    if (event.key === ' ' || event.key === 'k' || event.key === 'K') {
      if (target instanceof HTMLButtonElement || onSlider) return;
      event.preventDefault();
      toggle();
      return;
    }
    if (onSlider) return;
    if (event.key === 'm' || event.key === 'M') {
      event.preventDefault();
      toggleMuted();
    } else if (event.key === 'f' || event.key === 'F') {
      event.preventDefault();
      void toggleFullscreen();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      seek(current + 5);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      seek(current - 5);
    }
  }

  function onTrackPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (failed || duration <= 0) return;
    scrubbing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const ratio = ratioFromPointer(event);
    setPreview(ratio);
    seek(ratio * duration);
    armHide();
  }

  function onTrackPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (failed || duration <= 0) return;
    const ratio = ratioFromPointer(event);
    setPreview(ratio);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) seek(ratio * duration);
  }

  function onTrackPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    scrubbing.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    armHide();
  }

  const progress = duration > 0 ? Math.min(1, current / duration) : 0;
  const shown = failed || !playing || chrome || Boolean(reduce);
  const clock = `${formatClock(current)} of ${formatClock(duration)}`;

  return (
    <figure
      ref={figureRef}
      aria-label="Introduction film"
      data-theme-scope="dark"
      onKeyDown={onKeyDown}
      onMouseMove={armHide}
      onMouseLeave={() => {
        if (scrubbing.current) return;
        const active = document.activeElement;
        if (active instanceof HTMLElement && figureRef.current?.contains(active) && active.tagName !== 'DIV') {
          return;
        }
        if (playing && !reduce) setChrome(false);
      }}
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (next instanceof Node && event.currentTarget.contains(next)) return;
        if (playing && !reduce && !scrubbing.current) setChrome(false);
      }}
      onFocus={armHide}
      className={cn(
        'relative overflow-hidden rounded-card border border-white/10 bg-[#07080d]',
        fullscreen && 'flex h-full flex-col rounded-none bg-black',
      )}
    >
      <div
        className={cn(
          'relative bg-gradient-to-br from-[#131d33] via-[#0c0e16] to-[#08080c]',
          fullscreen && 'min-h-0 flex-1',
        )}
        style={fullscreen ? undefined : { aspectRatio: '16 / 9' }}
      >
        <div
          ref={youtubeHostRef}
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            ready ? 'opacity-100' : 'opacity-0',
          )}
        />

        <div className="absolute inset-0 z-[1] cursor-pointer touch-manipulation" onClick={onStageClick} />

        {!playing && !failed ? (
          <span className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white">
              <Play size={16} aria-hidden="true" className="ml-0.5 fill-current" />
            </span>
          </span>
        ) : null}

        {buffering && !failed ? (
          <span className="pointer-events-none absolute top-3 left-3 z-[3] text-[0.62rem] tracking-[0.16em] text-white/70 uppercase">
            Loading
          </span>
        ) : null}

        {failed ? (
          <p className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center px-6 text-center text-[0.72rem] tracking-[0.14em] text-white/60 uppercase">
            The film did not load
          </p>
        ) : null}

        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/80 via-black/25 to-transparent pt-14 transition-opacity duration-200',
            shown ? 'opacity-100' : 'opacity-0',
            reduce && 'transition-none',
          )}
        >
          <div
            className={cn(
              'flex items-center gap-1.5 px-2.5 pb-2.5 text-[0.68rem] text-white/75',
              shown ? 'pointer-events-auto' : 'pointer-events-none',
            )}
          >
            <button
              type="button"
              onClick={() => toggle()}
              disabled={failed}
              aria-label={playing ? 'Pause' : 'Play'}
              aria-pressed={playing}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-white/85 hover:text-white disabled:opacity-40"
            >
              {playing ? (
                <Pause size={13} aria-hidden="true" className="fill-current" />
              ) : (
                <Play size={12} aria-hidden="true" className="ml-px fill-current" />
              )}
            </button>

            <span className="sr-only">{clock}</span>
            <span aria-hidden="true" className="shrink-0 whitespace-nowrap tabular-nums tracking-wide text-white/90">
              {formatClock(current)}
              <span className="text-white/40"> / {formatClock(duration)}</span>
            </span>

            <div
              className="relative mx-1 h-8 min-w-16 flex-1 touch-none focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#2f7bff]"
              onPointerDown={onTrackPointerDown}
              onPointerMove={onTrackPointerMove}
              onPointerUp={onTrackPointerUp}
              onPointerCancel={onTrackPointerUp}
              onPointerLeave={(event) => {
                if (!event.currentTarget.hasPointerCapture(event.pointerId)) setPreview(null);
              }}
            >
              {preview !== null && duration > 0 ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-full mb-1 -translate-x-1/2 tabular-nums text-white"
                  style={{ left: `${preview * 100}%` }}
                >
                  {formatClock(preview * duration)}
                </span>
              ) : null}
              <div className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-white/25" />
              <div
                className="pointer-events-none absolute top-1/2 h-0.5 -translate-y-1/2 bg-white/40"
                style={{ width: `${buffered * 100}%` }}
              />
              <div
                className="pointer-events-none absolute top-1/2 h-0.5 -translate-y-1/2 bg-[#e07a3c]"
                style={{ width: `${progress * 100}%` }}
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e07a3c]"
                style={{ left: `${progress * 100}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={duration > 0 ? Math.min(current, duration) : 0}
                disabled={failed || duration <= 0}
                aria-label="Film position"
                aria-valuetext={clock}
                onChange={(event) => seek(Number(event.target.value))}
                className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent opacity-0"
              />
            </div>

            <button
              type="button"
              onClick={toggleMuted}
              disabled={failed}
              aria-label={muted ? 'Unmute' : 'Mute'}
              aria-pressed={muted}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-white/85 hover:text-white disabled:opacity-40"
            >
              {muted ? <VolumeX size={15} aria-hidden="true" /> : <Volume2 size={15} aria-hidden="true" />}
            </button>

            <button
              type="button"
              onClick={() => void toggleFullscreen()}
              disabled={failed}
              aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              aria-pressed={fullscreen}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-white/85 hover:text-white disabled:opacity-40"
            >
              {fullscreen ? (
                <Minimize2 size={14} aria-hidden="true" />
              ) : (
                <Maximize2 size={14} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </figure>
  );
});
