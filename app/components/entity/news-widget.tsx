import { Widget, WidgetHeader, WidgetBody } from "@/app/components/ui";

/* ── Types ─────────────────────────────── */

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  href?: string;
}

interface NewsWidgetProps {
  items: NewsItem[];
  maxItems?: number;
  className?: string;
}

/* ── Component ─────────────────────────── */

export function NewsWidget({
  items,
  maxItems = 5,
  className,
}: NewsWidgetProps) {
  const displayed = items.slice(0, maxItems);

  return (
    <Widget className={className}>
      <WidgetHeader title="Market News" />
      <WidgetBody>
        {displayed.map((item) => (
          <a
            key={item.id}
            href={item.href ?? "#"}
            className="block py-3 border-b border-border-s last:border-b-0 last:pb-0 no-underline transition-colors duration-150 hover:bg-brand-m -mx-[var(--w-p)] px-[var(--w-p)]"
          >
            <div className="font-display font-semibold text-sm text-fg leading-snug mb-1 line-clamp-2 hover:text-brand transition-colors">
              {item.title}
            </div>
            <div className="text-[11px] text-fg-3 flex items-center gap-1.5">
              <span>{item.source}</span>
              <span className="w-[3px] h-[3px] rounded-full bg-fg-3" />
              <span>{item.date}</span>
            </div>
          </a>
        ))}
      </WidgetBody>
    </Widget>
  );
}
