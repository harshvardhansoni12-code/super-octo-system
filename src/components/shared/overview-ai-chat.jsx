"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Self-contained AI-only chat for the Overview tab. Unlike LiveChat, this
// has no socket and no shared room — every message goes straight to
// POST /api/v1/ai/generate and the reply is appended locally.
export default function OverviewAiChat() {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, isThinking])

  async function sendMessage(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || isThinking) return

    const userMessage = { id: `local_${Date.now()}`, role: "user", text }
    setMessages((prev) => [...prev, userMessage])
    setDraft("")
    setIsThinking(true)

    try {
      const response = await fetch("/api/v1/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: text }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "The assistant couldn't reply")
      }

      setMessages((prev) => [
        ...prev,
        { id: `ai_${Date.now()}`, role: "ai", text: result.text },
      ])
    } catch (error) {
      console.error("OVERVIEW AI CHAT ERROR:", error)

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_error_${Date.now()}`,
          role: "ai",
          text: error.message || "Something went wrong. Please try again.",
        },
      ])
    } finally {
      setIsThinking(false)
    }
  }

  return (
    <section className="rounded-2xl border border-[#dbe5dc] bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-[#47705a]" />
          <h2 className="text-lg font-semibold">Ask the AI assistant</h2>
        </div>
      </div>

      <div
        ref={listRef}
        className="mt-4 h-64 space-y-3 overflow-y-auto rounded-xl bg-[#f8faf8] p-4"
      >
        {messages.length === 0 && (
          <p className="text-sm text-[#718078]">
            Ask about crop care, market prices, or anything else on your
            mind.
          </p>
        )}

        {messages.map((message) => (
          <div key={message.id} className="text-sm">
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                message.role === "ai" ? "text-[#8b5b25]" : "text-[#214a38]"
              }`}
            >
              {message.role === "ai" && <Sparkles className="size-3.5" />}
              {message.role === "ai" ? "AI Assistant" : "You"}
            </span>
            <span className="ml-2 whitespace-pre-wrap text-[#17231d]">
              {message.text}
            </span>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-2 text-sm text-[#8b5b25]">
            <Loader2 className="size-3.5 animate-spin" />
            Thinking...
          </div>
        )}
      </div>

      <form className="mt-4 flex gap-2" onSubmit={sendMessage}>
        <Input
          disabled={isThinking}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask the AI assistant a question…"
          value={draft}
        />
        <Button disabled={isThinking || !draft.trim()} size="icon" type="submit">
          <Send className="size-4" />
        </Button>
      </form>
    </section>
  )
}
