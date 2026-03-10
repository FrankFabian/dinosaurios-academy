"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LocationRow } from "../types";
import { LocationCard } from "./location-card";

export function LocationsCards({ data }: { data: LocationRow[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <MapPin className="h-8 w-8 text-emerald-500" />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-white">No locations yet</h3>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          Start by creating your first location to organize groups and schedules.
        </p>

        <Button asChild className="mt-6 bg-emerald-500 text-black hover:bg-emerald-600">
          <Link href="/dashboard/locations/new">New location</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
}
