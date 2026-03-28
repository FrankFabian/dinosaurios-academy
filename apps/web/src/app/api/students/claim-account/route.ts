import { verifyAndClaimStudent } from "@/features/students/claim";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/server/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const claimSchema = z.object({
  otp: z.string().trim().min(1, "otp is required"),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
  const parsed = claimSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation error",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const result = await verifyAndClaimStudent({
    otp: parsed.data.otp,
    userId: user.id,
  });

  if (!result.ok) {
    if (result.reason === "invalid") {
      return NextResponse.json({ error: "Invalid claim link" }, { status: 400 });
    }
    if (result.reason === "expired") {
      return NextResponse.json({ error: "Claim link expired" }, { status: 400 });
    }
    return NextResponse.json({ error: "Student is already linked to another account" }, { status: 409 });
  }

  return NextResponse.json({
    data: {
      studentId: result.studentId,
      linked: true,
    },
  });
}
