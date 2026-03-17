import { mapGroupToRow } from "@/features/groups/mappers";
import { getGroupDb, updateGroupDb } from "@/features/groups/repository";
import { updateGroupSchema, zodErrorToResponse } from "@/features/groups/schemas";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

type Params = { id: string };

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const group = await getGroupDb(id);
  if (!group) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: mapGroupToRow(group) });
}

export async function PATCH(req: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const payload = await req.json();
  const parsed = updateGroupSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(zodErrorToResponse(parsed.error), { status: 400 });
  }

  const body = parsed.data;
  const data: Prisma.GroupUncheckedUpdateInput = {};

  if (body.locationId !== undefined) data.locationId = body.locationId;
  if (body.disciplineId !== undefined) data.disciplineId = body.disciplineId;
  if (body.status !== undefined) data.status = body.status;
  if (body.gender !== undefined) data.gender = body.gender;
  if (body.categoryId !== undefined) data.categoryId = body.categoryId;
  if (body.sessionsPerWeek !== undefined) data.sessionsPerWeek = body.sessionsPerWeek;
  if (body.daysOfWeek !== undefined) data.daysOfWeek = body.daysOfWeek;
  if (body.startMinute !== undefined) data.startMinute = body.startMinute;
  if (body.endMinute !== undefined) data.endMinute = body.endMinute;
  if (body.coachId !== undefined) data.coachId = body.coachId?.trim() ? body.coachId.trim() : null;

  try {
    const updated = await updateGroupDb(id, data);
    return NextResponse.json({ data: mapGroupToRow(updated) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
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
