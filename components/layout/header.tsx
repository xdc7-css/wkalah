"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/server/auth-actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function Header() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <header className="mb-6 rounded-3xl border border-border p-3 sm:p-4 bg-card shadow-sm">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-base font-extrabold sm:text-xl font-heading leading-tight truncate text-foreground">لوحة الإدارة</h1>
            <p className="mt-0.5 text-[10px] font-medium text-muted-foreground/60 sm:text-sm sm:leading-6 truncate">
              إدارة العوائل والمواد والتوزيع الشهري
            </p>
          </div>

          <div className="shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLogoutConfirm(true)}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/40 p-0 text-muted-foreground transition-all hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/30 active:scale-90 sm:h-11 sm:w-auto sm:rounded-2xl sm:px-5 sm:gap-2"
            >
              <LogOut className="size-4 shrink-0 transition-transform group-hover:rotate-12" />
              <span className="hidden sm:inline font-bold">تسجيل الخروج</span>
            </Button>
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