"use client";

import Link from "next/link";
import { useReveal } from "@/app/lib/use-reveal";

/* ════════════════════════════════════════════════════════════════
   InsightsGrid — Semafor-style ruled wire-service layout
   ════════════════════════════════════════════════════════════════
   Design DNA:
   - Zero card chrome (no borders, no backgrounds, no shadows on tiles)
   - Hairline rules separate everything (vertical between cols, horizontal between rows)
   - Serif headlines (Newsreader), italic byline meta
   - Section headers: thick top rule + small-caps eyebrow + thin bottom rule
   - Hero is a magazine cover (huge serif headline, image inline-floating)
   - Image only on lead per section, the rest is text-only headlines
   ════════════════════════════════════════════════════════════════ */

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
  /** Direct URL of the cover image — server-rendered into <Image> by pages. */
  coverImage?: string;
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

/* ── Reveal scope wrapper ───────────────────────── */

function Reveal({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} data-reveal-scope className={className}>
      {children}
    </Tag>
  );
}

/* ── Byline (italic serif) ───────────────────────── */

function Byline({
  author,
  date,
  readTime,
  className = "",
}: {
  author: string;
  date: string;
  readTime?: string;
  className?: string;
}) {
  return (
    <div
      className={`text-[12px] text-fg-3 italic font-[var(--font-s)] flex items-center gap-1.5 ${className}`}
      style={{ fontFamily: "var(--font-s)" }}
    >
      <span className="not-italic font-display font-semibold text-[10px] tracking-[0.08em] uppercase text-fg-2">
        {author}
      </span>
      <span className="meta-dot inline-block w-[2px] h-[2px] rounded-full bg-fg-3" />
      <span>{date}</span>
      {readTime && (
        <>
          <span className="meta-dot inline-block w-[2px] h-[2px] rounded-full bg-fg-3" />
          <span>{readTime}</span>
        </>
      )}
    </div>
  );
}

/* ── Tag (small caps, hover-to-brand) ──────────── */

function Tag({ label, variant, onClick }: { label: string; variant: BadgeVariant; onClick?: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick?.();
      }}
      className={`tag-${variant} self-start font-display font-bold text-[10px] tracking-[0.14em] uppercase cursor-pointer bg-transparent border-none p-0 transition-colors`}
    >
      {label}
    </button>
  );
}

/* ════════════════════════════════════════════════
   PRIMITIVE: Hero — magazine-cover lead story
   ════════════════════════════════════════════════ */

function Hero({
  article,
  rail,
  onBadgeClick,
}: {
  article: Article;
  rail: Article[];
  onBadgeClick?: (variant: string) => void;
}) {
  return (
    <Reveal className="flex flex-col pb-12 border-b-2 border-fg">
      {/* Lead — full width: huge serif, image floats right of body */}
      <Link href={`/insights/${article.slug}`} className="group no-underline min-w-0 block">
        <Tag label={article.badge.label} variant={article.badge.variant} onClick={() => onBadgeClick?.(article.badge.variant)} />
        <h1
          data-reveal="title"
          className="mt-4 font-bold tracking-[-0.02em] leading-[1.02] text-fg group-hover:text-brand transition-colors"
          style={{
            fontFamily: "var(--font-s)",
            fontSize: "clamp(1.8rem, 4.4vw, 3.6rem)",
          }}
        >
          <span>{article.title}</span>
        </h1>

        {article.image && (
          <div className="float-right ml-8 mt-5 mb-2 w-[42%] max-md:float-none max-md:ml-0 max-md:w-full max-md:mt-5">
            <div className="relative aspect-[4/3] overflow-hidden bg-surface">
              <div className="insight-img absolute inset-0" data-reveal="image">
                {article.image}
              </div>
            </div>
            <p className="mt-2 text-[11px] text-fg-3 italic" style={{ fontFamily: "var(--font-s)" }}>
              Photo · {article.author}
            </p>
          </div>
        )}

        <p
          className="mt-6 text-fg-2 leading-[1.55] max-w-[760px]"
          style={{ fontFamily: "var(--font-s)", fontSize: "1.1875rem" }}
        >
          {article.excerpt}
        </p>

        <div className="clear-both pt-6 mt-6 border-t border-border-s">
          <Byline author={article.author} date={article.date} readTime={article.readTime} />
        </div>
      </Link>

      {/* Rundown — horizontal scroll rail below the headliner.
          Fixed-width cards (~280px) so the layout stays readable even
          when the content column is tight (filter+feed sidebars eat space). */}
      {rail.length > 0 && (
        <div className="mt-10 pt-5 border-t border-fg">
          <div className="flex items-end justify-between mb-5">
            <p className="font-display font-extrabold text-[10px] tracking-[0.18em] uppercase text-fg">
              The Rundown
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
              ↔ scroll
            </p>
          </div>
          <div
            className="overflow-x-auto scrollbar-none -mx-1"
            style={{ scrollSnapType: "x proximity" }}
          >
            <ol className="flex gap-0 min-w-fit">
              {rail.map((a, i) => (
                <RailItem
                  key={a.slug}
                  article={a}
                  index={i}
                  number={i + 1}
                  horizontal
                  onBadgeClick={onBadgeClick}
                />
              ))}
            </ol>
          </div>
        </div>
      )}
    </Reveal>
  );
}

/* ════════════════════════════════════════════════
   PRIMITIVE: RailItem — numbered headline list
   ════════════════════════════════════════════════ */

function RailItem({
  article,
  index,
  number,
  horizontal,
  onBadgeClick,
}: {
  article: Article;
  index: number;
  number?: number;
  /** If true, item is rendered as a grid cell with vertical hairlines
      between columns instead of horizontal rules between rows. */
  horizontal?: boolean;
  onBadgeClick?: (variant: string) => void;
}) {
  const liClass = horizontal
    ? "shrink-0 w-[280px] px-5 first:pl-1 last:pr-1 border-l border-border-s first:border-l-0"
    : "border-b border-border-s last:border-b-0 py-4 first:pt-3";

  const liStyle: React.CSSProperties = {
    ["--stagger-i" as string]: index,
    ...(horizontal ? { scrollSnapAlign: "start" } : {}),
  };

  return (
    <li
      data-reveal="stagger"
      style={liStyle}
      className={liClass}
    >
      <Link href={`/insights/${article.slug}`} className="group no-underline flex gap-3 min-w-0">
        {number !== undefined && (
          <span
            className="shrink-0 w-5 text-[11px] font-mono font-bold text-fg-3 tabular-nums pt-[3px]"
          >
            {String(number).padStart(2, "0")}
          </span>
        )}
        <div className="min-w-0 flex flex-col gap-1.5">
          <Tag label={article.badge.label} variant={article.badge.variant} onClick={() => onBadgeClick?.(article.badge.variant)} />
          <h3
            className="font-bold text-[15px] leading-[1.2] text-fg group-hover:text-brand transition-colors line-clamp-3"
            style={{ fontFamily: "var(--font-s)", letterSpacing: "-0.01em" }}
          >
            {article.title}
          </h3>
          <Byline author={article.author} date={article.date} />
        </div>
      </Link>
    </li>
  );
}

/* ════════════════════════════════════════════════
   PRIMITIVE: TextCard — image + serif headline, no chrome
   ════════════════════════════════════════════════ */

function TextCard({
  article,
  index,
  showImage = true,
  onBadgeClick,
}: {
  article: Article;
  index: number;
  showImage?: boolean;
  onBadgeClick?: (variant: string) => void;
}) {
  return (
    <div
      data-reveal="stagger"
      style={{ ["--stagger-i" as string]: index } as React.CSSProperties}
      className="min-w-0"
    >
      <Link href={`/insights/${article.slug}`} className="group no-underline flex flex-col gap-3 min-w-0 h-full">
        {showImage && article.image && (
          <div className="relative aspect-[4/3] overflow-hidden bg-surface mb-1">
            <div className="insight-img absolute inset-0">{article.image}</div>
          </div>
        )}
        <Tag label={article.badge.label} variant={article.badge.variant} onClick={() => onBadgeClick?.(article.badge.variant)} />
        <h3
          className="font-bold leading-[1.15] text-fg group-hover:text-brand transition-colors line-clamp-3"
          style={{ fontFamily: "var(--font-s)", fontSize: showImage ? "1.375rem" : "1.125rem", letterSpacing: "-0.015em" }}
        >
          {article.title}
        </h3>
        {showImage && article.excerpt && (
          <p
            className="text-fg-2 leading-[1.5] line-clamp-2 text-[14px]"
            style={{ fontFamily: "var(--font-s)" }}
          >
            {article.excerpt}
          </p>
        )}
        <Byline author={article.author} date={article.date} readTime={article.readTime} className="mt-auto pt-2" />
      </Link>
    </div>
  );
}

/* ════════════════════════════════════════════════
   PRIMITIVE: WireRow — text-only headlines, vertical hairlines between
   ════════════════════════════════════════════════ */

function WireRow({
  articles,
  onBadgeClick,
  cols = 4,
}: {
  articles: Article[];
  onBadgeClick?: (variant: string) => void;
  cols?: 3 | 4 | 5;
}) {
  const gridCols = cols === 5 ? "grid-cols-5" : cols === 3 ? "grid-cols-3" : "grid-cols-4";
  return (
    <Reveal className={`grid ${gridCols} gap-0 max-md:grid-cols-1 max-lg:grid-cols-2`}>
      {articles.map((a, i) => (
        <article
          key={a.slug}
          data-reveal="stagger"
          style={{ ["--stagger-i" as string]: i } as React.CSSProperties}
          className="px-5 first:pl-0 last:pr-0 lg:border-l lg:border-border-s lg:first:border-l-0 max-lg:border-t max-lg:border-border-s max-lg:py-5 max-lg:first:border-t-0 max-lg:first:pt-0"
        >
          <Link href={`/insights/${a.slug}`} className="group no-underline flex flex-col gap-2 min-w-0">
            <Tag label={a.badge.label} variant={a.badge.variant} onClick={() => onBadgeClick?.(a.badge.variant)} />
            <h3
              className="font-bold leading-[1.2] text-fg group-hover:text-brand transition-colors line-clamp-4"
              style={{ fontFamily: "var(--font-s)", fontSize: "1rem", letterSpacing: "-0.01em" }}
            >
              {a.title}
            </h3>
            <Byline author={a.author} date={a.date} className="mt-1" />
          </Link>
        </article>
      ))}
    </Reveal>
  );
}

/* ════════════════════════════════════════════════
   PRIMITIVE: SectionHead — thick rule above, small caps, thin rule below
   ════════════════════════════════════════════════ */

function SectionHead({
  label,
  count,
  hasMore,
  onMore,
}: {
  label: string;
  count: number;
  hasMore?: boolean;
  onMore?: () => void;
}) {
  return (
    <div className="border-t-[2px] border-fg pt-3 mb-7 flex items-end justify-between sticky top-[var(--header-h)] z-10 bg-[var(--bg)]">
      <h2 className="font-display font-extrabold text-[28px] tracking-tight text-fg leading-none">
        {label}
        <span className="ml-3 text-[12px] font-mono font-medium text-fg-3 tracking-[0.05em] tabular-nums align-baseline">
          {String(count).padStart(2, "0")}
        </span>
      </h2>
      {hasMore && (
        <button
          onClick={onMore}
          className="text-[11px] uppercase tracking-[0.14em] font-display font-bold text-fg-3 hover:text-brand cursor-pointer bg-transparent border-none transition-colors"
        >
          View all →
        </button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   SECTION BODY — Semafor 3+wire pattern
   ════════════════════════════════════════════════ */

function SectionBody({
  items,
  onBadgeClick,
}: {
  items: Article[];
  onBadgeClick?: (variant: string) => void;
}) {
  if (items.length === 0) return null;

  // Semafor pattern: 3 image-led cards on top, then 4 text-only headlines below
  const top = items.slice(0, 3);
  const tail = items.slice(3, 7);

  return (
    <div className="flex flex-col gap-8">
      {top.length > 0 && (
        <Reveal className="grid grid-cols-3 gap-0 max-md:grid-cols-1 max-lg:grid-cols-2">
          {top.map((a, i) => (
            <div
              key={a.slug}
              className="px-5 first:pl-0 last:pr-0 lg:border-l lg:border-border-s lg:first:border-l-0 max-lg:border-t max-lg:border-border-s max-lg:py-5 max-lg:first:border-t-0 max-lg:first:pt-0"
            >
              <TextCard article={a} index={i} showImage onBadgeClick={onBadgeClick} />
            </div>
          ))}
        </Reveal>
      )}
      {tail.length > 0 && (
        <div className="border-t border-border-s pt-7">
          <WireRow articles={tail} onBadgeClick={onBadgeClick} cols={tail.length >= 4 ? 4 : (tail.length as 3)} />
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════
   InsightsGrid — composition root
   ════════════════════════════════════════════════ */

export function InsightsGrid({
  articles,
  onBadgeClick,
  activeFilter,
}: InsightsGridProps) {
  if (articles.length === 0) return null;

  // Filtered view — flat browse grid (no hero, no sections)
  if (activeFilter && activeFilter !== "all") {
    const top = articles.slice(0, 3);
    const next = articles.slice(3, 7);
    const rest = articles.slice(7);
    return (
      <div className="flex flex-col gap-8">
        {top.length > 0 && (
          <Reveal className="grid grid-cols-3 gap-0 max-md:grid-cols-1 max-lg:grid-cols-2">
            {top.map((a, i) => (
              <div
                key={a.slug}
                className="px-5 first:pl-0 last:pr-0 lg:border-l lg:border-border-s lg:first:border-l-0 max-lg:border-t max-lg:border-border-s max-lg:py-5 max-lg:first:border-t-0"
              >
                <TextCard article={a} index={i} onBadgeClick={onBadgeClick} />
              </div>
            ))}
          </Reveal>
        )}
        {next.length > 0 && (
          <div className="border-t border-border-s pt-7">
            <WireRow articles={next} onBadgeClick={onBadgeClick} />
          </div>
        )}
        {rest.length > 0 && (
          <div className="border-t border-border-s pt-7">
            <WireRow articles={rest.slice(0, 4)} onBadgeClick={onBadgeClick} />
          </div>
        )}
      </div>
    );
  }

  // Default view — hero + sections
  const lead = articles[0];
  const rail = articles.slice(1, 6);

  // Group articles by type
  const grouped = new Map<string, Article[]>();
  for (const article of articles) {
    const key = article.badge.variant;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(article);
  }

  return (
    <div className="flex flex-col gap-14">
      {lead && <Hero article={lead} rail={rail} onBadgeClick={onBadgeClick} />}

      {TYPE_ORDER.map(({ variant, label }) => {
        const items = grouped.get(variant);
        if (!items || items.length === 0) return null;
        const preview = items.slice(0, SECTION_PREVIEW);
        return (
          <section key={variant}>
            <SectionHead
              label={label}
              count={items.length}
              hasMore={items.length > SECTION_PREVIEW}
              onMore={() => onBadgeClick?.(variant)}
            />
            <SectionBody items={preview} onBadgeClick={onBadgeClick} />
          </section>
        );
      })}
    </div>
  );
}
