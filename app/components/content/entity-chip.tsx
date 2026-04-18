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
        "inline",
        "text-brand font-semibold underline decoration-brand underline-offset-2",
        "cursor-pointer whitespace-nowrap",
        "transition-colors duration-[200ms]",
        "hover:text-brand-h hover:decoration-brand-h",
        className
      )}
    >
{ticker ?? name}
    </Link>
  );
}
