"use client";

import { useDisciplines } from "../hooks/use-disciplines";
import { DisciplinesCards } from "./disciplines-cards";
import { DisciplinesCardsSkeleton } from "./disciplines-cards-skeleton";

export function DisciplinesPageClient() {
  const { data, isLoading, isError } = useDisciplines();

  if (isLoading) return <DisciplinesCardsSkeleton />;
  if (isError) return <div className="text-sm text-red-400">Failed to load disciplines.</div>;

  return <DisciplinesCards data={data ?? []} />;
}
