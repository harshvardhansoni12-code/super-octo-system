"use client";

import {
  BarChart3,
  Boxes,
  Handshake,
  Leaf,
  User as UserIcon,
  Users,
  WrenchIcon,
  X,
} from "lucide-react";

const navItemsByRole = {
  ADMIN: [
    { name: "Overview", icon: BarChart3 },
    { name: "Members", icon: Users },
    { name: "Services", icon: WrenchIcon },
    { name: "Crops", icon: Leaf },
    { name: "Goods", icon: Boxes },
  ],
  USER: [
    { name: "Overview", icon: BarChart3 },
    { name: "Crops", icon: Leaf },
    { name: "Services", icon: WrenchIcon },
    { name: "Goods", icon: Boxes },
    { name: "Buyers", icon: Handshake },
    { name: "Profile", icon: UserIcon },
  ],
};

export default function Sidebar({
  role = "USER",
  activeNav,
  setActiveNav,
  mobileNav,
  setMobileNav,
}) {
  const navItems = navItemsByRole[role] || navItemsByRole.USER;

  return (
    <aside
      className={`${
        mobileNav ? "block" : "hidden"
      } fixed inset-0 z-20 bg-[#173b2b] p-6 text-white sm:relative sm:block sm:w-60 sm:shrink-0 sm:bg-transparent sm:p-7 sm:pr-3 sm:text-[#19352a]`}
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

      <div className="mt-10 sm:mt-5">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8c9c8a]">
          {role === "ADMIN" ? "Control room" : "Workspace"}
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setActiveNav(item.name);
                setMobileNav(false);
              }}
              className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${
                activeNav === item.name
                  ? "bg-[#dcebc9] font-semibold text-[#19352a]"
                  : "text-[#91a298] hover:bg-[#e5ecdf] hover:text-[#19352a]"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4" />
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      {role === "ADMIN" ? (
        <div className="mt-10 rounded-xl bg-[#173b2b] p-4 text-white sm:mt-14">
          <Boxes className="size-5 text-[#f0c22e]" />

          <p className="mt-5 text-sm font-semibold">System is healthy.</p>

          <p className="mt-2 text-xs leading-5 text-[#b9d1b8]">
            All services are responding normally.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-[#d9e6d4]">
            <span className="size-2 rounded-full bg-[#91c45b]" />
            99.98% uptime
          </div>
        </div>
      ) : (
        <div className="mt-10 rounded-xl bg-[#e8eedf] p-4 text-[#19352a] sm:mt-14">
          <Leaf className="size-5 text-[#668b45]" />

          <p className="mt-5 text-sm font-semibold">
            Healthy fields, better harvests.
          </p>

          <p className="mt-2 text-xs leading-5 text-[#6d7d6e]">
            Your Field A is tracking 12% above its seasonal average.
          </p>
        </div>
      )}
    </aside>
  );
}
