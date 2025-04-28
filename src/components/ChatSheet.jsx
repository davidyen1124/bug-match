import { motion as Motion, useMotionValue, animate } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChatSheet({ activeMatches, resolvedMatches, onChat }) {
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

  const snapTo = (toOpen) => {
    setOpen(toOpen)
    animate(y, toOpen ? Y_FULL : Y_COLLAPSED, {
      type: "spring",
      stiffness: 500,
      damping: 40,
    })
  }

  const handleDragEnd = (_e, info) => {
    const current = y.get() + info.offset.y
    const goOpen = Math.abs(current - Y_FULL) < Math.abs(current - Y_COLLAPSED)
    snapTo(goOpen)
  }

  const [tab, setTab] = useState("active")
  const list = tab === "active" ? activeMatches : resolvedMatches

  return (
    <Motion.div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40
                 bg-white/95 backdrop-blur border border-gray-200
                 rounded-t-3xl shadow-2xl flex flex-col"
      style={{ height: SHEET_H, y, touchAction: "none" }}
      drag="y"
      dragElastic={0.2}
      dragConstraints={{ top: Y_FULL, bottom: Y_COLLAPSED }}
      onDragEnd={handleDragEnd}
    >
      <div
        className="h-18 flex items-center justify-between px-4 cursor-pointer"
        onClick={() => snapTo(!open)}
      >
        <span className="font-semibold">Matches</span>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>
            {activeMatches.length} active · {resolvedMatches.length} resolved
          </span>
          {open ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronUp className="w-5 h-5" />
          )}
        </div>
      </div>

      <div className="flex border-b">
        {["active", "resolved"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium transition
              ${
                tab === t
                  ? "border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {t === "active" ? "Active" : "Resolved"}
          </button>
        ))}
      </div>

      <div className="overflow-y-auto flex-1 px-4 pb-[env(safe-area-inset-bottom)]">
        {list.length === 0 ? (
          <p className="text-center text-sm mt-8 text-gray-500">
            No {tab === "active" ? "active" : "resolved"} matches
          </p>
        ) : (
          <ul className="space-y-2 mt-2">
            {list.map((m) => (
              <li
                key={m.bug.id}
                className={`flex items-center gap-3 rounded-lg p-2
                  ${tab === "active" ? "bg-gray-100" : "bg-green-100"}`}
              >
                <img
                  src={m.bug.image}
                  alt={m.bug.name}
                  className={`w-12 h-12 rounded-full object-cover ${
                    tab === "resolved" ? "grayscale" : ""
                  }`}
                />
                <span
                  className={`flex-1 text-sm ${
                    tab === "resolved" ? "line-through" : "font-medium"
                  }`}
                >
                  {m.bug.name}
                </span>
                {tab === "active" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onChat(m.bug)}
                  >
                    Chat
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Motion.div>
  )
}
