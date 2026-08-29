import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import AvailabilityPageClient from "@/components/user/availability-page-client";

export default async function AvailabilityPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/");
  if (session.user.role === "ADMIN") redirect("/admin-dashboard");

  return <AvailabilityPageClient session={session} />;
}
