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
  topics?: string[];
}

interface InsightsGridProps {
  articles: Article[];
  onBadgeClick?: (variant: string) => void;
  activeFilter?: string;
}

const TYPE_ORDER: { variant: string; label: string }[] = [
  { variant: "article", label: "Articles" },
  { variant: "update", label: "Market Briefs" },
  { variant: "deal", label: "Deal Insights" },
  { variant: "research", label: "Research Reports" },
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
  /* Hero row: 3 cards, middle is the latest (index 0) and featured-large */
  const featured = articles[0];
  const leftFlank = articles[1];
  const rightFlank = articles[2];
  const withImages = articles.slice(3, 6);
  const restForGrid = articles.slice(6, 10);

  // Group ALL articles by type for sections below
  const grouped = new Map<string, Article[]>();
  for (const article of articles) {
    const key = article.badge.variant;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(article);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Hero row — small / big / small, middle is the latest */}
      {featured && (
        <div className="grid grid-cols-[1fr_2fr_1fr] gap-4 items-stretch max-md:grid-cols-1 max-lg:grid-cols-1">
          {leftFlank && (
            <ContentCard
              key={leftFlank.slug}
              title={leftFlank.title}
              excerpt={leftFlank.excerpt}
              badge={leftFlank.badge}
              author={leftFlank.author}
              date={leftFlank.date}
              readTime={leftFlank.readTime}
              topics={leftFlank.topics}
              flankFeatured
              href={`/insights/${leftFlank.slug}`}
              image={leftFlank.image}
              onBadgeClick={onBadgeClick}
            />
          )}
          <ContentCard
            key={featured.slug}
            title={featured.title}
            excerpt={featured.excerpt}
            badge={featured.badge}
            author={featured.author}
            date={featured.date}
            readTime={featured.readTime}
            featured
            href={`/insights/${featured.slug}`}
            image={featured.image}
            onBadgeClick={onBadgeClick}
          />
          {rightFlank && (
            <ContentCard
              key={rightFlank.slug}
              title={rightFlank.title}
              excerpt={rightFlank.excerpt}
              badge={rightFlank.badge}
              author={rightFlank.author}
              date={rightFlank.date}
              readTime={rightFlank.readTime}
              topics={rightFlank.topics}
              flankFeatured
              href={`/insights/${rightFlank.slug}`}
              image={rightFlank.image}
              onBadgeClick={onBadgeClick}
            />
          )}
        </div>
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

      {/* 4 — Image cards (smaller) */}
      {restForGrid.length > 0 && (
        <div className="grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3">
          {restForGrid.map((article) => (
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
