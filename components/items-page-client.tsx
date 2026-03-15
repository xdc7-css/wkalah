"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ItemsClientTable } from "@/components/items-client-table";
import { ItemForm } from "@/components/item-form";
import {
  Package2,
  CheckCircle2,
  Snowflake,
  PackagePlus,
  Plus,
  X,
} from "lucide-react";

type ItemRow = {
  id: string;
  name: string;
  unit: string;
  default_quantity: number;
  default_quantity_formatted?: string;
  calculation_type: "per_person" | "per_family";
  is_active: boolean;
};

import { StatsCard } from "@/components/ui/stats-card";

export function ItemsPageClient({
  items,
  totalItemsCount,
  activeItemsCount,
  inactiveItemsCount,
}: {
  items: ItemRow[];
  totalItemsCount: number;
  activeItemsCount: number;
  inactiveItemsCount: number;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        <Card className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                  إدارة المواد
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-300 md:text-base">
                  إضافة المواد الجديدة ومتابعة المواد الحالية وتحديث بياناتها.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(139,92,246,0.28)] active:translate-y-0 active:scale-95"
              >
                <Plus className="size-4" />
                إضافة مادة
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatsCard
            title="إجمالي المواد"
            value={totalItemsCount}
            icon={<Package2 className="size-6" />}
          />
          <StatsCard
            title="المواد الفعالة"
            value={activeItemsCount}
            valueClassName="text-emerald-600"
            icon={<CheckCircle2 className="size-6" />}
          />
          <StatsCard
            title="المواد المجمدة"
            value={inactiveItemsCount}
            valueClassName="text-amber-600"
            icon={<Snowflake className="size-6" />}
          />
        </div>

        <Card className="min-w-0 max-w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
          <CardHeader className="border-b border-white/5 bg-white/5 pb-5">
            <CardTitle className="text-xl font-extrabold text-white sm:text-2xl">
              المواد
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              إدارة المواد الأساسية مع الكميات الافتراضية وآلية الاحتساب
              المعتمدة في التوزيع الشهري.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 md:p-6 lg:p-8">
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-sm">
              <div className="overflow-x-auto">
                <ItemsClientTable items={items} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        aria-hidden={!isDrawerOpen}
        className={`fixed inset-0 z-[90] bg-slate-950/50 backdrop-blur-md transition-all duration-300 ${
          isDrawerOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      <div
        aria-hidden={!isDrawerOpen}
        className={`fixed inset-0 z-[100] transition-all duration-300 ease-out xl:left-auto xl:w-[min(820px,100vw)] ${
          isDrawerOpen
            ? "translate-y-0 xl:translate-x-0"
            : "translate-y-full xl:translate-y-0 xl:translate-x-full"
        }`}
      >
        <div className="flex h-[100svh] max-h-[100svh] flex-col overflow-hidden bg-[#0a0c10] shadow-[0_30px_90px_rgba(0,0,0,0.5)] xl:ml-auto xl:h-screen xl:max-h-screen xl:rounded-l-[32px] border-r border-white/5">
          <div className="shrink-0 border-b border-white/5 bg-white/5 px-4 py-3 sm:px-5 xl:px-6">
            <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-white/10 xl:hidden" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/30 sm:h-12 sm:w-12">
                  <PackagePlus className="size-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                    إضافة مادة جديدة
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    أدخل بيانات المادة المطلوبة ثم احفظ التغييرات.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

         <div
  className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#081225]/80 p-3 sm:p-4 xl:p-6 backdrop-blur-3xl"
  style={{ WebkitOverflowScrolling: "touch" }}
>
  <div className="mx-auto w-full max-w-4xl pb-6">
    <ItemForm embedded onSuccess={() => setIsDrawerOpen(false)} />
  </div>
</div>

         
        </div>
      </div>
    </>
  );
}