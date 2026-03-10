import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

export function listDisciplinesDb() {
  return prisma.discipline.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export function getDisciplineDb(id: string) {
  return prisma.discipline.findUnique({
    where: { id },
  });
}

export function createDisciplineDb(data: Prisma.DisciplineUncheckedCreateInput) {
  return prisma.discipline.create({ data });
}

export function updateDisciplineDb(id: string, data: Prisma.DisciplineUncheckedUpdateInput) {
  return prisma.discipline.update({
    where: { id },
    data,
  });
}
