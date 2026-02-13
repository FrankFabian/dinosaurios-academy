import { cookies } from "next/headers";

const KEY = "da_sidebar"; // da = dinosaurios academy

export async function getSidebarCollapsed(): Promise<boolean> {
  const value = (await cookies()).get(KEY)?.value;
  return value === "1";
}
