import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-48 rounded-2xl bg-white/10" />
        <Skeleton className="h-11 w-32 rounded-2xl bg-white/10" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-[30px] bg-white/10" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="lg:col-span-2 h-[400px] rounded-[30px] bg-white/10" />
        <Skeleton className="h-[400px] rounded-[30px] bg-white/10" />
      </div>
    </div>
  );
}
