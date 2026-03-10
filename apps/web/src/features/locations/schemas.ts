import { LOCATION_STATUS } from "@/features/locations/types";
import { z } from "zod";

const trimmedNonEmpty = z.string().trim().min(1);
const optionalUrl = z.string().trim().url("Invalid URL").optional().nullable();
const optionalMapsUrl = z
  .string()
  .trim()
  .url("Invalid URL")
  .refine(
    (value) =>
      value.includes("google.com/maps") ||
      value.includes("maps.google.com") ||
      value.includes("maps.app.goo.gl") ||
      value.includes("waze.com"),
    "Use a Google Maps or Waze URL"
  )
  .optional()
  .nullable();
const optionalEmbedUrl = z
  .string()
  .trim()
  .url("Invalid URL")
  .refine(
    (value) => value.includes("google.com/maps/embed"),
    "Embed URL must come from Google Maps embed link"
  )
  .optional()
  .nullable();

export const createLocationSchema = z.object({
  name: trimmedNonEmpty,
  address: trimmedNonEmpty,
  photoUrl: optionalUrl,
  mapsUrl: optionalMapsUrl,
  embedUrl: optionalEmbedUrl,
  status: z.enum(LOCATION_STATUS).default("ACTIVE"),
});

export const updateLocationSchema = z
  .object({
    name: trimmedNonEmpty.optional(),
    address: trimmedNonEmpty.optional(),
    photoUrl: optionalUrl,
    mapsUrl: optionalMapsUrl,
    embedUrl: optionalEmbedUrl,
    status: z.enum(LOCATION_STATUS).optional(),
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
