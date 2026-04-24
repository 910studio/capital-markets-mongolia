import Link from "next/link";

/* ── Types ─────────────────────────────── */

type BadgeVariant = "research" | "article" | "deal" | "update" | "teaser" | "press";

interface ContentCardBadge {
  label: string;
  variant: BadgeVariant;
}

interface ContentCardProps {
  title: string;
  excerpt?: string;
  badge?: ContentCardBadge;
  author: string;
  date: string;
  readTime?: string;
  topics?: string[];
  featured?: boolean;
  showImage?: boolean;
  /** Flanks a featured card — stretches to full height with richer content */
  flankFeatured?: boolean;
  /** Featured variant that fills parent grid-cell height (image grows, no fixed aspect) */
  fillHeight?: boolean;
  /** Show topic pills on any card variant when topics are provided */
  showTopics?: boolean;
  href: string;
  image?: React.ReactNode;
  onBadgeClick?: (variant: string) => void;
}

/* ── Meta dot ── */

function Dot() {
  return <span className="inline-block w-[3px] h-[3px] rounded-full bg-fg-3 shrink-0" />;
}

/* ── Meta row ── */

function Meta({ author, date, readTime }: { author: string; date: string; readTime?: string }) {
  return (
    <div className="flex items-center gap-[7px] text-[11px] text-fg-3 mt-auto">
      <span>{author}</span>
      <Dot />
      <span>{date}</span>
      {readTime && (
        <>
          <Dot />
          <span>{readTime}</span>
        </>
      )}
    </div>
  );
}

/* ── Topic pills ── */

function TopicPills({ topics, size = "sm" }: { topics: string[]; size?: "sm" | "xs" }) {
  const cls =
    size === "xs"
      ? "font-body font-medium text-[10px] py-0.5 px-1.5 rounded-[var(--btn-r)] bg-surface text-fg-2"
      : "font-body font-medium text-[11px] py-0.5 px-2 rounded-[var(--btn-r)] bg-surface text-fg-2";
  return (
    <div className="flex flex-wrap gap-1.5">
      {topics.slice(0, 3).map((t) => (
        <span key={t} className={cls}>
          {t}
        </span>
      ))}
    </div>
  );
}

/* ── ContentCard ── */

export function ContentCard({
  title,
  excerpt,
  author,
  date,
  readTime,
  topics,
  featured,
  showImage,
  flankFeatured,
  fillHeight,
  showTopics,
  href,
  image,
}: ContentCardProps) {
  const renderTopics = showTopics && topics && topics.length > 0;

  /* ── Featured: big card with image on top, larger text below ── */
  if (featured) {
    return (
      <Link href={href} className="card block no-underline !p-0 overflow-hidden h-full flex flex-col">
        {image && (
          <div
            className={
              fillHeight
                ? "relative w-full flex-1 min-h-0"
                : "relative aspect-[16/10] w-full shrink-0"
            }
          >
            {image}
          </div>
        )}
        <div
          className={
            fillHeight
              ? "flex flex-col gap-2 p-5 sm:p-6 shrink-0"
              : "flex flex-col gap-3 p-6 sm:p-7 flex-1"
          }
        >
          <h3
            className={
              fillHeight
                ? "font-display text-xl font-extrabold leading-[1.15] tracking-[-0.02em] max-sm:text-lg line-clamp-3"
                : "font-display text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] max-sm:text-xl"
            }
          >
            {title}
          </h3>
          {excerpt && !fillHeight && (
            <p className="text-base text-fg-2 leading-[1.6] line-clamp-3">{excerpt}</p>
          )}
          {excerpt && fillHeight && (
            <p className="text-sm text-fg-2 leading-[1.5] line-clamp-2">{excerpt}</p>
          )}
          {renderTopics && <TopicPills topics={topics!} />}
          <div className={fillHeight ? "" : "mt-auto"}>
            <Meta author={author} date={date} readTime={readTime} />
          </div>
        </div>
      </Link>
    );
  }

  /* ── Flank Featured: stretches to full height next to a featured card ── */
  if (flankFeatured) {
    return (
      <Link href={href} className="card flex flex-col no-underline overflow-hidden min-w-0 h-full">
        {image && (
          <div className="rounded-[var(--card-img-r)] overflow-hidden border border-border-s relative aspect-[4/3] -mx-[var(--card-p)] -mt-[var(--card-p)] mb-4 shrink-0">
            {image}
          </div>
        )}
        <h3 className="font-display text-base font-bold leading-[1.3] tracking-[-0.01em] mb-2">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-fg-2 leading-[1.6] mb-3">{excerpt}</p>
        )}
        {renderTopics && <div className="mb-3"><TopicPills topics={topics!} /></div>}
        <div className="mt-auto pt-3 border-t border-border-s">
          <Meta author={author} date={date} readTime={readTime} />
        </div>
      </Link>
    );
  }

  /* ── Image card: image on top ── */
  if (showImage && image) {
    return (
      <Link href={href} className="card flex flex-col no-underline overflow-hidden min-w-0">
        <div className="rounded-[var(--card-img-r)] overflow-hidden border border-border-s relative aspect-[16/9] -mx-[var(--card-p)] -mt-[var(--card-p)] mb-3 shrink-0">
          {image}
        </div>
        <h3 className="font-display text-sm font-bold leading-[1.35] tracking-[-0.01em] line-clamp-2">{title}</h3>
        {excerpt && <p className="text-xs text-fg-3 leading-[1.5] line-clamp-2 mt-1">{excerpt}</p>}
        {renderTopics && <div className="mt-2"><TopicPills topics={topics!} size="xs" /></div>}
        <div className="pt-2">
          <Meta author={author} date={date} readTime={readTime} />
        </div>
      </Link>
    );
  }

  /* ── Text-only compact card ── */
  return (
    <Link href={href} className="card block no-underline overflow-hidden min-w-0">
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-[var(--card-title-s)] font-bold leading-[1.35] tracking-[-0.01em] line-clamp-2">{title}</h3>
        {renderTopics && <TopicPills topics={topics!} size="xs" />}
        <Meta author={author} date={date} readTime={readTime} />
      </div>
    </Link>
  );
}
