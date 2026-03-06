import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type AppRole = "ADMIN" | "STAFF" | "COACH";

export async function requireRole(allowed: AppRole[]) {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/api/auth/signin");

  const role = session.user.role;
  if (!allowed.includes(role)) redirect("/dashboard"); 
}
