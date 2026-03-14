"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export function DashboardMobileSidebar() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [open, mounted]);

  const drawer =
    mounted && open
      ? createPortal(
          <div className="fixed inset-0 z-[999999] lg:hidden">
            <button
              type="button"
              aria-label="إغلاق القائمة"
              className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />

            <aside className="absolute right-0 top-0 h-dvh w-[88%] max-w-[340px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.25)] sm:w-[360px]">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
                  <h3 className="text-lg font-bold text-slate-900">القائمة</h3>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700"
                    aria-label="إغلاق القائمة"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <DashboardSidebar />
                </div>
              </div>
            </aside>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
        aria-label="فتح القائمة"
      >
        <Menu className="h-5 w-5" />
      </button>

      {drawer}
    </>
  );
}