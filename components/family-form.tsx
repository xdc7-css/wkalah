"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Family } from "@/lib/types";
import { upsertFamilyAction } from "@/server/family-actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  UserPlus, 
  Fingerprint, 
  Phone, 
  MapPin, 
  FileEdit, 
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";

const initialState = { error: "", success: "" };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="group relative h-14 w-full overflow-hidden rounded-[20px] bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] px-8 text-base font-black text-white shadow-[0_20px_40px_rgba(139,92,246,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(139,92,246,0.25)] active:scale-95 disabled:opacity-70"
    >
      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      
      {pending ? (
        <span className="relative flex items-center justify-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span className="tracking-tight">جارٍ الحفظ...</span>
        </span>
      ) : (
        <span className="relative flex items-center justify-center gap-3">
          <CheckCircle2 className="size-5 transition-transform group-hover:scale-110" />
          <span className="tracking-tight text-white">حفظ جميع البيانات</span>
        </span>
      )}
    </Button>
  );
}

function FieldLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-2 flex items-center gap-2 text-xs font-bold text-[#94A3B8] uppercase tracking-wider font-heading sm:text-sm">
      <span className="text-violet-400/80">{icon}</span>
      {children}
    </label>
  );
}

function FormSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:bg-white/[0.05] hover:border-violet-500/20">
      <div className="flex items-center gap-2.5 text-violet-400">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20">
          {icon}
        </div>
        <h4 className="text-xs font-black uppercase tracking-[0.2em] font-heading">{title}</h4>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

export function FamilyForm({
  family,
  onDone,
}: {
  family?: Partial<Family>;
  onDone?: () => void;
}) {
  const [state, formAction] = useActionState(upsertFamilyAction, initialState);
  const router = useRouter();
  const [isActive, setIsActive] = useState(family?.is_active ?? true);

  useEffect(() => {
    if (state.success && onDone) {
      const timer = setTimeout(() => onDone(), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, onDone]);

  const handleClose = () => {
    if (onDone) {
      onDone();
    } else {
      router.back();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="mx-auto w-full max-w-4xl overflow-hidden rounded-[40px] border border-white/10 bg-[#0F1B33] shadow-2xl transition-all duration-300">
        <CardHeader className="relative border-b border-white/5 bg-gradient-to-l from-[#13213D]/50 via-transparent to-transparent pb-8 pt-10 px-6 sm:px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 text-violet-400 ring-1 ring-violet-500/30 shadow-lg">
                {family?.id ? <FileEdit className="size-7" /> : <UserPlus className="size-7" />}
              </div>
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-2xl font-black text-[#F8FAFC] font-heading sm:text-3xl">
                  {family?.id ? "تعديل العائلة" : "إضافة عائلة جديدة"}
                </CardTitle>
                <CardDescription className="text-sm font-medium leading-relaxed text-[#94A3B8] md:text-base">
                  أدخل بيانات العائلة بدقة لضمان دقة عملية التوزيع الشهرية وتتبع الحصص.
                </CardDescription>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={handleClose}
              className="h-10 w-10 shrink-0 rounded-full border border-white/10 bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              <X className="size-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-10 lg:p-12">
          <form action={formAction} className="space-y-8" noValidate>
            <input type="hidden" name="id" defaultValue={family?.id} />

            {/* Section 1: Family Identitiy */}
            <FormSection title="بيانات العائلة" icon={<Fingerprint className="size-4" />}>
              <div className="space-y-2">
                <FieldLabel icon={<Fingerprint className="size-4" />}>رمز العائلة</FieldLabel>
                <Input 
                  name="family_code" 
                  defaultValue={family?.family_code} 
                  required 
                  className="h-12 rounded-2xl border-white/10 bg-white/5 text-base text-[#F8FAFC] placeholder:text-[#526077] focus:border-violet-500/50 focus:ring-violet-500/10 transition-all font-bold"
                  placeholder="مثال: F-100"
                />
              </div>

              <div className="space-y-2">
                <FieldLabel icon={<UserPlus className="size-4" />}>اسم العائلة</FieldLabel>
                <Input 
                  name="family_name" 
                  defaultValue={family?.family_name} 
                  required 
                  className="h-12 rounded-2xl border-white/10 bg-white/5 text-base text-[#F8FAFC] placeholder:text-[#526077] focus:border-violet-500/50 focus:ring-violet-500/10 transition-all font-bold"
                  placeholder="مثال: عائلة أحمد محمود"
                />
              </div>
            </FormSection>

            {/* Section 2: Contact Details */}
            <FormSection title="تفاصيل التواصل" icon={<Phone className="size-4" />}>
              <div className="space-y-2">
                <FieldLabel icon={<Phone className="size-4" />}>رقم الهاتف</FieldLabel>
                <Input 
                  name="phone" 
                  defaultValue={family?.phone ?? ""} 
                  className="h-12 rounded-2xl border-white/10 bg-white/5 text-base text-[#F8FAFC] placeholder:text-[#526077] focus:border-violet-500/50 focus:ring-violet-500/10 transition-all font-bold"
                  placeholder="اختياري (07xx xxx xxxx)"
                />
              </div>

              <div className="space-y-2">
                <FieldLabel icon={<Users className="size-4" />}>عدد الأفراد</FieldLabel>
                <Input
                  name="members_count"
                  type="number"
                  min={1}
                  defaultValue={family?.members_count ?? 1}
                  required
                  className="h-12 rounded-2xl border-white/10 bg-white/5 text-base text-[#F8FAFC] focus:border-violet-500/50 focus:ring-violet-500/10 transition-all font-bold"
                />
              </div>
            </FormSection>

            {/* Section 3: Location */}
            <FormSection title="الموقع" icon={<MapPin className="size-4" />}>
              <div className="col-span-full space-y-2">
                <FieldLabel icon={<MapPin className="size-4" />}>المنطقة / السكن</FieldLabel>
                <Input 
                  name="area" 
                  defaultValue={family?.area ?? ""} 
                  className="h-12 rounded-2xl border-white/10 bg-white/5 text-base text-[#F8FAFC] placeholder:text-[#526077] focus:border-violet-500/50 focus:ring-violet-500/10 transition-all font-bold"
                  placeholder="مثال: الحي العسكري - زقاق 12"
                />
              </div>
            </FormSection>

            {/* Section 4: Status */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-violet-400 px-1">
                <Settings2 className="size-4" />
                <h4 className="text-xs font-black uppercase tracking-[0.2em] font-heading">الحالة</h4>
              </div>
              <div className={cn(
                "rounded-[32px] border p-6 shadow-xl transition-all duration-500",
                isActive 
                  ? "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10" 
                  : "border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10"
              )}>
                <label
                  htmlFor="is_active"
                  className="flex cursor-pointer items-start gap-4"
                >
                  <div className="mt-1 relative flex items-center h-6">
                    <input
                      id="is_active"
                      name="is_active"
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className={cn(
                        "size-6 rounded-lg border-white/20 bg-white/5 transition-all ring-offset-0",
                        isActive ? "text-emerald-500 focus:ring-emerald-500/20" : "text-rose-500 focus:ring-rose-500/20"
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5">
                      <p className="text-lg font-black text-[#F8FAFC] font-heading leading-none">
                        {isActive ? "العائلة فعالة ومستمرة" : "العائلة مجمّدة مؤقتاً"}
                      </p>
                      <span className={cn(
                        "flex h-2.5 w-2.5 rounded-full ring-4 shadow-lg",
                        isActive ? "bg-emerald-500 ring-emerald-500/20 animate-pulse" : "bg-rose-500 ring-rose-500/20"
                      )} />
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#94A3B8] leading-relaxed max-w-2xl">
                      {isActive 
                        ? "سيتم تضمين العائلة في جميع قوائم التوزيع والتقارير الشهرية بشكل تلقائي."
                        : "تم إيقاف استلام الحصص مؤقتاً. لن تظهر في قوائم التوزيع حتى يتم إعادة التفعيل."}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Section 5: Notes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-violet-400 px-1">
                <FileEdit className="size-4" />
                <h4 className="text-xs font-black uppercase tracking-[0.2em] font-heading">ملاحظات إضافية</h4>
              </div>
              <Textarea 
                name="notes" 
                defaultValue={family?.notes ?? ""} 
                className="min-h-[120px] rounded-[24px] border-white/10 bg-white/5 p-5 text-base text-[#F8FAFC] placeholder:text-[#526077] focus:border-violet-500/50 focus:ring-violet-500/10 transition-all leading-relaxed"
                placeholder="أدخل أي معلومات إضافية أو تنبيهات تخص هذه العائلة..."
              />
            </div>

            {/* Actions */}
            <div className="mt-10 space-y-4 rounded-[32px] border border-white/10 bg-white/[0.02] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-l from-violet-500/20 to-transparent" />
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#94A3B8] font-heading">إدارة التغييرات</h4>
                <div className="h-px flex-1 bg-gradient-to-r from-violet-500/20 to-transparent" />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SubmitButton />
                
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  className="h-14 w-full rounded-[20px] border border-white/10 bg-white/5 px-8 text-base font-black text-[#CBD5E1] transition-all hover:bg-white/10 hover:text-white active:scale-95"
                >
                  إلغاء
                </Button>
              </div>

              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[#526077]">
                تأكد من مراجعة كافة البيانات قبل تأكيد الحفظ
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}