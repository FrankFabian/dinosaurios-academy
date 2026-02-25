"use client";

import * as React from "react";
import { DataTable } from "@/components/organisms/data-table";
import type { StudentRow, StudentStatus } from "../types";
import { studentColumns } from "./students-columns";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function StudentsTable({ data }: { data: StudentRow[] }) {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"ALL" | StudentStatus>("ALL");

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <Users className="h-8 w-8 text-emerald-500" />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-white">
          No students yet
        </h3>

        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          Start by creating your first student profile to manage attendance and groups.
        </p>

        <Button
          asChild
          className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-black"
        >
          <Link href="/dashboard/students/new">
            New student
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <DataTable<StudentRow>
      data={data}
      columns={studentColumns}
      search={{
        value: q,
        onChange: setQ,
        placeholder: "Search by name, DNI or email...",
        globalFilterFn: (row, _columnId, filterValue) => {
          const v = row.original as StudentRow;
          const query = String(filterValue ?? "").toLowerCase().trim();
          if (!query) return true;
          return (
            v.fullName.toLowerCase().includes(query) ||
            v.dni.toLowerCase().includes(query) ||
            (v.email ?? "").toLowerCase().includes(query)
          );
        },
      }}
      statusFilter={{
        columnId: "status",
        label: "Status",
        options: [
          { label: "All", value: "ALL" },
          { label: "Active", value: "ACTIVE" },
          { label: "Inactive", value: "INACTIVE" },
        ],
        value: status,
        onChange: (v) => setStatus(v as any),
      }}
      pageSize={10}
      emptyText="No students found."
    />
  );
}
