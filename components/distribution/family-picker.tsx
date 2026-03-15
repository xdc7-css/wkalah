"use client";

import { Search, MapPin, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useFamilySearch, type FamilyLite } from "@/hooks/use-family-search";

interface FamilyPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (family: FamilyLite) => void;
  selectedId?: string;
}

export function FamilyPicker({ open, onOpenChange, onSelect, selectedId }: FamilyPickerProps) {
  const { query, setQuery, results, isSearching } = useFamilySearch();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full border-l border-white/10 bg-[#081225] p-0 sm:max-w-xl">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-white/5 px-5 py-7 text-right sm:px-8 bg-[#0F1B33]">
            <SheetTitle className="text-2xl font-bold text-[#F8FAFC]">اختيار العائلة</SheetTitle>
            <SheetDescription className="mt-1 text-sm font-medium leading-relaxed text-[#94A3B8]">
              ابحث بالاسم أو رمز العائلة، ثم اختر العائلة للعودة مباشرة إلى التوزيع الشهري.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-hidden px-5 py-6 sm:px-8">
            <div className="relative mb-6">
              <Search className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-[#526077]" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 rounded-2xl border-white/10 bg-white/95 pr-12 text-[#0F1B33] font-bold shadow-sm focus:ring-4 focus:ring-violet-500/10 transition-all placeholder:text-slate-400"
                placeholder="ابحث بسرعة بالاسم أو الرمز..."
                autoFocus
              />
            </div>

            <div className="h-[calc(100vh-220px)] overflow-y-auto pe-1 custom-scrollbar">
              <div className="space-y-3">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center py-20 text-sm text-slate-500 gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                    <span>جارٍ البحث...</span>
                  </div>
                ) : results.length ? (
                  results.map((family) => {
                    const isActive = selectedId === family.id;
                    return (
                      <button
                        key={family.id}
                        onClick={() => onSelect(family)}
                        className={`w-full rounded-[28px] border p-5 text-right transition-all duration-300 ${
                          isActive
                            ? "border-violet-500/30 bg-violet-500/10 shadow-lg ring-1 ring-violet-500/20"
                            : "border-white/5 bg-[#0F1B33] hover:-translate-y-1 hover:border-white/10 hover:bg-[#13213D] shadow-md"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-lg font-bold text-[#F8FAFC]">{family.family_name}</p>
                            <p className="mt-1 text-sm font-medium text-[#94A3B8]">{family.family_code}</p>
                          </div>
                          <div className={`shrink-0 rounded-xl px-4 py-1.5 text-xs font-black tracking-tight ${isActive ? "bg-violet-500 text-white" : "bg-white/5 text-[#CBD5E1] border border-white/5"}`}>
                            {family.members_count} Individuals
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#526077]">
                          <MapPin className="size-4 shrink-0 text-violet-400" />
                          <span className="truncate">{family.area ?? "N/A"}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-1.5 text-xs font-black text-violet-400">
                          <span>Select Family</span>
                          <ChevronLeft className="size-4" />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-[30px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-16 text-center text-sm text-[#526077]">
                    <Search className="size-10 mx-auto mb-4 opacity-20" />
                    لا توجد نتائج مطابقة حاليًا
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
