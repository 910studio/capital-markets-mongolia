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

export type GridLayout = "default" | "no-hero" | "semafor";

interface InsightsGridProps {
  articles: Article[];
  onBadgeClick?: (variant: string) => void;
  activeFilter?: string;
  layout?: GridLayout;
  showTags?: boolean;
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

export function InsightsGrid({
  articles,
  onBadgeClick,
  activeFilter,
  layout = "default",
  showTags = false,
}: InsightsGridProps) {
  if (articles.length === 0) return null;

  // When a specific filter is active — clean browse grid, no oversized hero.
  // Rows: 3 image cards, then 4 image cards, then 4-col text-only for the rest.
  if (activeFilter && activeFilter !== "all") {
    const fImages3 = articles.slice(0, 3);
    const fImages4 = articles.slice(3, 7);
    const fRest = articles.slice(7);

    return (
      <div className="flex flex-col gap-5">
        {fImages3.length > 0 && (
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2">
            {fImages3.map((article) => (
              <ContentCard
                key={article.slug}
                title={article.title}
                excerpt={article.excerpt}
                badge={article.badge}
                author={article.author}
                date={article.date}
                readTime={article.readTime}
                topics={article.topics}
                showTopics={showTags}
                href={`/insights/${article.slug}`}
                image={article.image}
                showImage={!!article.image}
                onBadgeClick={onBadgeClick}
              />
            ))}
          </div>
        )}
        {fImages4.length > 0 && (
          <div className="grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3">
            {fImages4.map((article) => (
              <ContentCard
                key={article.slug}
                title={article.title}
                excerpt={article.excerpt}
                badge={article.badge}
                author={article.author}
                date={article.date}
                readTime={article.readTime}
                topics={article.topics}
                showTopics={showTags}
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
                topics={article.topics}
                showTopics={showTags}
                href={`/insights/${article.slug}`}
                onBadgeClick={onBadgeClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── Build the hero block based on layout ── */

  // Semafor hero: 70/30 — one big image headliner + vertical text column
  const renderSemaforHero = () => {
    const headliner = articles[0];
    const sideList = articles.slice(1, 5); // 4 text-only in the 30% column
    if (!headliner) return null;
    return (
      <div className="grid grid-cols-[7fr_3fr] gap-4 items-stretch max-lg:grid-cols-1">
        <ContentCard
          key={headliner.slug}
          title={headliner.title}
          excerpt={headliner.excerpt}
          badge={headliner.badge}
          author={headliner.author}
          date={headliner.date}
          readTime={headliner.readTime}
          topics={headliner.topics}
          showTopics={showTags}
          featured
          fillHeight
          href={`/insights/${headliner.slug}`}
          image={headliner.image}
          onBadgeClick={onBadgeClick}
        />
        <div className="flex flex-col gap-3 min-w-0 h-full">
          {sideList.map((article) => (
            <ContentCard
              key={article.slug}
              title={article.title}
              badge={article.badge}
              author={article.author}
              date={article.date}
              readTime={article.readTime}
              topics={article.topics}
              showTopics={showTags}
              href={`/insights/${article.slug}`}
              onBadgeClick={onBadgeClick}
            />
          ))}
        </div>
      </div>
    );
  };

  // Default hero: 1-3-1 flanked row
  const renderDefaultHero = () => {
    const featured = articles[0];
    const leftFlank = articles[1];
    const rightFlank = articles[2];
    if (!featured) return null;
    return (
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
            showTopics={showTags}
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
          topics={featured.topics}
          showTopics={showTags}
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
            showTopics={showTags}
            flankFeatured
            href={`/insights/${rightFlank.slug}`}
            image={rightFlank.image}
            onBadgeClick={onBadgeClick}
          />
        )}
      </div>
    );
  };

  /* ── Compute slices per layout ── */
  // default: hero uses [0..3], withImages [3..6], restForGrid [6..10]
  // no-hero: no hero row, withImages [0..3], restForGrid [3..7]
  // semafor: hero uses [0..5] (1 + 4 text col), withImages [5..8], textOnlyRow [8..12]

  let heroNode: React.ReactNode = null;
  let withImages: Article[] = [];
  let restForGrid: Article[] = [];
  let textOnlyRow: Article[] = [];

  if (layout === "no-hero") {
    withImages = articles.slice(0, 3);
    restForGrid = articles.slice(3, 7);
  } else if (layout === "semafor") {
    heroNode = renderSemaforHero();
    withImages = articles.slice(5, 8);
    textOnlyRow = articles.slice(8, 12);
  } else {
    heroNode = renderDefaultHero();
    withImages = articles.slice(3, 6);
    restForGrid = articles.slice(6, 10);
  }

  // Group ALL articles by type for sections below
  const grouped = new Map<string, Article[]>();
  for (const article of articles) {
    const key = article.badge.variant;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(article);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Hero row */}
      {heroNode}

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
              topics={article.topics}
              showTopics={showTags}
              href={`/insights/${article.slug}`}
              image={article.image}
              showImage
              onBadgeClick={onBadgeClick}
            />
          ))}
        </div>
      )}

      {/* 4 — Image cards (smaller) — default & no-hero */}
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
              topics={article.topics}
              showTopics={showTags}
              href={`/insights/${article.slug}`}
              image={article.image}
              showImage={!!article.image}
              onBadgeClick={onBadgeClick}
            />
          ))}
        </div>
      )}

      {/* 4 — Text-only row — semafor bottom row */}
      {textOnlyRow.length > 0 && (
        <div className="grid grid-cols-4 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2 max-xl:grid-cols-3">
          {textOnlyRow.map((article) => (
            <ContentCard
              key={article.slug}
              title={article.title}
              badge={article.badge}
              author={article.author}
              date={article.date}
              readTime={article.readTime}
              topics={article.topics}
              showTopics={showTags}
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
                    topics={article.topics}
                    showTopics={showTags}
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
                      topics={article.topics}
                      showTopics={showTags}
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
