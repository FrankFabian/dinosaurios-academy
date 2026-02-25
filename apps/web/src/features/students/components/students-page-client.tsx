"use client";

import { StudentsTable } from "./students-table";
import { useStudents } from "../hooks/use-students";
import { StudentsTableSkeleton } from "./students-table-skeleton";

export function StudentsPageClient() {
  const { data, isLoading, isError } = useStudents();

  if (isLoading) return <StudentsTableSkeleton />;
  if (isError) return <div className="text-sm text-red-400">Failed to load students.</div>;

  return <StudentsTable data={data ?? []} />;
}
