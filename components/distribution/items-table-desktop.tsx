"use client";

import { Input } from "@/components/ui/input";
import { ItemIcon } from "@/components/item-icon";
import { formatNumber } from "@/lib/utils";

interface ItemsTableDesktopProps {
  items: any[];
  onOverride: (itemId: string, value: number) => void;
}

export function ItemsTableDesktop({ items, onOverride }: ItemsTableDesktopProps) {
  return (
    <div className="hidden overflow-x-auto rounded-[24px] border border-white/10 bg-transparent md:block">
      <div className="min-w-[760px]">
        <table className="w-full text-sm">
          <thead className="bg-[#13213D]/60 text-[#94A3B8]">
            <tr>
              <th className="px-6 py-5 text-right font-bold uppercase tracking-wider text-[11px]">المادة</th>
              <th className="px-6 py-5 text-right font-bold uppercase tracking-wider text-[11px]">الوحدة</th>
              <th className="px-6 py-5 text-right font-bold uppercase tracking-wider text-[11px]">نوع الحساب</th>
              <th className="px-6 py-5 text-right font-bold uppercase tracking-wider text-[11px]">الكمية المحسوبة</th>
              <th className="px-6 py-5 text-right font-bold uppercase tracking-wider text-[11px]">الكمية المسلّمة</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/5 transition-all duration-200 hover:bg-slate-800/40 group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 transition-transform group-hover:scale-110">
                      <ItemIcon name={item.name} size={28} />
                    </div>
                    <span className="font-bold text-[#F8FAFC] text-base">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-[#CBD5E1] font-medium">{item.unit}</td>
                <td className="px-6 py-5">
                  <span className="rounded-xl bg-violet-500/10 px-3 py-1 text-[10px] font-bold text-violet-400 ring-1 ring-violet-500/20">
                    {item.calculation_type === "per_person" ? "Per Person" : "Per Family"}
                  </span>
                </td>
                <td className="px-6 py-5 text-[#F8FAFC] font-black text-lg tracking-tight">
                  {formatNumber(item.calculated, false)}
                </td>
                <td className="px-6 py-5">
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    value={item.delivered}
                    onChange={(e) => onOverride(item.id, Number(e.target.value))}
                    className="h-11 w-40 bg-white/95 rounded-2xl border-white/10 text-slate-800 font-black text-lg focus:ring-4 focus:ring-violet-500/10 text-center transition-all duration-200"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
