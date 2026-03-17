"use client";

import { useGroups } from "../hooks/use-groups";
import { GroupsCards } from "./groups-cards";
import { GroupsCardsSkeleton } from "./groups-cards-skeleton";

export function GroupsPageClient() {
  const { data, isLoading, isError } = useGroups();

  if (isLoading) return <GroupsCardsSkeleton />;
  if (isError) return <div className="text-sm text-red-400">Failed to load groups.</div>;

  return <GroupsCards data={data ?? []} />;
}
