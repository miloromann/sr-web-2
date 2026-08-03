"use client";

import { useEffect, useRef, type VideoHTMLAttributes } from "react";

type Props = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "autoPlay" | "muted" | "playsInline" | "controls"
> & {
  className?: string;
};

/**
 * Muted looping video that reliably autoplays on iOS/Android.
 * React's `muted` prop alone often fails mobile autoplay — we force the
 * DOM property and call play() after the element can start.
 */
export function MutedAutoplayVideo({ className, src, ...rest }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;

    el.defaultMuted = true;
    el.muted = true;
    el.playsInline = true;
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");
    el.setAttribute("muted", "");

    const tryPlay = () => {
      el.muted = true;
      const p = el.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          /* Autoplay may still be blocked until a gesture; retry below. */
        });
      }
    };

    tryPlay();
    el.addEventListener("loadeddata", tryPlay);
    el.addEventListener("canplay", tryPlay);

    const onVisible = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);

    // First tap/scroll anywhere often unlocks autoplay on strict mobile browsers
    const unlock = () => tryPlay();
    window.addEventListener("touchstart", unlock, { passive: true, once: true });
    window.addEventListener("scroll", unlock, { passive: true, once: true });

    return () => {
      el.removeEventListener("loadeddata", tryPlay);
      el.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("scroll", unlock);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
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
