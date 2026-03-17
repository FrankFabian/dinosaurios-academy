export const ACADEMY_CATEGORIES = [
  "PRE_MINI",
  "MINI",
  "U13",
  "U15",
  "U17",
  "U19",
  "OPEN",
] as const;

export type AcademyCategory = (typeof ACADEMY_CATEGORIES)[number];

export const ACADEMY_CATEGORY_LABEL: Record<AcademyCategory, string> = {
  PRE_MINI: "Pre-mini",
  MINI: "Mini",
  U13: "U13",
  U15: "U15",
  U17: "U17",
  U19: "U19",
  OPEN: "Open",
};

export function toCategoryLabel(value: string) {
  return ACADEMY_CATEGORY_LABEL[value as AcademyCategory] ?? value;
}
