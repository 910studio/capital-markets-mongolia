import Link from "next/link";
import { cn } from "@/app/lib/cn";

/* ── Types ─────────────────────────────── */

interface EntityChipProps {
  name: string;
  ticker?: string;
  href: string;
  className?: string;
}

/* ── EntityChip ────────────────────────── */

export function EntityChip({ name, ticker, href, className }: EntityChipProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 py-[1px] px-[7px]",
        "rounded-[2px] bg-surface text-brand",
        "font-display font-semibold text-xs",
        "no-underline cursor-pointer whitespace-nowrap",
        "transition-all duration-[200ms]",
        "hover:bg-brand-m align-baseline",
        className
      )}
    >
      <span className="inline-block w-1 h-1 rounded-full bg-brand shrink-0" />
      {ticker ?? name}
    </Link>
  );
}
