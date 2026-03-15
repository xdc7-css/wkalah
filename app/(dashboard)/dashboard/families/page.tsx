import Link from "next/link";
import { Plus } from "lucide-react";
import { getFamilies } from "@/lib/db";
import { toArabicDigits, toWesternDigits } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/empty-state";
import { FamilyActionButtons } from "@/components/family-action-buttons";
import { DebouncedSearch } from "@/components/debounced-search";
import { Pagination } from "@/components/pagination";

export default async function FamiliesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = toWesternDigits(params.q ?? "");
  const page = Number(params.page ?? 1);
  const result = await getFamilies(q, page, 12);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl">
        <CardHeader className="border-b border-white/5 bg-white/5 pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-extrabold text-white sm:text-2xl">
                إدارة العوائل
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-300">
                إضافة وتعديل وتجميد العوائل مع ميزة البحث السريع.
              </CardDescription>
            </div>

            <Link
              href="/dashboard/families/new"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(139,92,246,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(139,92,246,0.28)] active:translate-y-0 active:scale-95 sm:w-auto"
            >
              <Plus className="size-4" />
              إضافة عائلة
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="mb-6 max-w-md">
            <DebouncedSearch defaultValue={q} placeholder="ابحث برمز أو اسم العائلة..." />
          </div>

          {result.data.length === 0 ? (
            <EmptyState
              title="لا توجد نتائج"
              description="جرّب تغيير عبارة البحث أو إضافة عائلة جديدة"
            />
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-hidden rounded-3xl border border-white/10 bg-transparent">
                <div className="overflow-x-auto">
                    <Table className="w-full">
                      <THead className="bg-white/5">
                        <TR className="border-0">
                          <TH className="py-4 text-xs font-bold uppercase tracking-wider text-white">الرمز</TH>
                          <TH className="py-4 text-xs font-bold uppercase tracking-wider text-white">اسم العائلة</TH>
                          <TH className="py-4 text-xs font-bold uppercase tracking-wider text-white">الأفراد</TH>
                          <TH className="py-4 text-xs font-bold uppercase tracking-wider text-white">المنطقة</TH>
                          <TH className="py-4 text-xs font-bold uppercase tracking-wider text-white">الحالة</TH>
                          <TH className="py-4 text-xs font-bold uppercase tracking-wider text-white text-left">الإجراءات</TH>
                        </TR>
                      </THead>

                      <TBody>
                        {result.data.map((family) => (
                          <TR key={family.id} className="transition-colors hover:bg-white/5 border-b border-white/5">
                            <TD className="py-4">
                              <span className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-slate-300">
                                {toArabicDigits(family.family_code)}
                              </span>
                            </TD>
                            <TD className="py-4 font-bold text-white">{family.family_name}</TD>
                            <TD className="py-4 text-slate-400">{toArabicDigits(family.members_count)}</TD>
                            <TD className="py-4 text-slate-400">{family.area ?? "-"}</TD>
                            <TD className="py-4">
                              <Badge
                                className={`rounded-xl border-none px-3 py-1 font-bold ${
                                  family.is_active
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-amber-500/20 text-amber-400"
                                }`}
                              >
                                {family.is_active ? "فعالة" : "مجمّدة"}
                              </Badge>
                            </TD>

                            <TD className="py-4">
                              <FamilyActionButtons
                                familyId={family.id}
                                isActive={family.is_active}
                              />
                            </TD>
                          </TR>
                        ))}
                      </TBody>
                    </Table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="grid gap-4 lg:hidden">
                {result.data.map((family) => (
                  <div key={family.id} className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/5 p-5 transition-all active:scale-[0.98]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="shrink-0 rounded-lg border border-white/10 bg-white/10 px-2 py-0.5 text-[10px] font-black text-violet-400">
                            {toArabicDigits(family.family_code)}
                          </span>
                          <h3 className="truncate text-lg font-black text-white">{family.family_name}</h3>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500">الأفراد:</span>
                            <span className="text-slate-300">{toArabicDigits(family.members_count)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500">المنطقة:</span>
                            <span className="text-slate-300 truncate max-w-[120px]">{family.area ?? "-"}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Badge
                        className={`shrink-0 rounded-xl border-none px-3 py-1 text-[10px] font-black ${
                          family.is_active
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {family.is_active ? "فعالة" : "مجمّدة"}
                      </Badge>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/5">
                      <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">إجراءات العائلة</p>
                      <FamilyActionButtons
                        familyId={family.id}
                        isActive={family.is_active}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Pagination 
                currentPage={page} 
                totalPages={Math.ceil(result.count / 12)} 
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}