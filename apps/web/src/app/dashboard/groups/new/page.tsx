import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GroupsCreateForm } from "@/features/groups/components/groups-create-form";

export default function NewGroupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">New group</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Create a training group by selecting location, discipline, category and schedule.
          </p>
        </div>

        <Button asChild variant="outline" className="border-white/10 hover:bg-white/5">
          <Link href="/dashboard/groups">Back</Link>
        </Button>
      </div>

      <GroupsCreateForm />
    </div>
  );
}
