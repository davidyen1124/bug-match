/**
 * Simple JSON wrapper around localStorage.
 * Falls back to the provided default if the key is missing.
 */
export const storage = {
  /** @template T */
  get: (key, fallback) =>
    JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback)),
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
};