import { ClipboardCheck, Hourglass, Users, Package } from "lucide-react";
import { getDashboardStats, getRecentDistributions } from "@/lib/db";
import { formatNumber, monthOptions, toArabicDigits } from "@/lib/utils";
import { StatsCard } from "@/components/ui/stats-card";
import { MonthlyDistributionPieChart } from "@/components/monthly-distribution-pie-chart";
import { QuickActions } from "@/components/quick-actions";
import { AdminActivityTimeline } from "@/components/admin-activity-timeline";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
export default async function DashboardPage() {
  const [stats, activities] = await Promise.all([
    getDashboardStats(),
    getRecentDistributions(10)
  ]);

  const chartData =
    stats.totalsByItem?.map((item: any) => ({
      name: item.item_name_snapshot,
      value: Number(item.delivered_total ?? 0),
    })) ?? [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Quick Actions at the top */}
      <QuickActions />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatsCard
          title="إجمالي العوائل"
          value={formatNumber(stats.totalFamilies)}
          description="عدد العوائل الفعالة"
          icon={<Users className="size-6" />}
        />
        <StatsCard
          title="إجمالي الأفراد"
          value={formatNumber(stats.totalMembers)}
          description="مجموع الأفراد الحالي"
          icon={<Users className="size-6" />}
        />
        <StatsCard
          title="العوائل المستلمة"
          value={stats.deliveredFamilies}
          description={`خلال ${monthOptions[stats.month - 1]} ${stats.year}`}
          icon={<ClipboardCheck className="size-6" />}
          iconClassName="from-emerald-600/20 to-emerald-600/5 text-emerald-400 ring-emerald-500/30"
          className="hover:bg-emerald-500/5 hover:border-emerald-500/20"
        />
        <StatsCard
          title="العوائل المعلّقة"
          value={stats.pendingFamilies}
          description="لم تستلم بعد هذا الشهر"
          icon={<Hourglass className="size-6" />}
          iconClassName="from-amber-600/20 to-amber-600/5 text-amber-400 ring-amber-500/30"
          className="hover:bg-amber-500/5 hover:border-amber-500/20"
          valueClassName="text-amber-400"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main Chart */}
        <div className="xl:col-span-2">
          <Card className="h-full overflow-hidden rounded-[30px] border border-white/10 bg-[#0F1B33] shadow-2xl transition-all duration-300">
            <CardHeader className="border-b border-white/5 bg-white/5 pb-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-white font-heading">
                    المواد الموزعة هذا الشهر
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm font-medium text-slate-400">
                    {monthOptions[stats.month - 1]} {stats.year}
                  </CardDescription>
                </div>

                <p className="text-xs font-medium text-slate-400 sm:text-sm">
                  مرّر الماوس على أي مادة للتفاصيل
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="w-full min-w-0">
                <MonthlyDistributionPieChart data={chartData} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Insights & Timeline */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1">
             <StatsCard
              title="إجمالي المواد"
              value={stats.totalItemsCount}
              description="عدد المواد المسجلة"
              icon={<Package className="size-6" />}
            />
            <StatsCard
              title="المواد الفعالة"
              value={stats.activeItemsCount}
              description="المواد المتاحة للتوزيع"
              icon={<ClipboardCheck className="size-6" />}
              iconClassName="from-emerald-600/20 to-emerald-600/5 text-emerald-400 ring-emerald-500/30"
              valueClassName="text-emerald-400"
            />
          </div>

          <AdminActivityTimeline activities={activities} />
        </div>
      </div>
    </div>
  );
}