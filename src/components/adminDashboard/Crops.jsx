"use client";

import CropList from "@/components/user/crop-list";
import RecommendationPanel from "@/components/shared/recommendation-panel";

export default function Crops() {
  return (
    <section>
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e8c61]">
          Marketplace
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tighter sm:text-5xl">
          Crop listings
        </h1>

        <p className="mt-2 text-sm text-[#718078]">
          View all crops currently listed by growers.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <CropList
          title="All crops"
          description="Every crop listed on the platform."
        />

        <RecommendationPanel type="crop" />
      </div>
    </section>
  );
}