"use client";

import { CheckCircle2, AlertCircle, Info } from "lucide-react";

type AppToastProps = {
  open: boolean;
  title: string;
  description?: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
};

export function AppToast({
  open,
  title,
  description,
  type = "info",
  onClose,
}: AppToastProps) {
  if (!open) return null;

  const styles =
    type === "success"
      ? {
          wrap: "border-emerald-500/20 bg-emerald-500/10",
          icon: "text-emerald-500",
          title: "text-foreground",
          desc: "text-muted-foreground",
        }
      : type === "error"
      ? {
          wrap: "border-rose-500/20 bg-rose-500/10",
          icon: "text-rose-500",
          title: "text-foreground",
          desc: "text-muted-foreground",
        }
      : {
          wrap: "border-accent/20 bg-accent/10",
          icon: "text-accent",
          title: "text-foreground",
          desc: "text-muted-foreground",
        };

  return (
    <div className="fixed left-4 top-4 z-[110] w-full max-w-sm">
      <div
        className={`rounded-[24px] border px-4 py-4 shadow-2xl backdrop-blur-xl ${styles.wrap}`}
      >
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 ${styles.icon}`}>
            {type === "success" ? (
              <CheckCircle2 className="size-5" />
            ) : type === "error" ? (
              <AlertCircle className="size-5" />
            ) : (
              <Info className="size-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className={`text-sm font-extrabold ${styles.title}`}>{title}</p>
            {description ? (
              <p className={`mt-1 text-sm leading-6 ${styles.desc}`}>
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-2 py-1 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}