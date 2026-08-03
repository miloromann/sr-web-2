/**
 * Remember index scroll across client navigations to project pages.
 * Cleared on full page reload (module re-init).
 *
 * Important: never overwrite a remembered mid-page position with 0 from a
 * transient remount (React Strict Mode / Suspense) or from Next.js resetting
 * scroll during homepage remount.
 */
let lastHomeScrollY = 0;
let restoreLockUntil = 0;

export function getHomeScroll(): number {
  return lastHomeScrollY;
}

/** Call only from an active, visible homepage scroll context. */
export function setHomeScroll(y: number) {
  if (Date.now() < restoreLockUntil && y <= 0) return;
  lastHomeScrollY = Math.max(0, y);
}

/** Persist current window scroll if it looks like a real home position. */
export function captureHomeScrollFromWindow() {
  const y = window.scrollY;
  if (y > 0) lastHomeScrollY = y;
}

/** Forget saved index position (e.g. footer brand → top of home). */
export function clearHomeScroll() {
  lastHomeScrollY = 0;
}

/** Block 0-overwrites while we re-apply a restored position. */
export function beginHomeScrollRestore(durationMs = 600) {
  restoreLockUntil = Date.now() + durationMs;
}
