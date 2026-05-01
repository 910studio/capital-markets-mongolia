import Link from "next/link";
import { ContentCard } from "./content-card";
import { Badge } from "@/app/components/ui";

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

export type GridLayout = "default" | "featured" | "editorial";

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

/* ── EditorialListItem (used by editorial hero right column) ── */

function EditorialListItem({
  article,
  onBadgeClick,
}: {
  article: Article;
  onBadgeClick?: (variant: string) => void;
}) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="group flex items-start gap-3 py-3 border-b border-border-s last:border-b-0 last:pb-0 first:pt-0 no-underline"
    >
      {article.image && (
        <div className="relative w-40 aspect-[4/3] rounded-[var(--card-r)] overflow-hidden shrink-0 border border-border-s bg-surface max-md:w-32">
          {article.image}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBadgeClick?.(article.badge.variant);
          }}
          className="bg-transparent border-none p-0 cursor-pointer"
        >
          <Badge variant={article.badge.variant} className="!text-[10px]">
            {article.badge.label}
          </Badge>
        </button>
        <h3 className="font-display font-bold text-sm text-fg leading-snug mt-1.5 line-clamp-2 group-hover:text-brand transition-colors">
          {article.title}
        </h3>
        <div className="text-[11px] text-fg-3 mt-1.5 flex items-center gap-1.5">
          <span>{article.author}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-fg-3" />
          <span>{article.date}</span>
          {article.readTime && (
            <>
              <span className="w-[3px] h-[3px] rounded-full bg-fg-3" />
              <span>{article.readTime}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

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

  /* ── Hero renders ─────────────────────── */

  // Featured hero: one wide horizontal card. Image left 60%, text right 40%.
  const renderFeaturedHero = () => {
    const a = articles[0];
    if (!a) return null;
    return (
      <Link
        href={`/insights/${a.slug}`}
        className="group grid grid-cols-[3fr_2fr] gap-0 rounded-[var(--card-r)] overflow-hidden border border-border-s bg-[var(--white)] no-underline max-lg:grid-cols-1"
      >
        {a.image && (
          <div className="relative aspect-[16/10] max-lg:aspect-[16/9] overflow-hidden bg-surface">
            {a.image}
          </div>
        )}
        <div className="flex flex-col justify-center gap-3 p-6 max-lg:p-5">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onBadgeClick?.(a.badge.variant);
            }}
            className="bg-transparent border-none p-0 cursor-pointer self-start"
          >
            <Badge variant={a.badge.variant}>{a.badge.label}</Badge>
          </button>
          <h2 className="font-display font-extrabold text-3xl tracking-tight leading-[1.15] text-fg group-hover:text-brand transition-colors max-lg:text-2xl">
            {a.title}
          </h2>
          <p className="text-sm text-fg-2 leading-relaxed line-clamp-3">
            {a.excerpt}
          </p>
          <div className="text-xs text-fg-3 flex items-center gap-1.5 mt-1">
            <span className="font-medium text-fg-2">{a.author}</span>
            <span className="w-[3px] h-[3px] rounded-full bg-fg-3" />
            <span>{a.date}</span>
            {a.readTime && (
              <>
                <span className="w-[3px] h-[3px] rounded-full bg-fg-3" />
                <span>{a.readTime}</span>
              </>
            )}
          </div>
        </div>
      </Link>
    );
  };

  // Editorial hero: 60/40 split — featured card left, 4 list items right (with thumbnails)
  const renderEditorialHero = () => {
    const headliner = articles[0];
    const sideList = articles.slice(1, 4);
    if (!headliner) return null;
    return (
      <div className="grid grid-cols-[3fr_2fr] gap-6 items-stretch lg:min-h-[540px] max-lg:grid-cols-1">
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
        <div className="flex flex-col min-w-0 h-full pl-6 border-l border-border-s justify-between max-lg:border-l-0 max-lg:pl-0 max-lg:border-t max-lg:pt-4">
          {sideList.map((article) => (
            <EditorialListItem
              key={article.slug}
              article={article}
              onBadgeClick={onBadgeClick}
            />
          ))}
        </div>
      </div>
    );
  };

  /* ── Compute slices per layout ── */
  // default: no hero, withImages [0..3], restForGrid [3..7]
  // featured: hero uses [0], withImages [1..4], restForGrid [4..8]
  // editorial: hero uses [0..5] (1 + 4 list), withImages [5..8], restForGrid [8..12]

  let heroNode: React.ReactNode = null;
  let withImages: Article[] = [];
  let restForGrid: Article[] = [];

  if (layout === "featured") {
    heroNode = renderFeaturedHero();
    withImages = articles.slice(1, 4);
    restForGrid = articles.slice(4, 8);
  } else if (layout === "editorial") {
    heroNode = renderEditorialHero();
    withImages = articles.slice(4, 7);
    restForGrid = articles.slice(7, 11);
  } else {
    // default — clean browse grid, no hero
    withImages = articles.slice(0, 3);
    restForGrid = articles.slice(3, 7);
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

      {/* 4 — Smaller cards (with images when available) */}
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
