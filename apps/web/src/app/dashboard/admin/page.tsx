import { requireRole } from "@/server/auth/require-role";

export default async function AdminPage() {
  await requireRole(["ADMIN"]);
  return <div>Admin area</div>;
}
