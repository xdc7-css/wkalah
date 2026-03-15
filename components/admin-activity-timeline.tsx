"use client";

import { CheckCircle2, Package, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toArabicDigits } from "@/lib/utils";

type Activity = {
  id: string;
  family_name: string;
  item_count: number;
  delivered_at: string;
};

export function AdminActivityTimeline({ activities }: { activities: Activity[] }) {
  return (
    <Card className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur-xl">
      <CardHeader className="border-b border-white/5 bg-white/5 pb-5">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/30 shadow-lg">
            <Clock className="size-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-extrabold text-white">آخر النشاطات</CardTitle>
            <CardDescription className="text-slate-400">سجل عمليات التوزيع الأخيرة في النظام</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p className="text-sm">لا توجد سجلات توزيع حديثة</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="group flex items-center gap-4 p-4 transition-colors hover:bg-white/5">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-lg ring-1 ring-emerald-500/30">
                  <CheckCircle2 className="size-5" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="truncate text-sm font-bold text-slate-100">{activity.family_name}</p>
                    <time className="shrink-0 text-[10px] font-bold text-slate-500 uppercase">
                      {toArabicDigits(new Date(activity.delivered_at).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }))}
                    </time>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 font-bold text-slate-300 ring-1 ring-white/5">
                      <Package className="size-3" />
                      {toArabicDigits(activity.item_count)} مواد
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-700" />
                    <span className="text-[11px] font-medium text-slate-500">
                      تم تسجيل التوزيع بنجاح
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
