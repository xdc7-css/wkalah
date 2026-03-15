"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";

import {
  Boxes,
  ClipboardList,
  Home,
  Package,
  Users,
  FileSpreadsheet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

const links: { href: Route; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "لوحة التحكم", icon: Home },
  { href: "/dashboard/families", label: "العوائل", icon: Users },
  { href: "/dashboard/items", label: "المواد", icon: Package },
  {
    href: "/dashboard/distribution",
    label: "التوزيع الشهري",
    icon: ClipboardList,
  },
  { href: "/dashboard/reports", label: "التقارير", icon: FileSpreadsheet },
  { href: "/dashboard/backups", label: "النسخ الاحتياطي", icon: Boxes },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col p-5">
      <div className="mb-10 overflow-hidden rounded-[32px] border border-white/10 bg-[#0F1B33]/60 p-4 shadow-xl ring-1 ring-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/10 shadow-lg ring-1 ring-violet-400/20">
            <Image
              src="/icons/items/calculator.png"
              alt="logo"
              width={56}
              height={56}
              className="h-10 w-10 object-contain brightness-110 transition-transform duration-500 hover:rotate-12"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-right text-[15px] font-black leading-snug text-[#F8FAFC] font-heading">
              {APP_NAME}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">إدارة داخلية خاصة</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
                active
                  ? "bg-gradient-to-r from-violet-600 to-indigo-500 text-white shadow-[0_8px_20px_rgba(124,58,237,0.3)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn(
                "size-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                active ? "text-white" : "text-slate-500 group-hover:text-violet-400"
              )} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <div className="rounded-2xl bg-gradient-to-br from-violet-600/10 to-indigo-500/5 p-4 ring-1 ring-white/5">
          <p className="text-xs font-bold text-violet-400">النظام الموحد</p>
          <p className="mt-1 text-[10px] text-slate-500 leading-relaxed">
            تأكد من مراجعة التقارير الدورية لضمان دقة البيانات الموزعة.
          </p>
        </div>
      </div>
    </div>
  );
}