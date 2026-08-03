/**
 * Project / grid helpers.
 * Editable text lives in `docs/content-reference.json` (via `lib/content.ts`).
 */
export {
  CONTACT_EMAIL,
  content,
  getProject,
  homepageGrid,
  projects,
  type GridItem,
  type MediaItem,
  type Project,
} from "@/lib/content";

import type { GridItem } from "@/lib/content";
import { homepageGrid } from "@/lib/content";

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Cached for this document load — reshuffles only on full page refresh. */
let cachedHomepageGrid: GridItem[] | null = null;

/** Brand R stays first; remaining items shuffle once per page load (not on SPA back). */
export function buildShuffledHomepageGrid(): GridItem[] {
  if (cachedHomepageGrid) return cachedHomepageGrid;

  const brand = homepageGrid.find((item) => item.kind === "brand");
  const rest = homepageGrid.filter((item) => item.kind !== "brand");
  cachedHomepageGrid = brand
    ? [brand, ...shuffle(rest)]
    : shuffle(homepageGrid);
  return cachedHomepageGrid;
}

/** Tile image src for opening morph / grid. */
export function getItemTileSrc(item: GridItem): string {
  if (item.kind === "brand" || item.kind === "cta") return item.tile;
  return item.project.tile;
}

export type MorphMedia = {
  poster: string;
  video?: string;
  /** Figma crop for image morphs only (videos keep default framing). */
  objectPosition?: string;
  /** Project or CTA target — lets intro tiles stay clickable mid-animation. */
  href?: string;
  label?: string;
  external?: boolean;
};

/** Poster (+ optional looping video) for opening morph tiles. */
export function getItemMorphMedia(item: GridItem): MorphMedia {
  if (item.kind === "brand") {
    return { poster: item.tile };
  }
  if (item.kind === "cta") {
    return {
      poster: item.tile,
      href: item.href,
      label: item.alt,
      external: Boolean(item.href),
    };
  }
  const video = item.project.media.find((m) => m.type === "video");
  const hasVideo = video?.type === "video";
  return {
    poster: item.project.tile,
    video: hasVideo ? video.src : undefined,
    objectPosition: hasVideo ? undefined : item.project.tilePosition,
    href: `/work/${item.project.slug}`,
    label: item.project.title,
  };
}
