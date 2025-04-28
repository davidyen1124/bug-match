/**
 * Temporarily paints a majestic “Works-On-My-Machine” masterpiece.
 * TODO: trade this in for real AI magic once the GPUs stop catching fire in CI.
 * @param {string} prompt
 */
export async function generateBugImage(prompt) {
  return `https://placehold.co/300x300?text=${encodeURIComponent(prompt)}`
}
