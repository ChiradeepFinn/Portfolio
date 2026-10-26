/**
 * One load of the YouTube IFrame API, shared by every player on the page.
 * The script is not requested until a film actually has a video id.
 */

export const youtubePlayerState = {
  ended: 0,
  playing: 1,
  paused: 2,
  buffering: 3,
  cued: 5,
} as const;

export interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVideoLoadedFraction: () => number;
  getIframe: () => HTMLIFrameElement;
  destroy: () => void;
}

export interface YouTubePlayerEvent {
  target: YouTubePlayer;
  data: number;
}

interface YouTubePlayerOptions {
  videoId: string;
  host?: string;
  width?: string | number;
  height?: string | number;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: YouTubePlayerEvent) => void;
    onStateChange?: (event: YouTubePlayerEvent) => void;
    onError?: (event: YouTubePlayerEvent) => void;
  };
}

interface YouTubeNamespace {
  Player: new (element: HTMLElement, options: YouTubePlayerOptions) => YouTubePlayer;
}

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const iframeApiSrc = 'https://www.youtube.com/iframe_api';

let pending: Promise<void> | null = null;

export function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (pending) return pending;

  pending = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    if (document.querySelector(`script[src="${iframeApiSrc}"]`)) return;

    const script = document.createElement('script');
    script.src = iframeApiSrc;
    script.async = true;
    script.onerror = () => {
      pending = null;
      reject(new Error('YouTube player failed to load'));
    };
    document.head.appendChild(script);
  });

  return pending;
}
