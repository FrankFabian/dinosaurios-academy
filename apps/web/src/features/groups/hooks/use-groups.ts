import { useQuery } from "@tanstack/react-query";
import { fetchGroups } from "../api/groups.api";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
  });
}
