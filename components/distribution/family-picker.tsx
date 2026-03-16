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
      <SheetContent side="right" className="w-full border-l border-border bg-background p-0 sm:max-w-xl">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border px-5 py-7 text-right sm:px-8 bg-card">
            <SheetTitle className="text-2xl font-bold text-foreground">اختيار العائلة</SheetTitle>
            <SheetDescription className="mt-1 text-sm font-medium leading-relaxed text-muted-foreground">
              ابحث بالاسم أو رمز العائلة، ثم اختر العائلة للعودة مباشرة إلى التوزيع الشهري.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-hidden px-5 py-6 sm:px-8">
            <div className="relative mb-6">
              <Search className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-accent" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 rounded-2xl border-border bg-secondary/40 pr-12 text-foreground font-bold shadow-sm focus:ring-4 focus:ring-accent/5 transition-all placeholder:text-muted-foreground/40"
                placeholder="ابحث بسرعة بالاسم أو الرمز..."
                autoFocus
              />
            </div>

            <div className="h-[calc(100vh-220px)] overflow-y-auto pe-1 custom-scrollbar">
              <div className="space-y-3">
                {isSearching ? (
                  <div className="flex flex-col items-center justify-center py-20 text-sm text-muted-foreground/60 gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
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
                            ? "border-accent/30 bg-accent/10 shadow-lg ring-1 ring-accent/20"
                            : "border-border bg-card hover:-translate-y-1 hover:border-accent/20 hover:bg-secondary/20 shadow-md"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="truncate text-lg font-bold text-foreground">{family.family_name}</p>
                            <p className="mt-1 text-sm font-medium text-muted-foreground">{family.family_code}</p>
                          </div>
                          <div className={`shrink-0 rounded-xl px-4 py-1.5 text-xs font-black tracking-tight ${isActive ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground border border-border/50"}`}>
                            {family.members_count} Individuals
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground/60">
                          <MapPin className="size-4 shrink-0 text-accent/70" />
                          <span className="truncate">{family.area ?? "N/A"}</span>
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-1.5 text-xs font-black text-accent">
                          <span>Select Family</span>
                          <ChevronLeft className="size-4" />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-[30px] border border-dashed border-border bg-secondary/20 px-4 py-16 text-center text-sm text-muted-foreground/60">
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
