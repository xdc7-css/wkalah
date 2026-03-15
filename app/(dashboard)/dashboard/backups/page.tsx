import Link from "next/link";
import type { Route } from "next";
import {
  ArchiveRestore,
  CalendarDays,
  Download,
  FileSpreadsheet,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function BackupOption({
  title,
  description,
  href,
  buttonLabel,
  icon: Icon,
  variant = "default",
  disabled = false,
}: {
  title: string;
  description: string;
  href?: Route;
  buttonLabel?: string;
  icon: React.ElementType;
  variant?: "default" | "outline" | "ghost";
  disabled?: boolean;
}) {
  return (
    <div className="flex h-full flex-col rounded-[30px] border border-white/10 bg-[#0F1B33] p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#13213D] hover:shadow-xl">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-violet-400 shadow-lg ring-1 ring-violet-500/30">
          <Icon className="size-6" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-[#F8FAFC] font-heading">
        {title}
      </h3>

      <p className="mt-4 flex-1 text-sm leading-6 text-[#94A3B8]">
        {description}
      </p>

      {disabled ? (
        <div className="mt-8 rounded-2xl border border-dashed border-violet-500/30 bg-violet-500/10 px-4 py-3 text-center text-sm font-bold text-violet-400">
          قريبًا
        </div>
      ) : href ? (
        <Link
          href={href}
          className={cn(
            buttonVariants({ variant }),
            "mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95"
          )}
        >
          <Download className="size-4" />
          {buttonLabel}
        </Link>
      ) : null}
    </div>
  );
}

export default function BackupsPage() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const monthlyHref =
    `/api/export/monthly?month=${month}&year=${year}` as Route;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-[40px] border border-white/10 bg-[#0F1B33] shadow-2xl">
        <CardHeader className="border-b border-white/5 bg-gradient-to-l from-[#13213D]/50 via-transparent to-transparent pb-8 pt-10 px-6 sm:px-10">
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-bold text-violet-400">
              أدوات النظام
            </div>
            <CardTitle className="text-2xl font-black text-[#F8FAFC] font-heading sm:text-3xl">
              النسخ الاحتياطي والتصدير
            </CardTitle>

            <CardDescription className="max-w-3xl text-sm font-medium leading-relaxed text-[#94A3B8] md:text-base">
              تصدير كامل أو شهري لبيانات النظام بصيغة Excel، مع خيارات إضافية
              لتقارير العوائل والاستيراد والنسخ الاحتياطي المنظم.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-10 lg:p-12">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <BackupOption
              title="تصدير كامل"
              description="يشمل جميع بيانات العوائل والمواد وسجلات التوزيع في ملف واحد منظم لغايات الأرشفة والنسخ الاحتياطي."
              href={"/api/export/all" as Route}
              buttonLabel="تنزيل الملف"
              icon={ArchiveRestore}
              variant="default"
            />

            <BackupOption
              title="تصدير الشهر الحالي"
              description={`إنشاء نسخة شهرية سريعة لسجلات التوزيع الخاصة بشهر ${month} / ${year} للمراجعة أو الأرشفة.`}
              href={monthlyHref}
              buttonLabel="تنزيل التقرير"
              icon={CalendarDays}
              variant="outline"
            />

            <BackupOption
              title="تحميل تقرير العائلة"
              description="تنزيل تقرير شامل لكل العوائل مع جميع سجلات التوزيع والمواد المسلّمة عبر الأشهر في ملف Excel واحد."
              href={"/api/export/families-report" as Route}
              buttonLabel="تنزيل تقرير العوائل"
              icon={Users}
              variant="outline"
            />

            <BackupOption
              title="استيراد البيانات"
              description="رفع ملف Excel واستيراد بيانات العوائل إلى النظام بشكل مباشر مع فحص أولي للحقول."
              href={"/dashboard/import" as Route}
              buttonLabel="فتح صفحة الاستيراد"
              icon={FileSpreadsheet}
              variant="outline"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}