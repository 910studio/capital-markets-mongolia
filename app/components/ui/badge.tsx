import { cn } from "@/app/lib/cn";

type BadgeVariant =
  | "markets"
  | "companies"
  | "sectors"
  | "insights"
  | "ai"
  | "signal"
  | "pos"
  | "neg";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span className={cn("badge", `badge-${variant}`, className)}>
      {children}
    </span>
  );
}
