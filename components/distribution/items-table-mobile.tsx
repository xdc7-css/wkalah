"use client";

import { Input } from "@/components/ui/input";
import { ItemIcon } from "@/components/item-icon";
import { formatNumber } from "@/lib/utils";

interface ItemsTableMobileProps {
  items: any[];
  onOverride: (itemId: string, value: number) => void;
}

export function ItemsTableMobile({ items, onOverride }: ItemsTableMobileProps) {
  return (
    <div className="grid gap-4 md:hidden">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="rounded-[28px] border border-border bg-card p-5 shadow-lg group transition-all"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary ring-1 ring-border transition-transform group-hover:scale-110">
                <ItemIcon name={item.name} size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                <p className="mt-0.5 text-xs font-medium text-muted-foreground">{item.unit}</p>
              </div>
            </div>
            <span className="rounded-xl bg-accent/10 px-3 py-1 text-[10px] font-bold text-accent ring-1 ring-accent/20 whitespace-nowrap">
              {item.calculation_type === "per_person" ? "لكل فرد" : "لكل عائلة"}
            </span>
          </div>

          <div className="grid gap-2 grid-cols-2 pt-4 border-t border-border">
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-black">الكمية المحسوبة</p>
              <p className="text-xl font-black text-foreground tracking-tight">{formatNumber(item.calculated, false)}</p>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase tracking-wider text-muted-foreground font-black">الكمية المستلمة</label>
              <Input
                type="number"
                step="0.01"
                min={0}
                value={item.delivered}
                onChange={(e) => onOverride(item.id, Number(e.target.value))}
                className="h-11 w-full bg-secondary/30 rounded-xl border-border text-foreground font-black text-center text-lg focus:ring-4 focus:ring-accent/5 focus:border-accent/40 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
