import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Send, CheckCircle } from "lucide-react";
import { storage } from "@/utils/storage";

/**
 * @param {{
 *   bug: import("../App").BugProfile,
 *   onClose: () => void,
 *   onResolve: (bug: import("../App").BugProfile) => void
 * }} props
 */
function ChatWindow({ bug, onClose, onResolve }) {
  const [messages, setMessages] = useState(() =>
    storage.get(`chat:${bug.id}`, []),
  );
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    const next = [...messages, { from: "me", text: draft }];
    setMessages(next);
    storage.set(`chat:${bug.id}`, next);
    setDraft("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-4 flex flex-col gap-3">
        <header className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{bug.name}</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="success"
              onClick={() => {
                onResolve(bug);
                onClose();
              }}
            >
              <CheckCircle className="w-4 h-4 mr-1" /> Mark Fixed
            </Button>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X />
            </Button>
          </div>
        </header>
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
            placeholder="Ask about steps to reproduce…"
          />
          <Button size="icon" onClick={send}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;