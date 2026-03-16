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
      <div className="mb-10 overflow-hidden rounded-[32px] border border-border bg-card shadow-xl ring-1 ring-border/5">
        <div className="flex items-center gap-4 p-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-accent/10 shadow-lg ring-1 ring-accent/20">
            <Image
              src="/icons/items/calculator.png"
              alt="logo"
              width={56}
              height={56}
              className="h-10 w-10 object-contain brightness-110 transition-transform duration-500 hover:rotate-12 dark:brightness-125"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-right text-base font-black leading-snug text-foreground font-heading">
              {APP_NAME}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">إدارة داخلية خاصة</p>
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
                "group flex items-center gap-3 rounded-[20px] px-5 py-3.5 text-sm font-bold transition-all duration-300",
                active
                  ? "bg-accent text-accent-foreground shadow-lg active:scale-95 shadow-accent/20"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <Icon className={cn(
                "size-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                active ? "text-accent-foreground" : "text-muted-foreground/60 group-hover:text-accent"
              )} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <div className="rounded-2xl border border-border bg-accent/10 p-4 ring-1 ring-accent/5">
          <p className="text-xs font-bold text-accent">النظام الموحد</p>
          <p className="mt-1 text-[10px] text-muted-foreground/50 leading-relaxed">
            تأكد من مراجعة التقارير الدورية لضمان دقة البيانات الموزعة.
          </p>
        </div>
      </div>
    </div>
  );
}