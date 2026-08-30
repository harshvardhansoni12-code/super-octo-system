"use client"

import { useSearchParams } from "next/navigation"
import { MessageCircle } from "lucide-react"
import DashboardHeader from "@/components/dashboard-header"
import LiveChat from "@/components/live-chat"

export default function ChatPageClient({ session }) {
  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const id = searchParams.get("id")

  return (
    <main className="min-h-screen bg-[#f4f5ef] text-[#19352a]">
      <DashboardHeader
        label="Support chat"
        name={session.user.name || session.user.email}
      />

      <div className="mx-auto max-w-3xl px-5 py-6 sm:px-8 sm:py-8">
        {type && id && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#dce4d8] bg-white px-4 py-2 text-xs font-semibold text-[#476650]">
            <MessageCircle className="size-3.5" />
            Chatting about: <span className="text-[#19352a]">{type}</span> ·{" "}
            <span className="text-[#19352a]">{id}</span>
          </div>
        )}

        <LiveChat currentUserId={session.user.id} />
      </div>
    </main>
  )
}
