import { mapStudentToRow } from "@/features/students/mappers";
import { createStudentDb, listStudentsDb } from "@/features/students/repository";
import { createStudentSchema, zodErrorToResponse } from "@/features/students/schemas";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const students = await listStudentsDb();
  return NextResponse.json({ data: students.map(mapStudentToRow) });
}

export async function POST(req: Request) {
  const payload = await req.json();
  const parsed = createStudentSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(zodErrorToResponse(parsed.error), { status: 400 });
  }

  const body = parsed.data;
  const birthDate = new Date(`${body.birthDate}T00:00:00.000Z`);

  try {
    const created = await createStudentDb({
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      documentId: body.dni.trim(),
      phone: body.phone?.trim() || null,
      email: body.email.trim(),
      birthDate,
      category: body.category ?? "OPEN",
      photoUrl: body.photoUrl ?? null,
      photoPublicId: body.photoPublicId ?? null,
      qrCode: crypto.randomUUID(),
      status: "ACTIVE",
    });

    return NextResponse.json({ data: mapStudentToRow(created) }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Student already exists" }, { status: 409 });
    }

    throw error;
  }
}
