import { mapStudentToRow } from "@/features/students/mappers";
import { issueStudentClaimLink } from "@/features/students/claim";
import { createStudentDb, listStudentsDb } from "@/features/students/repository";
import { createStudentSchema, zodErrorToResponse } from "@/features/students/schemas";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/server/db";

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

    let claimEmail = { sent: false, provider: "none", error: null as string | null };

    try {
      const session = await getServerSession(authOptions);
      let requestedByUserId: string | null = null;

      if (session?.user?.email) {
        const requestedByUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true },
        });
        requestedByUserId = requestedByUser?.id ?? null;
      }

      const claimResult = await issueStudentClaimLink({
        studentId: created.id,
        requestedByUserId,
      });

      if (claimResult.ok) {
        claimEmail = { sent: true, provider: claimResult.provider, error: null };
      } else {
        claimEmail = {
          sent: false,
          provider: "none",
          error:
            claimResult.reason === "already-linked"
              ? "Student is already linked to an account"
              : claimResult.reason === "not-found"
              ? "Student not found for claim flow"
              : claimResult.error,
        };
      }
    } catch (claimError) {
      claimEmail = {
        sent: false,
        provider: "none",
        error: claimError instanceof Error ? claimError.message : "Failed to process claim email",
      };
    }

    return NextResponse.json({ data: mapStudentToRow(created), claimEmail }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Student already exists" }, { status: 409 });
    }

    throw error;
  }
}
