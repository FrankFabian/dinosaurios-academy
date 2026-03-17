import { GROUP_GENDERS, GROUP_STATUS, WEEK_DAYS } from "@/features/groups/types";
import { z } from "zod";

const idSchema = z.string().trim().min(1, "Required");

const minuteSchema = z.number().int().min(0).max(1439);

export const createGroupSchema = z
  .object({
    locationId: idSchema,
    disciplineId: idSchema,
    status: z.enum(GROUP_STATUS).default("ACTIVE"),
    gender: z.enum(GROUP_GENDERS),
    categoryId: idSchema,
    sessionsPerWeek: z.number().int().min(1).max(14),
    daysOfWeek: z.array(z.enum(WEEK_DAYS)).min(1, "Pick at least one day"),
    startMinute: minuteSchema,
    endMinute: minuteSchema,
    coachId: z.string().trim().optional().nullable(),
  })
  .refine((payload) => payload.sessionsPerWeek === payload.daysOfWeek.length, {
    message: "Sessions per week must match the number of selected days",
    path: ["sessionsPerWeek"],
  })
  .refine((payload) => payload.endMinute > payload.startMinute, {
    message: "End time must be after start time",
    path: ["endMinute"],
  });

export const updateGroupSchema = z
  .object({
    locationId: idSchema.optional(),
    disciplineId: idSchema.optional(),
    status: z.enum(GROUP_STATUS).optional(),
    gender: z.enum(GROUP_GENDERS).optional(),
    categoryId: idSchema.optional(),
    sessionsPerWeek: z.number().int().min(1).max(14).optional(),
    daysOfWeek: z.array(z.enum(WEEK_DAYS)).min(1, "Pick at least one day").optional(),
    startMinute: minuteSchema.optional(),
    endMinute: minuteSchema.optional(),
    coachId: z.string().trim().optional().nullable(),
  })
  .superRefine((payload, ctx) => {
    const hasSessions = payload.sessionsPerWeek !== undefined;
    const hasDays = payload.daysOfWeek !== undefined;

    if (hasSessions !== hasDays) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: hasSessions ? ["daysOfWeek"] : ["sessionsPerWeek"],
        message: "daysOfWeek and sessionsPerWeek must be updated together",
      });
      return;
    }

    if (
      hasSessions &&
      hasDays &&
      payload.sessionsPerWeek !== undefined &&
      payload.daysOfWeek !== undefined &&
      payload.sessionsPerWeek !== payload.daysOfWeek.length
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sessionsPerWeek"],
        message: "Sessions per week must match the number of selected days",
      });
    }
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
