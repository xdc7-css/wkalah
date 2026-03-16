"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Edit2,
  Trash2,
  MoreVertical,
  X,
  Loader2,
  Snowflake,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ItemIcon } from "@/components/item-icon";
import { formatNumber, cn } from "@/lib/utils";

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

function normalizeItemName(name: string) {
  return name.trim().toLowerCase();
}

function isFlourItem(name: string) {
  const n = normalizeItemName(name);
  return (
    n.includes("طحين") ||
    n.includes("flour") ||
    n.includes("wheat")
  );
}

function ItemVisual({ name, size = 32, className = "" }: { name: string; size?: number; className?: string }) {
  if (isFlourItem(name)) {
    return (
      <Image
        src="/icons/items/wheat.webp"
        alt={name}
        width={size}
        height={size}
        className={cn("object-contain", className)}
      />
    );
  }

  return <ItemIcon name={name} size={size} className={className} />;
}

export function ItemsTableRow({
  item,
  view = "table",
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
  isActionsOpen,
  onOpenActions,
}: ItemsTableRowProps) {
  const isTable = view === "table";

  const ActionButtons = ({ isMobile = false }) => {
    const btnClass = cn(
      "flex items-center justify-center gap-2 rounded-xl border font-bold transition-all active:scale-95 h-[42px] backdrop-blur-xl",
      isMobile ? "w-full text-[13px]" : "px-4 text-xs"
    );

    const iconClass = "h-4.5 w-4.5 sm:h-5 sm:w-5";

    return (
      <div className={cn("grid gap-2.5", isMobile ? "grid-cols-2" : "grid-cols-3 w-full")}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          className={cn(
            btnClass,
            "border-amber-500/20 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 hover:border-amber-500/40"
          )}
        >
          <Edit2 className={iconClass} />
          <span>تعديل</span>
        </Button>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onToggleActive(item);
          }}
          className={cn(
            btnClass,
            item.is_active
              ? "border-sky-500/20 bg-sky-500/5 text-sky-500 hover:bg-sky-500/10 hover:border-sky-500/40"
              : "border-emerald-500/20 bg-emerald-500/5 text-emerald-500 hover:bg-emerald-500/10 hover:border-emerald-500/40"
          )}
        >
          {item.is_active ? (
            <Snowflake className={iconClass} />
          ) : (
            <Zap className={iconClass} />
          )}
          <span>{item.is_active ? "تجميد" : "تفعيل"}</span>
        </Button>

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
          className={cn(
            btnClass,
            "border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 hover:border-red-500/40",
            isMobile && "col-span-2"
          )}
        >
          <Trash2 className={iconClass} />
          <span>حذف</span>
        </Button>
      </div>
    );
  };

  if (!isTable) {
    return (
      <Card className="group relative overflow-hidden p-6 shadow-2xl transition-all duration-500 hover:bg-white/[0.02] active:scale-[0.99]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] bg-secondary border border-border shadow-lg transition-all group-hover:scale-110 group-hover:rotate-6">
              <ItemVisual name={item.name} size={38} className="h-[38px] w-[38px]" />
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-xl font-black text-foreground font-heading tracking-tight">
                {item.name}
              </h3>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground opacity-80">
                {item.unit}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-3xl font-black text-foreground font-heading tracking-tighter leading-none">
              {formatNumber(item.default_quantity)}
            </p>
            <p className="mt-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              الكمية المقررة
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2.5">
          <Badge variant="secondary">
            {item.calculation_type === "per_person" ? "لكل فرد" : "لكل عائلة"}
          </Badge>
          <Badge variant={item.is_active ? "success" : "secondary"}>
            {item.is_active ? "فعالة" : "مجمدة"}
          </Badge>
        </div>

        <div className="mt-8">
          <div className="hidden lg:block">
            <div className="rounded-[20px] border border-border bg-secondary/20 p-1 shadow-inner backdrop-blur-sm">
              <ActionButtons isMobile={false} />
            </div>
          </div>

          <div className="lg:hidden">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onOpenActions(isActionsOpen ? null : item.id);
              }}
              className={cn(
                "h-12 w-full rounded-2xl border font-black text-xs uppercase tracking-[0.3em] transition-all shadow-lg",
                isActionsOpen
                  ? "border-accent/40 bg-accent/10 text-accent shadow-accent/10"
                  : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              {isActionsOpen ? "إغلاق" : "خيارات التحكم"}
            </Button>

            {isActionsOpen && (
              <div className="animate-in slide-in-from-top-6 fade-in zoom-in mt-4 overflow-hidden rounded-[26px] border border-border bg-card/80 p-5 shadow-2xl backdrop-blur-xl duration-500">
                <ActionButtons isMobile={true} />
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <tr className="group border-b border-border/10 transition-all last:border-0 hover:bg-secondary/40">
      <td className="px-6 py-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] border border-border/20 bg-secondary shadow-lg transition-all group-hover:scale-110 group-hover:rotate-6">
            <ItemVisual
              name={item.name}
              size={38}
              className="h-[38px] w-[38px] transition-transform"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[18px] font-black text-foreground font-heading tracking-tight">
              {item.name}
            </p>
            <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-70">
              {item.unit}
            </p>
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-6 py-6">
        <Badge
          variant="secondary"
          className={cn(
            "rounded-xl border border-border/20 bg-secondary/40 px-3.5 py-1.5 text-xs font-bold shadow-sm ring-1 ring-border/5",
            item.calculation_type === "per_person"
              ? "text-indigo-400 ring-indigo-500/10 dark:text-indigo-300"
              : "text-blue-400 ring-blue-500/10 dark:text-blue-300"
          )}
        >
          {item.calculation_type === "per_person" ? "لكل فرد" : "لكل عائلة"}
        </Badge>
      </td>

      <td className="px-6 py-6">
        <p className="text-3xl font-black tracking-tighter text-foreground font-heading">
          {formatNumber(item.default_quantity)}
        </p>
      </td>

      <td className="px-6 py-6">
        <Badge variant={item.is_active ? "success" : "secondary"}>
          {item.is_active ? "فعالة" : "مجمدة"}
        </Badge>
      </td>

      <td className="relative px-6 py-6 text-left">
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onOpenActions(isActionsOpen ? null : item.id);
            }}
            className={cn(
              "h-11 w-11 rounded-2xl border transition-all",
              isActionsOpen
                ? "border-accent/40 bg-accent/20 text-accent ring-1 ring-accent/20"
                : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <MoreVertical className="h-5.5 w-5.5" />
            )}
          </Button>

          {isActionsOpen && (
            <div className="animate-in slide-in-from-right-6 fade-in zoom-in absolute left-20 z-[100] flex w-max items-center gap-2 rounded-[24px] border border-border bg-card p-2 shadow-2xl backdrop-blur-xl duration-300">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onEdit(item);
                  onOpenActions(null);
                }}
                className="h-11 gap-2 rounded-xl px-5 text-xs font-black text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Edit2 className="h-5 w-5" />
                تعديل
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onToggleActive(item);
                  onOpenActions(null);
                }}
                className={cn(
                  "h-11 gap-2 rounded-xl px-4 text-xs font-bold transition-all",
                  item.is_active
                    ? "text-amber-400 hover:bg-amber-400/10 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                    : "text-sky-400 hover:bg-sky-400/10 hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                )}
              >
                {item.is_active ? (
                  <Snowflake className="h-5 w-5" />
                ) : (
                  <Zap className="h-5 w-5" />
                )}
                {item.is_active ? "تجميد" : "تفعيل"}
              </Button>

              <div className="mx-1.5 h-4 w-px bg-border" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onDelete(item);
                  onOpenActions(null);
                }}
                className="h-11 gap-2 rounded-xl px-4 text-xs font-bold text-rose-500 hover:bg-rose-500/10"
              >
                <Trash2 className="h-5 w-5" />
                حذف
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenActions(null)}
                className="h-10 w-10 rounded-xl text-muted-foreground/60 hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}