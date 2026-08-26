"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import DashboardHeader from "@/components/dashboard-header";
import CropSaleForm from "@/components/user/crop-sale-form";
import CropList from "@/components/user/crop-list";
import UserDashboardNav from "@/components/user/user-dashboard-nav";

export default function CropSalePageClient({
  session,
}) {
  const [activeNav, setActiveNav] =
    useState("Crops on sale");

  const [mobileNav, setMobileNav] =
    useState(false);

  const [cropRefreshKey, setCropRefreshKey] =
    useState(0);

  function handleCropCreated() {
    setCropRefreshKey((current) => current + 1);
  }

  return (
    <main className="min-h-screen bg-[#f4f5ef] text-[#19352a]">
      <DashboardHeader
        label="Grower workspace"
        name={
          session.user.name ||
          session.user.email
        }
      />

      <div className="mx-auto flex max-w-360">
        <aside
          className={`${
            mobileNav ? "block" : "hidden"
          } fixed inset-0 z-20 bg-[#173b2b] p-6 text-white sm:relative sm:block sm:w-60 sm:shrink-0 sm:bg-transparent sm:p-7 sm:pr-3 sm:text-[#19352a]`}
        >
          <div className="flex items-center justify-between sm:hidden">
            <span className="font-semibold">
              KisaanBazaar
            </span>

            <button
              type="button"
              aria-label="Close navigation"
              onClick={() =>
                setMobileNav(false)
              }
            >
              <X />
            </button>
          </div>

          <UserDashboardNav
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            setMobileNav={setMobileNav}
          />
        </aside>

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 sm:py-8">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e8c61]">
              Marketplace
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tighter sm:text-5xl">
              Your crops
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#718078]">
              Manage your crop listings and add
              new harvests for buyers.
            </p>
          </div>

          {/* YOUR CROPS */}
          <CropList
            key={cropRefreshKey}
            title="Crops on sale"
            description="These are the crops currently listed from your account."
          />

          {/* CREATE CROP */}
          <div className="mt-10">
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c9c8a]">
                Sell harvest
              </p>

              <h2 className="mt-1 text-2xl font-semibold">
                Create a new crop listing
              </h2>

              <p className="mt-2 text-sm text-[#718078]">
                Add your harvest details so buyers
                can discover your produce.
              </p>
            </div>

            <CropSaleForm
              onCreated={handleCropCreated}
            />
          </div>
        </section>
      </div>
    </main>
  );
}