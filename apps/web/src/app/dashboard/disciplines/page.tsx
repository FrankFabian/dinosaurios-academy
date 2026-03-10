import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DisciplinesPageClient } from "@/features/disciplines/components/disciplines-page-client";

export default function DisciplinesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Disciplines</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage academy disciplines and keep them active or inactive.
          </p>
        </div>

        <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-500">
          <Link href="/dashboard/disciplines/new">New discipline</Link>
        </Button>
      </div>

      <DisciplinesPageClient />
    </div>
  );
}
