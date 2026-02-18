import { NextResponse } from "next/server";

type StudentStatus = "ACTIVE" | "INACTIVE";

type StudentRow = {
  id: string;
  fullName: string;
  dni: string;
  email?: string;
  phone?: string;
  status: StudentStatus;
  createdAt: string; // ISO
  updatedAt: string;
};

// ✅ Por ahora mockeamos acá (luego lo conectas a Prisma)
const MOCK: StudentRow[] = [
  {
    id: "stu_1",
    fullName: "Ana Torres",
    dni: "76543210",
    email: "ana@example.com",
    phone: "+51 999 111 222",
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "stu_2",
    fullName: "Luis Rojas",
    dni: "12345678",
    email: "luis@example.com",
    phone: "+51 999 333 444",
    status: "INACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json({ data: MOCK });
}
