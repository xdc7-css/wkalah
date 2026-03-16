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
  ShieldCheck,
  Users,
  FileSpreadsheet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

const links: { href: Route; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "لوحة التحكم", icon: Home },
  { href: "/dashboard/families", label: "العوائل", icon: Users },
  { href: "/dashboard/items", label: "المواد", icon: Package },
  { href: "/dashboard/distribution", label: "التوزيع الشهري", icon: ClipboardList },
  { href: "/dashboard/reports", label: "التقارير", icon: FileSpreadsheet },
  { href: "/dashboard/backups", label: "النسخ الاحتياطي", icon: Boxes },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-4 lg:hidden">
        <div className="rounded-3xl border border-border p-3 bg-card shadow-sm">
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-secondary/50 p-3">
            <div className="rounded-2xl bg-primary/10 p-2">
              <Image src="/icon.png" alt="logo" width={48} height={48} />
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">{APP_NAME}</p>
              <p className="text-xs text-muted-foreground">إدارة داخلية خاصة</p>
            </div>
          </div>

          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {links.map((link) => {
              const Icon = link.icon;
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex min-h-16 flex-col items-center justify-center gap-2 rounded-2xl px-3 py-3 text-center text-xs font-medium transition",
                    active
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                      : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="leading-5">{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 flex-col rounded-3xl border border-border p-4 bg-card shadow-sm lg:flex">
        <div className="mb-8 flex items-center gap-3 rounded-2xl bg-secondary/50 p-4">
          <div className="rounded-2xl bg-primary/10 p-2">
            <Image src="/icon.png" alt="logo" width={64} height={64} />
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{APP_NAME}</p>
            <p className="text-xs text-muted-foreground">إدارة داخلية خاصة</p>
          </div>
        </div>

        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                  active
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                    : "hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}