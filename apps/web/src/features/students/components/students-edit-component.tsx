import { Skeleton } from "@/components/ui/skeleton";

export function StudentsEditSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-44 bg-white/10" />
          <Skeleton className="h-4 w-72 bg-white/10" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-9 w-28 rounded-md bg-white/10" />
          <Skeleton className="h-9 w-28 rounded-md bg-white/10" />
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-white/10 bg-zinc-950 p-5">
        <div className="grid gap-5 md:grid-cols-[1fr_260px]">
          {/* Left side (inputs) */}
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
            </div>
          </div>

          {/* Right side (photo/preview placeholder) */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-16 bg-white/10" />
            <div className="rounded-xl border border-white/10 bg-black p-4">
              <Skeleton className="mx-auto h-40 w-40 rounded-xl bg-white/10" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-9 w-full rounded-md bg-white/10" />
                <Skeleton className="h-9 w-full rounded-md bg-white/10" />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <Skeleton className="h-4 w-24 bg-white/10" />
              <Skeleton className="mt-2 h-9 w-full bg-white/10" />
              <Skeleton className="mt-3 h-4 w-24 bg-white/10" />
              <Skeleton className="mt-2 h-9 w-full bg-white/10" />
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Skeleton className="h-9 w-full sm:w-28 bg-white/10" />
          <Skeleton className="h-9 w-full sm:w-36 bg-white/10" />
        </div>
      </div>
    </div>
  );
}