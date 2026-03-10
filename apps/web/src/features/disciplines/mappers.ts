import type { Discipline } from "@prisma/client";
import type { DisciplineRow } from "./types";

export function mapDisciplineToRow(discipline: Discipline): DisciplineRow {
  return {
    id: discipline.id,
    name: discipline.name,
    icon: discipline.icon,
    status: discipline.status,
    createdAt: discipline.createdAt.toISOString(),
    updatedAt: discipline.updatedAt.toISOString(),
  };
}
