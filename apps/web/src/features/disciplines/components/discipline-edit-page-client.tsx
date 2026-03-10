"use client";

import { useDiscipline } from "../hooks/use-discipline";
import { DisciplinesCardsSkeleton } from "./disciplines-cards-skeleton";
import { DisciplineEditForm } from "./discipline-edit-form";

export function DisciplineEditPageClient({ id }: { id: string }) {
  const { data, isLoading, isError } = useDiscipline(id);

  if (isLoading) return <DisciplinesCardsSkeleton />;
  if (isError || !data) return <div className="text-red-400">Failed to load discipline.</div>;

  return <DisciplineEditForm discipline={data} />;
}
