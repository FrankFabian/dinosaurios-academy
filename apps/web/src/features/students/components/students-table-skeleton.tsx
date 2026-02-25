import { Skeleton } from "@/components/ui/skeleton";

export function StudentsTableSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40 bg-white/10" />
          <Skeleton className="h-4 w-80 bg-white/10" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md bg-white/10" />
      </div>

      {/* Controls skeleton */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-full sm:w-85 bg-white/10" />
          <Skeleton className="h-10 w-full sm:w-45 bg-white/10" />
        </div>

        <div className="flex items-center justify-between gap-2 md:justify-end">
          <Skeleton className="h-4 w-20 bg-white/10" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-16 bg-white/10" />
            <Skeleton className="h-9 w-16 bg-white/10" />
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-white/10 bg-zinc-950">
        <div className="p-4">
          {/* Header row */}
          <div className="grid grid-cols-6 gap-4 pb-4">
            <Skeleton className="h-4 w-28 bg-white/10" />
            <Skeleton className="h-4 w-20 bg-white/10" />
            <Skeleton className="h-4 w-20 bg-white/10" />
            <Skeleton className="h-4 w-20 bg-white/10" />
            <Skeleton className="h-4 w-20 bg-white/10" />
            <Skeleton className="h-4 w-20 bg-white/10" />
          </div>

          {/* Body rows */}
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="grid grid-cols-7 items-center gap-4">
                
                {/* Avatar + Name */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
                  <Skeleton className="h-4 w-32 bg-white/10" />
                </div>

                {/* Category */}
                <Skeleton className="h-4 w-16 bg-white/10" />

                {/* Status badge */}
                <Skeleton className="h-6 w-20 rounded-full bg-white/10" />

                {/* Phone */}
                <Skeleton className="h-4 w-24 bg-white/10" />

                {/* Email */}
                <Skeleton className="h-4 w-44 bg-white/10" />

                {/* Updated */}
                <Skeleton className="h-4 w-20 bg-white/10" />

                {/* Actions */}
                <Skeleton className="h-8 w-16 bg-white/10 justify-self-end" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
