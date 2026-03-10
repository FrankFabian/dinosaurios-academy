"use client";

import { useLocation } from "../hooks/use-location";
import { LocationsCardsSkeleton } from "./locations-cards-skeleton";
import { LocationEditForm } from "./location-edit-form";

export function LocationEditPageClient({ id }: { id: string }) {
  const { data, isLoading, isError } = useLocation(id);

  if (isLoading) return <LocationsCardsSkeleton />;
  if (isError || !data) return <div className="text-red-400">Failed to load location.</div>;

  return <LocationEditForm location={data} />;
}
