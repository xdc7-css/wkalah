"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportFamilyReportAction } from "@/app/(dashboard)/dashboard/reports/actions";

export function ExportFamilyReportButton({
  familyId,
}: {
  familyId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    try {
      setLoading(true);

      const result = await exportFamilyReportAction(familyId);

      const binary = atob(result.buffer);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("فشل في تصدير تقرير العائلة");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      disabled={loading}
      className="h-11 w-full gap-2 rounded-2xl border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 sm:w-auto"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
      {loading ? "جارٍ التصدير..." : "تصدير تقرير العائلة"}
    </Button>
  );
}