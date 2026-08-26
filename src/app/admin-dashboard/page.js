import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminDashboardClient from "@/components/admin/admin-dashboard-client";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");
  if (session.user.role !== "ADMIN") redirect("/user-dashboard");

  return <AdminDashboardClient session={session} />;
}
