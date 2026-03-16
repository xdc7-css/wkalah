"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import {
  ChevronDown,
  Search,
  Package2,
  Fingerprint,
  MapPin,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemIcon } from "@/components/item-icon";
import { formatNumber, toWesternDigits } from "@/lib/utils";
import { ExportFamilyReportButton } from "@/components/export-family-report-button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type FamilyRecord = {
  id: string;
  family_id: string;
  month: number;
  year: number;
  members_count_at_delivery: number;
  notes: string | null;
  delivered_at: string;
  families: {
    family_code: string;
    family_name: string;
    area: string | null;
  };
  monthly_distribution_items: {
    id: string;
    item_name_snapshot: string;
    unit_snapshot: string;
    delivered_quantity: number;
  }[];
};

interface Props {
  data: FamilyRecord[];
}

function normalizeItemName(name: string) {
  return name.trim().toLowerCase();
}

function isFlourItem(name: string) {
  const n = normalizeItemName(name);
  return n.includes("طحين") || n.includes("flour") || n.includes("wheat");
}

function ReportItemIcon({ name }: { name: string }) {
  if (isFlourItem(name)) {
    return (
      <Image
        src="/icons/items/wheat.webp"
        alt={name}
        width={28}
        height={28}
        className="h-7 w-7 object-contain"
      />
    );
  }

  return <ItemIcon name={name} size={28} />;
}

export function DetailedReportsClient({ data }: Props) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    const rawQuery = search.toLowerCase().trim();
    if (!rawQuery) return data;

    const normalizedQuery = toWesternDigits(rawQuery);

    return data.filter(
      (row) =>
        row.families.family_name.toLowerCase().includes(rawQuery) ||
        row.families.family_code.toLowerCase().includes(normalizedQuery) ||
        row.families.family_code.toLowerCase().includes(rawQuery)
    );
  }, [data, search]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="group relative">
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-5 text-muted-foreground/40 transition-colors group-focus-within:text-accent">
          <Search className="size-5" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث باسم العائلة أو رمزها..."
          className="h-14 w-full rounded-[22px] border border-border bg-card pr-14 pl-5 text-base font-bold text-foreground outline-none transition-all placeholder:text-muted-foreground/30 focus:border-accent/40 focus:ring-4 focus:ring-accent/5 shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-border bg-secondary/10 py-20">
            <Search className="mb-4 size-12 text-muted-foreground/20" />
            <p className="text-lg font-bold text-muted-foreground/50">
              لا توجد نتائج تطابق بحثك
            </p>
          </div>
        ) : (
          filteredData.map((row, index) => (
            <Card
              key={row.id}
              className={cn(
                "overflow-hidden border-border transition-all duration-500",
                expandedId === row.id
                  ? "translate-x-1 bg-secondary/40 ring-2 ring-accent/30"
                  : "hover:bg-secondary/20"
              )}
            >
              <button
                onClick={() => toggleExpand(row.id)}
                className="group w-full text-right outline-none"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent font-heading text-xl font-black text-accent-foreground shadow-lg shadow-accent/20">
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-heading text-xl font-black leading-tight text-foreground transition-colors group-hover:text-accent">
                          {row.families.family_name}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                          <div className="flex items-center gap-1.5 rounded-xl bg-secondary/50 px-3 py-1.5 shadow-sm ring-1 ring-border">
                            <Fingerprint className="size-3.5 text-accent" />
                            <span>رمز: {row.families.family_code}</span>
                          </div>
                          <div className="flex items-center gap-1.5 rounded-xl bg-secondary/50 px-3 py-1.5 shadow-sm ring-1 ring-border">
                            <MapPin className="size-3.5 text-blue-500 dark:text-blue-400" />
                            <span>{row.families.area || "منطقة غير محددة"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 rounded-xl bg-secondary/50 px-3 py-1.5 shadow-sm ring-1 ring-border">
                            <Users className="size-3.5 text-emerald-500 dark:text-emerald-400" />
                            <span>{row.members_count_at_delivery} أفراد</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pr-16 lg:pr-0">
                      <div className="hidden flex-col items-end lg:flex">
                        <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                          تاريخ التسليم
                        </span>
                        <span className="text-sm font-black text-foreground">
                          {new Date(row.delivered_at).toLocaleDateString("ar-IQ", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-muted-foreground/40 transition-transform duration-500",
                          expandedId === row.id
                            ? "rotate-180 bg-accent/20 text-accent"
                            : "group-hover:text-muted-foreground/60"
                        )}
                      >
                        <ChevronDown className="size-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {expandedId === row.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.04, 0.62, 0.23, 0.98],
                    }}
                  >
                    <div className="px-5 pb-6 sm:px-6 sm:pb-8">
                      <div className="mb-6 h-px w-full bg-border" />

                      <div className="mb-6 flex items-center justify-between">
                        <h4 className="font-heading flex items-center gap-3 text-base font-bold text-accent">
                          <Package2 className="size-5" />
                          المواد المستلمة
                        </h4>
                        <ExportFamilyReportButton familyId={row.family_id} />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {row.monthly_distribution_items.map((item) => (
                          <div
                            key={item.id}
                            className="group/item flex items-center gap-4 rounded-[24px] border border-border bg-secondary/50 p-4 transition-all hover:border-accent/30 hover:bg-secondary"
                          >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border/10 bg-secondary shadow-lg ring-1 ring-border/5 transition-transform group-hover/item:scale-110">
                              <ReportItemIcon name={item.item_name_snapshot} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-heading truncate text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
                                {item.item_name_snapshot}
                              </p>
                              <p className="mt-0.5 text-2xl font-black tracking-tight text-foreground">
                                {formatNumber(item.delivered_quantity)}
                                <span className="mr-2 text-xs font-bold text-muted-foreground/60">
                                  {item.unit_snapshot}
                                </span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {row.notes && (
                        <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-200">
                          <p className="mb-1 font-bold">ملاحظات:</p>
                          <p>{row.notes}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}