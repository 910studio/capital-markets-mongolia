import Link from "next/link";
import { MOCK_NEWS } from "@/app/lib/mock-data";
import { NewsItemCard } from "@/app/components/feed/news-item-card";

interface EntityNewsWidgetProps {
  entitySlug: string;
  limit?: number;
  title?: string;
}

export function EntityNewsWidget({
  entitySlug,
  limit = 5,
  title = "In the news",
}: EntityNewsWidgetProps) {
  const items = MOCK_NEWS.filter((n) => n.entitySlugs.includes(entitySlug))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, limit);

  if (items.length === 0) {
    return (
      <div className="widget">
        <div className="widget-header">
          <span>{title}</span>
        </div>
        <div className="widget-body">
          <p className="text-sm text-fg-3 leading-[1.5]">
            No recent news matched to this entity.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="widget">
      <div className="widget-header">
        <span>{title}</span>
        <Link
          href={`/feed?entity=${entitySlug}`}
          className="font-mono text-[10px] uppercase tracking-badge text-brand hover:text-brand-h no-underline"
        >
          See all →
        </Link>
      </div>
      <div>
        {items.map((item) => (
          <NewsItemCard key={item.id} item={item} variant="inline" />
        ))}
      </div>
    </div>
  );
}
