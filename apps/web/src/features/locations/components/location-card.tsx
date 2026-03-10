"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useUpdateLocation } from "../hooks/use-update-location";
import type { LocationRow } from "../types";

export function LocationCard({ location }: { location: LocationRow }) {
  const updateMutation = useUpdateLocation(location.id);
  const isInactive = location.status === "INACTIVE";

  return (
    <article className={cn("overflow-hidden rounded-2xl border border-white/10 bg-zinc-950", isInactive && "opacity-75")}>
      <div className="relative h-44 w-full bg-zinc-900">
        {location.photoUrl ? (
          <img src={location.photoUrl} alt={location.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-500">
            <MapPin className="h-8 w-8" />
          </div>
        )}

        <div className="absolute right-3 top-3">
          <Badge
            className={cn(
              "border border-white/10",
              isInactive ? "bg-zinc-500/20 text-zinc-200" : "bg-emerald-500/20 text-emerald-200"
            )}
            variant="secondary"
          >
            {location.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-100">{location.name}</h3>
          <p className="mt-1 text-sm text-zinc-400">{location.address}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {location.mapsUrl ? (
            <Button asChild size="sm" className="bg-emerald-500 text-black hover:bg-emerald-400">
              <a href={location.mapsUrl} target="_blank" rel="noreferrer">
                How to get there
              </a>
            </Button>
          ) : null}

          <Button asChild size="sm" variant="outline" className="border-white/15 bg-transparent text-zinc-100 hover:bg-white/10 hover:text-white">
            <Link href={`/dashboard/locations/${location.id}/edit`}>Edit</Link>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            disabled={isInactive || updateMutation.isPending}
            onClick={() => updateMutation.mutate({ status: "INACTIVE" })}
          >
            {updateMutation.isPending ? "..." : "Deactivate"}
          </Button>
        </div>
      </div>
    </article>
  );
}
