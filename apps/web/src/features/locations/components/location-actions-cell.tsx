"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LocationRow } from "../types";
import { useUpdateLocation } from "../hooks/use-update-location";

export function LocationActionsCell({ location }: { location: LocationRow }) {
  const updateMutation = useUpdateLocation(location.id);
  const isInactive = location.status === "INACTIVE";

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="border-white/15 bg-transparent text-zinc-100 hover:bg-white/10 hover:text-white">
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border-white/10 bg-zinc-950 text-zinc-100">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={`/dashboard/locations/${location.id}/edit`}>Edit</Link>
          </DropdownMenuItem>
          {location.mapsUrl ? (
            <DropdownMenuItem asChild className="cursor-pointer">
              <a href={location.mapsUrl} target="_blank" rel="noreferrer">
                How to get there
              </a>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            className="cursor-pointer text-red-300 focus:text-red-200"
            disabled={isInactive || updateMutation.isPending}
            onSelect={(e) => {
              e.preventDefault();
              updateMutation.mutate({ status: "INACTIVE" });
            }}
          >
            Deactivate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
