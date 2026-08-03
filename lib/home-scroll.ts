/**
 * Remember index scroll across client navigations to project pages.
 * Cleared on full page reload (module re-init).
 *
 * Important: never overwrite a remembered mid-page position with 0 from a
 * transient remount (React Strict Mode / Suspense) or from Next.js resetting
 * scroll during homepage remount.
 *
 * Only restore when returning from a project — never when the intro finishes,
 * or restore timers will fight the user mid-scroll.
 */
let lastHomeScrollY = 0;
let restoreLockUntil = 0;
let pendingRestore = false;

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

/** Mark that the next homepage mount should restore scroll (project → home). */
export function markHomeScrollPendingRestore() {
  pendingRestore = true;
}

/**
 * Consume a pending project→home restore.
 * Returns 0 when there is nothing to restore (e.g. intro just ended).
 */
export function consumeHomeScrollPendingRestore(): number {
  if (!pendingRestore) return 0;
  pendingRestore = false;
  return lastHomeScrollY;
}

/** Forget saved index position (e.g. footer brand → top of home). */
export function clearHomeScroll() {
  lastHomeScrollY = 0;
  pendingRestore = false;
}

/** Block 0-overwrites while we re-apply a restored position. */
export function beginHomeScrollRestore(durationMs = 600) {
  restoreLockUntil = Date.now() + durationMs;
}
