import type { Metadata } from "next";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardMobileSidebar } from "@/components/dashboard-mobile-sidebar";
import { LogOut } from "lucide-react";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "نظام إداري خاص لتوزيع المواد الغذائية",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_22%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_28%),linear-gradient(to_bottom,rgba(15,23,42,1),rgba(15,23,42,0.96),rgba(2,6,23,1))]" />

      <div className="absolute inset-0 opacity-[0.06]">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          fill="none"
        >
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="1440" height="900" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute -top-24 right-[-80px] h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute bottom-[-80px] left-[-60px] h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1600px] p-3 sm:p-4 lg:p-6">
        <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)] xl:gap-6">

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 h-[calc(100vh-48px)]">
              <div className="h-full overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                <DashboardSidebar />
              </div>
            </div>
          </aside>

          <div className="min-w-0">

            {/* Header */}
            <header className="sticky top-3 z-30 mb-4 sm:top-4 lg:top-6">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.22)] backdrop-blur-2xl">
                <div className="relative">

                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />

                  <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-6">

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="lg:hidden">
                        <DashboardMobileSidebar />
                      </div>

                  {/* ICON */}
<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-violet-400/30 bg-gradient-to-br from-violet-500/25 to-fuchsia-500/10 shadow-[0_10px_30px_rgba(139,92,246,0.35)]">
  <Image
    src="/icons/items/flour.png"
    alt="icon"
    width={80}
    height={80}
    className="object-contain"
  />
</div>

                      <div className="min-w-0">
                        <h1 className="truncate text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                          لوحة الإدارة
                        </h1>
                        <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                          إدارة العوائل والمواد والتوزيع الشهري بشكل منظم وعملي
                        </p>
                      </div>
                    </div>

                    {/* Logout */}
                    <div className="flex items-center justify-end gap-3">
                      <form action="/signout" method="post" className="shrink-0">
                        <button
                          type="submit"
                          className="group inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-medium text-slate-100 shadow-[0_6px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300/30 hover:bg-violet-500/15 hover:text-white hover:shadow-[0_12px_30px_rgba(139,92,246,0.18)] active:translate-y-0"
                        >
                          <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110" />
                          <span className="hidden sm:inline">تسجيل الخروج</span>
                        </button>
                      </form>
                    </div>

                  </div>
                </div>
              </div>
            </header>

            {/* Main */}
            <main className="min-w-0">
              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.07] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-2xl sm:p-3 lg:p-4">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />

                <div className="rounded-[4px] border border-white/8 bg-slate-900/40 p-3 sm:p-4 lg:p-5">
                  {children}
                </div>

              </div>
            </main>

          </div>
        </div>
      </div>
    </div>
  );
}