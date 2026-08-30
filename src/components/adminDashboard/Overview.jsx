"use client";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Check,
  Download,
  Leaf,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import OverviewAiChat from "@/components/shared/overview-ai-chat";

const initialMembers = [
  ["Aarav Sharma", "aarav@kisa.com", "Field manager", "Active"],
  ["Meera Patel", "meera@kisa.com", "Agronomist", "Active"],
  ["Dev Singh", "dev@kisa.com", "Grower", "Pending"],
  ["Isha Verma", "isha@kisa.com", "Grower", "Active"],
];

export default function Overview() {
  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e8c61]">
            Operations overview · August 2026
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tighter sm:text-5xl">
            Keep the whole farm moving.
          </h1>

          <p className="mt-2 text-sm text-[#718078]">
            A live view of people, activity, and platform health.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-[#d4dfd2] bg-white px-3 py-2.5 text-xs font-semibold text-[#476650] hover:bg-[#f6f8f3]">
            <Download className="size-4" />
            Export report
          </button>

          <button className="inline-flex items-center gap-2 rounded-lg bg-[#eab92d] px-3 py-2.5 text-xs font-bold text-[#24351c] hover:bg-[#f2c83e]">
            <UserPlus className="size-4" />
            Invite member
          </button>
        </div>
      </div>

      <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [Users, "128", "Active members", "+8 this month"],
          [Activity, "24", "Open workflows", "6 need review"],
          [BarChart3, "+18%", "Weekly growth", "vs last week"],
          [ShieldCheck, "99.98%", "Platform uptime", "All systems normal"],
        ].map(([Icon, value, label, note]) => (
          <div
            key={label}
            className="rounded-2xl border border-[#dce4d8] bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#edf3e8] text-[#668b45]">
                <Icon className="size-4" />
              </span>

              <ArrowUpRight className="size-4 text-[#91ae7c]" />
            </div>

            <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
              {value}
            </p>

            <p className="mt-1 text-sm font-medium">
              {label}
            </p>

            <p className="mt-2 text-xs text-[#78907c]">
              {note}
            </p>
          </div>
        ))}
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-[#dce4d8] bg-white p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c9c8a]">
                People directory
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Members
              </h2>
            </div>

            <label className="flex h-9 items-center gap-2 rounded-lg border border-[#dce4d8] px-3 text-sm text-[#829084]">
              <Search className="size-4" />

              <input
                placeholder="Search members"
                className="w-32 bg-transparent outline-none placeholder:text-[#a4b0a4]"
              />
            </label>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-140 text-left text-sm">
              <thead className="border-b border-[#edf1ed] text-[10px] uppercase tracking-[0.14em] text-[#92a095]">
                <tr>
                  <th className="pb-3 font-semibold">Member</th>
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {initialMembers.map((member) => (
                  <tr
                    key={member[1]}
                    className="border-b border-[#f0f3ef] last:border-0"
                  >
                    <td className="py-3">
                      <span className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-full bg-[#dcebc9] text-xs font-bold text-[#477536]">
                          {member[0]
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                        </span>

                        <span>
                          <b className="block font-medium">
                            {member[0]}
                          </b>

                          <small className="text-xs text-[#92a095]">
                            {member[1]}
                          </small>
                        </span>
                      </span>
                    </td>

                    <td className="py-3 text-[#718078]">
                      {member[2]}
                    </td>

                    <td className="py-3">
                      <span className="rounded-full bg-[#e8f2df] px-2 py-1 text-[10px] font-bold text-[#5b823e]">
                        {member[3]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-[#dce4d8] bg-[#214a38] p-5 text-white sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b9d1b8]">
                Platform pulse
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Weekly activity
              </h2>
            </div>

            <BarChart3 className="size-5 text-[#f0c22e]" />
          </div>

          <div className="mt-8 flex h-32 items-end justify-between gap-2">
            {[42, 58, 51, 74, 65, 88, 78].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex h-full flex-1 flex-col justify-end gap-2"
                >
                  <div
                    className="rounded-t bg-[#f0c22e]"
                    style={{ height: `${height}%` }}
                  />

                  <span className="text-center text-[10px] text-[#b9d1b8]">
                    {["M", "T", "W", "T", "F", "S", "S"][index]}
                  </span>
                </div>
              ),
            )}
          </div>

          <div className="mt-6 border-t border-white/15 pt-4">
            <p className="text-2xl font-semibold">1,284</p>

            <p className="mt-1 text-xs text-[#b9d1b8]">
              actions completed this week
            </p>
          </div>
        </section>
      </div>

      <section className="mt-5 rounded-2xl border border-[#dce4d8] bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Leaf className="size-5 text-[#668b45]" />

          <h2 className="text-lg font-semibold">
            Recent activity
          </h2>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ["Workspace permissions updated", "Admin team", "1h ago"],
            ["New member joined Product Circle", "Meera Patel", "3h ago"],
            ["Quarterly crop report published", "Reports", "Yesterday"],
          ].map(([title, source, time]) => (
            <div
              key={title}
              className="rounded-xl bg-[#f7f9f5] p-3"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-7 items-center justify-center rounded-full bg-[#dcebc9]">
                  <Check className="size-3.5 text-[#5b823e]" />
                </span>

                <span className="text-[10px] text-[#92a095]">
                  {time}
                </span>
              </div>

              <p className="mt-3 text-sm font-medium">
                {title}
              </p>

              <p className="mt-1 text-xs text-[#92a095]">
                {source}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-5">
        <OverviewAiChat />
      </div>
    </>
  );
}