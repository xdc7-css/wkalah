import * as React from "react";

type TableProps = React.TableHTMLAttributes<HTMLTableElement>;
type SectionProps = React.HTMLAttributes<HTMLTableSectionElement>;
type RowProps = React.HTMLAttributes<HTMLTableRowElement>;
type CellProps = React.ThHTMLAttributes<HTMLTableCellElement>;
type TDProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export function Table({ className = "", ...props }: TableProps) {
  return (
    <div className="w-full overflow-hidden rounded-[32px] border border-border bg-card shadow-xl ring-1 ring-border/5">
      <div className="overflow-x-auto">
        <table className={`w-full min-w-[800px] text-sm ${className}`} {...props} />
      </div>
    </div>
  );
}

export function THead({ className = "", ...props }: SectionProps) {
  return <thead className={`bg-secondary/40 border-b border-border ${className}`} {...props} />;
}

export function TBody({ className = "", ...props }: SectionProps) {
  return <tbody className={`divide-y divide-border ${className}`} {...props} />;
}

export function TR({ className = "", ...props }: RowProps) {
  return (
    <tr
      className={`transition-colors hover:bg-secondary/40 ${className}`}
      {...props}
    />
  );
}

export function TH({ className = "", ...props }: CellProps) {
  return (
    <th
      className={`px-6 py-5 text-right font-black uppercase tracking-[0.15em] text-muted-foreground text-[10px] sm:text-[11px] font-heading ${className}`}
      {...props}
    />
  );
}

export function TD({ className = "", ...props }: TDProps) {
  return (
    <td
      className={`px-5 py-5 align-middle text-secondary-foreground font-medium ${className}`}
      {...props}
    />
  );
}