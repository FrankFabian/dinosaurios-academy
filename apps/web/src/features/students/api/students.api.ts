import type { StudentCreateValues, StudentRow } from "../types";

export type StudentCreatePayload = StudentCreateValues & {
  photoUrl?: string | null;
  photoPublicId?: string | null;
};

type ApiResponse<T> = { data: T };
type StudentsResponse = { data: StudentRow[] };

export async function fetchStudents(): Promise<StudentRow[]> {
  const res = await fetch("/api/students", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch students");
  const json = (await res.json()) as StudentsResponse;
  return json.data;
}


export async function createStudent(input: StudentCreatePayload) {
  const res = await fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to create student");
  }

  return (await res.json()) as ApiResponse<StudentRow>;
}