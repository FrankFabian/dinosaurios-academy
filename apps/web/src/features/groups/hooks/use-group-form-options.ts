import { useQuery } from "@tanstack/react-query";
import { fetchGroupFormOptions } from "../api/groups.api";

export function useGroupFormOptions() {
  return useQuery({
    queryKey: ["groups", "options"],
    queryFn: fetchGroupFormOptions,
  });
}
