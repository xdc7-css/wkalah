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
        <label className="block text-sm font-bold text-[#CBD5E1] pr-1">الشهر</label>
        <Select 
          value={String(month)} 
          onChange={(e) => setMonth(Number(e.target.value))} 
          className="h-11 w-full rounded-2xl border border-white/10 bg-white/95 text-slate-800 font-bold shadow-sm outline-none focus:ring-4 focus:ring-violet-500/10 transition-all duration-200"
        >
          {monthOptions.map((label, index) => (
            <option key={label} value={index + 1}>{label}</option>
          ))}
        </Select>
      </div>

      <div className="space-y-2.5">
        <label className="block text-sm font-bold text-[#CBD5E1] pr-1">السنة</label>
        <Input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="h-11 w-full rounded-2xl border border-white/10 bg-white/95 text-slate-800 font-bold shadow-sm text-center transition-all duration-200 focus:ring-4 focus:ring-violet-500/10"
        />
      </div>

      <div className="space-y-2.5">
        <label className="block text-sm font-bold text-[#CBD5E1] pr-1">عدد الأفراد</label>
        <Input
          type="number"
          min={1}
          value={membersCount}
          onChange={(e) => setMembersCount(Number(e.target.value))}
          disabled={disabledMembers}
          className="h-11 w-full rounded-2xl border border-white/10 bg-white/95 text-slate-800 font-bold shadow-sm text-center transition-all duration-200 focus:ring-4 focus:ring-violet-500/10"
        />
      </div>

      <div className="flex flex-col justify-end">
        <div className="rounded-2xl border border-white/5 bg-[#13213D] p-3.5 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <CalendarDays className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">العائلة المختارة</p>
            <p className="truncate text-sm font-bold text-[#F8FAFC]">
              {selectedFamilyName ?? "لم يتم الاختيار"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
