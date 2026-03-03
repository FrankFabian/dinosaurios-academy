import { mapStudentToRow } from "@/features/students/mappers";
import { getStudentDb, updateStudentDb } from "@/features/students/repository";
import { updateStudentSchema, zodErrorToResponse } from "@/features/students/schemas";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

type Params = { id: string };

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const student = await getStudentDb(id);
  if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: mapStudentToRow(student) });
}

export async function PATCH(req: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;
  const payload = await req.json();
  const parsed = updateStudentSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(zodErrorToResponse(parsed.error), { status: 400 });
  }

  const body = parsed.data;
  const data: Prisma.StudentUncheckedUpdateInput = {};

  if (body.firstName !== undefined) data.firstName = body.firstName.trim();
  if (body.lastName !== undefined) data.lastName = body.lastName.trim();
  if (body.dni !== undefined) data.documentId = body.dni.trim();
  if (body.phone !== undefined) data.phone = body.phone?.trim() || null;

  if (body.email !== undefined) {
    if (!body.email?.trim()) {
      return NextResponse.json({ error: "Email cannot be empty" }, { status: 400 });
    }
    data.email = body.email.trim();
  }

  if (body.birthDate !== undefined) data.birthDate = new Date(`${body.birthDate}T00:00:00.000Z`);

  if (body.category !== undefined) data.category = body.category;
  if (body.status !== undefined) data.status = body.status;
  if (body.photoUrl !== undefined) data.photoUrl = body.photoUrl;
  if (body.photoPublicId !== undefined) data.photoPublicId = body.photoPublicId;

  try {
    const updated = await updateStudentDb(id, data);
    return NextResponse.json({ data: mapStudentToRow(updated) });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      if (error.code === "P2002") {
        return NextResponse.json({ error: "Unique field already exists" }, { status: 409 });
      }
    }

    throw error;
  }
}
