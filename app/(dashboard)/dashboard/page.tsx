import { ClipboardCheck, Hourglass, Users } from "lucide-react";
import { getDashboardStats } from "@/lib/db";
import { formatNumber, monthOptions } from "@/lib/utils";
import { StatCard } from "@/components/stat-card";
import { MonthlyDistributionPieChart } from "@/components/monthly-distribution-pie-chart";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const chartData =
    stats.totalsByItem?.map((item: any) => ({
      name: item.item_name_snapshot,
      value: Number(item.delivered_total ?? 0),
    })) ?? [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="إجمالي العوائل"
          value={formatNumber(stats.totalFamilies)}
          description="عدد العوائل الفعالة"
          icon={<Users className="size-6" />}
        />
        <StatCard
          title="إجمالي الأفراد"
          value={formatNumber(stats.totalMembers)}
          description="مجموع الأفراد الحالي"
          icon={<Users className="size-6" />}
        />
        <StatCard
          title="العوائل المستلمة"
          value={formatNumber(stats.deliveredFamilies)}
          description={`خلال ${monthOptions[stats.month - 1]} ${stats.year}`}
          icon={<ClipboardCheck className="size-6" />}
        />
        <StatCard
          title="العوائل المعلّقة"
          value={formatNumber(stats.pendingFamilies)}
          description="لم تستلم بعد هذا الشهر"
          icon={<Hourglass className="size-6" />}
        />
      </div>


      <section className="rounded-[28px] border border-slate-200/70 bg-white/85 shadow-sm">
        <div className="p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                المواد الموزعة هذا الشهر
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {monthOptions[stats.month - 1]} {stats.year}
              </p>
            </div>

            <p className="text-sm text-slate-500">
              مرّر الماوس على أي مادة حتى تظهر النسبة والتفاصيل
            </p>
          </div>

         <div className="w-full min-w-0">
  <MonthlyDistributionPieChart data={chartData} />
</div>
        </div>
      </section>
    </div>
  );
}