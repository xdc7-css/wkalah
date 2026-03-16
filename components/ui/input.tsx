import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={`flex h-12 w-full rounded-[18px] border border-border bg-secondary/40 px-5 py-2 text-sm font-bold text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-accent/40 focus:ring-4 focus:ring-accent/5 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";