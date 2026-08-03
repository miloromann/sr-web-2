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
  /** CSS object-position for index tile crops (from Figma). Image tiles only. */
  tilePosition?: string;
  media: MediaItem[];
  layout?: "centered" | "wide" | "harbor" | "stills" | "album" | "stacked";
};

export type GridItem =
  | { kind: "brand"; tile: string; alt: string }
  | { kind: "cta"; tile: string; alt: string; href?: string }
  | { kind: "project"; project: Project };

export const CONTACT_EMAIL = "miloromaguera@gmail.com";

export const projects: Project[] = [
  {
    slug: "here-stills",
    title: "HERE. STILLS",
    client: "MILO",
    about: "VHS stills from Milo’s “here.” series.",
    kind: ["Photography"],
    year: "2026",
    tile: "/here-stills/here-still-1.png",
    layout: "stills",
    media: Array.from({ length: 9 }, (_, i) => ({
      type: "image" as const,
      src: `/here-stills/here-still-${i + 1}.png`,
      alt: `here. still ${i + 1}`,
    })),
  },
  {
    slug: "here",
    title: "HERE.",
    client: "MILO",
    about: "VHS video and editing for Milo’s video series, “here.”",
    kind: ["Videography", "Video Editing"],
    year: "2026",
    tile: "/here/here-hero.png",
    media: [
      {
        type: "video",
        src: "/here/video/here-video-1.mp4",
        poster: "/here/here-hero.png",
      },
    ],
  },
  {
    slug: "nyotaimori",
    title: "NYOTAIMORI",
    client: "NUBLU STUDIO 151",
    about:
      "Poster design for Nublu Studio 151 appearing in ONLYCHILD Mag. Original image by Antonia Singer.",
    kind: ["Graphic Design", "Typography"],
    year: "2023",
    tile: "/nyotaimori/nyotaimori-image.png",
    tilePosition: "50% 0%",
    layout: "centered",
    media: [
      {
        type: "image",
        src: "/nyotaimori/nyotaimori-image.png",
        alt: "Nyotaimori poster",
      },
    ],
  },
  {
    slug: "live-at-arthur-ashe",
    title: "LIVE AT ARTHUR ASHE",
    client: "SWEDISH HOUSE MAFIA",
    about:
      "Digital marketing OOH (Adjacker) for Swedish House Mafia’s Arthur Ashe Stadium show. A bold campaign that pushed boundaries by hacking billboards and turning public space into a global moment.",
    kind: ["Adjacker", "Marketing", "Motion"],
    year: "2025",
    tile: "/live-at-arthur-ashe/live-at-arthur-ashe-hero.png",
    tilePosition: "28% 100%",
    layout: "wide",
    media: [
      {
        type: "image",
        src: "/live-at-arthur-ashe/live-at-arthur-ashe-hero.png",
        alt: "Live at Arthur Ashe",
      },
    ],
  },
  {
    slug: "harbor",
    title: "HARBOR",
    client: "HARBOR STUDIOS",
    about: "Branding for Harbor Studios, a music studio located in Red hook, Brooklyn.",
    kind: ["Art Direction", "Branding"],
    year: "2026",
    tile: "/harbor/harbor-hero.png",
    tilePosition: "3% 50%",
    layout: "harbor",
    media: [
      {
        type: "image",
        src: "/harbor/harbor-red-logo.png",
        alt: "Harbor Studios logo",
      },
      {
        type: "card-pair",
        front: "/harbor/harbor-card-front-eric.png",
        back: "/harbor/harbor-card-back-eric.png",
        alt: "Eric Sanderson card",
      },
      {
        type: "card-pair",
        front: "/harbor/harbor-card-front-olav.png",
        back: "/harbor/harbor-card-back-olav.png",
        alt: "Olav Christensen card",
      },
      {
        type: "card-pair",
        front: "/harbor/harbor-card-front-peter.png",
        back: "/harbor/harbor-card-back-peter.png",
        alt: "Peter Tavoulareas card",
      },
      {
        type: "card-pair",
        front: "/harbor/harbor-card-front-matthew.png",
        back: "/harbor/harbor-card-back-matthew.png",
        alt: "Matthew Stenroos card",
      },
    ],
  },
  {
    slug: "the-dance-vol-4",
    title: "THE DANCE VOL. 4",
    client: "MATTE PROJECTS",
    about:
      "Digital marketing OOH (Adjackr) for Swedish House Mafia’s Arthur Ashe Stadium show. A bold campaign that pushed boundaries by hacking billboards and turning public space into a global moment.",
    kind: ["Photography", "Graphic Design"],
    year: "2023",
    tile: "/the-dance-vol-4/the-dance-vol-4-image.png",
    tilePosition: "0% 50%",
    layout: "wide",
    media: [
      {
        type: "image",
        src: "/the-dance-vol-4/the-dance-vol-4-image.png",
        alt: "The Dance Vol. 4",
      },
    ],
  },
  {
    slug: "vincent-randazzo",
    title: "VINCENT RANDAZZO",
    client: "HARBOR STUDIOS",
    about: "Video for singer/songwriter, Vincent Randazzo, recording at Harbor Studios.",
    kind: ["Videography", "Video Editing"],
    year: "2026",
    tile: "/vincent-randazzo/vincent-randazzo-still-1.png",
    media: [
      {
        type: "video",
        src: "/vincent-randazzo/video/vincent-randazzo-video-1.mp4",
        poster: "/vincent-randazzo/vincent-randazzo-still-1.png",
      },
      {
        type: "image",
        src: "/vincent-randazzo/vincent-randazzo-still-1.png",
        alt: "Vincent Randazzo still 1",
      },
      {
        type: "image",
        src: "/vincent-randazzo/vincent-randazzo-still-2.png",
        alt: "Vincent Randazzo still 2",
      },
      {
        type: "image",
        src: "/vincent-randazzo/vincent-randazzo-still-3.png",
        alt: "Vincent Randazzo still 3",
      },
      {
        type: "image",
        src: "/vincent-randazzo/vincent-randazzo-still-4.png",
        alt: "Vincent Randazzo still 4",
      },
    ],
  },
  {
    slug: "the-salon",
    title: "THE SALON",
    client: "PALO GALLERY",
    about:
      "Digital marketing OOH (Adjackr) for Swedish House Mafia’s Arthur Ashe Stadium show. A bold campaign that pushed boundaries by hacking billboards and turning public space into a global moment.",
    kind: ["Photography", "Graphic Design"],
    year: "2023",
    tile: "/the-salon/the-salon-hero.png",
    tilePosition: "100% 100%",
    layout: "wide",
    media: [
      {
        type: "image",
        src: "/the-salon/the-salon-hero.png",
        alt: "The Salon",
      },
    ],
  },
  {
    slug: "lillys-show",
    title: "LILLY’S SHOW",
    client: "PALO GALLERY",
    about:
      "VHS video and editing for photographer Lilly Burgess’ show at Palo Gallery. Original score by Milo.",
    kind: ["Videography", "Video Editing"],
    year: "2026",
    tile: "/lillys-show/lillys-show-hero.png",
    media: [
      {
        type: "video",
        src: "/lillys-show/video/lillys-show-video.mp4",
        poster: "/lillys-show/lillys-show-hero.png",
      },
    ],
  },
  {
    slug: "earth-swallow-me-whole",
    title: "EARTH SWALLOW ME WHOLE",
    client: "TALLEN",
    about: "Album artwork for Narrows End’s single, Silver Lining.",
    kind: ["Graphic Design"],
    year: "2026",
    tile: "/earth-swallow-me-whole/earth-swallow-me-whole-cover.png",
    tilePosition: "50% 100%",
    layout: "centered",
    media: [
      {
        type: "image",
        src: "/earth-swallow-me-whole/earth-swallow-me-whole-cover.png",
        alt: "Earth Swallow Me Whole cover",
      },
    ],
  },
  {
    slug: "the-fitting",
    title: "THE FITTING",
    client: "TEARS DROP",
    about:
      "VHS video and editing for Tears Drop. Jewelry designer, Naz Yilmaz, fitting Lilly Burgess for her show at Palo Gallery.",
    kind: ["Videography", "Video Editing"],
    year: "2026",
    tile: "/the-fitting/the-fitting-hero.png",
    media: [
      {
        type: "video",
        src: "/the-fitting/video/the-fitting-video.mp4",
        poster: "/the-fitting/the-fitting-hero.png",
      },
    ],
  },
  {
    slug: "rebel",
    title: "REBEL",
    client: "BAR REBEL",
    about: "Editorial design and layout for Milo featuring photography by Andrew Womack.",
    kind: ["Editorial", "Graphic Design", "Typography"],
    year: "2024",
    tile: "/rebel/rebel-hero.jpg",
    tilePosition: "50% 71%",
    layout: "stacked",
    media: [
      {
        type: "image",
        src: "/rebel/rebel-hero.jpg",
        alt: "Bar Rebel",
        frame: "wide",
      },
      {
        type: "image",
        src: "/rebel/rebel-logo.png",
        alt: "Bar Rebel logo",
        frame: "wide",
      },
      {
        type: "image",
        src: "/rebel/rebel-menu.png",
        alt: "Bar Rebel menu",
        frame: "centered",
      },
    ],
  },
  {
    slug: "poeppel",
    title: "POEPPEL",
    client: "ALEX POEPPEL",
    about: "Branding for producer and mixing engineer Alex Poeppel.",
    kind: ["Branding", "Graphic Design"],
    year: "2025",
    tile: "/poeppel/poeppel-tile.png",
    layout: "stacked",
    media: [
      {
        type: "image",
        src: "/poeppel/poeppel-desktop.png",
        alt: "Poeppel desktop",
        frame: "full",
      },
      {
        type: "image",
        src: "/poeppel/poeppel-cards.png",
        alt: "Poeppel cards",
        frame: "full",
      },
      {
        type: "image",
        src: "/poeppel/poeppel-tracking-sheet.png",
        alt: "Poeppel tracking sheet",
        frame: "full",
      },
    ],
  },
  {
    slug: "how-to-wring-a-dream",
    title: "HOW TO WRING A DREAM",
    client: "MILO",
    about: "Editorial design and layout for Milo featuring photography by Andrew Womack.",
    kind: ["Editorial", "Graphic Design", "Typography"],
    year: "2024",
    tile: "/how-to-wring-a-dream/how-to-wring-a-dream-hero.png",
    tilePosition: "100% 50%",
    layout: "stacked",
    media: [
      {
        type: "image",
        src: "/how-to-wring-a-dream/how-to-wring-a-dream-hero.png",
        alt: "How to Wring a Dream",
      },
      {
        type: "image",
        src: "/how-to-wring-a-dream/how-to-wring-a-dream-2.png",
        alt: "How to Wring a Dream detail",
      },
    ],
  },
  {
    slug: "find-your-voice",
    title: "FIND YOUR VOICE",
    client: "TITLES",
    about: "Motion advertisement for Titles’ announcement of Text to Speech.",
    kind: ["Motion Graphics", "Video Editing"],
    year: "2026",
    tile: "/find-your-voice/find-your-voice-hero.png",
    media: [
      {
        type: "video",
        src: "/find-your-voice/video/FIND YOUR VOICE v1.mp4",
        poster: "/find-your-voice/find-your-voice-hero.png",
      },
    ],
  },
  {
    slug: "the-dance-vol-10",
    title: "THE DANCE VOL. 10",
    client: "CHANNEL 1",
    about:
      "Flyer for Channel 1’s The Dance Vol. 10 at Omakase Bar Juku in New York City. The title was rendered in soy sauce, with chopsticks crossing to form an X for Volume 10.",
    kind: ["Photography", "Graphic Design"],
    year: "2024",
    tile: "/the-dance-vol-10/the-dance-vol-10-hero.png",
    tilePosition: "16% 50%",
    layout: "wide",
    media: [
      {
        type: "image",
        src: "/the-dance-vol-10/the-dance-vol-10-hero.png",
        alt: "The Dance Vol. 10",
      },
    ],
  },
  {
    slug: "williamsburg-bridge-set",
    title: "WILLIAMSBURG BRIDGE SET",
    client: "EMMA X",
    about: "Poster for pop-up DJ sets at the Williamsburg Bridge center pathway.",
    kind: ["Graphic Design", "Typography"],
    year: "2023",
    tile: "/williamsburg-bridge-set/williamsburg-bridge-set-poster.png",
    tilePosition: "50% 29%",
    layout: "centered",
    media: [
      {
        type: "image",
        src: "/williamsburg-bridge-set/williamsburg-bridge-set-poster.png",
        alt: "Williamsburg Bridge Set poster",
      },
    ],
  },
  {
    slug: "album-art",
    title: "ALBUM ART",
    client: "MILO",
    about: "Album artwork for Milo.",
    kind: ["Graphic Design", "Typography"],
    year: "2018-2026",
    tile: "/album-art/album-art-1.png",
    tilePosition: "50% 60%",
    layout: "album",
    media: Array.from({ length: 10 }, (_, i) => ({
      type: "image" as const,
      src: `/album-art/album-art-${i + 1}.png`,
      alt: `Album art ${i + 1}`,
    })),
  },
  {
    slug: "rn",
    title: "RN",
    client: "OPP",
    about: "Album artwork for OPP’s single, RN featuring Julian Soto.",
    kind: ["Graphic Design"],
    year: "2026",
    tile: "/rn/rn-cover.png",
    layout: "centered",
    media: [{ type: "image", src: "/rn/rn-cover.png", alt: "RN cover" }],
  },
  {
    slug: "rajasthan",
    title: "RAJASTHAN",
    client: "WEST ELM",
    about:
      "Closing credits for a black-and-white short film shot in Rajasthan for West Elm, in collaboration with Gentl & Hyers.",
    kind: ["Motion Graphics", "Typography"],
    year: "2024",
    tile: "/rajasthan/rajasthan-hero.png",
    media: [
      {
        type: "video",
        src: "/rajasthan/video/rajasthan-credits.mp4",
        poster: "/rajasthan/rajasthan-hero.png",
      },
    ],
  },
  {
    slug: "silver-lining",
    title: "SILVER LINING",
    client: "NARROWS END",
    about: "Album artwork for Narrows End’s single, Silver Lining.",
    kind: ["Graphic Design"],
    year: "2026",
    tile: "/silver-lining/silver-lining-cover.png",
    tilePosition: "0% 50%",
    layout: "centered",
    media: [
      {
        type: "image",
        src: "/silver-lining/silver-lining-cover.png",
        alt: "Silver Lining cover",
      },
    ],
  },
  {
    slug: "couch-prints",
    title: "COUCH PRINTS",
    client: "COUCH PRINTS",
    about: "Print series for Couch Prints.",
    kind: ["Photography", "Print"],
    year: "2025",
    tile: "/couch-prints/couch-prints-hero.png",
    tilePosition: "50% 56%",
    layout: "wide",
    media: [
      {
        type: "image",
        src: "/couch-prints/couch-prints-hero.png",
        alt: "Couch Prints",
      },
    ],
  },
];

const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

/** Homepage grid order matches Figma HOMEPAGE. */
export const homepageGrid: GridItem[] = [
  { kind: "brand", tile: "/brand/romann-logo-r.png", alt: "Studio Romann" },
  { kind: "project", project: bySlug["here-stills"] },
  { kind: "project", project: bySlug["here"] },
  { kind: "project", project: bySlug["nyotaimori"] },
  { kind: "project", project: bySlug["live-at-arthur-ashe"] },
  { kind: "project", project: bySlug["harbor"] },
  { kind: "project", project: bySlug["the-dance-vol-4"] },
  { kind: "project", project: bySlug["vincent-randazzo"] },
  { kind: "project", project: bySlug["the-salon"] },
  { kind: "project", project: bySlug["lillys-show"] },
  { kind: "project", project: bySlug["earth-swallow-me-whole"] },
  { kind: "project", project: bySlug["the-fitting"] },
  { kind: "project", project: bySlug["rebel"] },
  { kind: "project", project: bySlug["poeppel"] },
  { kind: "project", project: bySlug["how-to-wring-a-dream"] },
  {
    kind: "cta",
    tile: "/tiles/create-cta.png",
    alt: "Create with Studio Romann",
  },
  { kind: "project", project: bySlug["find-your-voice"] },
  { kind: "project", project: bySlug["the-dance-vol-10"] },
  { kind: "project", project: bySlug["williamsburg-bridge-set"] },
  { kind: "project", project: bySlug["album-art"] },
  { kind: "project", project: bySlug["rn"] },
  { kind: "project", project: bySlug["rajasthan"] },
  { kind: "project", project: bySlug["silver-lining"] },
  { kind: "project", project: bySlug["couch-prints"] },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

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
    // Only apply Figma crop to still tiles — leave video framing alone
    objectPosition: hasVideo ? undefined : item.project.tilePosition,
    href: `/work/${item.project.slug}`,
    label: item.project.title,
  };
}
