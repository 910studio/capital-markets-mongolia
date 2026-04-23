import Link from "next/link";
import { cn } from "@/app/lib/cn";

type ResearchBadgeVariant = "research" | "article" | "update";

interface ResearchItem {
  badge: string;
  variant: ResearchBadgeVariant;
  title: string;
  date: string;
  href: string;
}

const BADGE_STYLES: Record<ResearchBadgeVariant, string> = {
  research: "bg-brand-m text-brand",
  article: "bg-pos-m text-pos",
  update: "bg-signal-m text-signal",
};

const RESEARCH_ITEMS: ResearchItem[] = [
  {
    badge: "Research",
    variant: "research",
    title: "Mongolia's Mining Sector: Q1 2026 Performance Review",
    date: "Apr 1",
    href: "/insights/mongolia-mining-sector-2026-outlook",
  },
  {
    badge: "Article",
    variant: "article",
    title: "Khan Bank Reports 23% Revenue Growth in Latest Earnings",
    date: "Mar 28",
    href: "/insights/khan-resources-uranium",
  },
  {
    badge: "Market Brief",
    variant: "update",
    title: "MIF 2026 Preview: What Global Investors Need to Know",
    date: "Mar 25",
    href: "/insights/mse-monthly-march-2026",
  },
  {
    badge: "Article",
    variant: "article",
    title: "Erdene Resource: Bayan Khundii Project Technical Update",
    date: "Mar 20",
    href: "/insights/erdene-resource-q4-2025",
  },
];

export function LatestResearchWidget() {
  return (
    <div className="widget">
      <div className="widget-header">
        <span>Latest Research</span>
        <Link
          href="/insights"
          className="font-mono text-[10px] font-medium text-brand transition-colors hover:text-brand-h no-underline"
        >
          View All &rarr;
        </Link>
      </div>

      <div>
        {RESEARCH_ITEMS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="flex items-center gap-3 border-b border-border-s px-5 py-3 transition-colors last:border-b-0 hover:bg-brand-m no-underline text-fg"
          >
            <span
              className={cn(
                "shrink-0 whitespace-nowrap rounded-xs px-2 py-0.5 font-display text-[10px] font-semibold",
                BADGE_STYLES[item.variant]
              )}
            >
              {item.badge}
            </span>
            <span className="flex-1 text-[13px] font-semibold leading-[1.3]">
              {item.title}
            </span>
            <span className="shrink-0 whitespace-nowrap font-mono text-[10px] text-fg-2">
              {item.date}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
