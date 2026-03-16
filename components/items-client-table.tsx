"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
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
            <Search className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المادة أو الوحدة أو الآلية..."
              className="h-14 w-full rounded-[24px] border border-border bg-secondary/40 pr-12 pl-5 text-base font-medium text-foreground outline-none transition-all focus:border-accent/50 focus:bg-secondary/60 focus:ring-4 focus:ring-accent/5 placeholder:text-muted-foreground/40"
            />
          </div>

          {editingItem && (
            <div className="animate-in slide-in-from-top-2 fade-in w-full rounded-[30px] border border-accent/30 bg-accent/5 p-4 duration-300">
              <div className="mb-4 flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-black text-foreground">
                  تعديل المادة: {editingItem.name}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setEditingItem(null)}
                  className="h-9 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  إلغاء التعديل
                </Button>
              </div>
              <ItemForm item={editingItem} />
            </div>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[32px] border border-dashed border-border bg-card p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-foreground">لا توجد نتائج مطابقة</h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
              لم نجد أي مادة تطابق بحثك. جرّب كلمات مفتاحية أخرى أو أفرغ حقل البحث.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-2xl">
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <ItemsTableRow
                  key={item.id}
                  item={item}
                  view="card"
                  isLoading={loadingId === item.id}
                  onEdit={setEditingItem}
                  onDelete={(it) =>
                    setConfirmState({
                      open: true,
                      title: `حذف المادة "${it.name}"`,
                      description: "هذا الإجراء نهائي ولا يمكن التراجع عنه. هل أنت متأكد؟",
                      variant: "delete",
                      onConfirm: () => {
                        setConfirmState({ open: false, title: "" });
                        handleDelete(it);
                      },
                    })
                  }
                  onToggleActive={(it) =>
                    setConfirmState({
                      open: true,
                      title: `${it.is_active ? "تجميد" : "تفعيل"} المادة "${it.name}"`,
                      description: it.is_active
                        ? "سيتم إيقاف ظهور هذه المادة في عمليات التوزيع اليومية."
                        : "ستظهر هذه المادة مرة أخرى في عمليات التوزيع اليومية.",
                      variant: it.is_active ? "freeze" : "edit",
                      onConfirm: () => {
                        setConfirmState({ open: false, title: "" });
                        handleToggle(it);
                      },
                    })
                  }
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