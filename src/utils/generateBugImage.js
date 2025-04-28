/**
 * Returns a placeholder image URL that encodes the prompt.
 * Replace this with a real image-generation call when available.
 * @param {string} prompt
 */
export async function generateBugImage(prompt) {
  return `https://placehold.co/300x300?text=${encodeURIComponent(prompt)}`;
}