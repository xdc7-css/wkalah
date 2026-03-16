"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { ItemIcon } from "./item-icon";
import { toArabicDigits } from "@/lib/utils";

type DistributionItem = {
  name: string;
  value: number;
};

type Props = {
  data: DistributionItem[];
};

const COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#84cc16",
];

function normalizeItemName(name: string) {
  return String(name ?? "").trim().toLowerCase();
}

function isFlourItem(name: string) {
  const n = normalizeItemName(name);
  return n.includes("طحين") || n.includes("flour") || n.includes("wheat");
}

function PieItemIcon({
  name,
  size,
  className,
}: {
  name: string;
  size: number;
  className?: string;
}) {
  if (isFlourItem(name)) {
    return (
      <Image
        src="/icons/items/wheat.webp"
        alt={name}
        width={size}
        height={size}
        className={className ?? "object-contain"}
      />
    );
  }

  return <ItemIcon name={name} size={size} className={className} />;
}

export function MonthlyDistributionPieChart({ data }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    const cleaned = (data ?? [])
      .map((item) => ({
        name: String(item.name ?? "").trim(),
        value: Number(item.value ?? 0),
      }))
      .filter(
        (item) => item.name && Number.isFinite(item.value) && item.value > 0
      );

    const total = cleaned.reduce((sum, item) => sum + item.value, 0);

    return cleaned.map((item, index) => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0,
      color: COLORS[index % COLORS.length],
    }));
  }, [data]);

  const totalDistributed = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  const safeActiveIndex =
    activeIndex >= 0 && activeIndex < chartData.length ? activeIndex : 0;

  const activeItem = chartData[safeActiveIndex] ?? chartData[0];

  if (!chartData.length) {
    return (
      <div className="rounded-[32px] border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
        لا توجد بيانات توزيع صالحة لهذا الشهر بعد
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 p-2 md:p-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <div className="order-1 min-w-0 rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] md:p-8">
        <div className="relative h-[320px] w-full min-w-0 overflow-hidden md:h-[420px]">
          {mounted ? (
            <ResponsiveContainer width="99%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="95%"
                  paddingAngle={5}
                  cornerRadius={12}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onClick={(_, index) => setActiveIndex(index)}
                  isAnimationActive
                  animationDuration={700}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => {
                    const isActive = safeActiveIndex === index;

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={
                          isActive
                            ? "hsl(var(--foreground))"
                            : "hsl(var(--border))"
                        }
                        strokeWidth={isActive ? 4 : 2}
                        style={{
                          filter: isActive
                            ? `drop-shadow(0 0 10px ${entry.color}44) brightness(1.03)`
                            : "none",
                          opacity: isActive ? 1 : 0.92,
                          transition: "all 0.35s ease",
                          cursor: "pointer",
                        }}
                      />
                    );
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full animate-pulse rounded-[28px] bg-secondary" />
          )}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem?.name}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col items-center"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-background shadow-2xl shadow-accent/5 backdrop-blur-md md:h-28 md:w-28">
                  <PieItemIcon
                    name={activeItem?.name || ""}
                    size={55}
                    className="h-[38px] w-[38px] object-contain md:h-[55px] md:w-[55px]"
                  />
                </div>

                <div className="mt-3 text-center">
                  <h3 className="text-lg font-black leading-tight text-foreground md:text-xl">
                    {activeItem?.name}
                  </h3>
                  <p
                    className="text-2xl font-black md:text-3xl"
                    style={{ color: activeItem?.color }}
                  >
                    {activeItem?.percentage.toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="order-2 flex w-full min-w-0 flex-col gap-4">
        <div className="custom-scrollbar grid max-h-[400px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-1">
          {chartData.map((item, index) => {
            const isActive = safeActiveIndex === index;

            return (
              <motion.div
                key={item.name}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                whileHover={{ y: -2 }}
                className="flex cursor-pointer items-center justify-between rounded-3xl border p-4 transition-all duration-300"
                style={{
                  borderColor: isActive ? `${item.color}44` : "hsl(var(--border)/0.3)",
                  backgroundColor: isActive
                    ? `${item.color}15`
                    : "hsl(var(--card)/0.4)",
                  boxShadow: isActive
                    ? `0 10px 30px -10px ${item.color}33, inset 0 0 0 1px ${item.color}22`
                    : "none",
                }}
              >
                <div className="min-w-0 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/10 bg-secondary/50 ring-1 ring-border/5">
                    <PieItemIcon
                      name={item.name}
                      size={28}
                      className="h-7 w-7 object-contain"
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate text-[15px] font-bold text-foreground">
                      {item.name}
                    </h4>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {toArabicDigits(item.value.toLocaleString("en-US"))} وحدة
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className="text-lg font-black"
                    style={{ color: item.color }}
                  >
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -3, scale: 1.01 }}
          className="relative mt-auto overflow-hidden rounded-[30px] border border-border bg-card p-6 shadow-2xl backdrop-blur-xl"
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-400/10 blur-2xl" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>

                <p className="text-[11px] font-bold uppercase tracking-wider text-accent/70">
                  إجمالي المواد الموزعة
                </p>
              </div>

              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-4xl font-black tracking-tight text-foreground">
                  {toArabicDigits(totalDistributed.toLocaleString("en-US"))}
                </span>
                <span className="text-sm font-bold text-muted-foreground">
                  وحدة إجمالية
                </span>
              </div>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 shadow-sm">
              <svg
                className="h-7 w-7 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}