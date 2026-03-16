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
    <Card className="overflow-hidden border-white/10 shadow-lg">
      <CardHeader className="border-b border-border bg-secondary/30 pb-6 pt-10 px-6 sm:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-accent/15 to-accent/5 text-accent ring-1 ring-accent/20 shadow-lg">
              <Users className="size-7" />
            </div>
            <div className="min-w-0 space-y-1">
              <CardTitle className="text-2xl sm:text-3xl font-black text-foreground">اختيار العائلة</CardTitle>
              <CardDescription className="text-sm font-medium leading-relaxed text-muted-foreground">
                اختر العائلة من نافذة البحث السريعة ثم أكمل التوزيع مباشرة.
              </CardDescription>
            </div>
          </div>
          <Button
            type="button"
            onClick={onPick}
            className="sm:w-auto"
          >
            <Search className="me-2 size-5" />
            {family ? "تغيير العائلة" : "اختيار عائلة"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6">
        {family ? (
          <div className="rounded-[32px] border border-border bg-secondary/20 p-6 shadow-inner ring-1 ring-border/5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-2xl font-black text-foreground font-heading">{family.family_name}</p>
                <p className="mt-1 text-xs font-black uppercase tracking-widest text-muted-foreground/60">{family.family_code}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center rounded-xl bg-accent/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-accent ring-1 ring-accent/20">
                    {family.members_count} فرد
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-xl bg-secondary px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground ring-1 ring-border/10">
                    <MapPin className="size-4 text-accent/70" />
                    {family.area ?? "N/A"}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={onPick}
                className="h-11"
              >
                تبديل العائلة
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-border bg-secondary/20 px-4 py-10 text-center text-sm text-muted-foreground/60">
            لم يتم اختيار عائلة بعد
          </div>
        )}
      </CardContent>
    </Card>
  );
}
