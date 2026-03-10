import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DisciplineCreateValues } from "../types";
import { createDiscipline } from "../api/disciplines.api";

export function useCreateDiscipline() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: DisciplineCreateValues) => createDiscipline(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["disciplines"] });
    },
  });
}
