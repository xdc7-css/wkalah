"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Edit3,
  Search,
  Snowflake,
  Trash2,
} from "lucide-react";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ItemForm } from "@/components/item-form";
import { deleteItemAction, toggleItemActiveAction } from "@/server/item-actions";
import { getItemIcon } from "@/lib/item-icons";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AppToast } from "@/components/ui/app-toast";

type ItemRow = {
  id: string;
  name: string;
  unit: string;
  default_quantity: number;
  default_quantity_formatted?: string;
  calculation_type: "per_person" | "per_family";
  is_active: boolean;
};

export function ItemsClientTable({ items }: { items: ItemRow[] }) {
  const [query, setQuery] = useState("");
  const [editingItem, setEditingItem] = useState<ItemRow | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [openActionsId, setOpenActionsId] = useState<string | null>(null);

  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    title: string;
    description?: string;
    variant?: "delete" | "freeze" | "edit";
    onConfirm?: () => void;
  }>({
    open: false,
    title: "",
  });

  const [toast, setToast] = useState<{
    open: boolean;
    title: string;
    description?: string;
    type?: "success" | "error" | "info";
  }>({
    open: false,
    title: "",
  });

  useEffect(() => {
    if (!toast.open) return;

    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 2500);

    return () => clearTimeout(timer);
  }, [toast.open]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        (item.calculation_type === "per_person" ? "لكل فرد" : "لكل عائلة").includes(q)
      );
    });
  }, [items, query]);

  async function handleDelete(item: ItemRow) {
    setLoadingId(item.id);
    try {
      await deleteItemAction(item.id);

      setToast({
        open: true,
        title: "تم حذف المادة بنجاح",
        description: `تم حذف "${item.name}" من السجل.`,
        type: "success",
      });

      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch {
      setToast({
        open: true,
        title: "فشل حذف المادة",
        description: "حدث خطأ أثناء حذف المادة.",
        type: "error",
      });
    } finally {
      setLoadingId(null);
    }
  }

  async function handleToggle(item: ItemRow) {
    setLoadingId(item.id);
    try {
      await toggleItemActiveAction(item.id, !item.is_active);

      setToast({
        open: true,
        title: item.is_active
          ? "تم تجميد المادة بنجاح"
          : "تمت إعادة تفعيل المادة بنجاح",
        description: `تم تحديث حالة المادة "${item.name}".`,
        type: "success",
      });

      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch {
      setToast({
        open: true,
        title: "فشل تحديث حالة المادة",
        description: "حدث خطأ أثناء تنفيذ العملية.",
        type: "error",
      });
    } finally {
      setLoadingId(null);
    }
  }

  const closeActions = () => setOpenActionsId(null);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث باسم المادة أو الوحدة..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-white pr-10 pl-4 text-sm outline-none transition focus:border-violet-400"
            />
          </div>

          {editingItem ? (
            <div className="w-full rounded-3xl border border-violet-200 bg-violet-50/70 p-4">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-slate-900">
                  تعديل المادة: {editingItem.name}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setEditingItem(null)}
                  className="w-full rounded-2xl sm:w-auto"
                >
                  إلغاء
                </Button>
              </div>
              <ItemForm item={editingItem} />
            </div>
          ) : null}
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/50 p-8 text-center">
            <div>
              <p className="text-base font-semibold text-slate-900">
                لا توجد نتائج مطابقة
              </p>
              <p className="mt-2 text-sm text-slate-500">
                جرّب البحث باسم مختلف أو أفرغ حقل البحث.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-3xl border border-slate-200/80 bg-white/60 md:block">
              <div className="overflow-x-auto">
                <div className="min-w-[980px]">
                  <Table>
                    <THead>
                      <TR className="bg-slate-50/80">
                        <TH>المادة</TH>
                        <TH>الوحدة</TH>
                        <TH>الكمية الافتراضية</TH>
                        <TH>آلية الاحتساب</TH>
                        <TH>الحالة</TH>
                        <TH className="text-left">الإجراءات</TH>
                      </TR>
                    </THead>

                    <TBody>
                      {filteredItems.map((item) => {
                        const busy = loadingId === item.id;

                        return (
                          <TR key={item.id} className="transition hover:bg-slate-50/70">
                            <TD>
                              <div className="flex items-center justify-end gap-3">
                                <div className="text-right">
                                  <p className="font-semibold text-slate-900">
                                    {item.name}
                                  </p>
                                </div>

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 shadow-sm">
                                  <Image
                                    src={getItemIcon(item.name)}
                                    alt={item.name}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                            </TD>

                            <TD>{item.unit}</TD>
                            <TD>
                              {item.default_quantity_formatted ?? item.default_quantity}
                            </TD>
                            <TD>
                              {item.calculation_type === "per_person"
                                ? "لكل فرد"
                                : "لكل عائلة"}
                            </TD>

                            <TD>
                              <Badge
                                className={
                                  item.is_active
                                    ? "border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                    : "border-0 bg-amber-100 text-amber-700 hover:bg-amber-100"
                                }
                              >
                                {item.is_active ? "فعالة" : "مجمّدة"}
                              </Badge>
                            </TD>

                            <TD>
                              <div className="flex flex-wrap items-center justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="rounded-2xl border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                                  onClick={() => setEditingItem(item)}
                                >
                                  <Edit3 className="size-4" />
                                  تعديل
                                </Button>

                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="rounded-2xl border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                                  disabled={busy}
                                  onClick={() =>
                                    setConfirmState({
                                      open: true,
                                      title: `${item.is_active ? "تجميد" : "إعادة تفعيل"} المادة "${item.name}"`,
                                      description: item.is_active
                                        ? "سيتم إخفاء هذه المادة من الاستخدام اليومي إلى حين إعادة تفعيلها."
                                        : "سيتم إعادة تفعيل هذه المادة وظهورها ضمن الاستخدام اليومي.",
                                      variant: "freeze",
                                      onConfirm: async () => {
                                        setConfirmState({ open: false, title: "" });
                                        await handleToggle(item);
                                      },
                                    })
                                  }
                                >
                                  <Snowflake className="size-4" />
                                  {item.is_active ? "تجميد" : "تفعيل"}
                                </Button>

                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="rounded-2xl border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                                  disabled={busy}
                                  onClick={() =>
                                    setConfirmState({
                                      open: true,
                                      title: `حذف المادة "${item.name}"`,
                                      description:
                                        "هذا الإجراء نهائي نسبيًا. تأكد من أنك تريد حذف المادة قبل المتابعة.",
                                      variant: "delete",
                                      onConfirm: async () => {
                                        setConfirmState({ open: false, title: "" });
                                        await handleDelete(item);
                                      },
                                    })
                                  }
                                >
                                  <Trash2 className="size-4" />
                                  حذف
                                </Button>
                              </div>
                            </TD>
                          </TR>
                        );
                      })}
                    </TBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 md:hidden">
              {filteredItems.map((item) => {
                const busy = loadingId === item.id;
                const actionsOpen = openActionsId === item.id;

                return (
                  <div
                    key={item.id}
                    className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenActionsId((prev) => (prev === item.id ? null : item.id))
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <ChevronDown
                          className={`size-4 transition-transform duration-200 ${
                            actionsOpen ? "rotate-180" : ""
                          }`}
                        />
                        الخيارات
                      </button>

                      <div className="flex items-start gap-3">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">{item.unit}</p>
                        </div>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 shadow-sm">
                          <Image
                            src={getItemIcon(item.name)}
                            alt={item.name}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">الكمية الافتراضية</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {item.default_quantity_formatted ?? item.default_quantity}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">آلية الاحتساب</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {item.calculation_type === "per_person"
                            ? "لكل فرد"
                            : "لكل عائلة"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Badge
                        className={
                          item.is_active
                            ? "border-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : "border-0 bg-amber-100 text-amber-700 hover:bg-amber-100"
                        }
                      >
                        {item.is_active ? "فعالة" : "مجمّدة"}
                      </Badge>
                    </div>

                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        actionsOpen
                          ? "mt-4 grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-2">
                          <div className="grid gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="h-11 w-full justify-start rounded-2xl border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
                              onClick={() => {
                                setEditingItem(item);
                                closeActions();
                              }}
                            >
                              <Edit3 className="size-4" />
                              تعديل المادة
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              className="h-11 w-full justify-start rounded-2xl border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                              disabled={busy}
                              onClick={() => {
                                closeActions();
                                setConfirmState({
                                  open: true,
                                  title: `${item.is_active ? "تجميد" : "إعادة تفعيل"} المادة "${item.name}"`,
                                  description: item.is_active
                                    ? "سيتم إيقاف هذه المادة مؤقتًا من الظهور ضمن الاستخدامات اليومية."
                                    : "سيتم إعادة تفعيل هذه المادة وظهورها ضمن الاستخدامات اليومية.",
                                  variant: "freeze",
                                  onConfirm: async () => {
                                    setConfirmState({ open: false, title: "" });
                                    await handleToggle(item);
                                  },
                                });
                              }}
                            >
                              <Snowflake className="size-4" />
                              {item.is_active ? "تجميد المادة" : "إعادة تفعيل المادة"}
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              className="h-11 w-full justify-start rounded-2xl border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100"
                              disabled={busy}
                              onClick={() => {
                                closeActions();
                                setConfirmState({
                                  open: true,
                                  title: `حذف المادة "${item.name}"`,
                                  description: "هذا الإجراء لا يمكن التراجع عنه بسهولة.",
                                  variant: "delete",
                                  onConfirm: async () => {
                                    setConfirmState({ open: false, title: "" });
                                    await handleDelete(item);
                                  },
                                });
                              }}
                            >
                              <Trash2 className="size-4" />
                              حذف المادة
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {busy ? (
                      <p className="mt-3 text-xs text-slate-500">جارٍ تنفيذ العملية...</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        description={confirmState.description}
        variant={confirmState.variant}
        confirmText="تأكيد العملية"
        cancelText="إلغاء"
        onClose={() =>
          setConfirmState({
            open: false,
            title: "",
          })
        }
        onConfirm={() => {
          confirmState.onConfirm?.();
        }}
      />

      <AppToast
        open={toast.open}
        title={toast.title}
        description={toast.description}
        type={toast.type}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </>
  );
}