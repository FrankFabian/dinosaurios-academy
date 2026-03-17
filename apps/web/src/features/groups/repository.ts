import { prisma } from "@/server/db";
import type { Prisma } from "@prisma/client";
import { ACADEMY_CATEGORIES, toCategoryLabel } from "@/features/categories/constants";

const groupInclude = {
  location: true,
  discipline: true,
  category: true,
  coach: {
    include: {
      user: true,
    },
  },
} satisfies Prisma.GroupInclude;

export function listGroupsDb() {
  return prisma.group.findMany({
    include: groupInclude,
    orderBy: { createdAt: "desc" },
  });
}

export function getGroupDb(id: string) {
  return prisma.group.findUnique({
    where: { id },
    include: groupInclude,
  });
}

export function createGroupDb(data: Prisma.GroupUncheckedCreateInput) {
  return prisma.group.create({
    data,
    include: groupInclude,
  });
}

export function updateGroupDb(id: string, data: Prisma.GroupUncheckedUpdateInput) {
  return prisma.group.update({
    where: { id },
    data,
    include: groupInclude,
  });
}

export async function listGroupFormOptionsDb() {
  await prisma.$transaction(
    ACADEMY_CATEGORIES.map((categoryName) =>
      prisma.category.upsert({
        where: { name: categoryName },
        update: { status: "ACTIVE" },
        create: { name: categoryName, status: "ACTIVE" },
      })
    )
  );

  const [locations, disciplines, categories, coaches] = await Promise.all([
    prisma.location.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.discipline.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
    prisma.coach.findMany({
      select: { id: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    locations,
    disciplines,
    categories: categories.map((category) => ({
      ...category,
      name: toCategoryLabel(category.name),
    })),
    coaches: coaches.map((coach) => ({
      id: coach.id,
      name: coach.user?.name?.trim() || coach.user?.email || "Unnamed coach",
    })),
  };
}
