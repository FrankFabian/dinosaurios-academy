export const STUDENT_STATUS = ["ACTIVE", "INACTIVE"] as const;
export type StudentStatus = (typeof STUDENT_STATUS)[number];

export const STUDENT_CATEGORY = [
  "PRE_MINI",
  "MINI",
  "U13",
  "U15",
  "U17",
  "U19",
  "OPEN",
] as const;
export type StudentCategory = (typeof STUDENT_CATEGORY)[number];

export type StudentRow = {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  dni: string;
  email?: string | null;
  phone?: string | null;

  birthDate: string; 
  category: StudentCategory;
  status: StudentStatus;
  
  photoUrl?: string | null;
  photoPublicId?: string | null;

  qrCodeValue: string;
  
  createdAt: string; 
  updatedAt: string; 
};

export type StudentCreateValues = {
  firstName: string;
  lastName: string;
  dni: string;

  phone?: string;
  email?: string;

  birthDate: string; 
  category: StudentCategory;
};

export type StudentUpdateValues = {
  email?: string | null;
  phone?: string | null;

  
  firstName?: string;
  lastName?: string;
  dni?: string;
  birthDate?: string;
  category?: StudentRow["category"];
  status?: StudentRow["status"];

  
  photoUrl?: string | null;
  photoPublicId?: string | null;
};
