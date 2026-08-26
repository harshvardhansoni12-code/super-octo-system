import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import CropSalePageClient from "@/components/user/crop-sale-page-client";

export default async function CropsOnSalePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/");
  if (session.user.role === "ADMIN") redirect("/admin-dashboard");

  return <CropSalePageClient session={session} />;
}
