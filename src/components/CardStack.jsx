import { useMemo } from "react"
import { AnimatePresence } from "framer-motion"
import SwipeCard from "@/components/SwipeCard"

function CardStack({ bugs, cursor, onLike, onSkip }) {
  // Only render the next three cards. This keeps the DOM small and ensures
  // Framer Motion animates a maximum of three elements.
  const visibleCards = useMemo(
    () => bugs.slice(cursor, cursor + 3),
    [bugs, cursor]
  )

  if (visibleCards.length === 0) return null

  return (
    <div className="relative w-full max-w-md h-[520px] mb-[150px]">
      <AnimatePresence initial={false}>
        {visibleCards
          .map((bug, index) => {
            const offset = index
            const scale = 1 - offset * 0.05
            const yOffset = offset * 20
            const depth = visibleCards.length - index

            return (
              <SwipeCard
                key={bug.id}
                bug={bug}
                isTop={index === 0}
                depth={depth}
                scale={scale}
                yOffset={yOffset}
                onLike={onLike}
                onSkip={onSkip}
              />
            )
          })
          .reverse()}
      </AnimatePresence>
    </div>
  )
}

export default CardStack
