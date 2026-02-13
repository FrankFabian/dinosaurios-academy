export type StudentStatus = "ACTIVE" | "INACTIVE";

export type StudentRow = {
  id: string;
  fullName: string;
  dni: string;
  category: string; // later: enum
  status: StudentStatus;
  phone?: string | null;
  email?: string | null;
  updatedAt: string; // ISO string for now
};
