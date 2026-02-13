import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = { params: { id: string } };

export default function StudentDetailPage({ params }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Student</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Student profile — ID: <span className="text-zinc-200">{params.id}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            className="border-white/10 bg-transparent text-zinc-100 hover:bg-white/5"
          >
            <Link href="/dashboard/students">Back</Link>
          </Button>

          <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-500">
            <Link href={`/dashboard/students/${params.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-950 p-6">
        <p className="text-sm text-zinc-400">
          Student details card + photo + QR will go here.
        </p>
      </div>
    </div>
  );
}
