/**
 * Shared muted-autoplay helpers for homepage tile videos.
 * iOS often blocks play() until a gesture OR until we keep retrying muted play.
 */

const videos = new Set<HTMLVideoElement>();

export function registerAutoplayVideo(el: HTMLVideoElement) {
  videos.add(el);
}

export function unregisterAutoplayVideo(el: HTMLVideoElement) {
  videos.delete(el);
}

/** Force muted + playsInline, then attempt play. */
export function armMutedVideo(el: HTMLVideoElement) {
  el.defaultMuted = true;
  el.muted = true;
  el.playsInline = true;
  el.setAttribute("muted", "");
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "");
}

export function tryPlayMuted(el: HTMLVideoElement): Promise<void> {
  armMutedVideo(el);
  const result = el.play();
  if (result && typeof result.then === "function") {
    return result.catch(() => {
      /* Autoplay may still be blocked; caller retries. */
    });
  }
  return Promise.resolve();
}

/** Kick every registered tile video (home mount, intro start, pageshow, etc.). */
export function kickAllAutoplayVideos() {
  videos.forEach((el) => {
    void tryPlayMuted(el);
  });
}
