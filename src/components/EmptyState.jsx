import { Button } from "@/components/ui/button"

export default function EmptyState({ onRestart }) {
  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-100
                    flex flex-col items-center justify-center p-6 z-50"
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md
                      p-8 flex flex-col gap-6 items-center"
      >
        <h2 className="text-2xl font-bold text-center">
          Backlog obliterated! 🎉
        </h2>

        <p className="text-center text-sm">
          Go touch grass while the build server sobs quietly into its&nbsp;logs.
          🌱
        </p>

        <Button onClick={onRestart}>Restart Hunt 🐞</Button>
      </div>
    </div>
  )
}
