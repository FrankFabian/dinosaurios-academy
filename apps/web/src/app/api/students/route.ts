import { StudentCreateValues, StudentRow } from "@/features/students/types";
import { NextResponse } from "next/server";

// ✅ Por ahora mockeamos acá (luego lo conectas a Prisma)
const now = new Date().toISOString();

export let MOCK: StudentRow[] = [
  {
    id: "stu_1",
    fullName: "Ana Torres",
    dni: "76543210",
    email: "ana@example.com",
    phone: "+51 999 111 222",
    birthDate: "2012-05-10",
    category: "U13",
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now,
    qrCodeValue: crypto.randomUUID(),
  },
  {
    id: "stu_2",
    fullName: "Luis Rojas",
    dni: "12345678",
    email: "luis@example.com",
    phone: "+51 999 333 444",
    birthDate: "2008-11-22",
    category: "U17",
    status: "INACTIVE",
    createdAt: now,
    updatedAt: now,
    qrCodeValue: crypto.randomUUID(),
  },
];

export async function GET() {
  return NextResponse.json({ data: MOCK });
}

export async function POST(req: Request) {
  const body = (await req.json()) as StudentCreateValues & {
  photoUrl?: string | null;
  photoPublicId?: string | null;
};

  const now = new Date().toISOString();

  const newStudent: StudentRow = {
    id: crypto.randomUUID(),
    fullName: `${body.firstName} ${body.lastName}`.trim(),
    dni: body.dni,
    phone: body.phone ?? null,
    email: body.email ? body.email : null,

    birthDate: body.birthDate,
    category: body.category ?? "OPEN",
    status: "ACTIVE", // ✅ literal: StudentStatus
    
    photoUrl: body.photoUrl ?? null,
    photoPublicId: body.photoPublicId ?? null,
    
    qrCodeValue: crypto.randomUUID(),

    createdAt: now,
    updatedAt: now,
  };

  MOCK = [newStudent, ...MOCK];

  return NextResponse.json({ data: newStudent }, { status: 201 });
}