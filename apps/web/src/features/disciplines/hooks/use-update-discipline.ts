import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DisciplineUpdateValues } from "../types";
import { updateDiscipline } from "../api/disciplines.api";

export function useUpdateDiscipline(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: DisciplineUpdateValues) => updateDiscipline(id, payload),
    onSuccess: (updated) => {
      qc.setQueryData(["disciplines", id], updated);
      qc.invalidateQueries({ queryKey: ["disciplines"] });
      qc.invalidateQueries({ queryKey: ["disciplines", id] });
    },
  });
}
