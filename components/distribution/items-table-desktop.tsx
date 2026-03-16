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
    <div className="hidden overflow-x-auto rounded-[24px] border border-border bg-transparent md:block">
      <div className="min-w-[760px]">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-muted-foreground">
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
              <tr key={item.id} className="border-t border-border transition-all duration-200 hover:bg-secondary/20 group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary ring-1 ring-border transition-transform group-hover:scale-110">
                      <ItemIcon name={item.name} size={28} />
                    </div>
                    <span className="font-bold text-foreground text-base">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-muted-foreground font-medium">{item.unit}</td>
                <td className="px-6 py-5">
                  <span className="rounded-xl bg-accent/10 px-3 py-1 text-[10px] font-bold text-accent ring-1 ring-accent/20">
                    {item.calculation_type === "per_person" ? "لكل فرد" : "لكل عائلة"}
                  </span>
                </td>
                <td className="px-6 py-5 text-foreground font-black text-lg tracking-tight">
                  {formatNumber(item.calculated, false)}
                </td>
                <td className="px-6 py-5">
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    value={item.delivered}
                    onChange={(e) => onOverride(item.id, Number(e.target.value))}
                    className="h-11 w-40 bg-secondary/30 rounded-2xl border-border text-foreground font-black text-lg focus:ring-4 focus:ring-accent/5 focus:border-accent/40 text-center transition-all duration-200"
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
