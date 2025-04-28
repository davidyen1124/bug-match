import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Onboarding from "@/components/Onboarding"

import CardStack from "@/components/CardStack"
import ChatWindow from "@/components/ChatWindow"

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
    const next = [...matches, { bug, status: "active" }]
    setMatches(next)
    setCursor((c) => c + 1)
  }, [cursor, bugs, matches])

  const skip = useCallback(() => setCursor((c) => c + 1), [])

  const resolveBug = (bug) => {
    const next = matches.map((m) =>
      m.bug.id === bug.id ? { ...m, status: "resolved" } : m
    )
    setMatches(next)
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

      {/* Matches drawer */}
      {(activeMatches.length > 0 || resolvedMatches.length > 0) && (
        <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow p-4 flex flex-col gap-6">
          {activeMatches.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-2">
                Working On ({activeMatches.length})
              </h2>
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {activeMatches.map((m) => (
                  <li
                    key={m.bug.id}
                    className="flex items-center gap-3 bg-gray-100 rounded-lg p-2 hover:bg-gray-200"
                  >
                    <img
                      src={m.bug.image}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="flex-1 text-sm font-medium">
                      {m.bug.name}
                    </span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setChatting(m.bug)}
                    >
                      Chat
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {resolvedMatches.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-2">
                Resolved ({resolvedMatches.length})
              </h2>
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {resolvedMatches.map((m) => (
                  <li
                    key={m.bug.id}
                    className="flex items-center gap-3 bg-green-100 rounded-lg p-2"
                  >
                    <img
                      src={m.bug.image}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover grayscale"
                    />
                    <span className="flex-1 text-sm line-through">
                      {m.bug.name}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* Empty state */}
      {!current && expertise.length > 0 && (
        <div className="text-center space-y-3">
          <p className="text-lg font-medium">
            You've triaged all available bugs! 🎉
          </p>
        </div>
      )}

      {/* Chat overlay */}
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
