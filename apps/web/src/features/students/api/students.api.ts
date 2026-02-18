import type { StudentRow } from "../types";

type StudentsResponse = { data: StudentRow[] };

export async function fetchStudents(): Promise<StudentRow[]> {
  const res = await fetch("/api/students", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch students");
  const json = (await res.json()) as StudentsResponse;
  return json.data;
}
