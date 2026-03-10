import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DisciplinesCreateForm } from "@/features/disciplines/components/disciplines-create-form";

export default function NewDisciplinePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">New discipline</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Create a discipline to organize groups and coach assignments.
          </p>
        </div>

        <Button asChild variant="outline" className="border-white/10 hover:bg-white/5">
          <Link href="/dashboard/disciplines">Back</Link>
        </Button>
      </div>

      <DisciplinesCreateForm />
    </div>
  );
}
