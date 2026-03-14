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
    <div className="flex h-full flex-col rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <Icon className="size-5" />
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
        {title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

      {disabled ? (
        <div className="mt-5 rounded-2xl border border-dashed border-violet-200 bg-violet-50 px-4 py-3 text-center text-sm font-medium text-violet-700">
          قريبًا
        </div>
      ) : href ? (
        <Link
          href={href}
          className={buttonVariants({
            variant,
            className:
              "mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm",
          })}
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
    <div className="space-y-4 sm:space-y-6">
      <Card className="rounded-[28px] border border-slate-200/70 bg-white/85 shadow-sm">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-xl font-bold text-slate-900 sm:text-2xl">
            النسخ الاحتياطي والتصدير
          </CardTitle>

          <CardDescription className="max-w-3xl text-sm leading-6 text-slate-500">
            تصدير كامل أو شهري لبيانات النظام بصيغة Excel، مع خيارات إضافية
            لتقارير العوائل والاستيراد والنسخ الاحتياطي المنظم.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        </CardContent>
      </Card>
    </div>
  );
}