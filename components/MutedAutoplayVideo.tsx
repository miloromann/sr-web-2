"use client";

import { useEffect, useRef, useState, type VideoHTMLAttributes } from "react";
import {
  armMutedVideo,
  kickAllAutoplayVideos,
  registerAutoplayVideo,
  tryPlayMuted,
  unregisterAutoplayVideo,
} from "@/lib/video-autoplay";
import { ensureVideoCached } from "@/lib/video-cache";

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
 * Prefetches into Cache API once, then loops without re-downloading.
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
    if (typeof src !== "string" || !src) return;
    void ensureVideoCached(src);
  }, [src]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof src !== "string" || !src) return;

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

    // Do NOT call el.load() — that forces a full re-fetch and kills looping reuse.
    tryPlay();
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);
    el.addEventListener("canplaythrough", tryPlay);
    el.addEventListener("playing", markPlaying);
    el.addEventListener("pause", markPaused);

    const burst = window.setInterval(tryPlay, 400);
    const stopBurst = window.setTimeout(() => window.clearInterval(burst), 8000);

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
