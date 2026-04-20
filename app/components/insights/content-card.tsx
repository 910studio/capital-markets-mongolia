import Link from "next/link";
import { cn } from "@/app/lib/cn";

/* ── Types ─────────────────────────────── */

type BadgeVariant = "research" | "article" | "deal" | "update" | "teaser" | "press";

interface ContentCardBadge {
  label: string;
  variant: BadgeVariant;
}

interface ContentCardProps {
  title: string;
  excerpt?: string;
  badge: ContentCardBadge;
  author: string;
  date: string;
  readTime?: string;
  featured?: boolean;
  showImage?: boolean;
  href: string;
  image?: React.ReactNode;
  onBadgeClick?: (variant: string) => void;
}

/* ── Badge color mapping ── */

const BADGE_COLORS: Record<BadgeVariant, string> = {
  research: "badge-insights",
  article: "badge-companies",
  deal: "badge-sectors",
  update: "badge-markets",
  teaser: "badge-companies",
  press: "badge-markets",
};

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

/* ── ContentCard ── */

export function ContentCard({
  title,
  excerpt,
  badge,
  author,
  date,
  readTime,
  featured,
  showImage,
  href,
  image,
  onBadgeClick,
}: ContentCardProps) {
  function BadgeTag() {
    return (
      <span
        className={cn("badge cursor-pointer hover:opacity-80 transition-opacity", BADGE_COLORS[badge.variant])}
        onClick={onBadgeClick ? (e) => { e.preventDefault(); onBadgeClick(badge.variant); } : undefined}
      >
        {badge.label}
      </span>
    );
  }
  /* ── Featured: full-width headline ── */
  if (featured) {
    return (
      <Link href={href} className="card block no-underline !p-0 overflow-hidden">
        <div className="grid sm:grid-cols-[1.2fr_1fr] min-h-[280px]">
          {image && (
            <div className="relative min-h-[200px] sm:min-h-full">
              {image}
            </div>
          )}
          <div className="flex flex-col gap-3 justify-center p-6 sm:p-8">
            <h3 className="font-display text-2xl font-extrabold leading-[1.15] tracking-[-0.02em]">{title}</h3>
            {excerpt && <p className="text-base text-fg-2 leading-[1.6] line-clamp-3">{excerpt}</p>}
            <Meta author={author} date={date} readTime={readTime} />
          </div>
        </div>
      </Link>
    );
  }

  /* ── Image card: image on top ── */
  if (showImage && image) {
    return (
      <Link href={href} className="card block no-underline overflow-hidden min-w-0">
        <div className="rounded-[var(--card-img-r)] overflow-hidden border border-border-s relative aspect-[16/9] -mx-[var(--card-p)] -mt-[var(--card-p)] mb-3">
          {image}
        </div>
        <h3 className="font-display text-sm font-bold leading-[1.35] tracking-[-0.01em] line-clamp-2">{title}</h3>
        {excerpt && <p className="text-xs text-fg-3 leading-[1.5] line-clamp-2 mt-1">{excerpt}</p>}
        <Meta author={author} date={date} readTime={readTime} />
      </Link>
    );
  }

  /* ── Text-only compact card ── */
  return (
    <Link href={href} className="card block no-underline overflow-hidden min-w-0">
      <div className="flex flex-col gap-2">
        <h3 className="font-display text-[var(--card-title-s)] font-bold leading-[1.35] tracking-[-0.01em] line-clamp-2">{title}</h3>
        <Meta author={author} date={date} readTime={readTime} />
      </div>
    </Link>
  );
}
