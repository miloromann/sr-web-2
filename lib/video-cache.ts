/**
 * Session + Cache API helpers so videos download once and reuse.
 * Uses the browser Cache API (disk) — not in-memory blobs — to avoid RAM spikes.
 */

const CACHE_NAME = "sr-videos-v1";
const inflight = new Map<string, Promise<void>>();

function absoluteUrl(src: string): string {
  if (typeof window === "undefined") return src;
  try {
    return new URL(src, window.location.origin).href;
  } catch {
    return src;
  }
}

/** Ensure a video URL is stored in Cache API (no-op if already cached). */
export function ensureVideoCached(src: string): Promise<void> {
  if (typeof window === "undefined" || !("caches" in window)) {
    return Promise.resolve();
  }

  const url = absoluteUrl(src);
  const existing = inflight.get(url);
  if (existing) return existing;

  const job = (async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const hit = await cache.match(url);
      if (hit) return;

      const res = await fetch(url, { mode: "cors", credentials: "omit" });
      if (res.ok) {
        await cache.put(url, res.clone());
      }
    } catch {
      /* Offline / blocked — video element will still try normal network. */
    } finally {
      inflight.delete(url);
    }
  })();

  inflight.set(url, job);
  return job;
}

/** Prefetch many video URLs into Cache API (homepage tiles, etc.). */
export function prefetchVideos(srcs: string[]) {
  const unique = [...new Set(srcs.filter(Boolean))];
  for (const src of unique) {
    void ensureVideoCached(src);
  }
}

/** Collect video srcs from project media lists. */
export function collectVideoSrcs(
  items: Array<{ media?: Array<{ type?: string; src?: string }> }>,
): string[] {
  const out: string[] = [];
  for (const item of items) {
    for (const m of item.media ?? []) {
      if (m.type === "video" && m.src) out.push(m.src);
    }
  }
  return out;
}
