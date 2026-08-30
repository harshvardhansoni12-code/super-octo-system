"use client";

import { useEffect, useState } from "react";
import { Leaf, Loader2, RefreshCw } from "lucide-react";
import ListingRow from "@/components/shared/listing-row";

export default function CropList({
  title = "Your crops",
  description = "Crops you have listed for sale.",
  query = "",
  interactive = false,
  onChat,
  onNegotiate,
}) {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCrops() {
    try {
      setLoading(true);
      setError("");

      // Crops already has a real API — search isn't implemented on the
      // backend yet, so we filter client-side for now until it's added.
      const response = await fetch("/api/v1/user/crops/all", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load crops");
      }

      setCrops(result.crops || []);
    } catch (error) {
      console.error("LOAD CROPS ERROR:", error);

      setError(error.message || "Failed to load crops");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCrops();
  }, []);

  const visibleCrops = query
    ? crops.filter(
        (crop) =>
          crop.name.toLowerCase().includes(query.toLowerCase()) ||
          crop.type.toLowerCase().includes(query.toLowerCase()),
      )
    : crops;

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

        <button
          type="button"
          onClick={loadCrops}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d4dfd2] bg-white px-4 py-2.5 text-xs font-semibold text-[#476650] transition hover:bg-[#f6f8f3] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="mt-6 flex min-h-48 items-center justify-center rounded-2xl border border-[#dce4d8] bg-white">
          <div className="flex items-center gap-2 text-sm text-[#718078]">
            <Loader2 className="size-5 animate-spin" />
            Loading crops...
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-700">Could not load crops</p>

          <p className="mt-1 text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={loadCrops}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && visibleCrops.length === 0 && (
        <div className="mt-6 flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-[#cfdacb] bg-white p-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-[#edf3e8] text-[#668b45]">
            <Leaf className="size-6" />
          </span>

          <h3 className="mt-4 font-semibold">No crops listed yet</h3>

          <p className="mt-1 text-sm text-[#78907c]">
            Your crop listings will appear here.
          </p>
        </div>
      )}

      {!loading && !error && visibleCrops.length > 0 && (
        <>
          <div className="mt-6 space-y-3">
            {visibleCrops.map((crop) => (
              <ListingRow
                key={crop.id}
                item={crop}
                itemType="crop"
                interactive={interactive}
                onChat={onChat}
                onNegotiate={onNegotiate}
              />
            ))}
          </div>

          <p className="mt-4 text-xs text-[#829084]">
            {visibleCrops.length} crop
            {visibleCrops.length !== 1 ? "s" : ""} listed
          </p>
        </>
      )}
    </section>
  );
}
