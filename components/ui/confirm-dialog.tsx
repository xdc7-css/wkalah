"use client";

import { cn } from "@/lib/utils";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "delete" | "freeze" | "edit";
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = "edit",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmClass =
    variant === "delete"
      ? "border-red-500/50 bg-red-500/10 text-red-500 hover:bg-red-500/20 active:scale-95"
      : variant === "freeze"
      ? "border-sky-500/50 bg-sky-500/10 text-sky-500 hover:bg-sky-500/20 active:scale-95"
      : "border-accent/50 bg-accent/10 text-accent hover:bg-accent/20 active:scale-95";

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm animate-in fade-in duration-300 sm:items-center sm:p-4 sm:backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="group relative flex w-full flex-col overflow-hidden rounded-t-[32px] border-t border-border bg-card pb-10 pt-8 px-6 shadow-2xl animate-in slide-in-from-bottom-full duration-500 sm:max-w-md sm:rounded-[32px] sm:border sm:pb-8 sm:zoom-in-95 sm:slide-in-from-bottom-5 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-muted sm:hidden" />

        {/* Luminous Red Glow for Delete Variant */}
        {variant === "delete" && (
          <div className="absolute -top-24 -right-24 h-48 w-48 bg-red-500/10 blur-[80px] transition-opacity group-hover:opacity-80" />
        )}

        <div className="relative text-center sm:text-right">
          <h3 className="text-2xl font-black text-foreground sm:text-3xl font-heading leading-tight tracking-tight">
            {title}
          </h3>
          {description ? (
            <p className="mt-4 text-sm leading-[1.6] text-muted-foreground sm:mt-5 sm:text-base sm:leading-[1.8] font-medium">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "inline-flex h-12 w-full items-center justify-center rounded-2xl border px-8 text-sm font-black transition-all active:scale-95 sm:h-11 sm:w-auto sm:min-w-[140px] order-1 sm:order-2",
              confirmClass
            )}
          >
            {confirmText}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 w-full items-center justify-center rounded-[18px] border border-border bg-secondary/50 px-6 text-sm font-black text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95 sm:h-11 sm:w-auto sm:min-w-[100px] order-2 sm:order-1"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}