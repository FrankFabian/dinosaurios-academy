import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { issueStudentClaimLink } from "@/features/students/claim";
import { prisma } from "@/server/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = { id: string };

export async function POST(_: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestedByUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  const result = await issueStudentClaimLink({
    studentId: id,
    requestedByUserId: requestedByUser?.id ?? null,
  });

  if (!result.ok) {
    if (result.reason === "not-found") {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    if (result.reason === "already-linked") {
      return NextResponse.json({ error: "Student is already linked to an account" }, { status: 409 });
    }
    return NextResponse.json({ error: result.error || "Failed to send claim email" }, { status: 400 });
  }

  return NextResponse.json({
    data: {
      sent: true,
      provider: result.provider,
    },
  });
}
