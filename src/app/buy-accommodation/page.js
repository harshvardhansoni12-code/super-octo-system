import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import BuyAccommodationPageClient from "@/components/user/buy-accommodation-page-client";

export default async function BuyAccommodationPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/");
  if (session.user.role === "ADMIN") redirect("/admin-dashboard");

  return <BuyAccommodationPageClient session={session} />;
}
