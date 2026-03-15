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
      ? "border-red-500/50 bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:bg-red-500/20 hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]"
      : variant === "freeze"
      ? "border-sky-500/50 bg-sky-500/10 text-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.2)] hover:bg-sky-500/20 hover:shadow-[0_0_25px_rgba(14,165,233,0.3)]"
      : "border-violet-500/50 bg-violet-600/10 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:bg-violet-600/20 hover:shadow-[0_0_25px_rgba(139,92,246,0.3)]";

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#081225]/60 p-0 backdrop-blur-md animate-in fade-in duration-300 sm:items-center sm:p-4 sm:bg-[#081225]/85 sm:backdrop-blur-xl"
      onClick={onClose}
    >
      <div 
        className="group relative flex w-full flex-col overflow-hidden rounded-t-[32px] border-t border-white/10 bg-[#0F1B33]/95 pb-10 pt-8 px-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl animate-in slide-in-from-bottom-full duration-500 sm:max-w-md sm:rounded-[32px] sm:border sm:pb-8 sm:shadow-[0_30_90px_rgba(0,0,0,0.6)] sm:zoom-in-95 sm:slide-in-from-bottom-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Pull Handle */}
        <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-white/10 sm:hidden" />

        {/* Luminous Red Glow for Delete Variant */}
        {variant === "delete" && (
          <div className="absolute -top-24 -right-24 h-48 w-48 bg-red-500/10 blur-[80px] transition-opacity group-hover:opacity-80" />
        )}

        <div className="relative text-center sm:text-right">
          <h3 className="text-2xl font-black text-white sm:text-3xl font-heading leading-tight tracking-tight">
            {title}
          </h3>
          {description ? (
            <p className="mt-4 text-sm leading-[1.6] text-slate-400 sm:mt-5 sm:text-base sm:leading-[1.8] opacity-90">
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
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-sm font-black text-slate-300 transition-all hover:bg-white/10 hover:text-white active:scale-95 sm:h-11 sm:w-auto sm:min-w-[100px] order-2 sm:order-1"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}