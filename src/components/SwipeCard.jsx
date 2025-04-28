import React from "react";
import { motion, useMotionValue } from "framer-motion";
import BugCard from "@/components/BugCard";

/**
 * @param {{
 *   bug: import("../App").BugProfile,
 *   isTop: boolean,
 *   depth: number,
 *   scale: number,
 *   yOffset: number,
 *   onLike: () => void,
 *   onSkip: () => void
 * }} props
 */
function SwipeCard({ bug, isTop, depth, scale, yOffset, onLike, onSkip }) {
  const rotate = useMotionValue(0);

  const handleDragEnd = (_, info) => {
    if (!isTop) return;
    if (info.offset.x > 120) onLike();
    else if (info.offset.x < -120) onSkip();
    else rotate.set(0);
  };

  return (
    <motion.div
      className="absolute inset-x-0 top-0 flex justify-center items-center touch-none select-none"
      style={{ zIndex: depth, scale, y: yOffset, rotate }}
      drag={isTop ? "x" : false}
      onDrag={(e, info) => {
        if (isTop) rotate.set(info.offset.x / 10);
      }}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: scale * 0.9 }}
      animate={{ opacity: 1, scale, y: yOffset }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
    >
      <BugCard bug={bug} />
    </motion.div>
  );
}

export default SwipeCard;