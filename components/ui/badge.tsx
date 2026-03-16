import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "destructive" | "secondary";
};

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/30",
    success: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30",
    destructive: "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
    secondary: "bg-secondary text-muted-foreground ring-1 ring-border/50",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none ${variants[variant]} ${className}`}
      {...props}
    />
  );
}