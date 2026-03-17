"use client";

import Link from "next/link";
import { CalendarDays, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { minuteToTimeLabel } from "../mappers";
import type { GroupRow } from "../types";
import { useUpdateGroup } from "../hooks/use-update-group";

const weekDayLabel: Record<GroupRow["daysOfWeek"][number], string> = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUN: "Sun",
};

export function GroupCard({ group }: { group: GroupRow }) {
  const updateMutation = useUpdateGroup(group.id);
  const isInactive = group.status === "INACTIVE";

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-zinc-950",
        isInactive && "opacity-75"
      )}
    >
      <div className="relative h-32 w-full bg-zinc-900 p-4">
        <div className="absolute right-3 top-3">
          <Badge
            className={cn(
              "border border-white/10",
              isInactive ? "bg-zinc-500/20 text-zinc-200" : "bg-emerald-500/20 text-emerald-200"
            )}
            variant="secondary"
          >
            {group.status}
          </Badge>
        </div>

        <p className="text-xs uppercase tracking-wide text-zinc-400">{group.disciplineName}</p>
        <h3 className="mt-1 text-lg font-semibold text-zinc-100">
          {group.categoryName} · {group.gender}
        </h3>
        <p className="mt-1 text-sm text-zinc-400">{group.locationName}</p>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <CalendarDays className="h-4 w-4 text-zinc-400" />
          <span>
            {group.daysOfWeek.map((day) => weekDayLabel[day]).join(" · ")} |{" "}
            {minuteToTimeLabel(group.startMinute)} - {minuteToTimeLabel(group.endMinute)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-300">
          <Users className="h-4 w-4 text-zinc-400" />
          <span>Coach: {group.coachName ?? "Unassigned"}</span>
        </div>

        <p className="text-xs text-zinc-500">Sessions per week: {group.sessionsPerWeek}</p>

        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-white/15 bg-transparent text-zinc-100 hover:bg-white/10 hover:text-white"
          >
            <Link href={`/dashboard/groups/${group.id}/edit`}>Edit</Link>
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
