import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudentsTable } from "@/features/students/components/students-table";
import type { StudentRow } from "@/features/students/types";

const MOCK: StudentRow[] = [
  {
    id: "stu_1",
    fullName: "Juan Perez",
    dni: "12345678",
    category: "U15",
    status: "ACTIVE",
    phone: "+51 999 888 777",
    email: "juan.perez@example.com",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "stu_2",
    fullName: "Maria Lopez",
    dni: "87654321",
    category: "U13",
    status: "INACTIVE",
    phone: null,
    email: "maria.lopez@example.com",
    updatedAt: new Date().toISOString(),
  },
];

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Students</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage student profiles, contact info, and enrollment status.
          </p>
        </div>

        <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-500">
          <Link href="/dashboard/students/new">New student</Link>
        </Button>
      </div>

      <StudentsTable data={MOCK} />
    </div>
  );
}
