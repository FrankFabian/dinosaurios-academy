import type { Student } from "@prisma/client";
import type { StudentRow } from "./types";

export function mapStudentToRow(student: Student): StudentRow {
  return {
    id: student.id,
    fullName: `${student.firstName} ${student.lastName}`.trim(),
    firstName: student.firstName,
    lastName: student.lastName,
    dni: student.documentId,
    email: student.email,
    phone: student.phone,
    birthDate: student.birthDate.toISOString().slice(0, 10),
    category: student.category,
    status: student.status,
    photoUrl: student.photoUrl,
    photoPublicId: student.photoPublicId,
    qrCodeValue: student.qrCode,
    createdAt: student.createdAt.toISOString(),
    updatedAt: student.updatedAt.toISOString(),
  };
}
