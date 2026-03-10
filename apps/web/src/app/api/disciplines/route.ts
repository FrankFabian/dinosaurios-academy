import { mapDisciplineToRow } from "@/features/disciplines/mappers";
import {
  createDisciplineDb,
  listDisciplinesDb,
} from "@/features/disciplines/repository";
import {
  createDisciplineSchema,
  zodErrorToResponse,
} from "@/features/disciplines/schemas";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const disciplines = await listDisciplinesDb();
  return NextResponse.json({ data: disciplines.map(mapDisciplineToRow) });
}

export async function POST(req: Request) {
  const payload = await req.json();
  const parsed = createDisciplineSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(zodErrorToResponse(parsed.error), { status: 400 });
  }

  const body = parsed.data;

  try {
    const created = await createDisciplineDb({
      name: body.name.trim(),
      icon: body.icon ?? null,
      status: body.status ?? "ACTIVE",
    });

    return NextResponse.json({ data: mapDisciplineToRow(created) }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Discipline already exists" }, { status: 409 });
    }

    throw error;
  }
}
