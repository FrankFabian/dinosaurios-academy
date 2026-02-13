"use client";

import * as React from "react";
import Link from "next/link";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";

import { DataTable } from "@/components/organisms/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { StudentRow, StudentStatus } from "../types";

function StatusBadge({ status }: { status: StudentStatus }) {
  return (
    <Badge
      className={cn(
        "border border-white/10",
        status === "ACTIVE"
          ? "bg-emerald-500/10 text-emerald-200"
          : "bg-zinc-500/10 text-zinc-200"
      )}
      variant="secondary"
    >
      {status}
    </Badge>
  );
}

const statusFilterFn: FilterFn<StudentRow> = (row, _id, value) => {
  if (!value) return true;
  return row.original.status === value;
};

export function StudentsTable({ data }: { data: StudentRow[] }) {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"ALL" | StudentStatus>("ALL");

  const columns: ColumnDef<StudentRow>[] = [
    {
      accessorKey: "fullName",
      header: "Student",
      cell: ({ row }) => (
        <div className="min-w-55">
          <div className="font-medium text-zinc-100">{row.original.fullName}</div>
          <div className="text-xs text-zinc-400">DNI: {row.original.dni}</div>
        </div>
      ),
    },
    { accessorKey: "category", header: "Category" },
    {
        accessorKey: "status",
        header: "Status",
        filterFn: statusFilterFn,
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: "phone", header: "Phone", cell: ({ row }) => row.original.phone ?? "—" },
    { accessorKey: "email", header: "Email", cell: ({ row }) => row.original.email ?? "—" },
    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => (
        <span className="text-zinc-400">
          {new Date(row.original.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-white/10">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-white/10 bg-zinc-950 text-zinc-100"
              >
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/dashboard/students/${id}`}>View</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/dashboard/students/${id}/edit`}>Edit</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable<StudentRow>
      data={data}
      columns={columns}
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
