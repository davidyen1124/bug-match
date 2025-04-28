import { motion as Motion, useMotionValue, animate } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown, ArrowLeft } from "lucide-react"
import ChatThread from "@/components/ChatThread"
import ChatList from "@/components/ChatList"

export default function ChatSheet({ activeMatches }) {
  const COLLAPSED_BAR = 72
  const [vh, setVh] = useState(
    typeof window !== "undefined" ? window.innerHeight : 0
  )

  useEffect(() => {
    const handle = () => setVh(window.innerHeight)
    window.addEventListener("resize", handle)
    return () => window.removeEventListener("resize", handle)
  }, [])

  const SHEET_H = Math.min(vh * 0.8, 640)
  const Y_FULL = 0
  const Y_COLLAPSED = SHEET_H - COLLAPSED_BAR

  const y = useMotionValue(Y_COLLAPSED)
  const [open, setOpen] = useState(false)

  const snapTo = (openState) =>
    animate(y, openState ? Y_FULL : Y_COLLAPSED, {
      type: "spring",
      stiffness: 500,
      damping: 40,
      onComplete: () => setOpen(openState),
    })

  const handleDragEnd = (_e, info) => {
    const current = y.get() + info.offset.y
    snapTo(Math.abs(current - Y_FULL) < Math.abs(current - Y_COLLAPSED))
  }

  const [view, setView] = useState("list")
  const [chatBug, setChatBug] = useState(null)

  const enterChat = (bug) => {
    setChatBug(bug)
    setView("chat")
    snapTo(true)
  }

  return (
    <Motion.div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                 z-40 bg-white/95 backdrop-blur border border-gray-200
                 rounded-t-3xl shadow-2xl flex flex-col"
      style={{ height: SHEET_H, y, touchAction: "none" }}
      drag="y"
      dragElastic={0.2}
      dragConstraints={{ top: Y_FULL, bottom: Y_COLLAPSED }}
      onDragEnd={handleDragEnd}
    >
      {view === "list" ? (
        <div
          className="h-18 flex items-center justify-between px-4 cursor-pointer select-none"
          onClick={() => snapTo(!open)}
        >
          <span className="font-semibold">Matches</span>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>{activeMatches.length} active</span>
            {open ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronUp className="w-5 h-5" />
            )}
          </div>
        </div>
      ) : (
        <div className="h-18 flex items-center justify-between px-4 border-b">
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="font-semibold">{chatBug.name}</span>
        </div>
      )}

      {view === "list" ? (
        <ChatList matches={activeMatches} onSelect={enterChat} />
      ) : (
        chatBug && <ChatThread key={chatBug.id} bug={chatBug} />
      )}
    </Motion.div>
  )
}
