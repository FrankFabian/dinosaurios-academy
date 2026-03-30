import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DashboardSidebar } from "@/components/organisms/dashboard-sidebar";
import { getSidebarCollapsed } from "@/server/ui/sidebar-cookies";
import { DashboardTopbar } from "@/components/organisms/dashboard-topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role ?? "STAFF";
  const collapsed = await getSidebarCollapsed();

  return (
    <div className="min-h-dvh bg-background">
      <div className="flex min-h-dvh">
        <aside className="hidden shrink-0 bg-zinc-950 md:block">
          <DashboardSidebar role={role} initialCollapsed={collapsed} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardTopbar role={role} />

          <main className="flex-1 overflow-auto bg-zinc-950">
            <div className="min-h-full bg-[radial-gradient(60%_60%_at_18%_10%,rgba(16,185,129,0.10)_0%,rgba(0,0,0,0)_55%)]">
              <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );

}
