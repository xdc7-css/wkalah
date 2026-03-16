import * as React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`flex h-12 w-full rounded-[18px] border border-border bg-secondary/40 px-5 py-2 text-sm font-bold text-foreground outline-none transition-all focus:border-accent/40 focus:ring-4 focus:ring-accent/5 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";