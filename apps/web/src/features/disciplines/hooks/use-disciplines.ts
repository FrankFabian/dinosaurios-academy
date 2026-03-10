import { useQuery } from "@tanstack/react-query";
import { fetchDisciplines } from "../api/disciplines.api";

export function useDisciplines() {
  return useQuery({
    queryKey: ["disciplines"],
    queryFn: fetchDisciplines,
  });
}
