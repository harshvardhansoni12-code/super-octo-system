"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

const navItems = [
  "Overview",
  "Crops on sale",
  "Availability",
  "Buy-Accomodies",
  "Profile",
];

export default function UserDashboardNav({
  activeNav,
  setActiveNav,
  setMobileNav,
}) {
  return (
    <div className=" overflow-hidden">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c9c8a]">
        Workspace
      </p>
      {navItems.map((item) =>
        item === "Overview" ||
        item === "Crops on sale" ||
        item === "Availability" ||
        item === "Buy-Accomodies" ? (
          <Link
            key={item}
            href={
              item === "Overview"
                ? "/user-dashboard"
                : item === "Crops on sale"
                  ? "/crops-on-sale"
                  : item === "Availability"
                    ? "/availability"
                    : "/buy-accommodation"
            }
            onClick={() => setMobileNav(false)}
            className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${activeNav === item ? "bg-[#dcebc9] font-semibold text-[#19352a]" : "text-[#91a298] hover:bg-[#e5ecdf] hover:text-[#19352a]"}`}
          >
            {item}
            <ChevronRight className="size-4 opacity-60" />
          </Link>
        ) : (
          <button
            key={item}
            onClick={() => {
              setActiveNav(item);
              setMobileNav(false);
            }}
            className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${activeNav === item ? "bg-[#dcebc9] font-semibold text-[#19352a]" : "text-[#91a298] hover:bg-[#e5ecdf] hover:text-[#19352a]"}`}
          >
            {item}
            <ChevronRight className="size-4 opacity-60" />
          </button>
        ),
      )}
    </div>
  );
}
