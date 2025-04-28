import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

const PLACEHOLDERS = [
  "Drop your stack trace like it's hot… 🔥📜",
  "Slide your Friday 4:59 PM push here… ⏰🤞",
  "Got logs? Let's doom-scroll together… 🐈‍⬛",
  "Whisper your flakiest test secrets… 🌧️",
  "Confess your `sudo chmod -R 777` sins… 🫣",
  "Tell me the tale of Docker-inside-Docker… 🐳🔃",
]

export default function ChatThread() {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState("")
  const [placeholder] = useState(
    () => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  )

  const send = () => {
    if (!draft.trim()) return
    setMessages((m) => [...m, { from: "me", text: draft }])
    setDraft("")
  }

  return (
    <div className="flex flex-col flex-1 p-3 gap-3 overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-2 border rounded-md p-2 bg-gray-50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.from === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                m.from === "me" ? "bg-blue-200" : "bg-gray-200"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-md p-2"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={placeholder}
        />
        <Button
          size="icon"
          className="h-10 w-10 flex items-center justify-center"
          onClick={send}
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
