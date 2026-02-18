"use client";

import * as React from "react";
import { DataTable } from "@/components/organisms/data-table";
import type { StudentRow, StudentStatus } from "../types";
import { studentColumns } from "./students-columns";

export function StudentsTable({ data }: { data: StudentRow[] }) {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"ALL" | StudentStatus>("ALL");

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
