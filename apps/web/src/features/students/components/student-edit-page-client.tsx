"use client";

import { StudentEditForm } from "./student-edit-form";
import { useStudent } from "../hooks/use-student";
import { StudentsEditSkeleton } from "./students-edit-component";

export function StudentEditPageClient({ id }: { id: string }) {
  const { data, isLoading, isError } = useStudent(id);

  if (isLoading) return <StudentsEditSkeleton />;
  if (isError || !data) return <div className="text-red-400">Failed to load student.</div>;

  return <StudentEditForm student={data} />;
}