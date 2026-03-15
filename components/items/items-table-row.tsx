"use client";

import { useState } from "react";
import { Edit2, Trash2, MoreVertical, X, Check, Loader2, Snowflake, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ItemIcon } from "@/components/item-icon";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type ItemRow = {
  id: string;
  name: string;
  unit: string;
  default_quantity: number;
  calculation_type: "per_person" | "per_family";
  is_active: boolean;
};

interface ItemsTableRowProps {
  item: ItemRow;
  view?: "table" | "card";
  isLoading: boolean;
  onEdit: (item: ItemRow) => void;
  onDelete: (item: ItemRow) => void;
  onToggleActive: (item: ItemRow) => void;
  isActionsOpen: boolean;
  onOpenActions: (id: string | null) => void;
}

export function ItemsTableRow({
  item,
  view = "table",
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
  isActionsOpen,
  onOpenActions
}: ItemsTableRowProps) {
  const isTable = view === "table";

  // 1. Actions Logic - Shared between Table and Card
  const ActionButtons = ({ isMobile = false }) => {
    const btnClass = cn(
      "flex items-center justify-center gap-2 rounded-xl border font-bold transition-all active:scale-95 h-[38px] backdrop-blur-xl",
      isMobile ? "w-full text-[13px]" : "px-4 text-xs"
    );

    return (
      <div className={cn("grid gap-2.5", isMobile ? "grid-cols-2" : "grid-cols-3 w-full")}>
        <Button
          onClick={(e) => { e.stopPropagation(); onEdit(item); }}
          className={cn(
            btnClass,
            "border-amber-400/20 bg-white/5 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.1)] hover:bg-amber-400/10 hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]"
          )}
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span>تعديل</span>
        </Button>
        
        <Button
          onClick={(e) => { e.stopPropagation(); onToggleActive(item); }}
          className={cn(
            btnClass,
            item.is_active 
              ? "border-sky-400/20 bg-white/5 text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.1)] hover:bg-sky-400/10 hover:border-sky-400/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]" 
              : "border-emerald-400/20 bg-white/5 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.1)] hover:bg-emerald-400/10 hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]"
          )}
        >
          {item.is_active ? <Snowflake className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
          <span>{item.is_active ? "تجميد" : "تفعيل"}</span>
        </Button>

        <Button
          onClick={(e) => { e.stopPropagation(); onDelete(item); }}
          className={cn(
            btnClass,
            "border-rose-500/20 bg-white/5 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:bg-rose-500/10 hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)]",
            isMobile && "col-span-2"
          )}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>حذف</span>
        </Button>
      </div>
    );
  };

  // 2. Card View Render
  if (!isTable) {
    return (
      <Card className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0F1B33]/35 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all duration-500 hover:bg-[#0F1B33]/45 active:scale-[0.99]">
        {/* Card Header & Stats */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 min-w-0">
            {/* Liquid Glass Icon Container */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_2px_10px_rgba(255,255,255,0.1)] border border-white/10 backdrop-blur-md transition-all group-hover:scale-110 group-hover:rotate-6">
              <ItemIcon name={item.name} size={32} className="brightness-110 contrast-125 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-xl font-black text-[#F8FAFC] font-heading tracking-tight">{item.name}</h3>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#94A3B8] opacity-80 mt-0.5">{item.unit}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-3xl font-black text-[#F8FAFC] font-heading tracking-tighter leading-none">{formatNumber(item.default_quantity)}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#64748B] mt-1.5">الكمية المقررة</p>
          </div>
        </div>

        {/* Status Badges - Clean Floating Look */}
        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <Badge variant="secondary" className={cn(
            "rounded-xl border border-white/[0.03] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest bg-white/[0.03] text-slate-300 shadow-sm",
            item.calculation_type === "per_person" ? "text-indigo-300 ring-1 ring-indigo-500/20" : "text-blue-300 ring-1 ring-blue-500/20"
          )}>
            {item.calculation_type === "per_person" ? "لكل فرد" : "لكل عائلة"}
          </Badge>
          <Badge className={cn(
            "rounded-xl border border-white/[0.03] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm",
            item.is_active ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : "bg-white/5 text-slate-500 ring-1 ring-white/10"
          )}>
            {item.is_active ? "فعالة" : "مجمدة"}
          </Badge>
        </div>

        {/* Action Controls - Glass Panel Integration */}
        <div className="mt-8">
          {/* Desktop Display - Balanced Row */}
          <div className="hidden lg:block">
            <div className="p-1 rounded-[20px] bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
              <ActionButtons isMobile={false} />
            </div>
          </div>

          {/* Table/Mobile Display - Compact Grid or Drawer */}
          <div className="lg:hidden">
            <Button
              onClick={(e) => { e.stopPropagation(); onOpenActions(isActionsOpen ? null : item.id); }}
              className={cn(
                "w-full h-12 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all border shadow-lg",
                isActionsOpen 
                  ? "bg-violet-600/10 text-violet-300 border-violet-500/40 shadow-violet-500/10" 
                  : "bg-white/[0.03] text-[#CBD5E1] border-white/10 hover:bg-white/10"
              )}
            >
              {isActionsOpen ? "إغلاق" : "خيارات التحكم"}
            </Button>

            {isActionsOpen && (
              <div className="mt-4 overflow-hidden rounded-[26px] border border-white/10 bg-[#0F1B33]/60 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl animate-in fade-in zoom-in slide-in-from-top-6 duration-500">
                <ActionButtons isMobile={true} />
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // 3. Table Row Render
  return (
    <tr className="group transition-all hover:bg-white/[0.04] border-b border-white/[0.02] last:border-0">
      <td className="px-6 py-6">
        <div className="flex items-center gap-5">
          {/* Glass Icon for Table */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/[0.06] shadow-[inset_0_2px_10px_rgba(255,255,255,0.05)] border border-white/[0.08] backdrop-blur-sm transition-all group-hover:scale-110 group-hover:rotate-6">
            <ItemIcon name={item.name} size={32} className="brightness-110 contrast-125 transition-transform group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[18px] font-black text-[#F8FAFC] font-heading tracking-tight">{item.name}</p>
            <p className="mt-0.5 text-xs font-bold text-[#94A3B8] uppercase tracking-[0.2em] opacity-70">{item.unit}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-6 whitespace-nowrap">
        <Badge variant="secondary" className={cn(
          "rounded-xl border border-white/[0.03] px-3.5 py-1.5 text-xs font-bold bg-white/[0.03] shadow-sm ring-1 ring-white/5",
          item.calculation_type === "per_person" ? "text-indigo-300 ring-indigo-500/10" : "text-blue-300 ring-blue-500/10"
        )}>
          {item.calculation_type === "per_person" ? "لكل فرد" : "لكل عائلة"}
        </Badge>
      </td>

      <td className="px-6 py-6">
        <p className="text-3xl font-black tracking-tighter text-[#F8FAFC] font-heading">{formatNumber(item.default_quantity)}</p>
      </td>

      <td className="px-6 py-6">
        <Badge className={cn(
          "h-9 rounded-xl px-5 text-xs font-black border border-white/10 transition-all shadow-lg font-heading whitespace-nowrap",
          item.is_active ? "bg-emerald-500/90 text-slate-950 shadow-emerald-500/20" : "bg-white/10 text-slate-400"
        )}>
          {item.is_active ? "فعالة" : "مجمدة"}
        </Badge>
      </td>

      <td className="px-6 py-6 text-left relative">
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); onOpenActions(isActionsOpen ? null : item.id); }}
            className={cn(
              "h-11 w-11 rounded-2xl transition-all border",
              isActionsOpen 
                ? "bg-violet-500/20 text-violet-300 border-violet-500/40 ring-1 ring-violet-500/20" 
                : "text-slate-400 border-transparent hover:bg-white/10 hover:text-white"
            )}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-5 w-5" />}
          </Button>

          {isActionsOpen && (
            <div className="absolute left-20 z-[100] flex w-max items-center gap-2 rounded-[24px] border border-white/10 bg-[#0F1B33]/80 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-3xl animate-in fade-in zoom-in slide-in-from-right-6 duration-300">
              <Button
                variant="ghost" size="sm" onClick={() => { onEdit(item); onOpenActions(null); }}
                className="h-9 px-4 gap-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/10 hover:border-white/10"
              >
                <Edit2 className="h-3.5 w-3.5" /> تعديل
              </Button>
              <Button
                variant="ghost" size="sm" onClick={() => { onToggleActive(item); onOpenActions(null); }}
                className={cn(
                  "h-9 px-4 gap-2 rounded-xl text-xs font-bold transition-all", 
                  item.is_active 
                    ? "text-amber-400 hover:bg-amber-400/10 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]" 
                    : "text-sky-400 hover:bg-sky-400/10 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                )}
              >
                {item.is_active ? <Snowflake className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
                {item.is_active ? "تجميد" : "تفعيل"}
              </Button>
              <div className="mx-1.5 h-4 w-px bg-white/10" />
              <Button
                variant="ghost" size="sm" onClick={() => { onDelete(item); onOpenActions(null); }}
                className="h-9 px-4 gap-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-400/10 hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
              >
                <Trash2 className="h-3.5 w-3.5" /> حذف
              </Button>
              <Button
                variant="ghost" size="icon" onClick={() => onOpenActions(null)}
                className="h-9 w-9 rounded-xl text-slate-500 hover:bg-white/10 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
