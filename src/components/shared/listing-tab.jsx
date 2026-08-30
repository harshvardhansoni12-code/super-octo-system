"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, PackageSearch } from "lucide-react";
import SearchBar from "@/components/shared/search-bar";
import ListingRow from "@/components/shared/listing-row";
import RecommendationPanel from "@/components/shared/recommendation-panel";

// Generic tab body for Services / Goods / Buyers: search bar up top,
// row-format listing below, wired to one of the mock "all" endpoints.
// Crops keeps its own component (crop-list.jsx) since it talks to the
// real crops API, but follows the same visual pattern.
export default function ListingTab({
  itemType,
  endpoint,
  dataKey,
  title,
  description,
  searchPlaceholder = "Search",
  interactive = false,
  onChat,
  onNegotiate,
  emptyLabel = "No listings found",
  showRecommendations = false,
  recommendationType,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadItems = useCallback(
    async (q) => {
      try {
        setLoading(true);
        setError("");

        const url = q
          ? `${endpoint}?q=${encodeURIComponent(q)}`
          : endpoint;

        const response = await fetch(url, {
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `Failed to load ${dataKey}`);
        }

        setItems(result[dataKey] || []);
      } catch (err) {
        console.error(`LOAD ${dataKey.toUpperCase()} ERROR:`, err);
        setError(err.message || `Failed to load ${dataKey}`);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, dataKey],
  );

  useEffect(() => {
    loadItems(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e8c61]">
            Marketplace
          </p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>

          <p className="mt-2 text-sm text-[#718078]">{description}</p>
        </div>

        <SearchBar
          placeholder={searchPlaceholder}
          onSearch={setQuery}
          className="sm:w-64"
        />
      </div>

      <div
        className={
          showRecommendations ? "mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]" : ""
        }
      >
        <div>
          {loading && (
            <div
              className={`${showRecommendations ? "" : "mt-6"} flex min-h-48 items-center justify-center rounded-2xl border border-[#dce4d8] bg-white`}
            >
              <div className="flex items-center gap-2 text-sm text-[#718078]">
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </div>
            </div>
          )}

          {!loading && error && (
            <div
              className={`${showRecommendations ? "" : "mt-6"} rounded-2xl border border-red-200 bg-red-50 p-5`}
            >
              <p className="font-semibold text-red-700">
                Could not load listings
              </p>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div
              className={`${showRecommendations ? "" : "mt-6"} flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-[#cfdacb] bg-white p-8 text-center`}
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-[#edf3e8] text-[#668b45]">
                <PackageSearch className="size-6" />
              </span>

              <h3 className="mt-4 font-semibold">{emptyLabel}</h3>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <>
              <div className={`${showRecommendations ? "" : "mt-6"} space-y-3`}>
                {items.map((item) => (
                  <ListingRow
                    key={item.id}
                    item={item}
                    itemType={itemType}
                    interactive={interactive}
                    onChat={onChat}
                    onNegotiate={onNegotiate}
                  />
                ))}
              </div>

              <p className="mt-4 text-xs text-[#829084]">
                {items.length} result{items.length !== 1 ? "s" : ""}
              </p>
            </>
          )}
        </div>

        {showRecommendations && (
          <RecommendationPanel type={recommendationType || itemType} />
        )}
      </div>
    </section>
  );
}
