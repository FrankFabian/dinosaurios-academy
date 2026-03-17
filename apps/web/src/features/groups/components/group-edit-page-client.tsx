"use client";

import { useGroup } from "../hooks/use-group";
import { GroupFormSkeleton } from "./group-form-skeleton";
import { GroupEditForm } from "./group-edit-form";

export function GroupEditPageClient({ id }: { id: string }) {
  const { data, isLoading, isError } = useGroup(id);

  if (isLoading) return <GroupFormSkeleton />;
  if (isError || !data) return <div className="text-red-400">Failed to load group.</div>;

  return <GroupEditForm group={data} />;
}
