import { Skeleton } from "@/components/ui/skeleton";

export function GroupFormSkeleton() {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-950 p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-28 bg-white/10" />
            <Skeleton className="h-10 w-full bg-white/10" />
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        <Skeleton className="h-4 w-24 bg-white/10" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-md bg-white/10" />
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <Skeleton className="h-9 w-32 bg-white/10" />
      </div>
    </div>
  );
}
