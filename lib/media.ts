/** DreamHost media host — all stills + videos live here. */
export const MEDIA_BASE = "https://files.studioromann.com";

/**
 * Turn a site-relative path (`/here/video.mp4`) into an absolute media URL.
 * Leaves already-absolute `http(s):` URLs unchanged.
 */
export function mediaUrl(path: string | undefined | null): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${MEDIA_BASE}${clean}`;
}
