"use client";

import { useState } from "react";
import { Save, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

import { saveDistributionAction } from "@/server/distribution-actions";
import { useDistributionState } from "@/hooks/use-distribution-state";
import { cn } from "@/lib/utils";
import { FamilyPicker } from "./distribution/family-picker";
import { SelectedFamilyCard } from "./distribution/selected-family-card";
import { DistributionFormFields } from "./distribution/distribution-form-fields";
import { ItemsTableDesktop } from "./distribution/items-table-desktop";
import { ItemsTableMobile } from "./distribution/items-table-mobile";

import type { Item } from "@/lib/types";

type SaveMessage = {
  type: "success" | "error";
  text: string;
};

export function DistributionClient({
  items,
  initialMonth,
  initialYear,
}: {
  items: Item[];
  initialMonth: number;
  initialYear: number;
}) {
  const [familyPickerOpen, setFamilyPickerOpen] = useState(false);
  const [message, setMessage] = useState<SaveMessage | null>(null);

  const {
    selectedFamily,
    setSelectedFamily,
    month,
    setMonth,
    year,
    setYear,
    notes,
    setNotes,
    membersCount,
    setMembersCount,
    calculatedItems,
    handleOverride,
    isPending,
    startTransition,
  } = useDistributionState(items, initialMonth, initialYear);

  const onSubmit = () => {
    if (!selectedFamily) return;
    setMessage(null);

    startTransition(async () => {
      try {
        const result = await saveDistributionAction({
          family_id: selectedFamily.id,
          month,
          year,
          members_count_at_delivery: membersCount,
          notes,
          items: calculatedItems.map((item) => ({
            item_id: item.id,
            calculated_quantity: item.calculated,
            delivered_quantity: Number(item.delivered),
          })),
        });

        if (result?.error) {
          setMessage({ type: "error", text: result.error });
          return;
        }

        setMessage({
          type: "success",
          text: result?.success ?? "تم حفظ سجل التوزيع بنجاح",
        });
      } catch (error) {
        console.error("Save distribution failed:", error);
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "حدث خطأ أثناء حفظ سجل التوزيع",
        });
      }
    });
  };

  return (
    <>
      <div className="space-y-4">
        <SelectedFamilyCard 
          family={selectedFamily} 
          onPick={() => setFamilyPickerOpen(true)} 
        />

        <Card>
          <CardHeader className="border-b border-border bg-secondary/30 pb-8 pt-10 px-6 sm:px-10">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-accent/15 to-accent/5 text-accent ring-1 ring-accent/20 shadow-lg">
                <Package2 className="size-7" />
              </div>
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl capitalize text-foreground">التوزيع الشهري</CardTitle>
                <CardDescription className="text-muted-foreground md:text-base">
                  الحساب تلقائي مع إمكانية تعديل الكمية المسلّمة قبل الحفظ.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 p-6 sm:p-8">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-xl bg-violet-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-violet-400 ring-1 ring-violet-500/20 shadow-inner">
                إعدادات التوزيع
              </div>
              <DistributionFormFields
                month={month}
                setMonth={setMonth}
                year={year}
                setYear={setYear}
                membersCount={membersCount}
                setMembersCount={setMembersCount}
                selectedFamilyName={selectedFamily?.family_name}
                disabledMembers={!selectedFamily}
              />
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center rounded-xl bg-fuchsia-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-fuchsia-400 ring-1 ring-fuchsia-500/20 shadow-inner">
                المواد الموزعة
              </div>
              <div className="space-y-4">
                <ItemsTableDesktop items={calculatedItems} onOverride={handleOverride} />
                <ItemsTableMobile items={calculatedItems} onOverride={handleOverride} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-foreground pr-1 font-heading">ملاحظات إضافية</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[120px] rounded-2xl border border-border bg-secondary/30 text-foreground placeholder:text-muted-foreground/40 focus:border-accent/50 focus:ring-accent/10 transition-all duration-200"
                placeholder="أضف أي ملاحظات تخص عملية التوزيع لهذا الشهر..."
              />
            </div>

            {message && (
              <div className={cn(
                "rounded-2xl border px-6 py-4 text-sm font-bold shadow-sm animate-in fade-in slide-in-from-top-2 duration-300",
                message.type === "error" 
                  ? "border-red-500/20 bg-red-500/10 text-red-400" 
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              )}>
                {message.text}
              </div>
            )}

            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between border-t border-border">
              <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                راجع الكميات المسلّمة وعدد الأفراد قبل الحفظ.
              </div>
              <Button
                onClick={onSubmit}
                disabled={!selectedFamily || isPending}
                className="h-14 w-full gap-3 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 text-base font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 sm:w-auto"
              >
                {isPending ? (
                   <span className="flex items-center gap-2">
                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                     جارٍ الحفظ...
                   </span>
                ) : (
                  <>
                    <Save className="size-5" />
                    حفظ سجل التوزيع
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <FamilyPicker 
        open={familyPickerOpen} 
        onOpenChange={setFamilyPickerOpen} 
        onSelect={(family) => {
          setSelectedFamily(family);
          setFamilyPickerOpen(false);
        }}
        selectedId={selectedFamily?.id}
      />
    </>
  );
}