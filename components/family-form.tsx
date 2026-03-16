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
      className="group relative h-14 w-full overflow-hidden rounded-[20px] px-8 text-base font-black transition-all duration-300 hover:-translate-y-1 active:scale-95 disabled:opacity-70 shadow-lg shadow-accent/20"
    >
      {pending ? (
        <span className="relative flex items-center justify-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
          <span className="tracking-tight">جارٍ الحفظ...</span>
        </span>
      ) : (
        <span className="relative flex items-center justify-center gap-3">
          <CheckCircle2 className="size-5 transition-transform group-hover:scale-110" />
          <span className="tracking-tight">حفظ جميع البيانات</span>
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
    <label className="mb-2 flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading sm:text-sm">
      <span className="text-accent/80">{icon}</span>
      {children}
    </label>
  );
}

function FormSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-5 rounded-[32px] border border-border bg-secondary/20 p-6 transition-all duration-300 hover:bg-secondary/40 hover:border-accent/20">
      <div className="flex items-center gap-3 text-accent">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 ring-1 ring-accent/20 shadow-inner">
          {icon}
        </div>
        <h4 className="text-sm font-black uppercase tracking-[0.2em] font-heading">{title}</h4>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
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
      <Card className="mx-auto w-full max-w-4xl shadow-2xl">
        <CardHeader className="relative border-b border-border bg-secondary/20 pb-8 pt-10 px-6 sm:px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-accent/15 to-accent/5 text-accent ring-1 ring-accent/20 shadow-lg">
                {family?.id ? <FileEdit className="size-7" /> : <UserPlus className="size-7" />}
              </div>
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-2xl font-black text-foreground font-heading sm:text-3xl">
                  {family?.id ? "تعديل العائلة" : "إضافة عائلة جديدة"}
                </CardTitle>
                <CardDescription className="text-sm font-medium leading-relaxed text-muted-foreground md:text-base">
                  أدخل بيانات العائلة بدقة لضمان دقة عملية التوزيع الشهرية وتتبع الحصص.
                </CardDescription>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={handleClose}
              className="h-10 w-10 shrink-0 rounded-full border border-border bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all active:scale-95"
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
                  placeholder="مثال: F-100"
                />
              </div>

              <div className="space-y-2">
                <FieldLabel icon={<UserPlus className="size-4" />}>اسم العائلة</FieldLabel>
                <Input 
                  name="family_name" 
                  defaultValue={family?.family_name} 
                  required 
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
                  placeholder="مثال: الحي العسكري - زقاق 12"
                />
              </div>
            </FormSection>

            {/* Section 4: Status */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-accent px-1">
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
                        "size-6 rounded-lg border-border bg-secondary/40 transition-all ring-offset-0 focus:ring-accent/20",
                        isActive ? "text-emerald-500" : "text-rose-500"
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5">
                      <p className="text-lg font-black text-foreground font-heading leading-none">
                        {isActive ? "العائلة فعالة ومستمرة" : "العائلة مجمّدة مؤقتاً"}
                      </p>
                      <span className={cn(
                        "flex h-2.5 w-2.5 rounded-full ring-4 shadow-lg",
                        isActive ? "bg-emerald-500 ring-emerald-500/20 animate-pulse" : "bg-rose-500 ring-rose-500/20"
                      )} />
                    </div>
                    <p className="mt-2 text-sm font-medium text-muted-foreground leading-relaxed max-w-2xl">
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
              <div className="flex items-center gap-2.5 text-accent px-1">
                <FileEdit className="size-4" />
                <h4 className="text-xs font-black uppercase tracking-[0.2em] font-heading">ملاحظات إضافية</h4>
              </div>
              <Textarea 
                name="notes" 
                defaultValue={family?.notes ?? ""} 
                className="min-h-[120px] rounded-[24px] border border-border bg-secondary/20 p-5 text-base text-foreground placeholder:text-muted-foreground/40 focus:border-accent/50 focus:ring-accent/10 transition-all leading-relaxed"
                placeholder="أدخل أي معلومات إضافية أو تنبيهات تخص هذه العائلة..."
              />
            </div>

            {/* Actions */}
            <div className="mt-10 space-y-4 rounded-[32px] border border-border bg-card p-6 sm:p-8 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-l from-accent/20 to-transparent" />
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground font-heading">إدارة التغييرات</h4>
                <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
              </div>
 
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SubmitButton />
                
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  className="h-14 w-full rounded-[20px] border border-border bg-secondary/50 px-8 text-base font-black text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95"
                >
                  إلغاء
                </Button>
              </div>

              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                تأكد من مراجعة كافة البيانات قبل تأكيد الحفظ
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}