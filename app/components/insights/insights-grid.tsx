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
  onBadgeClick?: (variant: string) => void;
  activeFilter?: string;
}

const TYPE_ORDER: { variant: string; label: string }[] = [
  { variant: "article", label: "Articles" },
  { variant: "deal", label: "Deal Insights" },
  { variant: "research", label: "Research Reports" },
  { variant: "update", label: "Monthly Updates" },
  { variant: "teaser", label: "Investment Teasers" },
  { variant: "press", label: "Press Releases" },
];

const SECTION_PREVIEW = 7;

/* ── InsightsGrid ── */

export function InsightsGrid({ articles, onBadgeClick, activeFilter }: InsightsGridProps) {
  if (articles.length === 0) return null;

  // When a specific filter is active — 1-3-4 grid
  if (activeFilter && activeFilter !== "all") {
    const fHeadline = articles[0];
    const fImages = articles.slice(1, 4);
    const fRest = articles.slice(4);

    return (
      <div className="flex flex-col gap-5">
        {fHeadline && (
          <ContentCard
            key={fHeadline.slug}
            title={fHeadline.title}
            excerpt={fHeadline.excerpt}
            badge={fHeadline.badge}
            author={fHeadline.author}
            date={fHeadline.date}
            readTime={fHeadline.readTime}
            featured
            href={`/insights/${fHeadline.slug}`}
            image={fHeadline.image}
            onBadgeClick={onBadgeClick}
          />
        )}
        {fImages.length > 0 && (
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2">
            {fImages.map((article) => (
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
                showImage={!!article.image}
                onBadgeClick={onBadgeClick}
              />
            ))}
          </div>
        )}
        {fRest.length > 0 && (
          <div className="grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3">
            {fRest.map((article) => (
              <ContentCard
                key={article.slug}
                title={article.title}
                badge={article.badge}
                author={article.author}
                date={article.date}
                readTime={article.readTime}
                href={`/insights/${article.slug}`}
                onBadgeClick={onBadgeClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default view: 1-3-4 hero grid + type sections below
  const headline = articles[0];
  const withImages = articles.slice(1, 4);
  const restForGrid = articles.slice(4, 8);

  // Group ALL articles by type for sections below
  const grouped = new Map<string, Article[]>();
  for (const article of articles) {
    const key = article.badge.variant;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(article);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 1 — Headline */}
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
          onBadgeClick={onBadgeClick}
        />
      )}

      {/* 3 — Image cards */}
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
              onBadgeClick={onBadgeClick}
            />
          ))}
        </div>
      )}

      {/* 4 — Text-only cards */}
      {restForGrid.length > 0 && (
        <div className="grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3">
          {restForGrid.map((article) => (
            <ContentCard
              key={article.slug}
              title={article.title}
              badge={article.badge}
              author={article.author}
              date={article.date}
              readTime={article.readTime}
              href={`/insights/${article.slug}`}
              onBadgeClick={onBadgeClick}
            />
          ))}
        </div>
      )}

      {/* ── Type sections ── */}
      {TYPE_ORDER.map(({ variant, label }) => {
        const items = grouped.get(variant);
        if (!items || items.length === 0) return null;

        const preview = items.slice(0, SECTION_PREVIEW);
        const hasMore = items.length > SECTION_PREVIEW;

        return (
          <div key={variant} className="mt-4">
            <div className="flex items-center justify-between py-2 border-b border-border-s mb-5 mt-6 sticky top-[var(--header-h)] z-10 bg-[var(--bg)]">
              <button
                onClick={() => onBadgeClick?.(variant)}
                className="font-display font-extrabold text-xl tracking-tight text-fg cursor-pointer bg-transparent border-none p-0 hover:text-brand transition-colors"
              >
                {label}
                <span className="text-fg-3 font-normal text-base ml-2">{items.length}</span>
              </button>
              {hasMore && (
                <button
                  onClick={() => onBadgeClick?.(variant)}
                  className="text-sm font-semibold text-brand-l hover:text-brand cursor-pointer bg-transparent border-none transition-colors font-display"
                >
                  View all →
                </button>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {/* First 3 — image cards */}
              <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2">
                {preview.slice(0, 3).map((article) => (
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
                    showImage={!!article.image}
                    onBadgeClick={onBadgeClick}
                  />
                ))}
              </div>
              {/* Rest — 4-col text-only */}
              {preview.length > 3 && (
                <div className="grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3">
                  {preview.slice(3).map((article) => (
                    <ContentCard
                      key={article.slug}
                      title={article.title}
                      badge={article.badge}
                      author={article.author}
                      date={article.date}
                      readTime={article.readTime}
                      href={`/insights/${article.slug}`}
                      onBadgeClick={onBadgeClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
