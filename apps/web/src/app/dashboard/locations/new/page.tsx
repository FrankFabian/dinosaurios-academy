import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LocationsCreateForm } from "@/features/locations/components/locations-create-form";

export default function NewLocationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">New location</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Create a location to organize groups, coaches, and schedules.
          </p>
        </div>

        <Button asChild variant="outline" className="border-white/10 hover:bg-white/5">
          <Link href="/dashboard/locations">Back</Link>
        </Button>
      </div>

      <LocationsCreateForm />
    </div>
  );
}
