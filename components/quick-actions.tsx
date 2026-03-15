"use client";

import Link from "next/link";
import { 
  UserPlus, 
  PackagePlus, 
  HandHelping, 
  FileBarChart,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const actions = [
  {
    title: "إضافة عائلة",
    description: "تسجيل عائلة جديدة في النظام",
    href: "/dashboard/families/new",
    icon: UserPlus,
    color: "from-blue-600/20 to-blue-600/5 text-blue-400 ring-blue-500/30",
    iconColor: "text-blue-400"
  },
  {
    title: "إضافة مادة",
    description: "إضافة مادة تموينية جديدة",
    href: "/dashboard/items",
    icon: PackagePlus,
    color: "from-violet-600/20 to-violet-600/5 text-violet-400 ring-violet-500/30",
    iconColor: "text-violet-400"
  },
  {
    title: "توزيع سريع",
    description: "تسجيل توزيع لعائلة عبر الكود",
    href: "/dashboard/quick-dist",
    icon: HandHelping,
    color: "from-emerald-600/20 to-emerald-600/5 text-emerald-400 ring-emerald-500/30",
    iconColor: "text-emerald-400"
  },
  {
    title: "تصدير تقرير",
    description: "تنزيل تقارير التوزيع الشهرية",
    href: "/dashboard/reports",
    icon: FileBarChart,
    color: "from-amber-600/20 to-amber-600/5 text-amber-400 ring-amber-500/30",
    iconColor: "text-amber-400"
  }
];

export function QuickActions() {
  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {actions.map((action) => (
        <Link key={action.href} href={action.href as any} className="group">
          <Card className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12] hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)] sm:rounded-[30px]">
            <CardContent className="flex flex-col p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ring-1 transition-transform duration-500 group-hover:scale-110 sm:h-12 sm:w-12 sm:rounded-2xl",
                  action.color
                )}>
                  <action.icon className="size-5 sm:size-6" />
                </div>
                <ArrowLeft className="size-4 opacity-40 transition-transform group-hover:-translate-x-1 group-hover:opacity-100 text-slate-400 sm:size-5" />
              </div>
              
              <div className="mt-3 sm:mt-4">
                <h3 className="text-sm font-black text-white sm:text-base">{action.title}</h3>
                <p className="mt-0.5 text-[10px] font-medium text-slate-400 line-clamp-1 sm:text-xs">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  );
}
