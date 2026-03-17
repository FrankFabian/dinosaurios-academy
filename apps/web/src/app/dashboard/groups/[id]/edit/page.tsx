import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GroupEditPageClient } from "@/features/groups/components/group-edit-page-client";

type Params = { id: string };

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Edit group</h1>
          <p className="mt-1 text-sm text-zinc-400">Edit a training group profile</p>
        </div>

        <Button asChild variant="outline" className="border-white/10 hover:bg-white/5">
          <Link href="/dashboard/groups">Back</Link>
        </Button>
      </div>

      <GroupEditPageClient id={id} />
    </div>
  );
}
