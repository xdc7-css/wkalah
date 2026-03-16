import Image from "next/image";
import { getCurrentMonthYear, monthOptions, formatNumber } from "@/lib/utils";
import { getMonthlyReport } from "@/lib/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ReportExportButtons } from "@/components/report-export-buttons";
import { ClipboardList, PieChart, Users as UsersIcon, Package2 } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { DetailedReportsClient } from "@/components/detailed-reports-client";
import { ItemIcon } from "@/components/item-icon";

function normalizeItemName(name: string) {
  return name.trim().toLowerCase();
}

function isFlourItem(name: string) {
  const n = normalizeItemName(name);
  return n.includes("طحين") || n.includes("flour") || n.includes("wheat");
}

function MaterialIcon({ name }: { name: string }) {
  if (isFlourItem(name)) {
    return (
      <Image
        src="/icons/items/wheat.webp"
        alt={name}
        width={28}
        height={28}
        className="h-7 w-7 object-contain"
      />
    );
  }

  return <ItemIcon name={name} size={28} />;
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const current = getCurrentMonthYear();
  const params = await searchParams;
  const month = Number(params.month ?? current.month);
  const year = Number(params.year ?? current.year);
  const report = await getMonthlyReport(month, year);

  const totals = new Map<string, { unit: string; total: number }>();
  let totalFamilies = 0;
  let totalDeliveredItems = 0;
  let totalDeliveredQuantity = 0;

  for (const record of report as any[]) {
    totalFamilies += 1;

    for (const item of record.monthly_distribution_items) {
      const quantity = Number(item.delivered_quantity ?? 0);
      totalDeliveredItems += 1;
      totalDeliveredQuantity += quantity;

      const existing = totals.get(item.item_name_snapshot) ?? {
        unit: item.unit_snapshot,
        total: 0,
      };

      existing.total += quantity;
      totals.set(item.item_name_snapshot, existing);
    }
  }

  const sortedTotals = [...totals.entries()].sort(
    (a, b) => b[1].total - a[1].total
  );

  const topItem = sortedTotals[0];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-border bg-secondary/30 px-6 pb-10 pt-12 sm:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-violet-500 dark:text-violet-400">
                التقارير الشهرية
              </div>

              <div className="space-y-2">
                <CardTitle className="text-2xl text-foreground sm:text-3xl lg:text-4xl">
                  تقارير التوزيع
                </CardTitle>

                <CardDescription className="max-w-2xl text-sm text-muted-foreground md:text-base">
                  ملخص التوزيع والتقارير التفصيلية لشهر{" "}
                  <span className="font-bold text-foreground">
                    {monthOptions[month - 1]} {year}
                  </span>
                </CardDescription>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <ReportExportButtons month={month} year={year} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatsCard
              title="العوائل المستلمة"
              value={formatNumber(totalFamilies)}
              icon={<UsersIcon className="size-6" />}
            />

            <StatsCard
              title="إجمالي السجلات"
              value={formatNumber(totalDeliveredItems)}
              icon={<ClipboardList className="size-6" />}
            />

            <StatsCard
              title="إجمالي الكميات"
              value={formatNumber(totalDeliveredQuantity)}
              icon={<Package2 className="size-6" />}
            />

            <StatsCard
              title="أعلى مادة توزيعًا"
              value={topItem ? topItem[0] : "—"}
              description={
                topItem
                  ? `${formatNumber(topItem[1].total)} ${topItem[1].unit}`
                  : "لا توجد بيانات"
              }
              icon={<PieChart className="size-6" />}
              className="ring-1 ring-violet-500/30 bg-gradient-to-br from-violet-500/20 to-violet-500/5"
            />
          </div>

          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4 border-t border-border pt-8">
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  ملخص المواد
                </h2>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  إجمالي الكميات المعتمدة لكل مادة لهذا الشهر.
                </p>
              </div>
            </div>

            {sortedTotals.length === 0 ? (
              <div className="flex min-h-[160px] items-center justify-center rounded-[32px] border border-dashed border-border bg-card/60 p-6 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  لا توجد بيانات مواد لهذا الشهر
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {sortedTotals.map(([name, value]) => (
                  <div
                    key={name}
                    className="group rounded-[32px] border border-border bg-secondary/30 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-secondary/50 hover:shadow-xl sm:p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background/60 ring-1 ring-border shadow-sm transition-transform group-hover:scale-110">
                        <MaterialIcon name={name} />
                      </div>

                      <div className="min-w-0">
                        <p className="font-heading truncate text-sm font-bold text-foreground">
                          {name}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                          {value.unit}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-2xl font-black tracking-tight text-foreground">
                        {formatNumber(value.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="border-t border-border pt-8">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                تقارير العوائل التفصيلية
              </h2>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                سجلات التوزيع الموثقة حسب كل عائلة.
              </p>
            </div>

            {report.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center rounded-[32px] border border-dashed border-border bg-card/60 p-6 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  لا توجد تقارير متاحة
                </p>
              </div>
            ) : (
              <DetailedReportsClient data={report as any} />
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}