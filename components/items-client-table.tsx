"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Table, TBody, TH, THead, TR } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ItemForm } from "@/components/item-form";
import { deleteItemAction, toggleItemActiveAction } from "@/server/item-actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AppToast } from "@/components/ui/app-toast";
import { useRouter } from "next/navigation";
import { ItemsTableRow } from "@/components/items/items-table-row";

type ItemRow = {
  id: string;
  name: string;
  unit: string;
  default_quantity: number;
  calculation_type: "per_person" | "per_family";
  is_active: boolean;
};

export function ItemsClientTable({ items }: { items: ItemRow[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
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
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!toast.open) return;
    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, 2500);
    return () => clearTimeout(timer);
  }, [toast.open]);

  const filteredItems = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        (item.calculation_type === "per_person" ? "لكل فرد" : "لكل عائلة").includes(q)
      );
    });
  }, [items, debouncedQuery]);

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
      router.refresh();
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
        title: item.is_active ? "تم تجميد المادة بنجاح" : "تمت إعادة تفعيل المادة بنجاح",
        description: `تم تحديث حالة المادة "${item.name}".`,
        type: "success",
      });
      router.refresh();
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

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="group relative w-full max-w-xl">
            <Search className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-[#94A3B8] transition-colors group-focus-within:text-violet-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المادة أو الوحدة أو الآلية..."
              className="h-14 w-full rounded-[24px] border border-white/10 bg-[#13213D] pr-12 pl-5 text-base font-medium text-white outline-none transition-all focus:border-violet-500/50 focus:bg-[#182742] focus:ring-4 focus:ring-violet-500/10 placeholder:text-[#526077]"
            />
          </div>

          {editingItem && (
            <div className="w-full rounded-[30px] border border-violet-500/30 bg-violet-500/10 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-bold text-white">تعديل المادة: {editingItem.name}</p>
                <Button
                  variant="ghost"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl h-8 text-xs font-bold"
                >
                  إلغاء التعديل
                </Button>
              </div>
              <ItemForm item={editingItem} />
            </div>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[32px] border border-dashed border-white/10 bg-white/5 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-500">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">لا توجد نتائج مطابقة</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-xs mx-auto">
              لم نجد أي مادة تطابق بحثك. جرّب كلمات مفتاحية أخرى أو أفرغ حقل البحث.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0F1B33] shadow-2xl">
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <Table className="w-full">
                <THead>
                  <TR className="bg-white/5 border-0 font-heading">
                    <TH className="px-6 py-5 font-bold text-[#F8FAFC]">المادة</TH>
                    <TH className="px-6 py-5 font-bold text-[#F8FAFC]">آلية الاحتساب</TH>
                    <TH className="px-6 py-5 font-bold text-[#F8FAFC]">الكمية الافتراضية</TH>
                    <TH className="px-6 py-5 font-bold text-[#F8FAFC]">الحالة</TH>
                    <TH className="px-6 py-5 font-bold text-[#F8FAFC] text-left">الإجراءات</TH>
                  </TR>
                </THead>
                <TBody className="divide-y divide-white/5">
                  {filteredItems.map((item) => (
                    <ItemsTableRow
                      key={item.id}
                      item={item}
                      view="table"
                      isLoading={loadingId === item.id}
                      onEdit={setEditingItem}
                      onDelete={(it) => setConfirmState({
                        open: true,
                        title: `حذف المادة "${it.name}"`,
                        description: "هذا الإجراء نهائي ولا يمكن التراجع عنه. هل أنت متأكد؟",
                        variant: "delete",
                        onConfirm: () => {
                          setConfirmState({ open: false, title: "" });
                          handleDelete(it);
                        }
                      })}
                      onToggleActive={(it) => setConfirmState({
                        open: true,
                        title: `${it.is_active ? "تجميد" : "تفعيل"} المادة "${it.name}"`,
                        description: it.is_active 
                          ? "سيتم إيقاف ظهور هذه المادة في عمليات التوزيع اليومية." 
                          : "ستظهر هذه المادة مرة أخرى في عمليات التوزيع اليومية.",
                        variant: it.is_active ? "freeze" : "edit",
                        onConfirm: () => {
                          setConfirmState({ open: false, title: "" });
                          handleToggle(it);
                        }
                      })}
                      isActionsOpen={openActionsId === item.id}
                      onOpenActions={setOpenActionsId}
                    />
                  ))}
                </TBody>
              </Table>
            </div>

            {/* Premium Responsive Grid (Cards) */}
            <div className="grid gap-4 p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                    <ItemsTableRow
                      key={item.id}
                      item={item}
                      view="card"
                      isLoading={loadingId === item.id}
                      onEdit={setEditingItem}
                      onDelete={(it) => setConfirmState({
                        open: true,
                        title: `حذف المادة "${it.name}"`,
                        description: "هذا الإجراء نهائي ولا يمكن التراجع عنه. هل أنت متأكد؟",
                        variant: "delete",
                        onConfirm: () => {
                          setConfirmState({ open: false, title: "" });
                          handleDelete(it);
                        }
                      })}
                      onToggleActive={(it) => setConfirmState({
                        open: true,
                        title: `${it.is_active ? "تجميد" : "تفعيل"} المادة "${it.name}"`,
                        description: it.is_active 
                          ? "سيتم إيقاف ظهور هذه المادة في عمليات التوزيع اليومية." 
                          : "ستظهر هذه المادة مرة أخرى في عمليات التوزيع اليومية.",
                        variant: it.is_active ? "freeze" : "edit",
                        onConfirm: () => {
                          setConfirmState({ open: false, title: "" });
                          handleToggle(it);
                        }
                      })}
                      isActionsOpen={openActionsId === item.id}
                      onOpenActions={setOpenActionsId}
                    />
                  ))}
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        description={confirmState.description}
        variant={confirmState.variant}
        confirmText="تأكيد العملية"
        cancelText="إلغاء"
        onClose={() => setConfirmState({ open: false, title: "" })}
        onConfirm={confirmState.onConfirm || (() => {})}
      />

      <AppToast
        open={toast.open}
        title={toast.title}
        description={toast.description}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}