import * as React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`flex min-h-[100px] w-full rounded-2xl border border-border bg-secondary/40 px-4 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/50 focus:border-accent/40 focus:ring-4 focus:ring-accent/5 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";