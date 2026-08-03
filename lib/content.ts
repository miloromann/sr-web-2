/**
 * Site copy & reference data — edit `docs/content-reference.json` to change text.
 * Restart / refresh the Next.js page after edits.
 */
import contentJson from "@/docs/content-reference.json";

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

export const content = contentJson;

export const CONTACT_EMAIL = content.site.contactEmail;

export const projects: Project[] = content.projects.map((p) => ({
  slug: p.slug,
  title: p.title,
  client: p.client,
  about: p.about,
  kind: p.kind,
  year: p.year,
  tile: p.tile,
  tilePosition: p.tilePosition ?? undefined,
  layout: (p.layout as Project["layout"]) ?? "wide",
  media: p.media as MediaItem[],
}));

const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

/** Homepage grid order from content-reference.json → homepage.canonicalOrder */
export const homepageGrid: GridItem[] = content.homepage.canonicalOrder.map(
  (item) => {
    if (item.kind === "brand") {
      return {
        kind: "brand" as const,
        tile: item.tile ?? content.homepage.brand.tile,
        alt: item.alt ?? content.homepage.brand.alt,
      };
    }
    if (item.kind === "cta") {
      return {
        kind: "cta" as const,
        tile: item.tile ?? content.homepage.cta.tile,
        alt: item.alt ?? content.homepage.cta.alt,
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
