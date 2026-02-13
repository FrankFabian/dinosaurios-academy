import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">My profile</h1>
          <p className="mt-1 text-sm text-zinc-400">
            View your info. Only email and phone can be edited.
          </p>
        </div>

        <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-500">
          <Link href="/me/edit">Edit</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-950 p-6">
        <p className="text-sm text-zinc-400">Student self profile view goes here.</p>
      </div>
    </div>
  );
}
