import { cn } from "@/app/lib/cn";

/* ── DataTable ──────────────────────────── */

interface DataTableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export function DataTable({ headers, children, className }: DataTableProps) {
  return (
    <table className={cn("data-table", className)}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

/* ── DataCell ───────────────────────────── */

interface DataCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  num?: boolean;
  pos?: boolean;
  neg?: boolean;
  children: React.ReactNode;
}

export function DataCell({
  num,
  pos,
  neg,
  children,
  className,
  ...props
}: DataCellProps) {
  return (
    <td
      className={cn(
        num && "num",
        pos && "data-pos",
        neg && "data-neg",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}
