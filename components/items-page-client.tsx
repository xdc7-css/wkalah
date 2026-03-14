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

function StatCard({
  title,
  value,
  icon,
  valueClassName = "text-slate-900",
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <Card className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-0">
        <div className="flex items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p
              className={`mt-2 text-3xl font-extrabold tracking-tight ${valueClassName}`}
            >
              {value}
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 shadow-inner">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
        <Card className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white/90 shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                  إدارة المواد
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  إضافة المواد الجديدة ومتابعة المواد الحالية وتحديث بياناتها.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(139,92,246,0.28)] active:translate-y-0"
              >
                <PackagePlus className="size-4" />
                إضافة مادة
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="إجمالي المواد"
            value={totalItemsCount}
            icon={<Package2 className="size-6" />}
          />
          <StatCard
            title="المواد الفعالة"
            value={activeItemsCount}
            valueClassName="text-emerald-600"
            icon={<CheckCircle2 className="size-6" />}
          />
          <StatCard
            title="المواد المجمدة"
            value={inactiveItemsCount}
            valueClassName="text-amber-600"
            icon={<Snowflake className="size-6" />}
          />
        </div>

        <Card className="min-w-0 overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/90 shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-l from-violet-50/70 via-white to-white pb-5">
            <CardTitle className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              المواد
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6 text-slate-500">
              إدارة المواد الأساسية مع الكميات الافتراضية وآلية الاحتساب
              المعتمدة في التوزيع الشهري.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-3 sm:p-4 lg:p-5">
            <div className="overflow-hidden rounded-[24px] border border-slate-200/70 bg-white">
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
        <div className="flex h-[100svh] max-h-[100svh] flex-col overflow-hidden bg-white shadow-[0_30px_90px_rgba(15,23,42,0.34)] xl:ml-auto xl:h-screen xl:max-h-screen xl:rounded-l-[32px]">
          <div className="shrink-0 border-b border-slate-100 bg-gradient-to-b from-violet-50/80 via-white to-white px-4 py-3 sm:px-5 xl:px-6">
            <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-300 xl:hidden" />

            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700 sm:h-12 sm:w-12">
                  <PackagePlus className="size-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                    إضافة مادة جديدة
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    أدخل بيانات المادة المطلوبة ثم احفظ التغييرات.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

         <div
  className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/60 p-3 sm:p-4 xl:p-6"
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