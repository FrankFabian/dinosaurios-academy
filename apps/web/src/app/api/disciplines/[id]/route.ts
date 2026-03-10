import { mapDisciplineToRow } from "@/features/disciplines/mappers";
import {
  getDisciplineDb,
  updateDisciplineDb,
} from "@/features/disciplines/repository";
import {
  updateDisciplineSchema,
  zodErrorToResponse,
} from "@/features/disciplines/schemas";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

type Params = { id: string };

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const discipline = await getDisciplineDb(id);
  if (!discipline) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: mapDisciplineToRow(discipline) });
}

export async function PATCH(req: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const payload = await req.json();
  const parsed = updateDisciplineSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(zodErrorToResponse(parsed.error), { status: 400 });
  }

  const body = parsed.data;
  const data: Prisma.DisciplineUncheckedUpdateInput = {};

  if (body.name !== undefined) data.name = body.name.trim();
  if (body.icon !== undefined) data.icon = body.icon;
  if (body.status !== undefined) data.status = body.status;

  try {
    const updated = await updateDisciplineDb(id, data);
    return NextResponse.json({ data: mapDisciplineToRow(updated) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      if (error.code === "P2002") {
        return NextResponse.json({ error: "Discipline already exists" }, { status: 409 });
      }
    }

    throw error;
  }
}
