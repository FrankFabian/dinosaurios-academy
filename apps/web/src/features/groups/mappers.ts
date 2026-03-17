import type { Group, Location, Discipline, Category, Coach, User } from "@prisma/client";
import type { GroupRow } from "./types";

type GroupWithRelations = Group & {
  location: Location;
  discipline: Discipline;
  category: Category;
  coach: (Coach & { user: User | null }) | null;
};

export function mapGroupToRow(group: GroupWithRelations): GroupRow {
  return {
    id: group.id,
    locationId: group.locationId,
    locationName: group.location.name,
    disciplineId: group.disciplineId,
    disciplineName: group.discipline.name,
    status: group.status,
    gender: group.gender,
    categoryId: group.categoryId,
    categoryName: group.category.name,
    sessionsPerWeek: group.sessionsPerWeek,
    daysOfWeek: group.daysOfWeek,
    startMinute: group.startMinute,
    endMinute: group.endMinute,
    coachId: group.coachId,
    coachName: group.coach?.user?.name ?? null,
    createdAt: group.createdAt.toISOString(),
    updatedAt: group.updatedAt.toISOString(),
  };
}

export function minuteToTimeLabel(minute: number) {
  const h = Math.floor(minute / 60);
  const m = minute % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
