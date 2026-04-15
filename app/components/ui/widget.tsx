import { cn } from "@/app/lib/cn";

/* ── Widget ─────────────────────────────── */

interface WidgetProps {
  children: React.ReactNode;
  className?: string;
}

export function Widget({ children, className }: WidgetProps) {
  return <div className={cn("widget", className)}>{children}</div>;
}

/* ── WidgetHeader ───────────────────────── */

interface WidgetHeaderProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export function WidgetHeader({ title, action, className }: WidgetHeaderProps) {
  return (
    <div className={cn("widget-header", className)}>
      <span>{title}</span>
      {action}
    </div>
  );
}

/* ── WidgetBody ─────────────────────────── */

interface WidgetBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function WidgetBody({ children, className }: WidgetBodyProps) {
  return <div className={cn("widget-body", className)}>{children}</div>;
}
