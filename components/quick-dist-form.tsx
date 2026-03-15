"use client";

import { useState, useTransition } from "react";
import { Search, Save, Package2, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getFamilyByCodeApi, saveDistributionAction } from "@/server/distribution-actions";
import { useDistributionState } from "@/hooks/use-distribution-state";
import { ItemsTableMobile } from "./distribution/items-table-mobile";
import { ItemsTableDesktop } from "./distribution/items-table-desktop";
import { formatNumber, toArabicDigits } from "@/lib/utils";
import type { Item } from "@/lib/types";

export function QuickDistForm({
  items,
  initialMonth,
  initialYear,
}: {
  items: Item[];
  initialMonth: number;
  initialYear: number;
}) {
  const [code, setCode] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    selectedFamily,
    setSelectedFamily,
    month,
    year,
    membersCount,
    setMembersCount,
    calculatedItems,
    handleOverride,
    isPending,
    startTransition,
    reset,
  } = useDistributionState(items, initialMonth, initialYear);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!code.trim()) return;

    setIsSearching(true);
    setError(null);
    setSuccess(null);
    setSelectedFamily(null as any);

    try {
      const family = await getFamilyByCodeApi(code.trim());
      if (!family) {
        setError("لم يتم العثور على عائلة بهذا الكود");
      } else {
        setSelectedFamily(family);
      }
    } catch (err) {
      setError("حدث خطأ أثناء البحث عن العائلة");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = () => {
    if (!selectedFamily) return;
    setError(null);

    startTransition(async () => {
      try {
        const result = await saveDistributionAction({
          family_id: selectedFamily.id,
          month,
          year,
          members_count_at_delivery: membersCount,
          items: calculatedItems.map((item) => ({
            item_id: item.id,
            calculated_quantity: item.calculated,
            delivered_quantity: Number(item.delivered),
          })),
        });

        if (result.error) {
          setError(result.error);
        } else {
          setSuccess("تم تسجيل التوزيع بنجاح");
          setTimeout(() => {
            reset();
            setCode("");
            setSuccess(null);
          }, 2000);
        }
      } catch (err) {
        setError("حدث خطأ أثناء حفظ التوزيع");
      }
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.08] backdrop-blur-xl shadow-xl">
        <CardHeader className="bg-white/5 pb-5 border-b border-white/5">
          <CardTitle className="text-lg text-white">بحث برمز العائلة</CardTitle>
          <CardDescription className="text-slate-400">أدخل كود العائلة للبدء بالتوزيع الفوري</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="أدخل رمز العائلة (مثلاً: ١٠٠١)..."
                className="h-12 pr-10 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10"
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSearching || !code.trim()}
              className="h-12 px-6 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-600/20 active:scale-95 transition-all"
            >
              {isSearching ? "جاري البحث..." : "بحث"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-3 rounded-[20px] bg-red-500/10 p-4 border border-red-500/20 text-red-400">
          <AlertCircle className="size-5 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-[20px] bg-emerald-500/10 p-4 border border-emerald-500/20 text-emerald-400 animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="size-5 shrink-0" />
          <p className="text-sm font-bold">{success}</p>
        </div>
      )}

      {selectedFamily && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <Card className="overflow-hidden rounded-[30px] border border-violet-500/20 bg-violet-500/5 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-violet-600 shadow-lg text-white ring-4 ring-violet-600/20">
                    <User className="size-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">{selectedFamily.family_name}</h2>
                    <div className="mt-1 flex gap-3 text-xs font-bold text-slate-400 uppercase">
                      <span>كود: {toArabicDigits(selectedFamily.family_code)}</span>
                      <span>•</span>
                      <span>{toArabicDigits(selectedFamily.members_count)} أفراد</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 rounded-2xl bg-white/5 p-2 border border-white/10 shadow-sm">
                   <div className="px-3">
                     <p className="text-[10px] font-bold text-slate-500 uppercase">الكمية المقدرة لـ</p>
                     <p className="text-sm font-black text-white">{toArabicDigits(membersCount)} أفراد</p>
                   </div>
                   <Input
                     type="number"
                     value={membersCount}
                     onChange={(e) => setMembersCount(Number(e.target.value))}
                     className="w-16 h-10 rounded-xl border-white/10 bg-white/5 text-white text-center font-bold focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10"
                     min={1}
                   />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.08] backdrop-blur-xl shadow-xl">
             <CardHeader className="border-b border-white/5 bg-white/5 pb-5">
               <div className="flex items-center gap-3">
                 <Package2 className="size-5 text-violet-400" />
                 <CardTitle className="text-lg text-white">تأكيد الكميات</CardTitle>
               </div>
             </CardHeader>
             <CardContent className="p-0 sm:p-6 lg:p-8">
                <div className="hidden sm:block">
                  <ItemsTableDesktop items={calculatedItems} onOverride={handleOverride} />
                </div>
                <div className="block sm:hidden p-4">
                   <ItemsTableMobile items={calculatedItems} onOverride={handleOverride} />
                </div>

                <div className="mt-8 flex items-center justify-end p-4 pt-0 sm:p-0">
                  <Button
                    onClick={handleSave}
                    disabled={isPending}
                    className="h-14 w-full sm:w-auto px-10 rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all font-black text-lg active:scale-95"
                  >
                    <Save className="ml-2 size-5" />
                    {isPending ? "جاري الحفظ..." : "تأكيد واستلام"}
                  </Button>
                </div>
             </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
