import React, { useState, useEffect, useCallback } from "react"
import Onboarding from "@/components/Onboarding"

import CardStack from "@/components/CardStack"
import ChatWindow from "@/components/ChatWindow"
import ChatSheet from "@/components/ChatSheet"

import { generateBugImage } from "@/utils/generateBugImage"

const sampleBugs = [
  {
    id: "bug-001",
    name: "NullPointer Nelly",
    pickupLine:
      "Are you an uninitialized variable? Because my world crashes without you 💥",
    stats: {
      Severity: 8,
      Complexity: 6,
      Reproducibility: 9,
      Legacy: 5,
      Priority: 8,
    },
    tags: ["backend", "java"],
  },
  {
    id: "bug-002",
    name: "Off-By-One Olivia",
    pickupLine: "I may be off by one, but you're the one for me ✨",
    stats: {
      Severity: 4,
      Complexity: 3,
      Reproducibility: 7,
      Legacy: 2,
      Priority: 5,
    },
    tags: ["frontend", "javascript"],
  },
  {
    id: "bug-003",
    name: "Race-Condition Ron",
    pickupLine: "Let's go parallel—we'll sync later 😉",
    stats: {
      Severity: 9,
      Complexity: 9,
      Reproducibility: 4,
      Legacy: 6,
      Priority: 9,
    },
    tags: ["systems", "c++", "concurrency"],
  },
]

export default function BugMatchApp() {
  const [expertise, setExpertise] = useState([])
  const [bugs, setBugs] = useState([])
  const [cursor, setCursor] = useState(0)
  const [matches, setMatches] = useState([])
  const [chatting, setChatting] = useState(null)

  useEffect(() => {
    ;(async () => {
      const enriched = await Promise.all(
        sampleBugs.map(async (b) => ({
          ...b,
          image: await generateBugImage(
            `${b.name} cartoon bug, kawaii, flat vector, white background`
          ),
        }))
      )

      const ranked = enriched.sort((a, b) => {
        const score = (prof) =>
          prof.tags.filter((t) => expertise.includes(t)).length
        const diff = score(b) - score(a)
        return diff !== 0 ? diff : Math.random() - 0.5
      })
      setBugs(ranked)
    })()
  }, [expertise])

  const like = useCallback(() => {
    const bug = bugs[cursor]
    if (!bug) return
    setMatches((prev) => [...prev, { bug, status: "active" }])
    setCursor((c) => c + 1)
  }, [cursor, bugs])

  const skip = useCallback(() => setCursor((c) => c + 1), [])

  const resolveBug = (bug) => {
    setMatches((m) =>
      m.map((x) => (x.bug.id === bug.id ? { ...x, status: "resolved" } : x))
    )
  }

  const current = bugs[cursor]
  const activeMatches = matches.filter((m) => m.status === "active")
  const resolvedMatches = matches.filter((m) => m.status === "resolved")

  return (
    <div className="bg-gradient-to-br from-purple-100 to-blue-100 fixed inset-0 overflow-auto flex flex-col items-center p-4 gap-8">
      {/* Onboarding */}
      {expertise.length === 0 && <Onboarding onDone={setExpertise} />}

      {/* Header */}
      <header className="text-center space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight">🐞 BugMatch</h1>
        <p className="max-w-md text-sm mx-auto mt-2">
          Swipe right to pick up a bug or swipe left to skip.
        </p>
      </header>

      {/* Card stack */}
      <CardStack bugs={bugs} cursor={cursor} onLike={like} onSkip={skip} />

      {/* Bottom-sheet with matches & chat */}
      <ChatSheet
        activeMatches={activeMatches}
        resolvedMatches={resolvedMatches}
        onChat={(bug) => setChatting(bug)}
      />

      {/* Empty-state after all bugs triaged */}
      {!current && expertise.length > 0 && (
        <p className="text-center text-lg font-medium">
          You've triaged all available bugs! 🎉
        </p>
      )}

      {/* Chat overlay (higher z-index than the sheet) */}
      {chatting && (
        <ChatWindow
          bug={chatting}
          onClose={() => setChatting(null)}
          onResolve={resolveBug}
        />
      )}
    </div>
  )
}
