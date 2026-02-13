import { Card } from "@/components/ui/card";


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview and quick actions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Today</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-muted-foreground">Sessions</div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Students</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-muted-foreground">Active</div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Attendance</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
          <div className="mt-1 text-xs text-muted-foreground">This week</div>
        </Card>
      </div>
    </div>
  );
}
