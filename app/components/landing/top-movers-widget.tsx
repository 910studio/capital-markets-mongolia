import Link from "next/link";
import { cn } from "@/app/lib/cn";

interface Mover {
  ticker: string;
  name: string;
  price: string;
  change: string;
  direction: "up" | "down";
}

const MOVERS: Mover[] = [
  { ticker: "TTL", name: "Tavan Tolgoi", price: "\u20AE28,450", change: "+0.6%", direction: "up" },
  { ticker: "MMC", name: "Mongolian Mining", price: "\u20AE3,240", change: "+5.1%", direction: "up" },
  { ticker: "ERD", name: "Erdene Resource", price: "\u20AE4,820", change: "+2.8%", direction: "up" },
  { ticker: "KHAN", name: "Khan Bank", price: "\u20AE2,890", change: "-1.2%", direction: "down" },
  { ticker: "APU", name: "APU JSC", price: "\u20AE1,247", change: "-1.2%", direction: "down" },
  { ticker: "GOV", name: "Gobi Corp", price: "\u20AE3,580", change: "-0.6%", direction: "down" },
  { ticker: "GLT", name: "Golomt Bank", price: "\u20AE2,680", change: "+0.3%", direction: "up" },
  { ticker: "SHV", name: "Shivee Energy", price: "\u20AE5,400", change: "+1.1%", direction: "up" },
];

export function TopMoversWidget() {
  return (
    <div className="widget">
      {/* Header */}
      <div className="widget-header">
        <span>Top Movers</span>
        <Link
          href="/directory"
          className="font-mono text-[10px] font-medium text-brand transition-colors hover:text-brand-h"
        >
          View All &rarr;
        </Link>
      </div>

      {/* Mover rows */}
      <div>
        {MOVERS.map((m) => (
          <div
            key={m.ticker}
            className="flex items-center gap-3 border-b border-border-s px-5 py-2.5 transition-colors last:border-b-0 hover:bg-brand-m"
          >
            <span className="w-12 shrink-0 font-mono text-[13px] font-bold">
              {m.ticker}
            </span>
            <span className="flex-1 truncate text-xs text-fg-2">{m.name}</span>
            <span className="ml-auto min-w-[72px] text-right font-mono text-[13px] font-medium">
              {m.price}
            </span>
            <span
              className={cn(
                "min-w-[52px] rounded-xs px-[7px] py-0.5 text-center font-mono text-[11px] font-semibold",
                m.direction === "up" && "bg-pos-m text-pos-t",
                m.direction === "down" && "bg-neg-m text-neg-t"
              )}
            >
              {m.change}
            </span>
          </div>
        ))}
      </div>

      {/* Featured entity */}
      <Link
        href="/directory/erdene-resource"
        className="flex items-center gap-4 border-t border-border-s px-5 py-5 transition-colors hover:bg-brand-m"
      >
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--card-r)] font-display text-[15px] font-extrabold text-white"
          style={{ background: "var(--grad-brand)" }}
        >
          ER
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-bold">Erdene Resource</div>
          <div className="text-[11px] text-fg-2">
            Mining &middot; TSX:ERD &middot; Gold &amp; Base Metals
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm font-semibold">{"\u20AE"}4,820</div>
          <div className="font-mono text-[11px] font-semibold text-pos">+2.8%</div>
        </div>
      </Link>
    </div>
  );
}
