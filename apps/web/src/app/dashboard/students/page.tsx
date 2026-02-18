import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudentsPageClient } from "@/features/students/components/students-page-client";

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Students</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage student profiles, contact info, and enrollment status.
          </p>
        </div>

        <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-500">
          <Link href="/dashboard/students/new">New student</Link>
        </Button>
      </div>

      <StudentsPageClient />
    </div>
  );
}
