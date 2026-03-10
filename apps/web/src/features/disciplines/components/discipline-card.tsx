"use client";

import Link from "next/link";
import { Dumbbell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUpdateDiscipline } from "../hooks/use-update-discipline";
import type { DisciplineRow } from "../types";

export function DisciplineCard({ discipline }: { discipline: DisciplineRow }) {
  const updateMutation = useUpdateDiscipline(discipline.id);
  const isInactive = discipline.status === "INACTIVE";

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-zinc-950",
        isInactive && "opacity-75"
      )}
    >
      <div className="relative h-28 w-full bg-zinc-900">
        <div className="flex h-full w-full items-center justify-center gap-2 text-zinc-200">
          {discipline.icon?.trim() ? (
            <span className="text-3xl" aria-hidden>
              {discipline.icon?.trim() || "🏀"}
            </span>
          ) : (
            <Dumbbell className="h-5 w-5 text-zinc-400" />
          )}
        </div>

        <div className="absolute right-3 top-3">
          <Badge
            className={cn(
              "border border-white/10",
              isInactive ? "bg-zinc-500/20 text-zinc-200" : "bg-emerald-500/20 text-emerald-200"
            )}
            variant="secondary"
          >
            {discipline.status}
          </Badge>
        </div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-100">{discipline.name}</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Icon: {discipline.icon?.trim() || "Default"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-white/15 bg-transparent text-zinc-100 hover:bg-white/10 hover:text-white"
          >
            <Link href={`/dashboard/disciplines/${discipline.id}/edit`}>Edit</Link>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            disabled={isInactive || updateMutation.isPending}
            onClick={() => updateMutation.mutate({ status: "INACTIVE" })}
          >
            {updateMutation.isPending ? "..." : "Deactivate"}
          </Button>
        </div>
      </div>
    </article>
  );
}
