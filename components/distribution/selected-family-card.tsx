"use client";

import { Users, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { FamilyLite } from "@/hooks/use-family-search";

interface SelectedFamilyCardProps {
  family: FamilyLite | null;
  onPick: () => void;
}

export function SelectedFamilyCard({ family, onPick }: SelectedFamilyCardProps) {
  return (
    <Card className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0F1B33] shadow-lg">
      <CardHeader className="border-b border-white/5 bg-[#13213D]/50 pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
              <Users className="size-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-xl font-bold text-[#F8FAFC]">اختيار العائلة</CardTitle>
              <CardDescription className="mt-1 text-sm leading-6 text-[#94A3B8]">
                اختر العائلة من نافذة البحث السريعة ثم أكمل التوزيع مباشرة.
              </CardDescription>
            </div>
          </div>
          <Button
            type="button"
            onClick={onPick}
            className="h-11 w-full sm:w-auto rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <Search className="me-2 size-4" />
            {family ? "تغيير العائلة" : "اختيار عائلة"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6">
        {family ? (
          <div className="rounded-[24px] border border-white/5 bg-[#13213D] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xl font-bold text-[#F8FAFC]">{family.family_name}</p>
                <p className="mt-1 text-sm font-medium text-[#94A3B8]">{family.family_code}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-xl bg-white/5 border border-white/5 px-4 py-1.5 font-bold text-[#CBD5E1]">{family.members_count} Individuals</span>
                  <span className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-4 py-1.5 font-bold text-[#CBD5E1]">
                    <MapPin className="size-4 text-violet-400" />
                    {family.area ?? "N/A"}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={onPick}
                className="h-10 rounded-2xl border-white/10 bg-white/5 text-[#CBD5E1] hover:bg-white/10 hover:text-white"
              >
                تبديل
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-10 text-center text-sm text-[#94A3B8]">
            لم يتم اختيار عائلة بعد
          </div>
        )}
      </CardContent>
    </Card>
  );
}
