import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLocation } from "../api/locations.api";
import type { LocationUpdateValues } from "../types";

export function useUpdateLocation(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: LocationUpdateValues) => updateLocation(id, input),
    onSuccess: (updated) => {
      qc.setQueryData(["locations", id], updated);
      qc.invalidateQueries({ queryKey: ["locations"] });
      qc.invalidateQueries({ queryKey: ["locations", id] });
    },
  });
}
