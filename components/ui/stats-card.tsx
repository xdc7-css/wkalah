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
      "overflow-hidden rounded-[32px] border border-border bg-card shadow-[0_15px_45px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_45px_rgba(0,0,0,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-secondary/60 hover:shadow-xl group",
      className
    )}>
      <CardContent className="p-5 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground font-heading leading-tight truncate sm:text-[11px]">
            {title}
          </p>
          <div className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-[18px] bg-accent/10 shadow-lg ring-1 ring-accent/20 transition-transform group-hover:scale-110 sm:h-12 sm:w-12 text-accent",
            iconClassName
          )}>
            <div className="scale-90 sm:scale-100">
              {icon}
            </div>
          </div>
        </div>

        <div className="mt-2 min-w-0 sm:mt-5">
          <div className="flex items-baseline gap-2 overflow-hidden">
            <h3 className={cn(
              "text-2xl font-black tracking-tighter text-foreground leading-tight font-heading truncate sm:text-3xl lg:text-4xl",
              valueClassName
            )}>
              {displayValue}
            </h3>
            {trend && (
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-lg ring-1 shrink-0",
                trend.isPositive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20" : "bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/20"
              )}>
                {trend.value}
              </span>
            )}
          </div>
          
          {description && (
            <p className="mt-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-wider truncate leading-relaxed sm:text-[11px] opacity-80 group-hover:opacity-100 transition-opacity">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
