"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Snowflake, Trash2 } from "lucide-react";
import { deleteFamilyAction, toggleFamilyStatusAction } from "@/app/(dashboard)/dashboard/families/actions";
import { ConfirmDialog } from "@/lib/confirm-dialog";

export function FamilyActionButtons({
  familyId,
  isActive,
}: {
  familyId: string;
  isActive: boolean;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [freezeOpen, setFreezeOpen] = useState(false);

  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("id", familyId);
    await deleteFamilyAction(formData);
    setDeleteOpen(false);
  };

  const handleToggle = async () => {
    const formData = new FormData();
    formData.append("id", familyId);
    formData.append("next_status", isActive ? "false" : "true");
    await toggleFamilyStatusAction(formData);
    setFreezeOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
        <Link
          href={`/dashboard/families/${familyId}`}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 text-sm font-bold text-foreground transition-all hover:bg-secondary/80 active:scale-95 sm:w-auto sm:rounded-2xl"
        >
          <Pencil className="size-4 text-accent" />
          تعديل
        </Link>

        <button
          type="button"
          onClick={() => setFreezeOpen(true)}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 text-sm font-bold text-foreground transition-all hover:bg-secondary/80 active:scale-95 sm:w-auto sm:rounded-2xl"
        >
          <Snowflake className="size-4 text-sky-500" />
          {isActive ? "تجميد" : "تفعيل"}
        </button>

        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 text-sm font-bold text-rose-500 dark:text-rose-400 transition-all hover:bg-rose-500/10 active:scale-95 sm:w-auto sm:rounded-2xl"
        >
          <Trash2 className="size-4 text-rose-500" />
          حذف
        </button>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="تأكيد حذف العائلة"
        description="هل أنت متأكد من رغبتك في حذف هذا السجل بشكل نهائي؟ لا يمكن التراجع عن هذا الإجراء."
        variant="delete"
        confirmText="نعم، احذف"
        cancelText="تراجع"
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={freezeOpen}
        title={isActive ? "تجميد العائلة" : "تفعيل العائلة"}
        description={
          isActive
            ? "سيتم تجميد هذه العائلة ولن تظهر في التوزيعات الجديدة."
            : "سيتم إعادة تفعيل هذه العائلة لتتمكن من استلام حصصها مجدداً."
        }
        variant={isActive ? "freeze" : "edit"}
        confirmText="تأكيد"
        cancelText="تراجع"
        onClose={() => setFreezeOpen(false)}
        onConfirm={handleToggle}
      />
    </>
  );
}
