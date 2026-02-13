import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MeEditPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Edit my profile</h1>
          <p className="mt-1 text-sm text-zinc-400">
            You can only edit your email and phone.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="border-white/10 bg-transparent text-zinc-100 hover:bg-white/5"
        >
          <Link href="/me">Cancel</Link>
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-950 p-6">
        <p className="text-sm text-zinc-400">Student form (student mode) goes here.</p>
      </div>
    </div>
  );
}
