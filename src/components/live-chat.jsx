"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import { useSocket } from "@/lib/socket-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LiveChat({ currentUserId }) {
  const { socketRef, connected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    function handleMessage(message) {
      console.log("[chat] received:", message);
      setMessages((prev) => [...prev, message]);
    }

    socket.on("chat:message", handleMessage);
    return () => socket.off("chat:message", handleMessage);
  }, [socketRef, connected]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  function sendMessage(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    console.log("[chat] sending:", text);
    socketRef.current?.emit("chat:message", { text });
    setDraft("");
  }

  return (
    <section className="rounded-2xl border border-[#dbe5dc] bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="size-5 text-[#47705a]" />
          <h2 className="text-lg font-semibold">Live support chat</h2>
        </div>
        <span
          className={`text-xs font-medium ${connected ? "text-[#47705a]" : "text-[#a56a28]"}`}
        >
          {connected ? "Connected" : "Connecting…"}
        </span>
      </div>

      <div
        ref={listRef}
        className="mt-4 h-64 space-y-3 overflow-y-auto rounded-xl bg-[#f8faf8] p-4"
      >
        {messages.length === 0 && (
          <p className="text-sm text-[#718078]">No messages yet.</p>
        )}
        {messages.map((message) => (
          <div key={message.id} className="text-sm">
            <span
              className={`inline-flex items-center gap-1 font-medium ${
                message.senderRole === "AI"
                  ? "text-[#8b5b25]"
                  : message.senderId === currentUserId
                    ? "text-[#214a38]"
                    : "text-[#47705a]"
              }`}
            >
              {message.senderRole === "AI" && <Sparkles className="size-3.5" />}
              {message.senderName}
              {message.senderRole === "ADMIN" ? " (admin)" : ""}
            </span>
            <span className="ml-2 whitespace-pre-wrap text-[#17231d]">
              {message.text}
            </span>
          </div>
        ))}
      </div>

      <form className="mt-4 flex gap-2" onSubmit={sendMessage}>
        <Input
          disabled={!connected}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message… (try /ai <question>)"
          value={draft}
        />
        <Button disabled={!connected || !draft.trim()} size="icon" type="submit">
          <Send className="size-4" />
        </Button>
      </form>
      <p className="mt-2 text-xs text-[#718078]">
        Tip: start a message with <code className="font-mono">/ai</code> to ask
        the AI assistant a question.
      </p>
    </section>
  );
}
