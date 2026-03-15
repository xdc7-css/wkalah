import * as React from "react";

type TableProps = React.TableHTMLAttributes<HTMLTableElement>;
type SectionProps = React.HTMLAttributes<HTMLTableSectionElement>;
type RowProps = React.HTMLAttributes<HTMLTableRowElement>;
type CellProps = React.ThHTMLAttributes<HTMLTableCellElement>;
type TDProps = React.TdHTMLAttributes<HTMLTableCellElement>;

export function Table({ className = "", ...props }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-[24px] border border-white/10 bg-[#0a0c10]/40 backdrop-blur-md">
      <table className={`w-full min-w-[760px] text-sm ${className}`} {...props} />
    </div>
  );
}

export function THead({ className = "", ...props }: SectionProps) {
  return <thead className={`bg-white/5 border-b border-white/10 ${className}`} {...props} />;
}

export function TBody({ className = "", ...props }: SectionProps) {
  return <tbody className={className} {...props} />;
}

export function TR({ className = "", ...props }: RowProps) {
  return (
    <tr
      className={`border-b border-white/5 last:border-b-0 transition-colors hover:bg-white/[0.03] ${className}`}
      {...props}
    />
  );
}

export function TH({ className = "", ...props }: CellProps) {
  return (
    <th
      className={`px-5 py-4 text-right font-bold text-slate-400 uppercase tracking-wider text-[11px] ${className}`}
      {...props}
    />
  );
}

export function TD({ className = "", ...props }: TDProps) {
  return (
    <td
      className={`px-5 py-5 align-middle text-slate-300 font-medium ${className}`}
      {...props}
    />
  );
}