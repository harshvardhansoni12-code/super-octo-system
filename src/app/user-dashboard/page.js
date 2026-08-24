import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CalendarDays, CheckCircle2, Circle, Plus } from "lucide-react";
import DashboardHeader from "@/components/dashboard-header";
import LiveChat from "@/components/live-chat";
import { authOptions } from "@/lib/auth";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");
  if (session.user.role === "ADMIN") redirect("/admin-dashboard");

  const tasks = [
    [true, "Review the project brief"],
    [true, "Reply to the design notes"],
    [false, "Plan tomorrow’s priorities"],
    [false, "Take a proper lunch break"],
  ];

  return (
    <main className="min-h-screen bg-[#f7faf8] text-[#17231d]">
      <DashboardHeader
        label="Personal workspace"
        name={session.user.name || session.user.email}
      />
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-[#47705a]">
              Sunday, August 23
            </p>
            <h1 className="mt-2 text-4xl font-medium tracking-[-0.05em]">
              Your day, in one place.
            </h1>
            <p className="mt-3 text-sm text-[#718078]">
              A little progress adds up. Here is what is waiting for you.
            </p>
          </div>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#214a38] px-4 text-sm font-medium text-white hover:bg-[#183a2c]">
            <Plus className="size-4" />
            New task
          </button>
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <section className="rounded-2xl border border-[#dbe5dc] bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Today’s focus</h2>
              <span className="rounded-full bg-[#edf4eb] px-3 py-1 text-xs font-medium text-[#47705a]">
                2 of 4 done
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {tasks.map(([complete, task]) => (
                <div
                  className="flex items-center gap-3 rounded-xl bg-[#f8faf8] px-4 py-3 text-sm"
                  key={task}
                >
                  {complete ? (
                    <CheckCircle2 className="size-5 text-[#47705a]" />
                  ) : (
                    <Circle className="size-5 text-[#b5c4b8]" />
                  )}
                  <span
                    className={complete ? "text-[#718078] line-through" : ""}
                  >
                    {task}
                  </span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-2xl bg-[#dcebd8] p-6">
            <CalendarDays className="size-5 text-[#47705a]" />
            <h2 className="mt-5 text-lg font-semibold">Upcoming</h2>
            <p className="mt-2 text-sm leading-6 text-[#526258]">
              Your next check-in is tomorrow at 10:30 AM.
            </p>
            <div className="mt-6 border-t border-[#c1d8be] pt-4 text-sm font-medium text-[#47705a]">
              Team planning · 45 min
            </div>
          </section>
        </div>
        <div className="mt-4">
          <LiveChat currentUserId={session.user.id} />
        </div>
      </div>
    </main>
  );
}
