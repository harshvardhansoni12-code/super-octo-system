"use client";

import { useState } from "react";
import { BedDouble, Home, Menu, MapPin, ShieldCheck, X } from "lucide-react";

import DashboardHeader from "@/components/dashboard-header";
import UserDashboardNav from "@/components/user/user-dashboard-nav";

const accommodationOptions = [
  {
    title: "Farm stay cottage",
    city: "Nashik",
    price: "₹4,200 / month",
    type: "Private stay",
    rating: "4.8",
  },
  {
    title: "Shared farmer housing",
    city: "Pune",
    price: "₹2,600 / month",
    type: "Shared room",
    rating: "4.6",
  },
  {
    title: "Rural worker hostel",
    city: "Nagpur",
    price: "₹3,100 / month",
    type: "Hostel",
    rating: "4.7",
  },
];

export default function BuyAccommodationPageClient({ session }) {
  const [activeNav, setActiveNav] = useState("Buy-Accomodies");
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <main className="min-h-screen bg-[#f4f5ef] text-[#19352a]">
      <DashboardHeader
        label="Grower workspace"
        name={session.user.name || session.user.email}
      />

      <div className="mx-auto flex max-w-[1440px]">
        <aside
          className={`${mobileNav ? "block" : "hidden"} fixed inset-0 z-20 bg-[#173b2b] p-6 text-white sm:relative sm:block sm:w-60 sm:shrink-0 sm:bg-transparent sm:p-7 sm:pr-3 sm:text-[#19352a]`}
        >
          <div className="flex items-center justify-between sm:hidden">
            <span className="font-semibold">KisaanBazaar</span>
            <button
              type="button"
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
          <div className="mb-8 flex items-center justify-between gap-4 sm:hidden">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setMobileNav(true)}
              className="rounded-lg bg-white p-2 shadow-sm"
            >
              <Menu className="size-5" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e8c61]">
              Buy accommodation
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              This is buy accommodation page
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#718078]">
              Discover verified living spaces near farms and agri-work zones
              that suit your routine and budget.
            </p>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              {accommodationOptions.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#dce4d8] bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-[#edf5e6] text-[#477536]">
                        <Home className="size-5" />
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold">{item.title}</h2>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#677a6d]">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="size-4" />
                            {item.city}
                          </span>
                          <span>{item.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-lg font-semibold text-[#19352a]">
                        {item.price}
                      </p>
                      <p className="text-sm text-[#6b816d]">★ {item.rating}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf0eb] pt-4">
                    <span className="inline-flex items-center gap-2 text-sm text-[#4d6958]">
                      <ShieldCheck className="size-4 text-[#508048]" />
                      Verified listing
                    </span>
                    <button className="rounded-lg bg-[#214a38] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a3a2d]">
                      View details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[#dce4d8] bg-[#fffdf4] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#efe5d0] text-[#8d6b15]">
                  <BedDouble className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a48639]">
                    Needs
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">Quick filters</h2>
                </div>
              </div>

              <div className="mt-5 space-y-3 text-sm text-[#5e7067]">
                <div className="rounded-xl bg-white p-3">
                  Budget: ₹2,500 - ₹5,000
                </div>
                <div className="rounded-xl bg-white p-3">
                  Distance: within 10 km
                </div>
                <div className="rounded-xl bg-white p-3">
                  Type: farm stay / shared room
                </div>
                <div className="rounded-xl bg-white p-3">
                  Verified for workers
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
