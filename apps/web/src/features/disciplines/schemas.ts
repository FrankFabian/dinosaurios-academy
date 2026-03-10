import { DISCIPLINE_STATUS } from "@/features/disciplines/types";
import { z } from "zod";

const trimmedNonEmpty = z.string().trim().min(1);
const optionalIcon = z.string().trim().min(1).optional().nullable();

export const createDisciplineSchema = z.object({
  name: trimmedNonEmpty,
  icon: optionalIcon,
  status: z.enum(DISCIPLINE_STATUS).default("ACTIVE"),
});

export const updateDisciplineSchema = z
  .object({
    name: trimmedNonEmpty.optional(),
    icon: optionalIcon,
    status: z.enum(DISCIPLINE_STATUS).optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field is required",
  });

export function zodErrorToResponse(error: z.ZodError) {
  const flattened = error.flatten();
  return {
    error: "Validation error",
    formErrors: flattened.formErrors,
    fieldErrors: flattened.fieldErrors,
  };
}
