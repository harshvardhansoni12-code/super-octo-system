"use client";

import { useState } from "react";
import { ArrowLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import DashboardHeader from "@/components/dashboard-header";
import CropSaleForm from "@/components/user/crop-sale-form";
import UserDashboardNav from "@/components/user/user-dashboard-nav";

export default function CropSalePageClient({ session }) {
  const [activeNav, setActiveNav] = useState("Crops on sale");
  const [mobileNav, setMobileNav] = useState(false);
  return (
    <main className="min-h-screen bg-[#f4f5ef] text-[#19352a]">
      <DashboardHeader
        label="Grower workspace"
        name={session.user.name || session.user.email}
      />
      <div className="mx-auto flex max-w-360">
        <aside
          className={`${mobileNav ? "block" : "hidden"} fixed inset-0 z-20 bg-[#173b2b] p-6 text-white sm:relative sm:block sm:w-60 sm:shrink-0 sm:bg-transparent sm:p-7 sm:pr-3 sm:text-[#19352a]`}
        >
          <div className="flex items-center justify-between sm:hidden">
            <span className="font-semibold">NEST</span>
            <button
              aria-label="Close navigation"
              onClick={() => setMobileNav(false)}
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
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e8c61]">
              Marketplace
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tighter sm:text-5xl">
              Sell your crops
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#718078]">
              Add your harvest details so buyers can discover your produce.
            </p>
          </div>
          <CropSaleForm />
        </section>
      </div>
    </main>
  );
}
