"use client";

import { useState, useMemo } from "react";
import { 
  ChevronDown, 
  Search, 
  Package2, 
  User, 
  Fingerprint, 
  MapPin, 
  Users
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemIcon } from "@/components/item-icon";
import { formatNumber, toArabicDigits, toWesternDigits } from "@/lib/utils";
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

export function DetailedReportsClient({ data }: Props) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    const rawQuery = search.toLowerCase().trim();
    if (!rawQuery) return data;
    
    // Normalize query to western digits for comparison with DB values (code-based search)
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
      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 group-focus-within:text-violet-400">
          <Search className="size-5 transition-colors" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث باسم العائلة أو رمزها..."
          className="w-full h-14 rounded-[22px] border border-white/10 bg-white/5 pr-12 pl-4 text-lg font-medium text-white outline-none transition-all focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 placeholder:text-slate-500"
        />
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-dashed border-white/10 rounded-[32px]">
            <Search className="size-12 text-slate-700 mb-4" />
            <p className="text-lg font-bold text-slate-500">لا توجد نتائج تطابق بحثك</p>
          </div>
        ) : (
          filteredData.map((row, index) => (
            <Card
              key={row.id}
              className={cn(
                "overflow-hidden rounded-[40px] border border-white/10 bg-[#0F1B33] shadow-xl transition-all duration-500",
                expandedId === row.id ? "ring-2 ring-violet-500/30 bg-[#13213D]" : "hover:bg-[#13213D]/70"
              )}
            >
              {/* Header */}
              <button
                onClick={() => toggleExpand(row.id)}
                className="w-full text-right outline-none group"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20 font-black text-xl font-heading">
                        {index + 1}
                      </div>
                      
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-[#F8FAFC] group-hover:text-violet-300 transition-colors font-heading">
                          {row.families.family_name}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-4 text-xs font-bold text-[#94A3B8]">
                          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg ring-1 ring-white/10">
                            <Fingerprint className="size-3.5 text-violet-400" />
                            <span>رمز: {row.families.family_code}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg ring-1 ring-white/10">
                            <MapPin className="size-3.5 text-blue-400" />
                            <span>{row.families.area || "منطقة غير محددة"}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg ring-1 ring-white/10">
                            <Users className="size-3.5 text-emerald-400" />
                            <span>{row.members_count_at_delivery} أفراد استلموا</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pr-16 lg:pr-0">
                      <div className="hidden lg:flex flex-col items-end">
                        <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest font-heading">تاريخ التسليم</span>
                        <span className="text-sm font-black text-[#F8FAFC]">
                          {new Date(row.delivered_at).toLocaleDateString('ar-IQ', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 transition-transform duration-500",
                        expandedId === row.id ? "rotate-180 bg-violet-500/20 text-violet-400" : "text-slate-600 group-hover:text-slate-400"
                      )}>
                        <ChevronDown className="size-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Collapsible Content */}
              <AnimatePresence>
                {expandedId === row.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-5 pb-6 sm:px-6 sm:pb-8">
                      <div className="h-px w-full bg-white/10 mb-6" />
                      
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="flex items-center gap-3 text-base font-bold text-violet-400 font-heading">
                          <Package2 className="size-5" />
                          المواد المستلمة
                        </h4>
                        <ExportFamilyReportButton familyId={row.family_id} />
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {row.monthly_distribution_items.map((item) => (
                          <div
                            key={item.id}
                            className="group/item flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 transition-all hover:border-violet-500/30 hover:bg-white/[0.08]"
                          >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0F1B33] shadow-lg ring-1 ring-white/10 group-hover/item:scale-110 transition-transform">
                              <ItemIcon name={item.item_name_snapshot} size={32} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider font-heading">
                                {item.item_name_snapshot}
                              </p>
                              <p className="text-2xl font-black text-[#F8FAFC] tracking-tight mt-0.5">
                                {formatNumber(item.delivered_quantity)}
                                <span className="mr-2 text-xs font-bold text-[#94A3B8]">{item.unit_snapshot}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {row.notes && (
                        <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
                          <p className="font-bold mb-1">ملاحظات:</p>
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
