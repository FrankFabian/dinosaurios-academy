"use client";

import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DisciplineRow } from "../types";
import { DisciplineCard } from "./discipline-card";

export function DisciplinesCards({ data }: { data: DisciplineRow[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <Dumbbell className="h-8 w-8 text-emerald-500" />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-white">No disciplines yet</h3>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          Create your first discipline to organize groups and coaching assignments.
        </p>

        <Button asChild className="mt-6 bg-emerald-500 text-black hover:bg-emerald-600">
          <Link href="/dashboard/disciplines/new">New discipline</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((discipline) => (
        <DisciplineCard key={discipline.id} discipline={discipline} />
      ))}
    </div>
  );
}
