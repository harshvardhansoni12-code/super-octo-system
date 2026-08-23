import AuthScreen from "@/app/authscreen/page";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "ADMIN") redirect("/admin-dashboard");
  if (session?.user) redirect("/user-dashboard");

  return <AuthScreen />;
}
