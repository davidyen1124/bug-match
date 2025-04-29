import React, { useState, useEffect, useCallback } from "react"
import Onboarding from "@/components/Onboarding"
import CardStack from "@/components/CardStack"
import ChatSheet from "@/components/ChatSheet"
import EmptyState from "@/components/EmptyState"
import confetti from "canvas-confetti"

export default function BugMatchApp() {
  const [expertise, setExpertise] = useState([])
  const [bugs, setBugs] = useState([])
  const [cursor, setCursor] = useState(0)
  const [matches, setMatches] = useState([])

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/bug-match/bugs.json")
      const bugs = await res.json()

      const ranked = bugs.sort((a, b) => {
        const score = (prof) =>
          prof.tags.filter((t) => expertise.includes(t)).length
        const diff = score(b) - score(a)
        return diff !== 0 ? diff : Math.random() - 0.5
      })
      setBugs(ranked)
    })()
  }, [expertise])

  const like = useCallback(() => {
    confetti()
    const bug = bugs[cursor]
    if (!bug) return
    setMatches((prev) => [...prev, { bug, status: "active" }])
    setCursor((c) => c + 1)
  }, [cursor, bugs])

  const restart = useCallback(() => {
    setCursor(0)
    setMatches([])
  }, [])

  const skip = useCallback(() => setCursor((c) => c + 1), [])

  const current = bugs[cursor]
  const activeMatches = matches.filter((m) => m.status === "active")

  return (
    <div className="bg-gradient-to-br from-purple-100 to-blue-100 fixed inset-0 overflow-auto flex flex-col items-center p-4 gap-8">
      {/* Onboarding */}
      {expertise.length === 0 && <Onboarding onDone={setExpertise} />}

      {/* Card stack */}
      <CardStack bugs={bugs} cursor={cursor} onLike={like} onSkip={skip} />

      {/* Bottom-sheet with matches & chat */}
      <ChatSheet activeMatches={activeMatches} />

      {/* Empty-state after all bugs triaged */}
      {!current && expertise.length > 0 && <EmptyState onRestart={restart} />}
    </div>
  )
}
