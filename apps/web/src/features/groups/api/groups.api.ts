import type {
  GroupCreateValues,
  GroupFormOptions,
  GroupRow,
  GroupUpdateValues,
} from "../types";

type ApiResponse<T> = { data: T };
type GroupsResponse = { data: GroupRow[] };
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

export async function fetchGroups(): Promise<GroupRow[]> {
  const res = await fetch("/api/groups", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch groups");
  const json = (await res.json()) as GroupsResponse;
  return json.data;
}

export async function fetchGroup(id: string): Promise<GroupRow> {
  const res = await fetch(`/api/groups/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch group");
  const json = await res.json();
  return json.data as GroupRow;
}

export async function createGroup(input: GroupCreateValues) {
  const res = await fetch("/api/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await getApiErrorMessage(res, "Failed to create group"));
  return (await res.json()) as ApiResponse<GroupRow>;
}

export async function updateGroup(id: string, input: GroupUpdateValues): Promise<GroupRow> {
  const res = await fetch(`/api/groups/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await getApiErrorMessage(res, "Failed to update group"));
  const json = await res.json();
  return json.data as GroupRow;
}

export async function fetchGroupFormOptions(): Promise<GroupFormOptions> {
  const res = await fetch("/api/groups/options", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch group options");
  const json = await res.json();
  return json.data as GroupFormOptions;
}
