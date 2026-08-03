/**
 * Opening plays only on a full document load of the homepage
 * (refresh / typed URL), not on client-side return from a project page.
 * Resets automatically when the tab reloads.
 */
let openingHandledForThisDocument = false;

export function hasOpeningBeenHandled(): boolean {
  return openingHandledForThisDocument;
}

export function markOpeningHandled(): void {
  openingHandledForThisDocument = true;
}
