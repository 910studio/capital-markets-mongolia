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
  };
  date: string;
  readTime: string;
  topics?: string[];
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
}: ArticleHeaderProps) {
  return (
    <header className="max-w-[1040px] mx-auto pb-7">
      {/* Badges */}
      <div className="mb-3.5 flex gap-2">
        {badges.map((b) => (
          <span key={b.label} className={cn("badge", BADGE_COLORS[b.variant])}>
            {b.label}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="font-display font-extrabold text-3xl tracking-[-0.03em] leading-[1.2] mb-3">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-[1.0625rem] text-fg-2 leading-[1.65] mb-6">
          {subtitle}
        </p>
      )}

      {/* Author row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-m to-surface-el grid place-items-center font-display text-xs font-bold text-brand-l shrink-0">
          {author.initials}
        </div>
        <div className="flex flex-col gap-px">
          <span className="font-display font-bold text-sm">{author.name}</span>
          <div className="flex items-center gap-1.5 text-sm text-fg-3">
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
            <span
              key={topic}
              className="font-body font-medium text-xs py-1 px-3 rounded-full bg-surface text-fg-2 cursor-pointer transition-all duration-[200ms] hover:bg-brand-m hover:text-brand"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
