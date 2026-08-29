"use client";

import { useState } from "react";
import { CalendarCheck2, Clock3, Menu, X } from "lucide-react";

import DashboardHeader from "@/components/dashboard-header";
import UserDashboardNav from "@/components/user/user-dashboard-nav";

const availabilityList = [
  {
    day: "Monday",
    slot: "9:00 AM - 1:00 PM",
    status: "Available",
    tone: "bg-[#edf8e9] text-[#3d6a34]",
  },
  {
    day: "Tuesday",
    slot: "11:00 AM - 4:00 PM",
    status: "Busy",
    tone: "bg-[#fff5d9] text-[#8c6820]",
  },
  {
    day: "Wednesday",
    slot: "8:00 AM - 12:00 PM",
    status: "Available",
    tone: "bg-[#edf8e9] text-[#3d6a34]",
  },
  {
    day: "Thursday",
    slot: "Closed for logistics",
    status: "Offline",
    tone: "bg-[#f3f5f2] text-[#5e6c64]",
  },
  {
    day: "Friday",
    slot: "10:00 AM - 3:00 PM",
    status: "Available",
    tone: "bg-[#edf8e9] text-[#3d6a34]",
  },
];

export default function AvailabilityPageClient({ session }) {
  const [activeNav, setActiveNav] = useState("Availability");
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
              Availability
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              This is availability page
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#718078]">
              View your weekly operating hours, check when you are free, and
              keep your farming schedule organized.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-[#dce4d8] bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#edf5e6] text-[#477536]">
                  <CalendarCheck2 className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c9c8a]">
                    Weekly schedule
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Farm availability
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {availabilityList.map(({ day, slot, status, tone }) => (
                  <div
                    key={day}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[#edf0eb] bg-[#f9faf7] p-4"
                  >
                    <div>
                      <p className="font-semibold text-[#19352a]">{day}</p>
                      <p className="mt-1 text-sm text-[#677a6d]">{slot}</p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#dce4d8] bg-[#fffdf4] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#f9efc7] text-[#9a7b1a]">
                  <Clock3 className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#af8f32]">
                    Summary
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">Today’s status</h2>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-white p-4 shadow-sm">
                <p className="text-sm text-[#6e7f72]">Current status</p>
                <p className="mt-2 text-3xl font-semibold text-[#19352a]">
                  Available
                </p>
                <p className="mt-2 text-sm text-[#5d7067]">
                  Next open slot: Wednesday, 8:00 AM - 12:00 PM
                </p>
              </div>

              <div className="mt-4 rounded-xl border border-[#ece8d3] bg-[#fef8e8] p-4 text-sm text-[#765f1e]">
                Keep your available hours updated to help buyers and partners
                schedule with you faster.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
