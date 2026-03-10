import { Skeleton } from "@/components/ui/skeleton";

function DisciplineCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
      <Skeleton className="h-28 w-full bg-white/10" />
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-2/3 bg-white/10" />
          <Skeleton className="h-4 w-1/2 bg-white/10" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-20 rounded-md bg-white/10" />
          <Skeleton className="h-9 w-24 rounded-md bg-white/10" />
        </div>
      </div>
    </article>
  );
}

export function DisciplinesCardsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <DisciplineCardSkeleton key={i} />
        ))}
      </div>
      <div className="text-sm text-zinc-500">Loading disciplines...</div>
    </div>
  );
}
