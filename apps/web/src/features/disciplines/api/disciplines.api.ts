import type {
  DisciplineCreateValues,
  DisciplineRow,
  DisciplineUpdateValues,
} from "../types";

type ApiResponse<T> = { data: T };
type DisciplinesResponse = { data: DisciplineRow[] };
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
      const firstFieldError = Object.values(json.fieldErrors).find(
        (errors) => errors && errors.length > 0
      )?.[0];
      if (firstFieldError) return firstFieldError;
    }
  }

  const text = await res.text().catch(() => "");
  return text || fallback;
}

export async function fetchDisciplines(): Promise<DisciplineRow[]> {
  const res = await fetch("/api/disciplines", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch disciplines");
  const json = (await res.json()) as DisciplinesResponse;
  return json.data;
}

export async function createDiscipline(input: DisciplineCreateValues) {
  const res = await fetch("/api/disciplines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "Failed to create discipline"));
  }
  return (await res.json()) as ApiResponse<DisciplineRow>;
}

export async function fetchDiscipline(id: string): Promise<DisciplineRow> {
  const res = await fetch(`/api/disciplines/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch discipline");
  const json = await res.json();
  return json.data as DisciplineRow;
}

export async function updateDiscipline(
  id: string,
  input: DisciplineUpdateValues
): Promise<DisciplineRow> {
  const res = await fetch(`/api/disciplines/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "Failed to update discipline"));
  }
  const json = await res.json();
  return json.data as DisciplineRow;
}
