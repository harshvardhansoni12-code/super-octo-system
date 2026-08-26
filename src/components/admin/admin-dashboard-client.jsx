"use client";

import { useState } from "react";

import DashboardHeader from "@/components/dashboard-header";
import AdminSidebar from "@/components/adminDashboard/AdminSidebar";
import Overview from "@/components/adminDashboard/Overview";
import Crops from "@/components/adminDashboard/Crops";

export default function AdminDashboardClient({
  session,
}) {
  const [activeNav, setActiveNav] =
    useState("Overview");

  const [mobileNav, setMobileNav] =
    useState(false);

  function renderContent() {
    switch (activeNav) {
      case "Overview":
        return <Overview />;

      case "Crops":
        return <Crops />;

      case "Members":
        return (
          <PlaceholderPage title="Members" />
        );

      case "Reports":
        return (
          <PlaceholderPage title="Reports" />
        );

      case "System health":
        return (
          <PlaceholderPage title="System health" />
        );

      default:
        return <Overview />;
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f5ef] text-[#19352a]">
      <DashboardHeader
        label="Operations console"
        name={
          session.user.name ||
          session.user.email
        }
      />

      <div className="mx-auto flex max-w-[1440px]">
        <AdminSidebar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          mobileNav={mobileNav}
          setMobileNav={setMobileNav}
        />

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 sm:py-8">
          {/* Mobile menu button */}
          <div className="mb-5 sm:hidden">
            <button
              type="button"
              onClick={() => setMobileNav(true)}
              className="rounded-lg bg-white p-2 shadow-sm"
              aria-label="Open navigation"
            >
              ☰
            </button>
          </div>

          {renderContent()}
        </section>
      </div>
    </main>
  );
}


function PlaceholderPage({ title }) {
  return (
    <section>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e8c61]">
        Control room
      </p>

      <h1 className="mt-2 text-3xl font-semibold tracking-tighter sm:text-5xl">
        {title}
      </h1>

      <div className="mt-7 rounded-2xl border border-[#dce4d8] bg-white p-8">
        <p className="text-sm text-[#718078]">
          {title} module is coming soon.
        </p>
      </div>
    </section>
  );
}