"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudent, StudentCreatePayload } from "../api/students.api";
import { StudentCreateValues, StudentRow } from "../types";

export function useCreateStudent() {
  const qc = useQueryClient();

  return useMutation<StudentRow, Error, StudentCreatePayload>({
    mutationFn: async (payload) => {
      const res = await createStudent(payload);
      return res.data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["students"] });
    },
  });
}