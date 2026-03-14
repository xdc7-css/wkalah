import Link from "next/link";
import { Download, FileSpreadsheet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function ReportExportButtons({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href={`/api/export/monthly?month=${month}&year=${year}`}
        className={buttonVariants({
          variant: "outline",
          className:
            "inline-flex h-11 items-center gap-2 rounded-2xl border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700",
        })}
      >
        <FileSpreadsheet className="size-4" />
        تصدير تقرير الشهر
      </Link>

      <Link
        href="/api/export/all"
        className={buttonVariants({
          variant: "outline",
          className:
            "inline-flex h-11 items-center gap-2 rounded-2xl border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700",
        })}
      >
        <Download className="size-4" />
        تصدير كل البيانات
      </Link>
    </div>
  );
}