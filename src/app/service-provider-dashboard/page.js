import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import DashboardHeader from "@/components/dashboard-header";
import { authOptions } from "@/lib/auth";

export default async function ServiceProviderDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== "SERVICE_PROVIDER") {
    redirect(
      session.user.role === "ADMIN" ? "/admin-dashboard" : "/user-dashboard",
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7f4] text-[#17231d]">
      <DashboardHeader
        label="Service Provider Dashboard"
        name={session.user.name || "Service Provider"}
      />

      <div className="p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4a6656]">
                Service provider
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-[-0.05em]">
                Welcome, {session.user.name || "Service Provider"}
              </h1>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-[#dfe9e1] bg-white p-6 shadow-sm">
              <p className="text-sm text-[#6d7b72]">Active services</p>
              <h2 className="mt-3 text-3xl font-bold">12</h2>
            </div>
            <div className="rounded-2xl border border-[#dfe9e1] bg-white p-6 shadow-sm">
              <p className="text-sm text-[#6d7b72]">Pending bookings</p>
              <h2 className="mt-3 text-3xl font-bold">4</h2>
            </div>
            <div className="rounded-2xl border border-[#dfe9e1] bg-white p-6 shadow-sm">
              <p className="text-sm text-[#6d7b72]">Rating</p>
              <h2 className="mt-3 text-3xl font-bold">4.8</h2>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#dfe9e1] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">Service provider overview</h3>
            <p className="mt-3 max-w-2xl text-[#53645c]">
              Manage your services, respond to requests, and keep bookings
              updated for farmers and buyers.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
