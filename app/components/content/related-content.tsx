import Link from "next/link";

/* ── Types ─────────────────────────────── */

interface RelatedItem {
  title: string;
  badge: string;
  date: string;
  href: string;
}

interface RelatedContentProps {
  items: RelatedItem[];
  title?: string;
}

/* ── RelatedContent ────────────────────── */

export function RelatedContent({ items, title = "Related Research" }: RelatedContentProps) {
  return (
    <div className="widget">
      <div className="widget-header">
        <span>{title}</span>
      </div>
      <div className="widget-body">
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="block no-underline cursor-pointer transition-opacity duration-[200ms] hover:opacity-75"
            >
              <div className="font-display font-semibold text-xs leading-[1.4] mb-[3px] line-clamp-2">
                {item.title}
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-fg-3">
                <span className="font-display font-semibold text-[9px] uppercase tracking-[0.05em] py-px px-[5px] rounded-[2px] bg-brand-m text-brand-l">
                  {item.badge}
                </span>
                <span>{item.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
