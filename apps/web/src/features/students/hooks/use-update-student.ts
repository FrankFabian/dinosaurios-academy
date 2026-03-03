import { useMutation, useQueryClient } from "@tanstack/react-query";
import { StudentUpdateValues } from "../types";
import { updateStudent } from "../api/students.api";

export function useUpdateStudent(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: StudentUpdateValues) => updateStudent(id, input),
    onSuccess: (updated) => {
      qc.setQueryData(["students", id], updated);
      qc.invalidateQueries({ queryKey: ["students"] }); // refresca listado
      qc.invalidateQueries({ queryKey: ["students", id] });
    },
  });
}