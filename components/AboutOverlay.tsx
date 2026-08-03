"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { content } from "@/lib/content";

export type AboutOrigin = {
  top: number;
  left: number;
  width: number;
  height: number;
  radius: number;
};

type Phase = "idle" | "enter" | "open" | "exit";

/** Intro-like stagger between tiles when returning from About */
export const ABOUT_RETURN_STAGGER_MS = 70;
export const ABOUT_RETURN_TILE_MS = 80;

/** Bold first occurrence of each word from content-reference.json → about.boldWords */
function renderAboutCopy(copy: string, boldWords: string[]): ReactNode {
  const parts: ReactNode[] = [];
  let remaining = copy;
  let key = 0;

  const targets = [...boldWords].sort((a, b) => b.length - a.length);

  while (remaining.length > 0) {
    let bestIndex = -1;
    let bestWord = "";
    for (const word of targets) {
      const idx = remaining.indexOf(word);
      if (idx === -1) continue;
      if (bestIndex === -1 || idx < bestIndex) {
        bestIndex = idx;
        bestWord = word;
      }
    }

    if (bestIndex === -1) {
      parts.push(remaining);
      break;
    }

    if (bestIndex > 0) {
      parts.push(remaining.slice(0, bestIndex));
    }
    parts.push(<strong key={key++}>{bestWord}</strong>);
    remaining = remaining.slice(bestIndex + bestWord.length);
    // Only bold the first hit for each word
    const used = targets.indexOf(bestWord);
    if (used !== -1) targets.splice(used, 1);
  }

  return <>{parts}</>;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function AboutOverlay({
  open,
  origin,
  onClose,
  onExitComplete,
}: {
  open: boolean;
  origin: AboutOrigin | null;
  onClose: () => void;
  onExitComplete?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [mounted, setMounted] = useState(false);
  const [from, setFrom] = useState<AboutOrigin | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useRef(false);
  const exitCompleteRef = useRef(onExitComplete);
  exitCompleteRef.current = onExitComplete;

  useEffect(() => {
    if (open) {
      reduceMotion.current = prefersReducedMotion();
      setFrom(origin);
      setMounted(true);
      setPhase(reduceMotion.current ? "open" : "enter");
      return;
    }

    if (!mounted) return;

    // Shrink toward latest origin (e.g. R after scrolling home to top)
    if (origin) setFrom(origin);

    if (reduceMotion.current || !from) {
      setPhase("idle");
      setMounted(false);
      exitCompleteRef.current?.();
      return;
    }

    setPhase("exit");
  }, [open, origin, mounted, from]);

  useLayoutEffect(() => {
    if (phase !== "enter") return;

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("open"));
    });
    return () => cancelAnimationFrame(id);
  }, [phase]);

  useEffect(() => {
    if (!mounted) return;

    // Unlock scroll while exiting so the page can jump to top under the overlay
    if (phase === "exit") {
      document.body.style.overflow = "";
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, onClose, phase]);

  if (!mounted) return null;

  const originBox = from;
  const shrinking = phase === "enter" || phase === "exit";
  const revealed = phase === "open";

  // Morph from the R tile, then always fill the viewport insets (X stays top-left).
  const style: CSSProperties = !originBox || !shrinking
    ? {
        top: "var(--about-inset-y)",
        left: "var(--about-inset-x)",
        width: "calc(100% - (var(--about-inset-x) * 2))",
        height: "calc(100% - (var(--about-inset-y) * 2))",
        borderRadius: "var(--about-radius)",
      }
    : {
        top: originBox.top,
        left: originBox.left,
        width: originBox.width,
        height: originBox.height,
        borderRadius: originBox.radius,
      };

  return (
    <div
      className={`about-overlay is-active${revealed ? " is-open" : ""}${phase === "enter" ? " is-entering" : ""}${phase === "exit" ? " is-exiting" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-title"
    >
      <div
        ref={panelRef}
        className="about-overlay__panel"
        style={style}
        onTransitionEnd={(e) => {
          if (e.target !== panelRef.current) return;
          if (e.propertyName !== "width" && e.propertyName !== "top") return;
          if (phase === "exit") {
            setPhase("idle");
            setMounted(false);
            exitCompleteRef.current?.();
          }
        }}
      >
        <div
          className={`about-overlay__content${revealed ? " is-visible" : ""}`}
        >
          <button
            type="button"
            className="about-overlay__close"
            aria-label={content.labels.aria.closeAbout}
            onClick={onClose}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.about.assets.close}
              alt=""
              width={41}
              height={41}
            />
          </button>

          <div className="about-overlay__layout">
            <h1 id="about-title" className="about-overlay__heading">
              {content.about.heading}
            </h1>

            <div className="about-overlay__copy">
              <p>
                {renderAboutCopy(content.about.copy, content.about.boldWords)}
              </p>
            </div>

            <button
              type="button"
              className="about-overlay__mark"
              aria-label={content.labels.aria.closeAbout}
              onClick={onClose}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.about.assets.mark}
                alt=""
                width={100}
                height={84}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Matches `.tile:hover` scale in globals.css */
const TILE_HOVER_SCALE = 1.05;

export function measureAboutOrigin(el: HTMLElement): AboutOrigin {
  const prevTransition = el.style.transition;
  const prevTransform = el.style.transform;
  // Measure at rest, then derive the hover (rolled-over) bounds
  el.style.transition = "none";
  el.style.transform = "none";
  void el.offsetWidth;
  const rest = el.getBoundingClientRect();
  const radius = Number.parseFloat(getComputedStyle(el).borderRadius) || 30;
  el.style.transform = prevTransform;
  el.style.transition = prevTransition;

  const width = rest.width * TILE_HOVER_SCALE;
  const height = rest.height * TILE_HOVER_SCALE;
  const left = rest.left + (rest.width - width) / 2;
  const top = rest.top + (rest.height - height) / 2;

  return {
    top,
    left,
    width,
    height,
    radius: radius * TILE_HOVER_SCALE,
  };
}
