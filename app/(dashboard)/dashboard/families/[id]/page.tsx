import Link from "next/link";
import { ArrowRight, Download, Package2, Phone, Users } from "lucide-react";
import { getFamilyById, getFamilyHistory } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FamilyForm } from "@/components/family-form";
import { EmptyState } from "@/components/empty-state";
import { formatNumber, monthOptions } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function FamilyProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const family = await getFamilyById(id);
  const history = await getFamilyHistory(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/dashboard/families"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
        >
          <ArrowRight className="h-4 w-4" />
          رجوع إلى العوائل
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_minmax(480px,520px)] lg:grid-cols-[1fr_450px]">
        <Card className="hidden lg:block border-white/10 bg-white/[0.04] shadow-sm overflow-hidden rounded-[32px]">
           <CardHeader className="border-b border-white/5 bg-white/5 pb-5">
              <CardTitle className="text-xl font-bold text-white">معاينة البيانات</CardTitle>
              <CardDescription>عرض سريع لبيانات العائلة الحالية</CardDescription>
           </CardHeader>
           <CardContent className="p-6">
              {/* Content moved from the other card or simplified for preview */}
              <div className="space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 text-violet-400">
                         <Users className="size-8" />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-white">{family.family_name}</h3>
                         <p className="text-sm text-slate-400">{family.family_code}</p>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                         <p className="text-xs text-slate-500 font-bold uppercase mb-1">الأفراد</p>
                         <p className="text-2xl font-black text-white">{family.members_count}</p>
                      </div>
                      <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                         <p className="text-xs text-slate-500 font-bold uppercase mb-1">المنطقة</p>
                         <p className="text-base font-bold text-white truncate">{family.area ?? "-"}</p>
                      </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                      <p className="text-xs text-slate-500 font-bold uppercase mb-2">الملاحظات</p>
                      <p className="text-sm text-slate-300 leading-relaxed">{family.notes || "لا توجد ملاحظات مسجلة."}</p>
                  </div>
              </div>
           </CardContent>
        </Card>

        <FamilyForm family={family} />
      </div>

      <Card className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0F1B33]/60 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-3xl">
        <CardHeader className="border-b border-white/5 bg-white/5 pb-6 pt-8 px-6 sm:px-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-black text-white font-heading">سجل التسليم الشهري</CardTitle>
              <CardDescription className="text-sm text-slate-400">
                جميع السجلات محفوظة كسجل تاريخي ثابت ويمكن الرجوع إليها لاحقاً
              </CardDescription>
            </div>
            
            <Link
              href={`/api/export/family/${id}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95"
            >
              <Download className="size-4" />
              تصدير التقرير
            </Link>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-6 sm:p-10">
          {history.length === 0 ? (
            <EmptyState
              title="لا يوجد سجل تسليم"
              description="لم يتم تسجيل أي تسليم لهذه العائلة بعد"
            />
          ) : (
            history.map((record: any) => (
              <div
                key={record.id}
                className="overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] p-5 shadow-sm transition-all hover:bg-white/[0.05]"
              >
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <p className="text-lg font-black text-white font-heading">
                      {monthOptions[record.month - 1]} {record.year}
                    </p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      عدد الأفراد وقت التسليم: <span className="text-slate-300">{record.members_count_at_delivery}</span>
                    </p>
                  </div>

                  <Badge className="rounded-xl border-none bg-violet-500/20 text-violet-400 px-3 py-1 font-black text-[10px]">
                    {record.monthly_distribution_items.length} مواد
                  </Badge>
                </div>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {record.monthly_distribution_items.map((item: any) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/5 bg-white/[0.04] p-4 transition hover:bg-white/10"
                    >
                      <p className="mb-3 text-[15px] font-black text-white font-heading truncate">
                        {item.item_name_snapshot}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                           <span className="text-slate-500">المسلّم:</span>
                           <span className="text-emerald-400">
                             {formatNumber(item.delivered_quantity)} {item.unit_snapshot}
                           </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-bold">
                           <span className="text-slate-500">المحسوب:</span>
                           <span className="text-slate-300">
                             {formatNumber(item.calculated_quantity)} {item.unit_snapshot}
                           </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}