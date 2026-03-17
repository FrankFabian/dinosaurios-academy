import { mapGroupToRow } from "@/features/groups/mappers";
import { createGroupDb, listGroupsDb } from "@/features/groups/repository";
import { createGroupSchema, zodErrorToResponse } from "@/features/groups/schemas";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const groups = await listGroupsDb();
  return NextResponse.json({ data: groups.map(mapGroupToRow) });
}

export async function POST(req: Request) {
  const payload = await req.json();
  const parsed = createGroupSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(zodErrorToResponse(parsed.error), { status: 400 });
  }

  const body = parsed.data;

  try {
    const created = await createGroupDb({
      locationId: body.locationId,
      disciplineId: body.disciplineId,
      ...(body.status && body.status !== "ACTIVE" ? { status: body.status } : {}),
      gender: body.gender,
      categoryId: body.categoryId,
      sessionsPerWeek: body.sessionsPerWeek,
      daysOfWeek: body.daysOfWeek,
      startMinute: body.startMinute,
      endMinute: body.endMinute,
      coachId: body.coachId?.trim() ? body.coachId.trim() : null,
    });

    return NextResponse.json({ data: mapGroupToRow(created) }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ error: "Group already exists" }, { status: 409 });
      }
      if (error.code === "P2003") {
        return NextResponse.json({ error: "Invalid related entity" }, { status: 400 });
      }
    }

    throw error;
  }
}
