import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GroupCreateValues } from "../types";
import { createGroup } from "../api/groups.api";

export function useCreateGroup() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: GroupCreateValues) => createGroup(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
