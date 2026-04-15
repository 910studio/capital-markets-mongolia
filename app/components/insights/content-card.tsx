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
  href: string;
  image?: React.ReactNode;
}

/* ── Badge color mapping (solid variants from design system) ── */

const BADGE_COLORS: Record<BadgeVariant, string> = {
  research: "badge-solid-research",
  article: "badge-solid-article",
  deal: "badge-solid-deal",
  update: "badge-solid-update",
  teaser: "badge-solid-teaser",
  press: "badge-solid-press",
};

/* ── Meta separator dot ────────────────── */

function Dot() {
  return (
    <span className="inline-block w-[3px] h-[3px] rounded-full bg-fg-3 shrink-0" />
  );
}

/* ── ContentCard ───────────────────────── */

export function ContentCard({
  title,
  excerpt,
  badge,
  author,
  date,
  readTime,
  featured,
  href,
  image,
}: ContentCardProps) {
  if (featured) {
    return (
      <Link
        href={href}
        className="card block no-underline col-span-full"
      >
        <div className="grid gap-7 sm:grid-cols-[1fr_1.5fr]">
          {/* Featured image */}
          {image && (
            <div className="rounded-[var(--card-img-r)] overflow-hidden border border-border-s bg-[var(--white)] relative aspect-[2/1]">
              {image}
            </div>
          )}

          {/* Featured body */}
          <div className="flex flex-col gap-2 justify-center">
            <span className={cn("badge", BADGE_COLORS[badge.variant])}>
              {badge.label}
            </span>

            <h3 className="font-display text-base font-bold leading-[1.35] tracking-[-0.01em]">
              {title}
            </h3>

            {excerpt && (
              <p className="text-sm text-fg-2 leading-body line-clamp-3">
                {excerpt}
              </p>
            )}

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
          </div>
        </div>
      </Link>
    );
  }

  /* ── Non-featured card (Dense: no image, no excerpt) ── */
  return (
    <Link href={href} className="card block no-underline">
      <div className="flex flex-col gap-2">
        <span className={cn("badge", BADGE_COLORS[badge.variant])}>
          {badge.label}
        </span>

        <h3 className="font-display text-[var(--card-title-s)] font-bold leading-[1.35] tracking-[-0.01em] line-clamp-2">
          {title}
        </h3>

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
      </div>
    </Link>
  );
}
