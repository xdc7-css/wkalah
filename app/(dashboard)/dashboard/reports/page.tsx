import { getCurrentMonthYear, monthOptions, formatNumber, toArabicDigits } from "@/lib/utils";
import { getMonthlyReport } from "@/lib/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ReportExportButtons } from "@/components/report-export-buttons";
import { ExportFamilyReportButton } from "@/components/export-family-report-button";
import { ItemIcon } from "@/components/item-icon";
import { ClipboardList, PieChart, Users as UsersIcon, Package2 } from "lucide-react";
import { StatsCard } from "@/components/ui/stats-card";
import { DetailedReportsClient } from "@/components/detailed-reports-client";

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
      <Card className="overflow-hidden rounded-[40px] border border-white/10 bg-[#0F1B33] shadow-2xl">
        <CardHeader className="border-b border-white/5 bg-[#13213D]/50 pb-8 pt-10 px-6 sm:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-bold text-violet-400">
                التقارير الشهرية
              </div>

              <CardTitle className="text-2xl font-black text-[#F8FAFC] font-heading sm:text-3xl">
                تقارير التوزيع
              </CardTitle>

              <CardDescription className="text-sm font-medium leading-relaxed text-[#94A3B8] md:text-base">
                ملخص التوزيع والتقارير التفصيلية لشهر{" "}
                <span className="font-bold text-[#F8FAFC]">
                  {monthOptions[month - 1]} {year}
                </span>
              </CardDescription>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <ReportExportButtons month={month} year={year} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-4 sm:p-6 lg:p-8">
          {/* Overview Stats */}
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
              description={topItem ? `${formatNumber(topItem[1].total)} ${topItem[1].unit}` : "لا توجد بيانات"}
              icon={<PieChart className="size-6" />}
              className="bg-gradient-to-br from-violet-600/30 to-violet-600/10 ring-1 ring-violet-500/30"
            />
          </div>

          {/* Material Summary */}
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-8">
              <div>
                <h2 className="text-2xl font-bold text-[#F8FAFC] font-heading">
                  ملخص المواد
                </h2>
                <p className="mt-1 text-sm font-medium text-[#94A3B8]">
                  إجمالي الكميات المعتمدة لكل مادة لهذا الشهر.
                </p>
              </div>
            </div>

            {sortedTotals.length === 0 ? (
              <div className="flex min-h-[160px] items-center justify-center rounded-[32px] border border-dashed border-white/10 bg-white/5 p-6 text-center">
                <p className="text-sm font-medium text-[#94A3B8]">لا توجد بيانات مواد لهذا الشهر</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {sortedTotals.map(([name, value]) => (
                  <div
                    key={name}
                    className="group rounded-[24px] border border-white/10 bg-[#13213D] p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#182742] hover:shadow-xl sm:rounded-[30px] sm:p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-sm transition-transform group-hover:scale-110">
                        <ItemIcon name={name} size={28} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#F8FAFC] font-heading">
                          {name}
                        </p>
                        <p className="mt-0.5 text-xs font-medium text-[#94A3B8]">
                          {value.unit}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#F8FAFC] tracking-tight">
                        {formatNumber(value.total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Family Reports */}
          <section className="space-y-6">
            <div className="border-t border-white/5 pt-8">
              <h2 className="text-2xl font-bold text-[#F8FAFC] font-heading">
                تقارير العوائل التفصيلية
              </h2>
              <p className="mt-1 text-sm font-medium text-[#94A3B8]">
                سجلات التوزيع الموثقة حسب كل عائلة.
              </p>
            </div>

            {report.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center rounded-[32px] border border-dashed border-white/10 bg-white/5 p-6 text-center">
                <p className="text-sm font-medium text-slate-500">لا توجد تقارير متاحة</p>
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