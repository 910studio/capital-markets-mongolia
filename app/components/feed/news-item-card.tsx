import Link from "next/link";
import {
  type MockNewsItem,
  MOCK_ENTITIES,
  NEWS_CATEGORY_COLORS,
  NEWS_CATEGORY_LABELS,
} from "@/app/lib/mock-data";
import { cn } from "@/app/lib/cn";

interface NewsItemCardProps {
  item: MockNewsItem;
  variant?: "default" | "compact" | "inline";
  showCategory?: boolean;
  showEntities?: boolean;
}

function relativeTime(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diff = Math.max(0, now - t);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function NewsItemCard({
  item,
  variant = "default",
  showCategory = true,
  showEntities = true,
}: NewsItemCardProps) {
  const entityRefs = item.entitySlugs
    .map((slug) => MOCK_ENTITIES.find((e) => e.slug === slug))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  const lowConfidence = item.confidence < 0.75;
  const categoryColor = NEWS_CATEGORY_COLORS[item.category];

  const detailHref = `/feed/${item.id}`;

  if (variant === "inline") {
    return (
      <Link
        href={detailHref}
        className="block no-underline group border-b border-border-s last:border-b-0 hover:bg-brand-m transition-colors"
      >
        <article className="px-5 py-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <CategoryDot color={categoryColor} />
            <span className="font-mono text-[10px] uppercase tracking-badge text-fg-3">
              {NEWS_CATEGORY_LABELS[item.category]}
            </span>
            {item.isBreaking && <BreakingBadge />}
            {lowConfidence && <LowConfidenceBadge />}
          </div>
          <h3 className="line-clamp-2 font-display text-[13px] font-semibold leading-[1.35] text-fg transition-colors group-hover:text-brand">
            {item.headline}
          </h3>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-fg-3 mt-1">
            <span className="font-semibold text-fg-2">{item.source}</span>
            <span>·</span>
            <span>{relativeTime(item.publishedAt)}</span>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={detailHref} className="card !p-4 block no-underline group">
        <div className="flex items-center gap-2 mb-2">
          {showCategory && <CategoryDot color={categoryColor} withLabel category={item.category} />}
          {item.isBreaking && <BreakingBadge />}
          {lowConfidence && <LowConfidenceBadge />}
        </div>
        <h3 className="font-display text-sm font-bold leading-[1.35] line-clamp-3 text-fg group-hover:text-brand transition-colors">
          {item.headline}
        </h3>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-fg-3 mt-2">
          <span className="font-semibold text-fg-2">{item.source}</span>
          <span>·</span>
          <span>{relativeTime(item.publishedAt)}</span>
        </div>
      </Link>
    );
  }

  return (
    <article className="card relative group flex flex-col gap-3">
      {/* Stretched link covers the card; sibling links remain clickable via z-index */}
      <Link
        href={detailHref}
        aria-label={item.headline}
        className="absolute inset-0 z-0 rounded-[var(--card-r)]"
      />

      <div className="relative z-10 flex items-center gap-2 flex-wrap pointer-events-none">
        {showCategory && <CategoryDot color={categoryColor} withLabel category={item.category} />}
        {item.isBreaking && <BreakingBadge />}
        {lowConfidence && <LowConfidenceBadge />}
        <span className="ml-auto font-mono text-[10px] text-fg-3">
          {relativeTime(item.publishedAt)}
        </span>
      </div>

      <h3 className="relative z-10 font-display text-base font-extrabold leading-[1.3] tracking-tight text-fg group-hover:text-brand transition-colors pointer-events-none">
        {item.headline}
      </h3>

      {item.summary && (
        <p className="relative z-10 text-sm text-fg-2 leading-[1.55] line-clamp-3 pointer-events-none">
          {item.summary}
        </p>
      )}

      <div className="relative z-10 flex items-center justify-between gap-3 mt-auto pt-2 border-t border-border-s pointer-events-none">
        <div className="font-mono text-[11px] text-fg-2 font-semibold">
          {item.source}
        </div>
        {showEntities && entityRefs.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap justify-end pointer-events-auto">
            {entityRefs.slice(0, 3).map((e) => (
              <Link
                key={e.slug}
                href={`/directory/${e.slug}`}
                className="font-body font-medium text-[11px] py-0.5 px-2 rounded-[var(--btn-r)] bg-brand-m text-brand no-underline hover:bg-brand hover:text-white transition-colors"
              >
                {e.ticker ?? e.name}
              </Link>
            ))}
            {entityRefs.length > 3 && (
              <span className="font-mono text-[10px] text-fg-3">
                +{entityRefs.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function CategoryDot({
  color,
  withLabel,
  category,
}: {
  color: string;
  withLabel?: boolean;
  category?: keyof typeof NEWS_CATEGORY_LABELS;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: color }}
      />
      {withLabel && category && (
        <span className="font-mono text-[10px] uppercase tracking-badge text-fg-2 font-semibold">
          {NEWS_CATEGORY_LABELS[category]}
        </span>
      )}
    </span>
  );
}

function BreakingBadge() {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-badge font-bold text-[color:var(--neg-t)] bg-[var(--neg-m)] px-1.5 py-0.5 rounded-[var(--btn-r)]">
      <span className="w-1 h-1 rounded-full bg-[color:var(--neg)] animate-pulse" />
      Breaking
    </span>
  );
}

function LowConfidenceBadge() {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[10px] uppercase tracking-badge font-semibold",
        "text-fg-3 border border-border bg-[var(--surface-down)] px-1.5 py-0.5 rounded-[var(--btn-r)]"
      )}
      title="Low-confidence AI tagging — pending analyst review"
    >
      Unverified
    </span>
  );
}

export { relativeTime };
