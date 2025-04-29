import {
  motion as Motion,
  useMotionValue,
  useTransform,
  animate as motionAnimate,
} from "framer-motion"
import useSwipeThreshold from "@/hooks/useSwipeThreshold"
import BugCard from "@/components/BugCard"

export default function SwipeCard({
  bug,
  isTop,
  depth,
  scale,
  yOffset,
  onLike,
  onSkip,
}) {
  const threshold = useSwipeThreshold()

  const x = useMotionValue(0)
  const y = useMotionValue(yOffset)
  const rotate = useTransform(x, [-threshold, 0, threshold], [-15, 0, 15])
  const opacity = useTransform(
    x,
    [-threshold * 1.5, 0, threshold * 1.5],
    [0, 1, 0]
  )

  const flyOut = (direction) => {
    const toX = direction === "right" ? window.innerWidth : -window.innerWidth
    const toRotate = direction === "right" ? 45 : -45
    motionAnimate(x, toX, { type: "spring", stiffness: 500, damping: 40 })
    motionAnimate(rotate, toRotate, {
      type: "spring",
      stiffness: 500,
      damping: 40,
      onComplete: () => {
        direction === "right" ? onLike() : onSkip()
      },
    })
  }

  const handleDragEnd = (_e, info) => {
    if (info.offset.x > threshold) {
      flyOut("right")
    } else if (info.offset.x < -threshold) {
      flyOut("left")
    } else {
      motionAnimate(x, 0, { type: "spring", stiffness: 300, damping: 20 })
      motionAnimate(y, yOffset, {
        type: "spring",
        stiffness: 300,
        damping: 20,
      })
    }
  }

  return (
    <Motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: depth,
        touchAction: "pan-y",
      }}
      initial={{ scale, y: yOffset }}
      animate={{ scale, y: yOffset }}
      exit={{ opacity: 0 }}
      drag={isTop ? "x" : false}
      dragElastic={0.2}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full overflow-y-auto overscroll-contain scrollbar-none">
        <BugCard bug={bug} />
      </div>
    </Motion.div>
  )
}
