"use client";

import Image from "next/image";
import Link from "next/link";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";

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
import { StudentQrDialog } from "./students-qr-dialog";
import { QrCode } from "lucide-react";
import React from "react";

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

export const studentColumns: ColumnDef<StudentRow>[] = [
  {
    id: "photo",
    header: "",
    cell: ({ row }) => {
      const url = row.original.photoUrl;

      return (
        <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-white/5">
          {url ? (
            <Image
              src={url}
              alt="Student photo"
              width={40}
              height={40}
              className="h-10 w-10 object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center text-xs text-white/50">
              —
            </div>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
    size: 56,
  },
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
    cell: ({ row }) => {
    const { createdAt, updatedAt } = row.original;

    const created = new Date(createdAt);
    const updated = new Date(updatedAt);

    if (created.getTime() === updated.getTime()) {
      return <span className="text-zinc-500">—</span>;
    }

    return (
      <span className="text-zinc-400">
        {updated.toLocaleDateString("es-PE")}
      </span>
    );
  }

  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const [dropdownOpen, setDropdownOpen] = React.useState(false);
      const [qrOpen, setQrOpen] = React.useState(false);
      const id = row.original.id;
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-white/15 bg-transparent text-zinc-100 hover:bg-white/10 hover:text-white">
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
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setQrOpen(true);
                }}
              >
                <QrCode className="h-4 w-4 text-emerald-400" />
                QR
              </DropdownMenuItem>

              <StudentQrDialog
                student={row.original}
                open={qrOpen}
                onOpenChange={setQrOpen}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
