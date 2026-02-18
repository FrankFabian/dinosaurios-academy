"use client";

import { StudentsTable } from "./students-table";
import { useStudents } from "../hooks/use-students";
import LoadingStudentsPage from "@/app/dashboard/students/loading";

export function StudentsPageClient() {
  const { data, isLoading, isError } = useStudents();

  if (isLoading) return <LoadingStudentsPage />;
  if (isError) return <div className="text-sm text-red-400">Failed to load students.</div>;

  return <StudentsTable data={data ?? []} />;
}
