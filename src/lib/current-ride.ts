// Tiny session-scoped store for the active ride id so screens that
// transition (searching → driver-found → tracking → ride-complete) can
// pick up the same ride without query-string plumbing.

const KEY = "dl.currentRideId";

export function setCurrentRideId(id: string) {
  try {
    sessionStorage.setItem(KEY, id);
  } catch {
    /* SSR */
  }
}
export function getCurrentRideId(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}
export function clearCurrentRideId() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}
