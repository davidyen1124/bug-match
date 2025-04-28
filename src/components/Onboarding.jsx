import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function Onboarding({ storage, onDone }) {
  const ALL_SKILLS = [
    "frontend",
    "backend",
    "mobile",
    "systems",
    "database",
    "devops",
    "javascript",
    "java",
    "python",
    "c++",
  ]

  const [selected, setSelected] = useState(
    () => new Set(storage.get("expertise", []))
  )

  const toggle = (skill) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(skill) ? next.delete(skill) : next.add(skill)
      return next
    })

  const finish = () => {
    const arr = [...selected]
    storage.set("expertise", arr)
    onDone(arr)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center">
          What are your areas of expertise?
        </h2>
        <p className="text-center text-sm">
          Pick as many as you like—this helps us prioritize bugs you’ll enjoy
          fixing.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ALL_SKILLS.map((skill) => (
            <label
              key={skill}
              className="flex items-center gap-2 cursor-pointer select-none bg-gray-50 rounded-lg py-2 px-3 hover:bg-gray-100"
            >
              <Checkbox
                checked={selected.has(skill)}
                onCheckedChange={() => toggle(skill)}
              />
              <span className="capitalize text-sm">{skill}</span>
            </label>
          ))}
        </div>
        <Button
          className="mt-4 cursor-pointer"
          disabled={!selected.size}
          onClick={finish}
        >
          Start Squashing 🐞
        </Button>
      </div>
    </div>
  )
}
