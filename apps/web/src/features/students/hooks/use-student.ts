import { useQuery } from "@tanstack/react-query";
import { fetchStudent } from "../api/students.api";

export function useStudent(id: string) {
  return useQuery({
    queryKey: ["students", id],
    queryFn: () => fetchStudent(id),
    enabled: Boolean(id),
  });
}

