import Link from "next/link";
import { cn } from "@/app/lib/cn";

/* ── Types ─────────────────────────────── */

type BadgeVariant = "research" | "article" | "deal" | "update" | "teaser" | "press";

interface ArticleBadge {
  label: string;
  variant: BadgeVariant;
}

interface ArticleHeaderProps {
  badges: ArticleBadge[];
  title: string;
  subtitle?: string;
  author: {
    name: string;
    initials: string;
    org?: string;
    href?: string;
  };
  date: string;
  readTime: string;
  topics?: string[];
  onTopicClick?: (topic: string) => void;
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

/* ── Dot separator ─────────────────────── */

function Dot() {
  return (
    <span className="inline-block w-[3px] h-[3px] rounded-full bg-fg-3 shrink-0" />
  );
}

/* ── ArticleHeader ─────────────────────── */

export function ArticleHeader({
  badges,
  title,
  subtitle,
  author,
  date,
  readTime,
  topics,
  onTopicClick,
}: ArticleHeaderProps) {
  return (
    <header className="pb-8 mb-8 border-b border-border-s">
      {/* Badges */}
      <div className="mb-4 flex gap-2">
        {badges.map((b) => (
          <span key={b.label} className={cn("badge", BADGE_COLORS[b.variant])}>
            {b.label}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="font-display font-extrabold text-3xl tracking-[-0.03em] leading-[1.15] mb-4">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-md text-fg-2 leading-[1.65] mb-6 max-w-[720px]">
          {subtitle}
        </p>
      )}

      {/* Author row */}
      <div className="flex items-center gap-3">
        {author.href ? (
          <Link href={author.href} className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-m to-surface-el grid place-items-center font-display text-xs font-bold text-brand-l shrink-0 no-underline transition-opacity hover:opacity-80">
            {author.initials}
          </Link>
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-m to-surface-el grid place-items-center font-display text-xs font-bold text-brand-l shrink-0">
            {author.initials}
          </div>
        )}
        <div className="flex flex-col gap-px">
          {author.href ? (
            <Link href={author.href} className="font-display font-bold text-sm no-underline text-fg hover:text-brand transition-colors">
              {author.name}
            </Link>
          ) : (
            <span className="font-display font-bold text-sm">{author.name}</span>
          )}
          <div className="flex items-center gap-1.5 text-xs text-fg-3">
            {author.org && <span>{author.org}</span>}
            {author.org && <Dot />}
            <span>{date}</span>
            <Dot />
            <span>{readTime}</span>
          </div>
        </div>
      </div>

      {/* Topic tags */}
      {topics && topics.length > 0 && (
        <div className="flex gap-1.5 flex-wrap mt-5">
          {topics.map((topic) => (
            <Link
              key={topic}
              href={`/insights?topic=${encodeURIComponent(topic)}`}
              onClick={onTopicClick ? (e) => { e.preventDefault(); onTopicClick(topic); } : undefined}
              className="font-body font-medium text-xs py-1 px-3 rounded-[var(--btn-r)] bg-surface text-fg-2 no-underline transition-all duration-[200ms] hover:bg-brand-m hover:text-brand cursor-pointer"
            >
              {topic}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
