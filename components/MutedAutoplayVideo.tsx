"use client";

import { useEffect, useRef, useState, type VideoHTMLAttributes } from "react";
import {
  armMutedVideo,
  kickAllAutoplayVideos,
  registerAutoplayVideo,
  tryPlayMuted,
  unregisterAutoplayVideo,
} from "@/lib/video-autoplay";

type Props = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "autoPlay" | "muted" | "playsInline" | "controls"
> & {
  className?: string;
  /** Fired once the video is actually playing (use to fade out poster). */
  onPlayingChange?: (playing: boolean) => void;
};

/**
 * Muted looping video aimed at iOS/Android homepage tiles.
 * Keeps retrying play during the intro so videos run before any scroll gesture.
 */
export function MutedAutoplayVideo({
  className,
  src,
  onPlayingChange,
  ...rest
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    onPlayingChange?.(playing);
  }, [playing, onPlayingChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;

    registerAutoplayVideo(el);
    armMutedVideo(el);

    const markPlaying = () => {
      setPlaying(true);
      onPlayingChange?.(true);
    };
    const markPaused = () => {
      if (!el.paused) return;
      setPlaying(false);
      onPlayingChange?.(false);
    };

    const tryPlay = () => {
      void tryPlayMuted(el).then(() => {
        if (!el.paused) markPlaying();
      });
    };

    // Immediate + media events
    tryPlay();
    if (el.readyState < 2) {
      try {
        el.load();
      } catch {
        /* ignore */
      }
    }
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);
    el.addEventListener("canplaythrough", tryPlay);
    el.addEventListener("playing", markPlaying);
    el.addEventListener("pause", markPaused);

    // Keep trying through the intro window (no gesture required if policy allows)
    const burst = window.setInterval(tryPlay, 400);
    const stopBurst = window.setTimeout(() => window.clearInterval(burst), 8000);

    // Play when near / in viewport (helps after returning from a project)
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) tryPlay();
          }
        },
        { rootMargin: "20% 0px", threshold: 0.01 },
      );
      io.observe(el);
    }

    const onPageShow = () => {
      kickAllAutoplayVideos();
      tryPlay();
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisible);

    // Gesture unlock still helps on strict browsers — but don't wait for it
    const unlock = () => {
      kickAllAutoplayVideos();
      tryPlay();
    };
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("scroll", unlock, { passive: true });

    return () => {
      unregisterAutoplayVideo(el);
      window.clearInterval(burst);
      window.clearTimeout(stopBurst);
      io?.disconnect();
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
      el.removeEventListener("canplaythrough", tryPlay);
      el.removeEventListener("playing", markPlaying);
      el.removeEventListener("pause", markPaused);
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("scroll", unlock);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <video
      ref={ref}
      className={`${className ?? ""}${playing ? " is-playing" : " is-pending"}`}
      src={src}
      // Poster handled by sibling img in TileMedia — avoids iOS play-button-on-poster
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      controls={false}
      {...rest}
    />
  );
}
