"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Loader2, Sparkles } from "lucide-react"

// Compact "Recommended for you" panel shown alongside listing tabs.
// Reads from the mock GET /api/v1/recommendations?type= endpoint.
export default function RecommendationPanel({ type, onView }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadRecommendations() {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          `/api/v1/recommendations?type=${encodeURIComponent(type)}`,
          { method: "GET", cache: "no-store" },
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || "Failed to load recommendations")
        }

        if (!cancelled) {
          setItems(result.recommendations || [])
        }
      } catch (err) {
        console.error("LOAD RECOMMENDATIONS ERROR:", err)

        if (!cancelled) {
          setError(err.message || "Failed to load recommendations")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadRecommendations()

    return () => {
      cancelled = true
    }
  }, [type])

  return (
    <aside className="h-fit rounded-2xl border border-[#dce4d8] bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-lg bg-[#edf3e8] text-[#668b45]">
          <Sparkles className="size-4" />
        </span>

        <h3 className="text-sm font-semibold text-[#19352a]">
          Recommended for you
        </h3>
      </div>

      {loading && (
        <div className="mt-5 flex items-center gap-2 text-sm text-[#718078]">
          <Loader2 className="size-4 animate-spin" />
          Loading...
        </div>
      )}

      {!loading && error && (
        <p className="mt-5 text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="mt-5 text-sm text-[#829084]">
          No recommendations right now.
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-[#edf1ed] bg-[#f7f9f5] p-3"
            >
              <p className="text-sm font-semibold text-[#19352a]">
                {item.name}
              </p>

              <div className="mt-1 flex items-center justify-between gap-2 text-xs text-[#718078]">
                <span className="truncate">{item.subtitle}</span>
                <span className="shrink-0 font-semibold text-[#476650]">
                  {item.price}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onView && onView(item)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#5c7c4f] transition hover:text-[#214a38]"
              >
                View <ArrowRight className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}
