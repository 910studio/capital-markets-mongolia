import Link from "next/link";
import { Widget, WidgetHeader, WidgetBody, Badge } from "@/app/components/ui";

/* ── Types ─────────────────────────────── */

type ResearchType = "markets" | "companies" | "sectors" | "insights" | "ai";

interface ResearchItem {
  id: string;
  title: string;
  type: ResearchType;
  typeLabel: string;
  date: string;
  href?: string;
}

interface ResearchWidgetProps {
  items: ResearchItem[];
  maxItems?: number;
  className?: string;
}

/* ── Component ─────────────────────────── */

export function ResearchWidget({
  items,
  maxItems = 5,
  className,
}: ResearchWidgetProps) {
  const sorted = [...items]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxItems);

  return (
    <Widget className={className}>
      <WidgetHeader
        title="CMM Research"
        action={
          <Link
            href="/insights"
            className="font-display font-semibold text-xs text-brand-l hover:text-brand transition-colors no-underline"
          >
            View All &rarr;
          </Link>
        }
      />
      <WidgetBody>
        {sorted.map((item) => (
          <Link
            key={item.id}
            href={item.href ?? `/insights/${item.id}`}
            className="block py-3 border-b border-border-s last:border-b-0 last:pb-0 no-underline transition-colors duration-150 hover:bg-brand-m -mx-[var(--w-p)] px-[var(--w-p)]"
          >
            <div className="font-display font-semibold text-sm text-fg leading-snug mb-1 hover:text-brand transition-colors">
              {item.title}
            </div>
            <div className="text-[11px] text-fg-3 flex items-center gap-1.5">
              <Badge variant={item.type} className="!text-[9px]">
                {item.typeLabel}
              </Badge>
              <span className="w-[3px] h-[3px] rounded-full bg-fg-3" />
              <span>{item.date}</span>
            </div>
          </Link>
        ))}
      </WidgetBody>
    </Widget>
  );
}
