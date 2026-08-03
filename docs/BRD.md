# Studio Romann Website — Business Requirements Document (BRD)

| Field | Value |
|--------|--------|
| **Product** | Studio Romann portfolio website |
| **Document** | BRD |
| **Baseline version** | **version-001** |
| **Date** | 2026-08-02 |
| **Status** | Baseline (saved snapshot) |
| **Contact** | hello@studioromann.com |

---

## 1. Purpose

Deliver a dark, editorial portfolio site for Studio Romann (New York City) that:

1. Opens with a branded letter→project morph animation synced to a randomized homepage grid
2. Showcases 22 case-study projects with appropriate media layouts
3. Lets visitors contact the studio via email
4. Feels seamless from intro into browsing, on desktop and mobile

**version-001** is the first saved baseline of this product: feature-complete homepage intro (shuffle + video morph + third-row cascade), case study pages, footer, and preview tooling as of 2026-08-02.

---

## 2. Scope

### In scope (version-001)

- Static Next.js marketing/portfolio site
- Homepage opening animation + project grid
- Case study pages for all catalogued projects
- Shared footer and contact mailto
- Desktop (3-col) and mobile (2-col) layouts
- Local preview page for layout comparison

### Out of scope (version-001)

- CMS / admin editing
- User accounts, auth, or payments
- Contact form backend (mailto only)
- Light mode / alternate themes
- Blog, about page, or primary site navigation chrome
- Analytics / tracking integrations

---

## 3. Tech stack (version-001)

| Layer | Choice |
|--------|--------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + TypeScript |
| Styling | Global CSS (`app/globals.css`), design tokens via CSS variables |
| Font | Inter (`next/font`) |
| Data | Static TypeScript catalog in `lib/projects.ts` |
| Media | Files under `public/` (images, MP4s, brand, footer) |
| Deploy shape | Static-friendly SSG for `/work/[slug]` |

---

## 4. Routes & information architecture

| Route | Function |
|--------|----------|
| `/` | Homepage: opening animation → shuffled project grid → footer |
| `/work/[slug]` | Case study for one project (SSG; 404 if unknown) |
| `/preview` | Dev helper: desktop vs mobile iframes of home with opening skipped |

**Primary navigation**

- Home: project tiles → case studies
- Case study: top-left R logo → home
- Footer Contact → `mailto:hello@studioromann.com`

---

## 5. Features & functionality

### 5.1 Opening animation (homepage)

| ID | Requirement | version-001 behavior |
|----|-------------|----------------------|
| OA-01 | Branded intro | Letters **R O M A N N** appear in a 3×N tile grid matching homepage metrics |
| OA-02 | R stays | Slot 0 (R) remains as the brand tile |
| OA-03 | Letter → project morph | O M A N N crossfade into the first five **shuffled** non-brand grid items |
| OA-04 | Order coupling | Morph destinations **are** the shuffled homepage order (animation reflects load order) |
| OA-05 | Next-row continue | After OMANN morph, next row (3 tiles) cascades in with the same stagger |
| OA-06 | Video during morph | If a morph target is a video project, its muted looping video plays as it appears |
| OA-07 | Seamless handoff | Overlay uses same padding/gap/radius as the live grid; grid reveals underneath; no layout jump |
| OA-08 | Timing | ~2.26s Figma letter/morph timeline; total ~2.55s including next row; handoff ~2.48s |
| OA-09 | Skip | Click anywhere to skip; `?skipOpening=1` skips; `prefers-reduced-motion` skips |
| OA-10 | Once per session | `sessionStorage` key `sr-opening-seen`; `?forceOpening=1` clears and replays |

### 5.2 Homepage project grid

| ID | Requirement | version-001 behavior |
|----|-------------|----------------------|
| HG-01 | Grid density | 24 cells: brand R + 22 projects + 1 CTA |
| HG-02 | Columns | Desktop **3**; mobile (≤900px) **2** |
| HG-03 | Shuffle | Brand R fixed first; remaining 23 items Fisher–Yates shuffled **each load** |
| HG-04 | Tile shape | Aspect 536∶442, 30px radius (unchanged across breakpoints) |
| HG-05 | Hover | Interactive tiles scale to **1.05** in 200ms ease-out |
| HG-06 | Index videos | Projects with video media autoplay muted/loop in the tile after opening handoff |
| HG-07 | Brand tile | Non-link R using `/brand/romann-logo-r.png` (matches opening end frame) |
| HG-08 | CTA tile | “Create with Studio Romann” image tile; static (no href) in version-001 |
| HG-09 | Navigation | Project tiles link to `/work/{slug}` |

### 5.3 Case study pages

| ID | Requirement | version-001 behavior |
|----|-------------|----------------------|
| CS-01 | Header | R home link; title; client; About / Kind / Year |
| CS-02 | R styling | Transparent letter SVG, 30px radius, same hover scale as tiles |
| CS-03 | Layouts | `centered`, `wide`, `harbor`, `stills`, `album` (see §6) |
| CS-04 | Video UX | Autoplay muted loop; **click toggles volume**; no native control chrome |
| CS-05 | Mute affordance | Hover/focus shows mute/unmute icon; on touch, muted icon stays visible while muted |
| CS-06 | Harbor cards | Logo + front/back image pairs (side by side) |
| CS-07 | Metadata | Page title `{Project} — Studio Romann`; description from About copy |

### 5.4 Footer

| ID | Requirement | version-001 behavior |
|----|-------------|----------------------|
| FT-01 | Branding | STUDIO wordmark · New York City · Contact · ROMANN wordmark |
| FT-02 | Contact | Mailto `hello@studioromann.com` |
| FT-03 | Placement | Shared on homepage and all case studies |

### 5.5 Responsive & accessibility

| ID | Requirement | version-001 behavior |
|----|-------------|----------------------|
| RA-01 | Breakpoint | `max-width: 900px` → 2-col grid, stacked header meta, single-col media grids |
| RA-02 | Reduced motion | Opening skipped; CSS animations/transitions minimized; hover scale disabled |
| RA-03 | Semantics | List roles on grid; aria-labels on project links and video mute control |
| RA-04 | Language | `lang="en"` |

### 5.6 Developer / QA helpers

| ID | Requirement | version-001 behavior |
|----|-------------|----------------------|
| DV-01 | Preview | `/preview` — desktop (1280×900) and mobile (390×844) iframes of `/?skipOpening=1` |
| DV-02 | Force intro | `/?forceOpening=1` |
| DV-03 | Skip intro | `/?skipOpening=1` |

---

## 6. Project catalog (version-001)

22 case studies. Video projects play in homepage tiles and on their case study pages.

| Slug | Title | Layout | Notes |
|------|--------|--------|--------|
| `here-stills` | HERE. STILLS | stills | 9-image grid |
| `here` | HERE. | wide | Video |
| `nyotaimori` | NYOTAIMORI | centered | Poster |
| `live-at-arthur-ashe` | LIVE AT ARTHUR ASHE | wide | Campaign still |
| `harbor` | HARBOR | harbor | Logo + 4 card pairs |
| `the-dance-vol-4` | THE DANCE VOL. 4 | wide | Poster |
| `vincent-randazzo` | VINCENT RANDAZZO | wide | Video + stills |
| `the-salon` | THE SALON | wide | Still |
| `lillys-show` | LILLY'S SHOW | wide | Video |
| `earth-swallow-me-whole` | EARTH SWALLOW ME WHOLE | centered | Poster |
| `the-fitting` | THE FITTING | wide | Video |
| `rebel` | REBEL | wide | Still |
| `poeppel` | POEPPEL | wide | Multi-image |
| `how-to-wring-a-dream` | HOW TO WRING A DREAM | wide | Multi-image |
| `find-your-voice` | FIND YOUR VOICE | wide | Video |
| `the-dance-vol-10` | THE DANCE VOL. 10 | wide | Poster |
| `williamsburg-bridge-set` | WILLIAMSBURG BRIDGE SET | centered | Poster |
| `album-art` | ALBUM ART | album | 10-image grid |
| `rn` | RN | centered | Still |
| `rajasthan` | RAJASTHAN | wide | Video |
| `silver-lining` | SILVER LINING | centered | Still |
| `couch-prints` | COUCH PRINTS | wide | Still |

**Homepage cell order (canonical, pre-shuffle):** brand R → projects above (through how-to-wring-a-dream) → CTA → remaining projects (find-your-voice … couch-prints). At runtime only the brand stays fixed; all other cells shuffle.

---

## 7. Design tokens (version-001)

| Token | Value | Use |
|--------|--------|-----|
| Background | `#0c0c0c` | Page |
| Foreground | `#ffffff` / muted `#dddddd` | Text |
| Gap | `32px` desktop / `16px` mobile | Grid |
| Radius | `30px` | Tiles (fixed across breakpoints) |
| Max width | `1685px` | Content shell |
| Page pad | `22px` / `14px` mobile | Horizontal inset |
| Hover scale | `1.05` @ 200ms ease-out | Tiles / header R |

---

## 8. Non-functional requirements

| ID | Requirement | version-001 |
|----|-------------|-------------|
| NF-01 | Performance | Next Image (AVIF/WebP); opening preloads morph assets; videos muted for autoplay |
| NF-02 | Offline/CMS | None — static data and files |
| NF-03 | Browser | Modern evergreen; autoplay muted video supported |
| NF-04 | Privacy | No analytics in baseline |

---

## 9. Known gaps / follow-ups (not blocking version-001)

- CTA tile has no destination URL yet
- `FlipCard` component exists but Harbor uses static front/back pairs
- `public/opening/opening.mp4` is present but unused (superseded by DOM morph for shuffle + seamless handoff)
- Some About/Kind/Year copy may still be approximate vs Figma source

---

## 10. Version history

| Version | Date | Summary |
|---------|------|---------|
| **version-001** | 2026-08-02 | Baseline: shuffled seamless letter→project intro with video morph + next-row cascade; 22 case studies; mute-toggle project videos; footer contact; responsive 3/2 grid; `/preview` |

Future versions should append rows here and keep this BRD updated (or add `docs/BRD-version-00N.md` deltas if preferred).

---

## 11. Acceptance checklist (version-001)

- [x] Homepage plays letter morph into **shuffled** projects with matching handoff
- [x] Video projects play during morph and in index tiles after handoff
- [x] Next grid row continues the intro cascade
- [x] Opening plays once per session; force/skip query params work
- [x] All 22 `/work/[slug]` pages render with correct layout type
- [x] Project videos: no native overlay; click mute/unmute; hover mute icon
- [x] Footer contact mailto works
- [x] Desktop 3-col / mobile 2-col grids
- [x] Reduced-motion skips opening
- [x] This BRD documents version-001
