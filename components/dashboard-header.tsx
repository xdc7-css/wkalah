"use client";

import { useState } from "react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { DashboardMobileSidebar } from "@/components/dashboard-mobile-sidebar";
import { ThemeToggle } from "./theme-toggle";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { signOutAction } from "@/server/auth-actions";

export function DashboardHeader() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <header className="sticky top-3 z-30 mb-6 sm:top-4 lg:top-6">
        <div className="overflow-hidden rounded-[32px] sm:rounded-[40px] border border-border bg-card/80 shadow-xl backdrop-blur-3xl transition-all duration-500">
          <div className="flex flex-row items-center justify-between gap-4 px-4 py-3 sm:px-8 sm:py-6 lg:flex-row lg:items-center">
            <div className="flex min-w-0 items-center gap-3 sm:gap-6">
              <div className="lg:hidden">
                <DashboardMobileSidebar />
              </div>

              {/* Branding Icon */}
              <div className="flex h-12 w-12 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-[20px] sm:rounded-3xl border border-accent/20 bg-accent/10 shadow-lg ring-1 ring-border/5">
                <Image
                  src="/icons/items/wheat.png"
                  alt="branding"
                  width={80}
                  height={80}
                  className="h-7 w-7 sm:h-14 sm:w-14 object-contain brightness-110 grayscale-[0.2] transition-transform duration-500 hover:scale-110"
                />
              </div>

              <div className="min-w-0 space-y-0.5 sm:space-y-1">
                <h1 className="truncate text-base font-black tracking-tight text-foreground font-heading sm:text-2xl lg:text-3xl">
                  لوحة الإدارة
                </h1>
                <p className="line-clamp-1 text-[10px] font-medium text-muted-foreground sm:text-xs leading-relaxed max-w-[150px] sm:max-w-lg">
                  إدارة العوائل والمواد والتوزيع الشهري
                </p>
              </div>
            </div>

            {/* Actions Area */}
            <div className="flex items-center justify-end shrink-0 gap-3 sm:gap-4">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="group relative flex h-10 w-10 sm:h-12 sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-full sm:rounded-[18px] border border-border bg-secondary/40 transition-all duration-300 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400 sm:px-6"
              >
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent transition-opacity opacity-0 group-hover:opacity-100" />
                <LogOut className="h-4 w-4 transition-transform group-hover:rotate-12 group-hover:translate-x-0.5" />
                <span className="hidden sm:inline text-sm font-black uppercase tracking-wider">تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="تأكيد تسجيل الخروج"
        description="هل أنت متأكد أنك تريد تسجيل الخروج من النظام؟"
        confirmText="تسجيل الخروج"
        cancelText="إلغاء"
        variant="delete"
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={async () => {
          setShowLogoutConfirm(false);
          await signOutAction();
        }}
      />
    </>
  );
}
