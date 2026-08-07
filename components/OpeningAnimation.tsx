"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ABOUT_RETURN_STAGGER_MS,
  ABOUT_RETURN_TILE_MS,
} from "@/components/AboutOverlay";
import {
  hasOpeningBeenHandled,
  markOpeningHandled,
} from "@/lib/opening-gate";
import { mediaUrl } from "@/lib/media";

type Props = {
  /** Count of non-brand tiles — drives total cascade length. */
  morphCount: number;
  onComplete: () => void;
  onHandOff?: () => void;
  /** Fired when the letter/cascade timeline starts (grid should animate with it). */
  onPlayingChange?: (playing: boolean) => void;
  skip?: boolean;
  force?: boolean;
};

/** When OMANN begins flipping to projects (after letters are up). */
export const OMANN_MORPH_START_MS = 1100;

/** Delay for every project reveal — same stagger as About return. */
export function getOpeningMorphDelayMs(morphIndex: number): number {
  return OMANN_MORPH_START_MS + morphIndex * ABOUT_RETURN_STAGGER_MS;
}

/** Grid tile index 0 is R; project tiles use morphIndex = tileIndex - 1. */
export function getOpeningTileDelayMs(tileIndex: number): number {
  if (tileIndex <= 0) return 0;
  return getOpeningMorphDelayMs(tileIndex - 1);
}

function getOpeningTimelineMs(morphCount: number) {
  if (morphCount <= 0) {
    return { duration: OMANN_MORPH_START_MS };
  }
  const lastDelay = getOpeningMorphDelayMs(morphCount - 1);
  return { duration: lastDelay + ABOUT_RETURN_TILE_MS + 120 };
}

const LETTERS = [
  mediaUrl("/brand/romann-logo-r.png"),
  mediaUrl("/brand/romann-logo-o.png"),
  mediaUrl("/brand/romann-logo-m.png"),
  mediaUrl("/brand/romann-logo-a.png"),
  mediaUrl("/brand/romann-logo-n.png"),
  mediaUrl("/brand/romann-logo-n-2.png"),
] as const;

/**
 * Letter overlay only — project/video media lives on the live homepage grid
 * so video playback is continuous (no second element to sync at handoff).
 */
export function OpeningAnimation({
  morphCount,
  onComplete,
  onHandOff,
  onPlayingChange,
  skip = false,
  force = false,
}: Props) {
  const [done, setDone] = useState(skip || (!force && hasOpeningBeenHandled()));
  const [playing, setPlaying] = useState(false);
  const completed = useRef(false);
  const handedOff = useRef(false);
  const started = useRef(false);

  const timeline = useMemo(
    () => getOpeningTimelineMs(morphCount),
    [morphCount],
  );

  const handOff = () => {
    if (handedOff.current) return;
    handedOff.current = true;
    onHandOff?.();
  };

  const finish = () => {
    if (completed.current) return;
    completed.current = true;
    markOpeningHandled();
    handOff();
    setPlaying(false);
    onPlayingChange?.(false);
    setDone(true);
    onComplete();
  };

  useEffect(() => {
    if (skip) {
      finish();
      return;
    }

    if (!force && hasOpeningBeenHandled()) {
      finish();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    let cancelled = false;
    let endTimer = 0;
    let startFrame = 0;

    const kickoff = window.setTimeout(() => {
      if (cancelled) return;
      if (!force && hasOpeningBeenHandled()) {
        finish();
        return;
      }
      if (started.current) return;
      started.current = true;
      markOpeningHandled();

      LETTERS.forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });

      startFrame = window.requestAnimationFrame(() => {
        if (cancelled) return;
        setPlaying(true);
        onPlayingChange?.(true);
        // Live grid is already showing/playing under the letters
        handOff();
      });
      endTimer = window.setTimeout(finish, timeline.duration);
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(kickoff);
      window.cancelAnimationFrame(startFrame);
      window.clearTimeout(endTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, force, timeline.duration]);

  // Click empty space to skip — ignore clicks on tiles/links so projects stay openable
  useEffect(() => {
    if (done) return;
    const onPointer = (e: PointerEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest("a, button, .tile, .site-footer")) return;
      finish();
    };
    window.addEventListener("pointerdown", onPointer, { passive: true });
    return () => window.removeEventListener("pointerdown", onPointer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  return (
    <div
      className={`opening${done ? " is-done" : ""}${playing ? " is-playing" : ""}`}
      aria-hidden={done}
      role="presentation"
    >
      <div className="opening-shell">
        <div className="opening-grid" aria-label="ROMANN">
          {LETTERS.map((src, i) => (
            <div className="opening-slot" key={src}>
              <div
                className={`opening-layer opening-letter opening-letter--${i}`}
              >
                <Image
                  className="opening-layer__media"
                  src={src}
                  alt={i === 0 ? "R" : ""}
                  fill
                  sizes="33vw"
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Studio Romann opening animation</span>
    </div>
  );
}
