"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export function DashboardMobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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

  const drawer = (
    <AnimatePresence>
      {mounted && open && (
        <div className="fixed inset-0 z-[999999] lg:hidden">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="button"
            aria-label="إغلاق القائمة"
            className="absolute inset-0 bg-background/80 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />

          <motion.aside
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="absolute right-0 top-0 h-dvh w-[85%] max-w-[320px] bg-background shadow-2xl ring-1 ring-border/5 backdrop-blur-3xl sm:w-[340px]"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <div>
                  <h3 className="text-xl font-black text-foreground font-heading">القائمة</h3>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">تصفح أقسام النظام</p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-all duration-300 hover:bg-accent/10 hover:text-accent"
                  aria-label="إغلاق القائمة"
                >
                  <X className="h-5 w-5 transition-transform group-hover:rotate-90" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <DashboardSidebar />
                </motion.div>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-border bg-card text-foreground shadow-xl backdrop-blur-xl transition-all hover:bg-secondary active:scale-95 lg:hidden"
        aria-label="فتح القائمة"
      >
        <Menu className="h-6 w-6" />
      </button>

      {typeof window !== "undefined" ? createPortal(drawer, document.body) : null}
    </>
  );
}