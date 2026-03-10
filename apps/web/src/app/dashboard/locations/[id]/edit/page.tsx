import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LocationEditPageClient } from "@/features/locations/components/location-edit-page-client";

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
          <h1 className="text-xl font-semibold text-zinc-100">Edit location</h1>
          <p className="mt-1 text-sm text-zinc-400">Edit a location profile</p>
        </div>

        <Button asChild variant="outline" className="border-white/10 hover:bg-white/5">
          <Link href="/dashboard/locations">Back</Link>
        </Button>
      </div>

      <LocationEditPageClient id={id} />
    </div>
  );
}
