import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GroupUpdateValues } from "../types";
import { updateGroup } from "../api/groups.api";

export function useUpdateGroup(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: GroupUpdateValues) => updateGroup(id, payload),
    onSuccess: (updated) => {
      qc.setQueryData(["groups", id], updated);
      qc.invalidateQueries({ queryKey: ["groups"] });
      qc.invalidateQueries({ queryKey: ["groups", id] });
    },
  });
}
