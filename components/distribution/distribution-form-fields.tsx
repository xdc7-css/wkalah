"use client";

import { CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { monthOptions } from "@/lib/utils";

interface DistributionFormFieldsProps {
  month: number;
  setMonth: (month: number) => void;
  year: number;
  setYear: (year: number) => void;
  membersCount: number;
  setMembersCount: (count: number) => void;
  selectedFamilyName?: string;
  disabledMembers?: boolean;
}

export function DistributionFormFields({
  month,
  setMonth,
  year,
  setYear,
  membersCount,
  setMembersCount,
  selectedFamilyName,
  disabledMembers
}: DistributionFormFieldsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div className="space-y-2.5">
        <label className="block text-sm font-bold text-foreground pr-1">الشهر</label>
        <Select 
          value={String(month)} 
          onChange={(e) => setMonth(Number(e.target.value))} 
        >
          {monthOptions.map((label, index) => (
            <option key={label} value={index + 1}>{label}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-2.5">
        <label className="block text-sm font-bold text-foreground pr-1">السنة</label>
        <Input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="text-center"
        />
      </div>

      <div className="space-y-2.5">
        <label className="block text-sm font-bold text-foreground pr-1">عدد الأفراد</label>
        <Input
          type="number"
          min={1}
          value={membersCount}
          onChange={(e) => setMembersCount(Number(e.target.value))}
          disabled={disabledMembers}
          className="text-center"
        />
      </div>

      <div className="flex flex-col justify-end">
        <div className="rounded-[18px] border border-border bg-secondary/40 p-3.5 flex items-center gap-3 ring-1 ring-border/5 shadow-inner">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
            <CalendarDays className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">العائلة المختارة</p>
            <p className="truncate text-sm font-black text-foreground">
              {selectedFamilyName ?? "لم يتم الاختيار"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
