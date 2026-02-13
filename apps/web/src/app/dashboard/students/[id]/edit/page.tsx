import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = { params: { id: string } };

export default function EditStudentPage({ params }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Edit student</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Admin/Staff can edit all fields — ID:{" "}
            <span className="text-zinc-200">{params.id}</span>
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="border-white/10 bg-transparent text-zinc-100 hover:bg-white/5"
        >
          <Link href={`/dashboard/students/${params.id}`}>Cancel</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-950 p-6">
        <p className="text-sm text-zinc-400">
          Student form (admin/staff mode) goes here.
        </p>
      </div>
    </div>
  );
}
