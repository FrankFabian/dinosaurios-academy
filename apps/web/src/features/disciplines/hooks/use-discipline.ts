import { useQuery } from "@tanstack/react-query";
import { fetchDiscipline } from "../api/disciplines.api";

export function useDiscipline(id: string) {
  return useQuery({
    queryKey: ["disciplines", id],
    queryFn: () => fetchDiscipline(id),
    enabled: Boolean(id),
  });
}
