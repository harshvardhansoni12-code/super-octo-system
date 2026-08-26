import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import UserDashboardClient from "@/components/user/user-dashboard-client";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");
  // if (session.user.role === "ADMIN") redirect("/admin/admin-dashboard");

  return <UserDashboardClient session={session} />;
}
