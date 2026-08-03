"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { getOpeningTileDelayMs } from "@/components/OpeningAnimation";
import { captureHomeScrollFromWindow } from "@/lib/home-scroll";
import type { GridItem, Project } from "@/lib/projects";

function TileImage({
  src,
  alt,
  objectPosition,
}: {
  src: string;
  alt: string;
  objectPosition?: string;
}) {
  const isSvg = src.endsWith(".svg");
  const style = objectPosition ? { objectPosition } : undefined;

  if (isSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="tile-media" src={src} alt={alt} style={style} />
    );
  }

  return (
    <Image
      className="tile-media"
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 900px) 50vw, 33vw"
      priority={false}
      style={style}
    />
  );
}

function getTileVideo(project: Project) {
  const video = project.media.find((m) => m.type === "video");
  return video?.type === "video" ? video : null;
}

function TileMedia({
  project,
  enableVideos,
}: {
  project: Project;
  enableVideos: boolean;
}) {
  const video = getTileVideo(project);

  // Single video element on the live grid — plays straight through the intro
  if (video && enableVideos) {
    return (
      <video
        className="tile-media"
        src={video.src}
        poster={video.poster ?? project.tile}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden
      />
    );
  }

  // Video projects: leave poster framing default. Image projects: Figma crop.
  const objectPosition = video ? undefined : project.tilePosition;

  return (
    <TileImage
      src={project.tile}
      alt={project.title}
      objectPosition={objectPosition}
    />
  );
}

/** Inner shell carries return / opening cascade so outer `.tile` hover scale works */
function TileShell({
  reentering,
  openingCascade,
  delayMs,
  openingDelayMs,
  children,
}: {
  reentering: boolean;
  openingCascade?: boolean;
  delayMs: number;
  openingDelayMs?: number;
  children: ReactNode;
}) {
  const style: CSSProperties | undefined = reentering
    ? { ["--about-return-delay" as string]: `${delayMs}ms` }
    : openingCascade && openingDelayMs != null
      ? { ["--opening-tile-delay" as string]: `${openingDelayMs}ms` }
      : undefined;

  return (
    <div
      className={`tile-shell${reentering ? " is-returning" : ""}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function ProjectGrid({
  items,
  enableVideos = true,
  onBrandClick,
  reentering = false,
  openingCascade = false,
  returnStaggerMs = 70,
}: {
  items: GridItem[];
  enableVideos?: boolean;
  onBrandClick?: (el: HTMLElement) => void;
  reentering?: boolean;
  openingCascade?: boolean;
  returnStaggerMs?: number;
}) {
  return (
    <div
      className={`project-grid${reentering ? " is-about-reentering" : ""}`}
      role="list"
    >
      {items.map((item, index) => {
        const delayMs = index * returnStaggerMs;
        const openingDelayMs = getOpeningTileDelayMs(index);

        if (item.kind === "brand") {
          return (
            <button
              type="button"
              className="tile tile--brand"
              role="listitem"
              key={`brand-${index}`}
              aria-label="About Studio Romann"
              onClick={(e) => onBrandClick?.(e.currentTarget)}
            >
              <TileShell
                reentering={reentering}
                openingCascade={openingCascade}
                delayMs={delayMs}
                openingDelayMs={openingDelayMs}
              >
                <TileImage src="/brand/romann-logo-r.png" alt={item.alt} />
              </TileShell>
            </button>
          );
        }

        if (item.kind === "cta") {
          const inner = (
            <TileShell
              reentering={reentering}
              openingCascade={openingCascade}
              delayMs={delayMs}
              openingDelayMs={openingDelayMs}
            >
              <TileImage src={item.tile} alt={item.alt} />
            </TileShell>
          );
          if (item.href) {
            return (
              <a
                className="tile"
                role="listitem"
                key={`cta-${index}`}
                href={item.href}
                target="_blank"
                rel="noreferrer"
              >
                {inner}
              </a>
            );
          }
          return (
            <div className="tile is-static" role="listitem" key={`cta-${index}`}>
              {inner}
            </div>
          );
        }

        const { project } = item;
        return (
          <Link
            className="tile"
            role="listitem"
            key={project.slug}
            href={`/work/${project.slug}`}
            aria-label={project.title}
            onClick={captureHomeScrollFromWindow}
          >
            <TileShell
              reentering={reentering}
              openingCascade={openingCascade}
              delayMs={delayMs}
              openingDelayMs={openingDelayMs}
            >
              <TileMedia project={project} enableVideos={enableVideos} />
            </TileShell>
          </Link>
        );
      })}
    </div>
  );
}
