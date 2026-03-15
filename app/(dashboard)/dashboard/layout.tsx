import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

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
              <DashboardSidebar />
            </div>
          </aside>

          <div className="min-w-0">

            {/* Header */}
            <DashboardHeader />

            {/* Main */}
            <main className="min-w-0">
              {children}
            </main>

          </div>
        </div>
      </div>
    </div>
  );
}