"use client";

import Link from "next/link";
import { Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GroupRow } from "../types";
import { GroupCard } from "./group-card";

export function GroupsCards({ data }: { data: GroupRow[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
          <Layers3 className="h-8 w-8 text-emerald-500" />
        </div>

        <h3 className="mt-6 text-lg font-semibold text-white">No groups yet</h3>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          Create your first training group to organize sessions and enrollments.
        </p>

        <Button asChild className="mt-6 bg-emerald-500 text-black hover:bg-emerald-600">
          <Link href="/dashboard/groups/new">New group</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {data.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}
