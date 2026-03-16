"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { toArabicDigits } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Item } from "@/lib/types";
import { upsertItemAction } from "@/server/item-actions";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PackagePlus,
  Boxes,
  Scale,
  Calculator,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Settings2,
} from "lucide-react";

const initialState = { error: "", success: "" };
const UNIT_OPTIONS = ["كغم", "لتر", "علبة", "بطل"];

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
          <span className="tracking-tight">حفظ المادة</span>
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
    <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
      <span className="text-accent/80">{icon}</span>
      {children}
    </label>
  );
}

function StepIndicator({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  const steps = [
    { id: 1, title: "البيانات الأساسية" },
    { id: 2, title: "الاحتساب والحفظ" },
  ];

  return (
    <div className="rounded-[24px] border border-border bg-secondary/20 p-2 shadow-inner backdrop-blur-md">
      <div className="grid grid-cols-2 gap-2">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isDone = currentStep > step.id;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick(step.id)}
              className={`flex min-w-0 flex-col items-center justify-center rounded-[18px] border py-2.5 text-center transition-all duration-300 ${
                isDone
                  ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                  : isActive
                    ? "border-accent/30 bg-accent/5 text-foreground shadow-lg ring-1 ring-border"
                    : "border-transparent bg-transparent text-muted-foreground/60 hover:bg-secondary/50 hover:text-muted-foreground"
              }`}
            >
              <span className={cn(
                "mb-1 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-black transition-colors",
                isActive ? "border-accent text-accent" : "border-current text-current"
              )}>
                {isDone ? <CheckCircle2 className="size-3.5" /> : step.id}
              </span>
              <span className="truncate text-[10px] font-black uppercase tracking-wider sm:text-xs">
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UnitSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (unit: string) => void;
}) {
  return (
    <div>
      <FieldLabel icon={<Scale className="size-4" />}>الوحدة</FieldLabel>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {UNIT_OPTIONS.map((unit) => {
          const id = `unit_${unit}`;

          return (
            <label key={unit} htmlFor={id} className="group cursor-pointer">
              <input
                id={id}
                type="radio"
                name="unit_picker"
                value={unit}
                checked={value === unit}
                onChange={() => onChange(unit)}
                className="peer sr-only"
              />

              <div className="flex h-11 items-center justify-center rounded-xl border border-border bg-secondary/30 px-3 text-xs font-black text-muted-foreground transition-all duration-300 hover:border-accent/30 hover:bg-secondary/50 peer-checked:border-accent/40 peer-checked:bg-accent/10 peer-checked:text-accent peer-checked:shadow-sm sm:h-12 sm:text-sm">
                {unit}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function ItemForm({
  item,
  embedded = false,
  onSuccess,
}: {
  item?: Partial<Item>;
  embedded?: boolean;
  onSuccess?: () => void;
}) {
  const [state, formAction] = useActionState(upsertItemAction, initialState);
  const [nameValue, setNameValue] = useState(item?.name ?? "");
  const [unitValue, setUnitValue] = useState(item?.unit ?? "كغم");
  const [quantityValue, setQuantityValue] = useState(
    String(item?.default_quantity ?? 0)
  );
  const [calculationType, setCalculationType] = useState<
    "per_person" | "per_family"
  >(item?.calculation_type ?? "per_person");
  const [isActive, setIsActive] = useState(item?.is_active ?? true);

  useEffect(() => {
    if (!state.success || !onSuccess) return;
    const timeout = window.setTimeout(() => onSuccess(), 700);
    return () => window.clearTimeout(timeout);
  }, [state.success, onSuccess]);

  const formBody = (
    <CardContent className={embedded ? "p-3 sm:p-4" : "p-4 sm:p-6 md:p-8"}>
      <form action={formAction} className="space-y-6" noValidate>
        <input type="hidden" name="id" value={item?.id ?? ""} />
        <input type="hidden" name="name" value={nameValue} />
        <input type="hidden" name="unit" value={unitValue} />
        <input type="hidden" name="default_quantity" value={quantityValue} />
        <input type="hidden" name="calculation_type" value={calculationType} />

        <div className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="space-y-4 rounded-[28px] border border-border bg-secondary/20 p-6 transition-all duration-300 hover:bg-secondary/40 hover:border-accent/20">
            <div className="flex items-center gap-2.5 text-accent">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                <Boxes className="size-4" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] font-heading">البيانات الأساسية</h4>
            </div>
            
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="col-span-full">
                <FieldLabel icon={<Boxes className="size-4" />}>اسم المادة</FieldLabel>
                <Input
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  placeholder="مثال: فاصوليا"
                />
              </div>

              <div className="col-span-full">
                <UnitSelector value={unitValue} onChange={setUnitValue} />
              </div>
            </div>
          </div>

          {/* Section 2: Calculation Settings */}
          <div className="space-y-4 rounded-[28px] border border-border bg-secondary/20 p-6 transition-all duration-300 hover:bg-secondary/40 hover:border-accent/20">
            <div className="flex items-center gap-2.5 text-accent">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 ring-1 ring-accent/20">
                <Calculator className="size-4" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] font-heading">إعدادات الاحتساب</h4>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel icon={<PackagePlus className="size-4" />}>الكمية الافتراضية</FieldLabel>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  value={quantityValue}
                  onChange={(e) => setQuantityValue(e.target.value)}
                />
              </div>

              <div>
                <FieldLabel icon={<Calculator className="size-4" />}>نوع الحساب</FieldLabel>
                <Select
                  value={calculationType}
                  onChange={(e) => setCalculationType(e.target.value as "per_person" | "per_family")}
                >
                  <option value="per_person" className="bg-background">لكل فرد</option>
                  <option value="per_family" className="bg-background">لكل عائلة</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 3: Status */}
          <div className={cn(
            "rounded-[32px] border p-6 shadow-xl transition-all duration-500",
            isActive 
              ? "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10" 
              : "border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10"
          )}>
            <label htmlFor="item_active" className="flex cursor-pointer items-start gap-4">
              <div className="mt-1 relative flex items-center h-6">
                <input
                  id="item_active"
                  name="is_active"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className={cn(
                    "size-6 rounded-lg border-border bg-secondary/40 transition-all ring-offset-0",
                    isActive ? "text-emerald-500 focus:ring-emerald-500/20" : "text-rose-500 focus:ring-rose-500/20"
                  )}
                />
              </div>
              <div className="flex-1">
                <p className="text-lg font-black text-foreground font-heading leading-none">تفعيل المادة</p>
                <p className="mt-2 text-sm font-medium text-muted-foreground leading-relaxed">
                  {isActive 
                    ? "ستظهر المادة ضمن القوائم والنماذج المعتمدة في النظام."
                    : "سيتم إخفاء المادة مؤقتاً من قوائم التوزيع والتقارير."}
                </p>
              </div>
            </label>
          </div>

          {state.error && (
            <div className="flex items-center gap-3 rounded-[20px] border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-bold text-rose-400 animate-in shake-1 duration-300">
              <AlertCircle className="size-5 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {state.success && (
            <div className="flex items-center gap-3 rounded-[20px] border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-400 animate-in zoom-in-95 duration-300">
              <CheckCircle2 className="size-5 shrink-0" />
              <span>{state.success}</span>
            </div>
          )}

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
                onClick={() => {
                   if (onSuccess) onSuccess();
                }}
                className="h-14 w-full rounded-[20px] border border-border bg-secondary/50 px-8 text-base font-black text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </CardContent>
  );

  if (embedded) {
    return <div className="space-y-3">{formBody}</div>;
  }

  return (
    <Card className="mx-auto w-full max-w-3xl shadow-2xl">
      <CardHeader className="border-b border-border bg-secondary/20 px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-accent/10 shadow-lg ring-1 ring-accent/20">
            <PackagePlus className="size-7 text-accent" />
          </div>

          <div className="min-w-0">
            <CardTitle className="text-xl font-black text-foreground font-heading sm:text-2xl">
              {item?.id ? "تعديل المادة" : "إضافة مادة جديدة"}
            </CardTitle>
            <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
              قم بتحديث أو إضافة بيانات المادة لضمان دقة عمليات التوزيع.
            </p>
          </div>
        </div>
      </CardHeader>

      {formBody}
    </Card>
  );
}