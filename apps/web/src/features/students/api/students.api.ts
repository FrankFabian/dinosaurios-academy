import type { StudentCreateValues, StudentProfile, StudentRow, StudentUpdateValues } from "../types";

export type StudentCreatePayload = StudentCreateValues & {
  photoUrl?: string | null;
  photoPublicId?: string | null;
};

type ApiResponse<T> = { data: T };
type StudentsResponse = { data: StudentRow[] };
type ApiError = {
  error?: string;
  formErrors?: string[];
  fieldErrors?: Record<string, string[] | undefined>;
};

async function getApiErrorMessage(res: Response, fallback: string) {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const json = (await res.json().catch(() => null)) as ApiError | null;
    if (json?.error) return json.error;

    const formMessage = json?.formErrors?.[0];
    if (formMessage) return formMessage;

    if (json?.fieldErrors) {
      const firstFieldError = Object.values(json.fieldErrors).find((errors) => errors && errors.length > 0)?.[0];
      if (firstFieldError) return firstFieldError;
    }
  }

  const text = await res.text().catch(() => "");
  return text || fallback;
}

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
    throw new Error(await getApiErrorMessage(res, "Failed to create student"));
  }

  return (await res.json()) as ApiResponse<StudentRow>;
}

export async function fetchStudent(id: string): Promise<StudentRow> {
  const res = await fetch(`/api/students/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch student");
  const json = await res.json();
  return json.data as StudentRow;
}

export async function fetchStudentProfile(id: string): Promise<StudentProfile> {
  const res = await fetch(`/api/students/${id}/profile`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch student profile");
  const json = await res.json();
  return json.data as StudentProfile;
}

export async function updateStudent(id: string, input: StudentUpdateValues): Promise<StudentRow> {
  const res = await fetch(`/api/students/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await getApiErrorMessage(res, "Failed to update student"));
  const json = await res.json();
  return json.data as StudentRow;
}

export async function resendStudentClaimLink(id: string): Promise<{ sent: boolean; provider: string }> {
  const res = await fetch(`/api/students/${id}/resend-claim`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await getApiErrorMessage(res, "Failed to resend claim link"));
  const json = (await res.json()) as { data: { sent: boolean; provider: string } };
  return json.data;
}
