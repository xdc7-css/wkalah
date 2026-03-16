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
    <Card className="shadow-2xl">
      <CardHeader className="border-b border-border bg-secondary/30 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-accent/10 text-accent ring-1 ring-accent/20 shadow-lg">
            <Clock className="size-6" />
          </div>
          <div>
            <CardTitle className="text-lg">آخر النشاطات</CardTitle>
            <CardDescription className="text-muted-foreground mt-0.5">سجل عمليات التوزيع الأخيرة في النظام</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground/60">
              <p className="text-sm">لا توجد سجلات توزيع حديثة</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="group flex items-center gap-4 p-4 transition-colors hover:bg-secondary/40">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-lg ring-1 ring-emerald-500/30">
                  <CheckCircle2 className="size-5" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="truncate text-sm font-bold text-foreground">{activity.family_name}</p>
                    <time className="shrink-0 text-[10px] font-bold text-muted-foreground uppercase">
                      {toArabicDigits(new Date(activity.delivered_at).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' }))}
                    </time>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-secondary/80 px-2.5 py-1 font-bold text-foreground ring-1 ring-border">
                      <Package className="size-3" />
                      {toArabicDigits(activity.item_count)} مواد
                    </span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span className="text-[11px] font-medium text-muted-foreground/60">
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
