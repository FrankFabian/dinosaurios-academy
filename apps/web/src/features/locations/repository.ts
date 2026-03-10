import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";

export function listLocationsDb() {
  return prisma.location.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export function getLocationDb(id: string) {
  return prisma.location.findUnique({
    where: { id },
  });
}

export function createLocationDb(data: Prisma.LocationUncheckedCreateInput) {
  return prisma.location.create({ data });
}

export function updateLocationDb(id: string, data: Prisma.LocationUncheckedUpdateInput) {
  return prisma.location.update({
    where: { id },
    data,
  });
}
