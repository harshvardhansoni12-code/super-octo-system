"use client"

import { useEffect, useState } from "react"
import { Loader2, PackageSearch } from "lucide-react"
import ListingRow from "@/components/shared/listing-row"

// Fetches one of the mock "all" endpoints and filters client-side down to
// the current user's own published listings (no `?q=` support on these
// mock routes yet, so filtering happens here rather than server-side).
// Used from the Services/Goods tabs (alongside the create form) and from
// the Profile tab.
export default function OwnListings({
  endpoint,
  dataKey,
  itemType,
  providerIdKey,
  userId,
  title,
  description,
  emptyLabel = "You haven't published any listings yet.",
  refreshKey,
}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadItems() {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(endpoint, {
          method: "GET",
          cache: "no-store",
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || `Failed to load ${dataKey}`)
        }

        if (!cancelled) {
          const all = result[dataKey] || []
          setItems(all.filter((item) => item[providerIdKey] === userId))
        }
      } catch (err) {
        console.error(`LOAD OWN ${dataKey.toUpperCase()} ERROR:`, err)

        if (!cancelled) {
          setError(err.message || `Failed to load ${dataKey}`)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadItems()

    return () => {
      cancelled = true
    }
  }, [endpoint, dataKey, providerIdKey, userId, refreshKey])

  return (
    <section>
      {(title || description) && (
        <div className="mb-5">
          {title && <h3 className="text-xl font-semibold">{title}</h3>}
          {description && (
            <p className="mt-1 text-sm text-[#718078]">{description}</p>
          )}
        </div>
      )}

      {loading && (
        <div className="flex min-h-32 items-center justify-center rounded-2xl border border-[#dce4d8] bg-white">
          <div className="flex items-center gap-2 text-sm text-[#718078]">
            <Loader2 className="size-5 animate-spin" />
            Loading...
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-700">Could not load listings</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="flex min-h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-[#cfdacb] bg-white p-6 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#edf3e8] text-[#668b45]">
            <PackageSearch className="size-5" />
          </span>

          <p className="mt-3 text-sm text-[#78907c]">{emptyLabel}</p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <ListingRow
              key={item.id}
              item={item}
              itemType={itemType}
              interactive={false}
            />
          ))}
        </div>
      )}
    </section>
  )
}
