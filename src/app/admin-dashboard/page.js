import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Activity, BarChart3, UserPlus, Users } from "lucide-react";
import DashboardHeader from "@/components/dashboard-header";
import { authOptions } from "@/lib/auth";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");
  if (session.user.role !== "ADMIN") redirect("/user-dashboard");

  const metrics = [
    [Users, "128", "Active members"],
    [Activity, "24", "Open workflows"],
    [BarChart3, "+18%", "Weekly growth"],
  ];
  const activity = [
    "Workspace permissions updated",
    "New member joined Product Circle",
    "Quarterly report was published",
  ];

  return (
    <main className="min-h-screen bg-[#f5f7f4] text-[#17231d]">
      <DashboardHeader
        label="Admin workspace"
        name={session.user.name || session.user.email}
      />
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <section className="mb-8 rounded-[1.75rem] bg-[#214a38] px-6 py-8 text-[#f4f6ed] sm:px-10">
          <p className="text-sm font-medium text-[#c4d8c4]">
            Good morning, {session.user.name || "admin"}
          </p>
          <h1 className="mt-2 text-4xl font-medium tracking-tighter">
            Keep the whole nest moving.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#c4d8c4]">
            A clear view of people, activity, and the work that needs your
            attention.
          </p>
        </section>
        <div className="grid gap-4 sm:grid-cols-3">
          {metrics.map(([Icon, value, label]) => (
            <div
              className="rounded-2xl border border-[#dbe5dc] bg-white p-5"
              key={label}
            >
              <Icon className="size-5 text-[#47705a]" />
              <p className="mt-6 text-3xl font-medium tracking-[-0.04em]">
                {value}
              </p>
              <p className="mt-1 text-sm text-[#718078]">{label}</p>
            </div>
          ))}
        </div>
        <section className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-[#dbe5dc] bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent activity</h2>
              <span className="text-xs text-[#718078]">Today</span>
            </div>
            <div className="mt-5 space-y-4 text-sm">
              {activity.map((item, index) => (
                <div
                  className="flex items-center justify-between border-t border-[#edf1ed] pt-4"
                  key={item}
                >
                  <span>{item}</span>
                  <span className="text-xs text-[#718078]">
                    {index + 1}h ago
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[#e6d6b9] bg-[#fffaf0] p-6">
            <UserPlus className="size-5 text-[#a56a28]" />
            <h2 className="mt-5 text-lg font-semibold">Invite your team</h2>
            <p className="mt-2 text-sm leading-6 text-[#806c4d]">
              Bring the people who make your best work possible into NEST.
            </p>
            <button className="mt-6 text-sm font-semibold text-[#8b5b25] underline underline-offset-4">
              Invite members
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
