import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "../api/students.api";

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });
}
