"use client";

import { useState } from "react";

import DashboardHeader from "@/components/dashboard-header";
import Sidebar from "@/components/shared/sidebar";
import Overview from "@/components/adminDashboard/Overview";
import Crops from "@/components/adminDashboard/Crops";
import ListingTab from "@/components/shared/listing-tab";

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

      case "Services":
        return (
          <ListingTab
            itemType="service"
            endpoint="/api/v1/user/services/all"
            dataKey="services"
            title="Service listings"
            description="Every service listed on the platform. Read-only for admins."
            searchPlaceholder="Search services"
            emptyLabel="No services found"
            interactive={false}
            showRecommendations
            recommendationType="service"
          />
        );

      case "Goods":
        return (
          <ListingTab
            itemType="good"
            endpoint="/api/v1/user/goods/all"
            dataKey="goods"
            title="Goods listings"
            description="Every good listed on the platform. Read-only for admins."
            searchPlaceholder="Search goods"
            emptyLabel="No goods found"
            interactive={false}
            showRecommendations
            recommendationType="good"
          />
        );

      case "Members":
        return (
          <PlaceholderPage title="Members" />
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
        <Sidebar
          role="ADMIN"
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
