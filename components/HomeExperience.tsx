"use client";

import { useEffect, useLayoutEffect, useState, type CSSProperties } from "react";
import { useSearchParams } from "next/navigation";
import {
  ABOUT_RETURN_STAGGER_MS,
  ABOUT_RETURN_TILE_MS,
  AboutOverlay,
  measureAboutOrigin,
  type AboutOrigin,
} from "@/components/AboutOverlay";
import {
  getOpeningTileDelayMs,
  OpeningAnimation,
} from "@/components/OpeningAnimation";
import { ProjectGrid } from "@/components/ProjectGrid";
import { SiteFooter } from "@/components/SiteFooter";
import {
  beginHomeScrollRestore,
  captureHomeScrollFromWindow,
  clearHomeScroll,
  consumeHomeScrollPendingRestore,
  setHomeScroll,
} from "@/lib/home-scroll";
import { hasOpeningBeenHandled } from "@/lib/opening-gate";
import {
  buildShuffledHomepageGrid,
  type GridItem,
} from "@/lib/projects";

export function HomeExperience() {
  const searchParams = useSearchParams();
  const skipOpening = searchParams.get("skipOpening") === "1";
  const forceOpening = searchParams.get("forceOpening") === "1";
  const openingAlreadyDone =
    skipOpening || (!forceOpening && hasOpeningBeenHandled());

  const [items, setItems] = useState<GridItem[] | null>(null);
  const [openingMounted, setOpeningMounted] = useState(!openingAlreadyDone);
  const [openingActive, setOpeningActive] = useState(!openingAlreadyDone);
  const [openingPlaying, setOpeningPlaying] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutCovering, setAboutCovering] = useState(false);
  const [aboutDimmable, setAboutDimmable] = useState(false);
  const [aboutReentering, setAboutReentering] = useState(false);
  const [aboutOrigin, setAboutOrigin] = useState<AboutOrigin | null>(null);

  useEffect(() => {
    setItems(buildShuffledHomepageGrid());
  }, []);

  useEffect(() => {
    if (!aboutReentering || !items) return;
    const total =
      items.length * ABOUT_RETURN_STAGGER_MS + ABOUT_RETURN_TILE_MS + 120;
    const id = window.setTimeout(() => setAboutReentering(false), total);
    return () => window.clearTimeout(id);
  }, [aboutReentering, items]);

  useEffect(() => {
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  useEffect(() => {
    if (!items) return;

    const onScroll = () => setHomeScroll(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      captureHomeScrollFromWindow();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  useLayoutEffect(() => {
    // Only restore after project → home, never when the intro finishes
    // (restore timers were fighting mid-scroll and felt like a lock).
    if (!items || openingActive) return;

    const y = consumeHomeScrollPendingRestore();
    if (y <= 0) return;

    beginHomeScrollRestore(700);

    const restore = () => {
      if (Math.abs(window.scrollY - y) > 1) {
        window.scrollTo(0, y);
      }
    };

    restore();

    const frames: number[] = [];
    frames.push(
      requestAnimationFrame(() => {
        restore();
        frames.push(requestAnimationFrame(restore));
      }),
    );

    const t1 = window.setTimeout(restore, 50);
    const t2 = window.setTimeout(restore, 150);
    const t3 = window.setTimeout(restore, 400);

    return () => {
      frames.forEach((id) => cancelAnimationFrame(id));
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [items, openingActive]);

  const morphCount = items ? Math.max(0, items.length - 1) : 0;
  const footerDelayMs = items
    ? getOpeningTileDelayMs(items.length - 1) + ABOUT_RETURN_STAGGER_MS
    : 0;

  if (!items) {
    return <main className="page" aria-busy="true" />;
  }

  return (
    <>
      {openingMounted && (
        <OpeningAnimation
          morphCount={morphCount}
          skip={skipOpening}
          force={forceOpening}
          onPlayingChange={setOpeningPlaying}
          onHandOff={() => {
            setOpeningActive(true);
          }}
          onComplete={() => {
            setOpeningActive(false);
            setOpeningPlaying(false);
            window.setTimeout(() => setOpeningMounted(false), 200);
          }}
        />
      )}
      <main
        className={[
          "page",
          "home-main",
          "is-visible",
          openingActive ? "is-opening" : "",
          openingPlaying ? "is-opening-playing" : "",
          aboutDimmable ? "is-about-dimmable" : "",
          aboutCovering ? "is-about-open" : "",
          aboutReentering ? "is-about-reentering" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          openingPlaying
            ? ({
                ["--opening-footer-delay" as string]: `${footerDelayMs}ms`,
              } satisfies CSSProperties)
            : undefined
        }
      >
        <div className="page-inner">
          <ProjectGrid
            items={items}
            enableVideos
            openingCascade={openingPlaying}
            reentering={aboutReentering}
            returnStaggerMs={ABOUT_RETURN_STAGGER_MS}
            onBrandClick={(el) => {
              setAboutOrigin(measureAboutOrigin(el));
              setAboutReentering(false);
              setAboutDimmable(true);
              setAboutCovering(true);
              setAboutOpen(true);
            }}
          />
          <SiteFooter
            className={aboutReentering ? "is-about-returning" : undefined}
            style={
              aboutReentering
                ? ({
                    ["--about-return-delay" as string]: `${items.length * ABOUT_RETURN_STAGGER_MS}ms`,
                  } satisfies CSSProperties)
                : undefined
            }
          />
        </div>
      </main>
      <AboutOverlay
        open={aboutOpen}
        origin={aboutOrigin}
        onClose={() => {
          // Always land at the top of the index after About closes
          clearHomeScroll();
          document.body.style.overflow = "";
          window.scrollTo(0, 0);
          requestAnimationFrame(() => {
            const brand = document.querySelector(".tile--brand");
            if (brand instanceof HTMLElement) {
              setAboutOrigin(measureAboutOrigin(brand));
            }
            setAboutOpen(false);
          });
        }}
        onExitComplete={() => {
          setAboutCovering(false);
          setAboutReentering(true);
          window.scrollTo(0, 0);
        }}
      />
    </>
  );
}
