import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudentCreateForm } from "@/features/students/components/students-create-form";

export default function NewStudentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">New student</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Create a student profile. You can edit phone and email later.
          </p>
        </div>

        <Button asChild variant="outline" className="border-white/10 hover:bg-white/5">
          <Link href="/dashboard/students">Back</Link>
        </Button>
      </div>

      <StudentCreateForm />
    </div>
  );
}