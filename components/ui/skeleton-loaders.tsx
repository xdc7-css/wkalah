import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StatsCardSkeleton() {
  return (
    <Card className="overflow-hidden rounded-[30px] border border-border bg-card shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 bg-secondary/80" />
            <Skeleton className="h-8 w-16 bg-secondary/80" />
          </div>
          <Skeleton className="size-12 rounded-2xl bg-secondary/80" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ItemsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <Card className="overflow-hidden rounded-[32px] border border-border bg-card shadow-sm">
        <CardHeader className="border-b border-border pb-5">
          <Skeleton className="h-8 w-32 bg-secondary/80" />
          <Skeleton className="mt-1 h-4 w-64 bg-secondary/80" />
        </CardHeader>
        <CardContent className="p-4 md:p-6 lg:p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-2xl bg-secondary/80" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
