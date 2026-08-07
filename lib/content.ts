/**
 * Site copy & reference data — edit `docs/content-reference.json` to change text.
 * Media paths are resolved to https://files.studioromann.com
 */
import contentJson from "@/docs/content-reference.json";
import { mediaUrl } from "@/lib/media";

export type MediaItem =
  | { type: "image"; src: string; alt?: string; frame?: "wide" | "centered" | "full" }
  | { type: "video"; src: string; poster?: string }
  | { type: "card-pair"; front: string; back: string; alt?: string };

export type Project = {
  slug: string;
  title: string;
  client: string;
  about: string;
  kind: string[];
  year: string;
  tile: string;
  tilePosition?: string;
  media: MediaItem[];
  layout?: "centered" | "wide" | "harbor" | "stills" | "album" | "stacked";
};

export type GridItem =
  | { kind: "brand"; tile: string; alt: string }
  | { kind: "cta"; tile: string; alt: string; href?: string }
  | { kind: "project"; project: Project };

function mapMedia(item: MediaItem): MediaItem {
  if (item.type === "image") {
    return { ...item, src: mediaUrl(item.src) };
  }
  if (item.type === "video") {
    return {
      ...item,
      src: mediaUrl(item.src),
      poster: item.poster ? mediaUrl(item.poster) : undefined,
    };
  }
  return {
    ...item,
    front: mediaUrl(item.front),
    back: mediaUrl(item.back),
  };
}

export const content = {
  ...contentJson,
  footer: {
    ...contentJson.footer,
    assets: {
      studio: mediaUrl(contentJson.footer.assets.studio),
      romann: mediaUrl(contentJson.footer.assets.romann),
    },
  },
  about: {
    ...contentJson.about,
    assets: {
      close: mediaUrl(contentJson.about.assets.close),
      mark: mediaUrl(contentJson.about.assets.mark),
    },
  },
  homepage: {
    ...contentJson.homepage,
    brand: {
      ...contentJson.homepage.brand,
      tile: mediaUrl(contentJson.homepage.brand.tile),
    },
    cta: {
      ...contentJson.homepage.cta,
      tile: mediaUrl(contentJson.homepage.cta.tile),
    },
  },
};

export const CONTACT_EMAIL = content.site.contactEmail;

export const projects: Project[] = contentJson.projects.map((p) => ({
  slug: p.slug,
  title: p.title,
  client: p.client,
  about: p.about,
  kind: p.kind,
  year: p.year,
  tile: mediaUrl(p.tile),
  tilePosition: p.tilePosition ?? undefined,
  layout: (p.layout as Project["layout"]) ?? "wide",
  media: (p.media as MediaItem[]).map(mapMedia),
}));

const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

/** Homepage grid order from content-reference.json → homepage.canonicalOrder */
export const homepageGrid: GridItem[] = contentJson.homepage.canonicalOrder.map(
  (item) => {
    if (item.kind === "brand") {
      return {
        kind: "brand" as const,
        tile: mediaUrl(item.tile ?? contentJson.homepage.brand.tile),
        alt: item.alt ?? contentJson.homepage.brand.alt,
      };
    }
    if (item.kind === "cta") {
      return {
        kind: "cta" as const,
        tile: mediaUrl(item.tile ?? contentJson.homepage.cta.tile),
        alt: item.alt ?? contentJson.homepage.cta.alt,
        href: item.href ?? undefined,
      };
    }
    const project = bySlug[item.slug!];
    if (!project) {
      throw new Error(`Unknown project slug in homepage order: ${item.slug}`);
    }
    return { kind: "project" as const, project };
  },
);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
