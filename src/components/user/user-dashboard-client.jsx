"use client";

import { useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  CloudSun,
  Droplets,
  Leaf,
  Menu,
  MessageCircle,
  Plus,
  Sprout,
  Tractor,
  X,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard-header";
import LiveChat from "@/components/live-chat";
import UserDashboardNav from "@/components/user/user-dashboard-nav";

const initialTasks = [
  { title: "Review crop health report", meta: "Today · Field A", done: true },
  { title: "Reply to the agronomist", meta: "Today · Advisory", done: true },
  {
    title: "Schedule irrigation check",
    meta: "Tomorrow · Field B",
    done: false,
  },
  {
    title: "Upload this week’s harvest log",
    meta: "Friday · Records",
    done: false,
  },
];

export default function UserDashboardClient({ session }) {
  const [activeNav, setActiveNav] = useState("Overview");
  const [tasks, setTasks] = useState(initialTasks);
  const [mobileNav, setMobileNav] = useState(false);

  function toggleTask(index) {
    setTasks((current) =>
      current.map((task, taskIndex) =>
        taskIndex === index ? { ...task, done: !task.done } : task,
      ),
    );
  }

  const completed = tasks.filter((task) => task.done).length;
  const firstName = (session.user.name || session.user.email || "farmer").split(
    " ",
  )[0];

  return (
    <main className="min-h-screen bg-[#f4f5ef] text-[#19352a]">
      <DashboardHeader
        label="Grower workspace"
        className="overflow-hidden rounded-b-2xl border-b border-[#dbe5dc] bg-[#f4f5ef] px-5 py-4 sm:px-8"
        name={session.user.name || session.user.email}
      />
      <div className="mx-auto flex max-w-[1440px]">
        <aside
          className={`${mobileNav ? "block" : "hidden"} fixed inset-0 z-20 bg-[#173b2b] p-6 text-white sm:relative sm:block sm:w-60 sm:shrink-0 sm:bg-transparent sm:p-7 sm:pr-3 sm:text-[#19352a]`}
        >
          <div className="flex items-center justify-between sm:hidden">
            <span className="font-semibold">KisaanBazaar</span>
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
          <div className="mt-10 rounded-xl bg-[#e8eedf] p-4 sm:mt-14">
            <Leaf className="size-5 text-[#668b45]" />
            <p className="mt-5 text-sm font-semibold">
              Healthy fields, better harvests.
            </p>
            <p className="mt-2 text-xs leading-5 text-[#6d7d6e]">
              Your Field A is tracking 12% above its seasonal average.
            </p>
            <button className="mt-4 text-xs font-bold text-[#477536]">
              View report <ChevronRight className="ml-1 inline size-3" />
            </button>
          </div>
        </aside>
        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 sm:py-8">
          <div className="mb-5 flex items-center justify-between sm:hidden">
            <button
              aria-label="Open navigation"
              onClick={() => setMobileNav(true)}
              className="rounded-lg bg-white p-2 shadow-sm"
            >
              <Menu className="size-5" />
            </button>
            <div className="flex gap-2">
              <button
                aria-label="Notifications"
                className="rounded-lg bg-white p-2 shadow-sm"
              >
                <Bell className="size-4" />
              </button>
              <span className="flex size-8 items-center justify-center rounded-full bg-[#f0bd2f] text-xs font-bold">
                {firstName[0]}
              </span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e8c61]">
                Sunday, August 23, 2026
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] sm:text-5xl">
                Good morning, {firstName}.
              </h1>
              <p className="mt-2 text-sm text-[#718078]">
                Here’s what’s happening across your farm today.
              </p>
            </div>
            <button className="hidden items-center gap-2 rounded-lg bg-[#eab92d] px-4 py-2.5 text-xs font-bold text-[#24351c] shadow-sm transition hover:bg-[#f2c83e] sm:flex">
              <Plus className="size-4" /> Add a record
            </button>
          </div>
          <div className="mt-7 grid overflow-hidden rounded-2xl bg-[#214a38] text-white shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-64 overflow-hidden p-6 sm:p-8">
              <div className="absolute inset-0 bg-[url('/loginBackground.jpg')] bg-cover bg-[center_65%] opacity-55" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#173b2b] via-[#173b2b]/70 to-transparent" />
              <div className="relative max-w-md">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#e5efcf]">
                  <Sprout className="size-3" /> Field intelligence
                </span>
                <h2 className="mt-8 text-3xl font-semibold leading-tight tracking-[-0.04em]">
                  Grow with a clearer view of your land.
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[#d2e0cf]">
                  Small signals become stronger harvests. Your latest field data
                  is ready to review.
                </p>
                <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f0c22e]">
                  Open field report <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 bg-[#2c6245] p-6 sm:p-8">
              <div className="border-b border-white/15 pb-5">
                <p className="text-xs text-[#b9d1b8]">Field A health</p>
                <p className="mt-2 text-4xl font-semibold">
                  86<span className="text-xl">%</span>
                </p>
                <p className="mt-1 text-xs text-[#f0c22e]">↑ 12% this month</p>
              </div>
              <div className="border-b border-l border-white/15 pb-5 pl-5">
                <CloudSun className="size-5 text-[#f0c22e]" />
                <p className="mt-2 text-2xl font-semibold">24°C</p>
                <p className="mt-1 text-xs text-[#b9d1b8]">Clear skies today</p>
              </div>
              <div className="pt-5">
                <Droplets className="size-5 text-[#b9d1b8]" />
                <p className="mt-2 text-2xl font-semibold">68%</p>
                <p className="mt-1 text-xs text-[#b9d1b8]">Soil moisture</p>
              </div>
              <div className="border-l border-white/15 pt-5 pl-5">
                <Tractor className="size-5 text-[#f0c22e]" />
                <p className="mt-2 text-2xl font-semibold">3.4 ha</p>
                <p className="mt-1 text-xs text-[#b9d1b8]">Under management</p>
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-2xl border border-[#dce4d8] bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c9c8a]">
                    Your day
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">Today’s focus</h2>
                </div>
                <span className="rounded-full bg-[#edf3e8] px-3 py-1 text-xs font-semibold text-[#5c7c4f]">
                  {completed} of {tasks.length} done
                </span>
              </div>
              <div className="mt-5 space-y-2">
                {tasks.map((task, index) => (
                  <button
                    key={task.title}
                    onClick={() => toggleTask(index)}
                    className="flex w-full items-center gap-3 rounded-xl border border-transparent bg-[#f7f9f5] p-3 text-left transition hover:border-[#c7d8bd]"
                  >
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${task.done ? "border-[#6b934d] bg-[#6b934d] text-white" : "border-[#c8d4c5] text-transparent"}`}
                    >
                      {task.done ? (
                        <Check className="size-3.5" />
                      ) : (
                        <Circle className="size-3" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-medium ${task.done ? "text-[#829084] line-through" : "text-[#294436]"}`}
                      >
                        {task.title}
                      </span>
                      <span className="mt-1 block text-[11px] text-[#92a095]">
                        {task.meta}
                      </span>
                    </span>
                    <ChevronRight className="size-4 text-[#a6b4a5]" />
                  </button>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-[#dce4d8] bg-[#fffdf4] p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#a48639]">
                    Coming up
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">Next check-in</h2>
                </div>
                <CalendarDays className="size-5 text-[#bb921b]" />
              </div>
              <p className="mt-8 text-2xl font-semibold text-[#5d552f]">
                Tomorrow · 10:30 AM
              </p>
              <p className="mt-2 text-sm leading-6 text-[#817752]">
                Team planning and irrigation review with your field advisor.
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-[#ede4bd] pt-4 text-xs font-semibold text-[#92761b]">
                <span>45 min session</span>
                <button className="flex items-center gap-1">
                  View calendar <ChevronRight className="size-3" />
                </button>
              </div>
            </section>
          </div>
          <section className="mt-5 rounded-2xl border border-[#dce4d8] bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="size-5 text-[#668b45]" />
                <h2 className="text-lg font-semibold">Your field team</h2>
              </div>
              <span className="text-xs text-[#829084]">
                3 updates this week
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-3 rounded-lg bg-[#f7f9f5] px-3 py-2 text-sm">
                <span className="flex size-8 items-center justify-center rounded-full bg-[#dcebc9] text-xs font-bold text-[#477536]">
                  RK
                </span>
                <span>
                  <b className="block font-medium">Rajesh Kumar</b>
                  <small className="text-xs text-[#829084]">
                    Agronomist · Online
                  </small>
                </span>
              </div>
              <button className="flex items-center gap-2 rounded-lg border border-dashed border-[#c5d2c2] px-4 py-2 text-xs font-semibold text-[#5c7c4f] hover:bg-[#f4f8f0]">
                <MessageCircle className="size-4" /> Message team
              </button>
            </div>
          </section>
          <div className="mt-5">
            <LiveChat currentUserId={session.user.id} />
          </div>
        </section>
      </div>
    </main>
  );
}
