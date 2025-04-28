import { useState, useEffect } from "react"
import { SWIPE_RATIO } from "@/constants"

/**
 * Returns the swipe threshold in pixels (window.innerWidth × SWIPE_RATIO).
 * Automatically updates on resize and is SSR-safe.
 */
export default function useSwipeThreshold() {
  const [threshold, setThreshold] = useState(() =>
    typeof window === "undefined" ? 0 : window.innerWidth * SWIPE_RATIO
  )

  useEffect(() => {
    const handleResize = () => setThreshold(window.innerWidth * SWIPE_RATIO)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return threshold
}
