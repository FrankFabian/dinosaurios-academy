import { useQuery } from "@tanstack/react-query";
import { fetchGroup } from "../api/groups.api";

export function useGroup(id: string) {
  return useQuery({
    queryKey: ["groups", id],
    queryFn: () => fetchGroup(id),
    enabled: Boolean(id),
  });
}
