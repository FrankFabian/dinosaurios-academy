"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLocation } from "../api/locations.api";
import type { LocationCreateValues, LocationRow } from "../types";

export function useCreateLocation() {
  const qc = useQueryClient();

  return useMutation<LocationRow, Error, LocationCreateValues>({
    mutationFn: async (payload) => {
      const res = await createLocation(payload);
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["locations"] });
    },
  });
}
