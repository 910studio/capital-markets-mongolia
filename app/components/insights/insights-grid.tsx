import { ContentCard } from "./content-card";

/* ── Types ─────────────────────────────── */

type BadgeVariant = "research" | "article" | "deal" | "update" | "teaser" | "press";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  badge: { label: string; variant: BadgeVariant };
  author: string;
  date: string;
  readTime?: string;
  featured?: boolean;
  image?: React.ReactNode;
}

interface InsightsGridProps {
  articles: Article[];
}

/* ── InsightsGrid — 1 headline / 3 with images / 4-col text ── */

export function InsightsGrid({ articles }: InsightsGridProps) {
  if (articles.length === 0) return null;

  const headline = articles[0];
  const withImages = articles.slice(1, 4);
  const rest = articles.slice(4);

  return (
    <div className="flex flex-col gap-5">
      {/* 1 — Headline card (full width, big image + text) */}
      {headline && (
        <ContentCard
          key={headline.slug}
          title={headline.title}
          excerpt={headline.excerpt}
          badge={headline.badge}
          author={headline.author}
          date={headline.date}
          readTime={headline.readTime}
          featured
          href={`/insights/${headline.slug}`}
          image={headline.image}
        />
      )}

      {/* 3 — Image cards row */}
      {withImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2">
          {withImages.map((article) => (
            <ContentCard
              key={article.slug}
              title={article.title}
              excerpt={article.excerpt}
              badge={article.badge}
              author={article.author}
              date={article.date}
              readTime={article.readTime}
              href={`/insights/${article.slug}`}
              image={article.image}
              showImage
            />
          ))}
        </div>
      )}

      {/* Rest — 3-col compact text-only */}
      {rest.length > 0 && (
        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2">
          {rest.map((article) => (
            <ContentCard
              key={article.slug}
              title={article.title}
              badge={article.badge}
              author={article.author}
              date={article.date}
              readTime={article.readTime}
              href={`/insights/${article.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
