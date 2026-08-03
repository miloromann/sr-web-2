"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

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

const ABOUT_COPY = (
  <>
    <strong>Studio Romann</strong> is a multidisciplinary creative studio
    specializing in brand strategy, design, and activation. Founded by Milo
    Romaguera, the studio collaborates with cultural and commercial partners
    across the globe to craft bold, enduring identities. Our{" "}
    <strong>design</strong> process is rooted in attentive observation, drawing
    inspiration from the environments we inhabit and the experiences that shape
    us. This sensitivity allows us to translate vision into form{" "}
    <strong>with</strong> nuance and <strong>intention</strong>. Through
    thoughtful strategy and expressive design, we create work that resonates,
    allowing brands to communicate authentically with their intended audiences
    while opening pathways to new possibilities.
  </>
);

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
  }, [mounted, onClose]);

  if (!mounted) return null;

  const originBox = from;
  const shrinking = phase === "enter" || phase === "exit";
  const revealed = phase === "open";

  // Expand/shrink uses hover-sized R. Open panel keeps that top-left, fills to page insets.
  const style: CSSProperties = !originBox
    ? {
        top: "var(--about-inset-y)",
        left: "var(--about-inset-x)",
        width: "calc(100% - (var(--about-inset-x) * 2))",
        height: "calc(100% - (var(--about-inset-y) * 2))",
        borderRadius: "var(--about-radius)",
      }
    : shrinking
      ? {
          top: originBox.top,
          left: originBox.left,
          width: originBox.width,
          height: originBox.height,
          borderRadius: originBox.radius,
        }
      : {
          top: originBox.top,
          left: originBox.left,
          width: `calc(100% - ${originBox.left}px - var(--about-inset-x))`,
          height: `calc(100% - ${originBox.top}px - var(--about-inset-y))`,
          borderRadius: "var(--about-radius)",
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
            aria-label="Close about"
            onClick={onClose}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/about/close.svg" alt="" width={41} height={41} />
          </button>

          <div className="about-overlay__layout">
            <h1 id="about-title" className="about-overlay__heading">
              ABOUT
            </h1>

            <div className="about-overlay__copy">
              <p>{ABOUT_COPY}</p>
            </div>

            <button
              type="button"
              className="about-overlay__mark"
              aria-label="Close about"
              onClick={onClose}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/about/r-mark.svg" alt="" width={100} height={84} />
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
