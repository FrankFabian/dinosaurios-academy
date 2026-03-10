import type { LocationCreateValues, LocationRow, LocationUpdateValues } from "../types";

type ApiResponse<T> = { data: T };
type LocationsResponse = { data: LocationRow[] };
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

export async function fetchLocations(): Promise<LocationRow[]> {
  const res = await fetch("/api/locations", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch locations");
  const json = (await res.json()) as LocationsResponse;
  return json.data;
}

export async function createLocation(input: LocationCreateValues) {
  const res = await fetch("/api/locations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "Failed to create location"));
  }
  return (await res.json()) as ApiResponse<LocationRow>;
}

export async function fetchLocation(id: string): Promise<LocationRow> {
  const res = await fetch(`/api/locations/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch location");
  const json = await res.json();
  return json.data as LocationRow;
}

export async function updateLocation(id: string, input: LocationUpdateValues): Promise<LocationRow> {
  const res = await fetch(`/api/locations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await getApiErrorMessage(res, "Failed to update location"));
  const json = await res.json();
  return json.data as LocationRow;
}
