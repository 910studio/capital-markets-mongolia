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

/* ── InsightsGrid ──────────────────────── */

export function InsightsGrid({ articles }: InsightsGridProps) {
  return (
    <div className="grid-dense">
      {articles.map((article) => (
        <ContentCard
          key={article.slug}
          title={article.title}
          excerpt={article.excerpt}
          badge={article.badge}
          author={article.author}
          date={article.date}
          readTime={article.readTime}
          featured={article.featured}
          href={`/insights/${article.slug}`}
          image={article.image}
        />
      ))}
    </div>
  );
}
