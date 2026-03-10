"use client";

import Image from "next/image";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LocationRow, LocationStatus } from "../types";
import { LocationActionsCell } from "./location-actions-cell";

function StatusBadge({ status }: { status: LocationStatus }) {
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

const statusFilterFn: FilterFn<LocationRow> = (row, _id, value) => {
  if (!value) return true;
  return row.original.status === value;
};

export const locationColumns: ColumnDef<LocationRow>[] = [
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
              alt="Location photo"
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
    accessorKey: "name",
    header: "Location",
    cell: ({ row }) => <div className="min-w-55 font-medium text-zinc-100">{row.original.name}</div>,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => <span className="text-zinc-300">{row.original.address}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: statusFilterFn,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => {
      const updated = new Date(row.original.updatedAt);
      return <span className="text-zinc-400">{updated.toLocaleDateString("es-PE")}</span>;
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <LocationActionsCell location={row.original} />,
  },
];
