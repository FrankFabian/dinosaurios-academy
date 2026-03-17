export const GROUP_STATUS = ["ACTIVE", "INACTIVE"] as const;
export type GroupStatus = (typeof GROUP_STATUS)[number];

export const GROUP_GENDERS = ["MALE", "FEMALE"] as const;
export type GroupGender = (typeof GROUP_GENDERS)[number];

export const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

export type GroupRow = {
  id: string;
  locationId: string;
  locationName: string;
  disciplineId: string;
  disciplineName: string;
  status: GroupStatus;
  gender: GroupGender;
  categoryId: string;
  categoryName: string;
  sessionsPerWeek: number;
  daysOfWeek: WeekDay[];
  startMinute: number;
  endMinute: number;
  coachId?: string | null;
  coachName?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GroupCreateValues = {
  locationId: string;
  disciplineId: string;
  status?: GroupStatus;
  gender: GroupGender;
  categoryId: string;
  sessionsPerWeek: number;
  daysOfWeek: WeekDay[];
  startMinute: number;
  endMinute: number;
  coachId?: string | null;
};

export type GroupUpdateValues = {
  locationId?: string;
  disciplineId?: string;
  status?: GroupStatus;
  gender?: GroupGender;
  categoryId?: string;
  sessionsPerWeek?: number;
  daysOfWeek?: WeekDay[];
  startMinute?: number;
  endMinute?: number;
  coachId?: string | null;
};

export type GroupFormOptions = {
  locations: Array<{ id: string; name: string }>;
  disciplines: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
  coaches: Array<{ id: string; name: string }>;
};
