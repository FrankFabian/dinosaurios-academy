import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewStudentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">New student</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Create a new student profile.
          </p>
        </div>

        <Button asChild variant="outline" className="border-white/10 bg-transparent text-zinc-100 hover:bg-white/5">
          <Link href="/dashboard/students">Back</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-950 p-6">
        <p className="text-sm text-zinc-400">Student form (admin/staff) goes here.</p>
      </div>
    </div>
  );
}
