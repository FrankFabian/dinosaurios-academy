"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StatusOption = { label: string; value: string };

export type DataTableStatusFilter = {
  columnId: string; // e.g. "status"
  label?: string;   // e.g. "Status"
  options: StatusOption[]; // include ALL yourself
  value: string;
  onChange: (value: string) => void;
};

export type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];

  /** Global search */
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    /** If you want custom global filtering, pass a function */
    globalFilterFn?: (row: any, columnId: string, filterValue: unknown) => boolean;
  };

  /** Simple select filter (common for Status) */
  statusFilter?: DataTableStatusFilter;

  /** Pagination */
  pageSize?: number;

  /** UI */
  emptyText?: string;
};

export function DataTable<TData>({
  data,
  columns,
  search,
  statusFilter,
  pageSize = 10,
  emptyText = "No results found.",
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = React.useState(search?.value ?? "");

  // keep internal in sync with controlled search
  React.useEffect(() => {
    if (typeof search?.value === "string") setGlobalFilter(search.value);
  }, [search?.value]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: (v) => {
      const next = String(v ?? "");
      setGlobalFilter(next);
      search?.onChange?.(next);
    },
    globalFilterFn: search?.globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  // Apply status filter (if provided)
  React.useEffect(() => {
    if (!statusFilter) return;
    const col = table.getColumn(statusFilter.columnId);
    if (!col) return;

    // convention: "ALL" means remove filter
    if (statusFilter.value === "ALL") col.setFilterValue(undefined);
    else col.setFilterValue(statusFilter.value);
  }, [statusFilter, table]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      {(search || statusFilter) && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {search && (
              <Input
                value={globalFilter}
                onChange={(e) => table.setGlobalFilter(e.target.value)}
                placeholder={search.placeholder ?? "Search..."}
                className={cn(
                  "w-full sm:w-85",
                  "bg-zinc-950 border-white/10 text-zinc-100 placeholder:text-zinc-500"
                )}
              />
            )}

            {statusFilter && (
              <Select value={statusFilter.value} onValueChange={statusFilter.onChange}>
                <SelectTrigger
                  className={cn(
                    "w-full sm:w-45",
                    "bg-zinc-950 border-white/10 text-zinc-100"
                  )}
                >
                  <SelectValue placeholder={statusFilter.label ?? "Filter"} />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-zinc-950 text-zinc-100">
                  {statusFilter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 md:justify-end">
            <div className="text-xs text-zinc-400">
              {table.getFilteredRowModel().rows.length} result(s)
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-transparent text-zinc-100 hover:bg-white/5"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-transparent text-zinc-100 hover:bg-white/5"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-white/10 bg-zinc-950">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-white/10">
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="text-zinc-400">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-white/10 hover:bg-white/5">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-zinc-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-white/10">
                <TableCell colSpan={columns.length} className="py-10 text-center text-zinc-400">
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
