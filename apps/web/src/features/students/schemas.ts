import { STUDENT_CATEGORY, STUDENT_STATUS } from "@/features/students/types";
import { z } from "zod";

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

const trimmedNonEmpty = z.string().trim().min(1);

const optionalTrimmedString = z
  .string()
  .trim()
  .min(1)
  .optional()
  .or(z.literal("").transform(() => undefined));

export const createStudentSchema = z.object({
  firstName: trimmedNonEmpty,
  lastName: trimmedNonEmpty,
  dni: trimmedNonEmpty,
  email: z.string().trim().email(),
  phone: optionalTrimmedString,
  birthDate: z.string().regex(dateOnlyRegex, "birthDate must be YYYY-MM-DD"),
  category: z.enum(STUDENT_CATEGORY).default("OPEN"),
  photoUrl: z.string().trim().optional().nullable(),
  photoPublicId: z.string().trim().optional().nullable(),
});

export const updateStudentSchema = z
  .object({
    firstName: trimmedNonEmpty.optional(),
    lastName: trimmedNonEmpty.optional(),
    dni: trimmedNonEmpty.optional(),
    email: z.string().trim().email().optional(),
    phone: optionalTrimmedString.nullable().optional(),
    birthDate: z.string().regex(dateOnlyRegex, "birthDate must be YYYY-MM-DD").optional(),
    category: z.enum(STUDENT_CATEGORY).optional(),
    status: z.enum(STUDENT_STATUS).optional(),
    photoUrl: z.string().trim().optional().nullable(),
    photoPublicId: z.string().trim().optional().nullable(),
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
