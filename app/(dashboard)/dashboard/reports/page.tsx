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
import { ExportFamilyReportButton } from "@/components/export-family-report-button";
import { getItemIcon } from "@/lib/item-icons";

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
      <Card className="overflow-hidden rounded-[30px] border border-white/60 bg-white/80 shadow-sm backdrop-blur">
        <CardHeader className="border-b border-slate-100/80 bg-gradient-to-l from-violet-50/70 via-white to-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                التقارير الشهرية
              </div>

              <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
                التقارير
              </CardTitle>

              <CardDescription className="text-sm leading-6 text-slate-500">
                ملخص التوزيع الشهري والتقارير التفصيلية للعوائل لشهر{" "}
                <span className="font-medium text-slate-700">
                  {monthOptions[month - 1]} {year}
                </span>
              </CardDescription>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-fit">
                <ReportExportButtons month={month} year={year} />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-4 sm:p-5 lg:p-6">
          {/* Overview */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-medium text-slate-500">
                العوائل المستلمة
              </p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                {formatNumber(totalFamilies)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                عدد العوائل ضمن التقرير الحالي
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-medium text-slate-500">
                إجمالي السجلات الموزعة
              </p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                {formatNumber(totalDeliveredItems)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                مجموع أسطر المواد داخل التقارير
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-medium text-slate-500">
                إجمالي الكميات الموزعة
              </p>
              <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                {formatNumber(totalDeliveredQuantity)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                مجموع الكميات لجميع المواد
              </p>
            </div>

            <div className="rounded-[24px] border border-violet-200/70 bg-gradient-to-br from-violet-50 to-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-xs font-medium text-slate-500">
                أعلى مادة توزيعًا
              </p>
              <p className="mt-2 truncate text-lg font-extrabold tracking-tight text-slate-900">
                {topItem ? topItem[0] : "—"}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {topItem
                  ? `${formatNumber(topItem[1].total)} ${topItem[1].unit}`
                  : "لا توجد بيانات حالية"}
              </p>
            </div>
          </div>

          {/* Material Summary */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                ملخص المواد
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                إجمالي الكميات المعتمدة لكل مادة ضمن الشهر المحدد.
              </p>
            </div>

            {sortedTotals.length === 0 ? (
              <div className="flex min-h-[180px] items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    لا توجد بيانات مواد لهذا الشهر
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    عند توفر سجلات توزيع ستظهر هنا ملخصات المواد.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {sortedTotals.map(([name, value]) => (
                  <div
                    key={name}
                    className="group rounded-[24px] border border-slate-200/70 bg-white/85 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 shadow-sm">
                          <Image
                            src={getItemIcon(name)}
                            alt={name}
                            width={26}
                            height={26}
                            className="object-contain"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {value.unit}
                          </p>
                        </div>
                      </div>

                      <div className="h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_16px_rgba(167,139,250,0.65)]" />
                    </div>

                    <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
                      {formatNumber(value.total)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Family Reports */}
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                تقارير العوائل
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                عرض تفصيلي لكل عائلة مع إمكانية تصدير تقرير مستقل.
              </p>
            </div>

            {report.length === 0 ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center">
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    لا توجد تقارير متاحة
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    لم يتم العثور على بيانات توزيع للشهر المحدد.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {report.map((row: any, index: number) => (
                  <Card
                    key={row.id}
                    className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/85 shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <CardContent className="p-0">
                      <div className="border-b border-slate-100 bg-gradient-to-l from-slate-50/80 to-white px-4 py-4 sm:px-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-violet-100 px-2 text-xs font-bold text-violet-700">
                                {index + 1}
                              </span>
                              <p className="truncate text-lg font-bold text-slate-900">
                                {row.families.family_name}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 sm:text-sm">
                              <span>الكود: {row.families.family_code}</span>
                              <span>
                                أفراد وقت التسليم: {row.members_count_at_delivery}
                              </span>
                              <span>المنطقة: {row.families.area ?? "-"}</span>
                            </div>
                          </div>

                          <div className="w-full lg:w-auto">
                            <ExportFamilyReportButton familyId={row.family_id} />
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          {row.monthly_distribution_items.map((item: any) => (
                            <div
                              key={item.id}
                              className="rounded-[22px] border border-slate-200/60 bg-slate-50/70 p-3 transition-all duration-300 hover:border-violet-200 hover:bg-violet-50/40"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 shadow-sm">
                                    <Image
                                      src={getItemIcon(item.item_name_snapshot)}
                                      alt={item.item_name_snapshot}
                                      width={24}
                                      height={24}
                                      className="object-contain"
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <p className="truncate font-medium text-slate-900">
                                      {item.item_name_snapshot}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                      {item.unit_snapshot}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <p className="mt-3 text-lg font-bold tracking-tight text-slate-900">
                                {formatNumber(item.delivered_quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}