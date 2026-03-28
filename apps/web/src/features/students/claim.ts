import { prisma } from "@/server/db";
import { createHash, randomBytes } from "crypto";
import { sendStudentClaimEmail } from "@/lib/email";

const CLAIM_OTP_TTL_MINUTES = 60 * 24;

function hashOtp(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export function buildClaimAccountUrl(otp: string) {
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const url = new URL("/claim-account", baseUrl);
  url.searchParams.set("otp", otp);
  return url.toString();
}

export async function createStudentClaimOtp(input: {
  studentId: string;
  requestedByUserId?: string | null;
}) {
  const code = randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + CLAIM_OTP_TTL_MINUTES * 60 * 1000);

  await prisma.studentLinkOtp.create({
    data: {
      studentId: input.studentId,
      codeHash: hashOtp(code),
      expiresAt,
      requestedByUserId: input.requestedByUserId ?? null,
    },
  });

  return { code, expiresAt };
}

export async function verifyAndClaimStudent(input: { otp: string; userId: string }) {
  const codeHash = hashOtp(input.otp);
  const now = new Date();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const otpRecord = await tx.studentLinkOtp.findFirst({
        where: { codeHash },
        include: { student: true },
        orderBy: { createdAt: "desc" },
      });

      if (!otpRecord) {
        return { ok: false as const, reason: "invalid" as const };
      }

      if (otpRecord.expiresAt < now) {
        return { ok: false as const, reason: "expired" as const };
      }

      if (otpRecord.student.userId && otpRecord.student.userId !== input.userId) {
        return { ok: false as const, reason: "already-linked" as const };
      }

      await tx.studentLinkOtp.delete({
        where: { id: otpRecord.id },
      });

      await tx.student.update({
        where: { id: otpRecord.studentId },
        data: { userId: input.userId },
      });

      await tx.studentLinkOtp.deleteMany({
        where: { studentId: otpRecord.studentId },
      });

      return { ok: true as const, studentId: otpRecord.studentId };
    });

    return result;
  } catch {
    return { ok: false as const, reason: "invalid" as const };
  }
}

export async function issueStudentClaimLink(input: {
  studentId: string;
  requestedByUserId?: string | null;
}) {
  const student = await prisma.student.findUnique({
    where: { id: input.studentId },
    select: {
      id: true,
      userId: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!student) {
    return { ok: false as const, reason: "not-found" as const };
  }

  if (student.userId) {
    return { ok: false as const, reason: "already-linked" as const };
  }

  const otp = await createStudentClaimOtp({
    studentId: student.id,
    requestedByUserId: input.requestedByUserId ?? null,
  });
  const claimUrl = buildClaimAccountUrl(otp.code);

  const emailResult = await sendStudentClaimEmail({
    to: student.email,
    studentName: `${student.firstName} ${student.lastName}`.trim(),
    claimUrl,
  });

  if (!emailResult.ok) {
    return { ok: false as const, reason: "email-failed" as const, error: emailResult.error };
  }

  return {
    ok: true as const,
    provider: emailResult.provider,
    claimUrl,
  };
}
