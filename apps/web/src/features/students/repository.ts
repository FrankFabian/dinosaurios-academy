import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

export function listStudentsDb() {
  return prisma.student.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export function getStudentDb(id: string) {
  return prisma.student.findUnique({
    where: { id },
  });
}

export function createStudentDb(data: Prisma.StudentUncheckedCreateInput) {
  return prisma.student.create({ data });
}

export function updateStudentDb(id: string, data: Prisma.StudentUncheckedUpdateInput) {
  return prisma.student.update({
    where: { id },
    data,
  });
}
