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
      <Card>
        <CardHeader className="border-b border-white/5 bg-secondary/30 pb-6 pt-10 px-6 sm:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
                إدارة العوائل
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                إضافة وتعديل وتجميد العوائل مع ميزة البحث السريع.
              </CardDescription>
            </div>

            <Link
              href="/dashboard/families/new"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              <Plus className="size-5" />
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
              <div className="hidden lg:block overflow-hidden rounded-[32px] border border-white/10 bg-card/40">
                <div className="overflow-x-auto">
                    <Table className="w-full">
                      <THead className="bg-secondary/20">
                        <TR className="border-0">
                          <TH className="py-5">الرمز</TH>
                          <TH className="py-5">اسم العائلة</TH>
                          <TH className="py-5">الأفراد</TH>
                          <TH className="py-5">المنطقة</TH>
                          <TH className="py-5">الحالة</TH>
                          <TH className="py-5 text-left">الإجراءات</TH>
                        </TR>
                      </THead>

                      <TBody>
                        {result.data.map((family) => (
                          <TR key={family.id} className="transition-colors hover:bg-muted/50 border-b border-border">
                            <TD className="py-5">
                              <span className="inline-flex items-center rounded-xl border border-border bg-secondary px-3 py-1.5 text-xs font-bold text-muted-foreground">
                                {toArabicDigits(family.family_code)}
                              </span>
                            </TD>
                            <TD className="py-5 font-black text-foreground">{family.family_name}</TD>
                            <TD className="py-5 font-bold text-secondary-foreground">{toArabicDigits(family.members_count)}</TD>
                            <TD className="py-5 font-bold text-secondary-foreground">{family.area ?? "-"}</TD>
                            <TD className="py-5">
                               {/* Badge uses its own logic below */}
                              <Badge
                                variant={family.is_active ? "success" : "warning"}
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
                  <div key={family.id} className="relative overflow-hidden rounded-[26px] border border-border bg-card p-5 transition-all hover:bg-secondary/30 active:scale-[0.98]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="shrink-0 rounded-lg border border-border bg-secondary px-2 py-0.5 text-[10px] font-black text-accent">
                            {toArabicDigits(family.family_code)}
                          </span>
                          <h3 className="truncate text-lg font-black text-foreground">{family.family_name}</h3>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs font-medium text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <span className="opacity-60">الأفراد:</span>
                            <span className="text-foreground">{toArabicDigits(family.members_count)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="opacity-60">المنطقة:</span>
                            <span className="text-foreground truncate max-w-[120px]">{family.area ?? "-"}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Badge
                        variant={family.is_active ? "success" : "warning"}
                      >
                        {family.is_active ? "فعالة" : "مجمّدة"}
                      </Badge>
                    </div>

                    <div className="mt-6 pt-5 border-t border-border">
                      <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">إجراءات العائلة</p>
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