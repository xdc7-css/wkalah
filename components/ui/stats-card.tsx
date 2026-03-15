"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    label: string;
    isPositive?: boolean;
  };
  className?: string;
  valueClassName?: string;
  iconClassName?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  valueClassName,
  iconClassName
}: StatsCardProps) {
  // If value is a number, format it with Arabic digits
  const displayValue = typeof value === "number" ? formatNumber(value) : value;

  return (
    <Card className={cn(
      "overflow-hidden rounded-[30px] border border-white/10 bg-[#0F1B33] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#13213D] hover:shadow-xl",
      className
    )}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 overflow-hidden">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8] font-heading leading-tight truncate sm:text-[11px]">
            {title}
          </p>
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ring-1 sm:h-12 sm:w-12",
            iconClassName || "from-violet-600/20 to-violet-600/5 text-violet-400 ring-violet-500/30"
          )}>
            {/* Scale down icon slightly on mobile */}
            <div className="scale-75 sm:scale-100">
              {icon}
            </div>
          </div>
        </div>

        <div className="mt-2 min-w-0 sm:mt-4">
          <div className="flex items-baseline gap-2 overflow-hidden">
            <h3 className={cn(
              "text-2xl font-black tracking-tighter text-[#F8FAFC] leading-tight font-heading truncate sm:text-3xl lg:text-4xl",
              valueClassName
            )}>
              {displayValue}
            </h3>
            {trend && (
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-lg ring-1 shrink-0",
                trend.isPositive ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20" : "bg-rose-500/10 text-rose-400 ring-rose-500/20"
              )}>
                {trend.value}
              </span>
            )}
          </div>
          
          {description && (
            <p className="mt-2 text-[10px] font-bold text-[#64748B] uppercase tracking-wider truncate leading-relaxed sm:text-[11px] opacity-80">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
