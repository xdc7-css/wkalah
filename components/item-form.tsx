"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
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
      className="h-10 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(139,92,246,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(139,92,246,0.28)] active:translate-y-0 disabled:opacity-80 sm:h-11 sm:w-auto sm:min-w-[150px]"
    >
      {pending ? "جارٍ الحفظ..." : "حفظ المادة"}
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
    <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-slate-700 sm:text-sm">
      <span className="text-slate-400">{icon}</span>
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
    <div className="rounded-[18px] border border-slate-200/70 bg-white p-2 shadow-sm sm:rounded-[20px] sm:p-2.5">
      <div className="grid grid-cols-2 gap-2">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isDone = currentStep > step.id;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick(step.id)}
              className={`flex min-w-0 flex-col items-center justify-center rounded-xl border px-2 py-2 text-center transition-all ${
                isDone
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : isActive
                    ? "border-violet-200 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              <span className="mb-1 flex h-6 w-6 items-center justify-center rounded-full border border-current/20 text-[11px] font-bold">
                {isDone ? <CheckCircle2 className="size-3.5" /> : step.id}
              </span>
              <span className="truncate text-[10px] font-medium sm:text-xs">
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

              <div className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-700 transition-all duration-200 hover:border-violet-200 hover:bg-violet-50 peer-checked:border-violet-300 peer-checked:bg-violet-50 peer-checked:text-violet-700 peer-checked:shadow-[0_0_0_1px_rgba(139,92,246,0.12)] sm:h-11 sm:text-sm">
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
  const [step, setStep] = useState(1);

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

  const stepMeta = useMemo(
    () => [
      {
        id: 1,
        title: "البيانات الأساسية",
        description: "أدخل اسم المادة وحدد الوحدة.",
        icon: <Boxes className="size-4" />,
      },
      {
        id: 2,
        title: "الاحتساب والحفظ",
        description: "أدخل الكمية الافتراضية وحدد نوع الحساب ثم احفظ.",
        icon: <Settings2 className="size-4" />,
      },
    ],
    []
  );

  const currentMeta = stepMeta[step - 1];

  const nextStep = () => {
    if (!nameValue.trim() || !unitValue.trim()) return;
    setStep(2);
  };

  const prevStep = () => setStep(1);

  const formBody = (
    <CardContent className={embedded ? "p-0" : "p-4 sm:p-5"}>
      <form action={formAction} className="space-y-3 sm:space-y-4" noValidate>
        <input type="hidden" name="id" value={item?.id ?? ""} />
        <input type="hidden" name="name" value={nameValue} />
        <input type="hidden" name="unit" value={unitValue} />
        <input type="hidden" name="default_quantity" value={quantityValue} />
        <input type="hidden" name="calculation_type" value={calculationType} />

        <StepIndicator currentStep={step} onStepClick={setStep} />

        <div className="rounded-[18px] border border-slate-200/70 bg-white p-3 shadow-sm sm:rounded-[22px] sm:p-4">
          <div className="mb-2">
            <div className="flex items-center gap-2 text-violet-700">
              {currentMeta.icon}
              <span className="text-[11px] font-semibold sm:text-xs">
                الخطوة {step} من 2
              </span>
            </div>

            <h4 className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
              {currentMeta.title}
            </h4>
            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
              {currentMeta.description}
            </p>
          </div>

          <div className="animate-[fadeIn_.22s_ease-out]">
            {step === 1 ? (
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <FieldLabel icon={<Boxes className="size-4" />}>
                    اسم المادة
                  </FieldLabel>
                  <Input
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    placeholder="مثال: فاصوليا"
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 sm:h-11"
                  />
                </div>

                <UnitSelector value={unitValue} onChange={setUnitValue} />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <FieldLabel icon={<PackagePlus className="size-4" />}>
                    الكمية الافتراضية
                  </FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    value={quantityValue}
                    onChange={(e) => setQuantityValue(e.target.value)}
                    className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 sm:h-11"
                  />
                </div>

                <div>
                  <FieldLabel icon={<Calculator className="size-4" />}>
                    نوع الحساب
                  </FieldLabel>
                  <Select
                    value={calculationType}
                    onChange={(e) =>
                      setCalculationType(
                        e.target.value as "per_person" | "per_family"
                      )
                    }
                    className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm text-slate-900 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 sm:h-11"
                  >
                    <option value="per_person">لكل فرد</option>
                    <option value="per_family">لكل عائلة</option>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {step === 2 ? (
            <div className="mt-3 rounded-[18px] border border-slate-200/70 bg-slate-50 p-3">
              <label
                htmlFor="item_active"
                className="flex cursor-pointer items-start gap-3"
              >
                <input
                  id="item_active"
                  name="is_active"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="mt-1 size-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    تفعيل المادة
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    عند التفعيل ستظهر المادة ضمن القوائم والنماذج المعتمدة.
                  </p>
                </div>
              </label>
            </div>
          ) : null}

          {state.error ? (
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700 sm:text-sm">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          ) : null}

          {state.success ? (
            <div className="mt-3 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700 sm:text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              <span>{state.success}</span>
            </div>
          ) : null}

          <div className="mt-3 rounded-[18px] border border-slate-200/70 bg-slate-50/70 p-3">
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-500">
                استخدم الأزرار التالية للتنقل بين الخطوات.
              </p>

              <div className="flex w-full gap-2 sm:w-auto">
                {step > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="h-10 flex-1 rounded-xl px-3 text-sm sm:flex-none"
                  >
                    <ChevronRight className="size-4" />
                    السابق
                  </Button>
                ) : (
                  <div className="flex-1 sm:hidden" />
                )}

                {step < 2 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!nameValue.trim() || !unitValue.trim()}
                    className="h-10 flex-1 rounded-xl bg-slate-900 px-3 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                  >
                    التالي
                    <ChevronLeft className="size-4" />
                  </Button>
                ) : (
                  <div className="flex-1 sm:flex-none">
                    <SubmitButton />
                  </div>
                )}
              </div>
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
    <Card className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/90 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-l from-violet-50/70 via-white to-white pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <PackagePlus className="size-5" />
          </div>

          <div>
            <CardTitle className="text-lg font-extrabold text-slate-900">
              {item?.id ? "تعديل المادة" : "إضافة مادة"}
            </CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              أدخل بيانات المادة كما ستُستخدم في النظام.
            </p>
          </div>
        </div>
      </CardHeader>

      {formBody}
    </Card>
  );
}