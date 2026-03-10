"use client";

import { useLocations } from "../hooks/use-locations";
import { LocationsCards } from "./locations-cards";
import { LocationsCardsSkeleton } from "./locations-cards-skeleton";

export function LocationsPageClient() {
  const { data, isLoading, isError } = useLocations();

  if (isLoading) return <LocationsCardsSkeleton />;
  if (isError) return <div className="text-sm text-red-400">Failed to load locations.</div>;

  return <LocationsCards data={data ?? []} />;
}
