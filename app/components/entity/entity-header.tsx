import { cn } from "@/app/lib/cn";
import type { DataSource, ListingLocation } from "@/app/lib/mock-data";
import { ProfileBadgeWidget } from "./profile-badge-widget";

/* ── Icons ─────────────────────────────────────── */

const ICON_PROPS = {
  width: 12,
  height: 12,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const Icons = {
  Calendar: () => (
    <svg {...ICON_PROPS}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Tag: () => (
    <svg {...ICON_PROPS}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  Briefcase: () => (
    <svg {...ICON_PROPS}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Building: () => (
    <svg {...ICON_PROPS}>
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <line x1="9" y1="6" x2="9" y2="6.01" />
      <line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" />
      <line x1="15" y1="10" x2="15" y2="10.01" />
      <line x1="9" y1="14" x2="9" y2="14.01" />
      <line x1="15" y1="14" x2="15" y2="14.01" />
    </svg>
  ),
  Landmark: () => (
    <svg {...ICON_PROPS}>
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  ),
  MapPin: () => (
    <svg {...ICON_PROPS}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Layers: () => (
    <svg {...ICON_PROPS}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  TrendingUp: () => (
    <svg {...ICON_PROPS}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  Languages: () => (
    <svg {...ICON_PROPS}>
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  ),
  Globe: () => (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Linkedin: () => (
    <svg {...ICON_PROPS}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Twitter: () => (
    <svg {...ICON_PROPS}>
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  ),
  Facebook: () => (
    <svg {...ICON_PROPS}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
};

/* ── MetaItem helper ───────────────────────────── */

function MetaItem({
  icon,
  children,
  href,
  accent,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  accent?: "pos";
}) {
  const baseClass = cn(
    "inline-flex items-center gap-1 text-xs font-medium",
    accent === "pos" ? "text-pos" : "text-fg-2",
  );
  const iconClass = accent === "pos" ? "text-pos" : "text-fg-3";

  const content = (
    <>
      <span className={cn("inline-flex shrink-0", iconClass)}>{icon}</span>
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseClass, "no-underline hover:text-brand-l transition-colors")}
      >
        {content}
      </a>
    );
  }
  return <span className={baseClass}>{content}</span>;
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-fg-3 hover:text-brand-l transition-colors"
    >
      {icon}
    </a>
  );
}

function MetaSep() {
  return <span className="w-1 h-1 rounded-full bg-border shrink-0" />;
}

/* ── Types ─────────────────────────────────────── */

interface EntityHeaderProps {
  name: string;
  initials: string;
  ticker?: string;
  exchange?: string;
  price?: string;
  priceChange?: string;
  priceDirection?: "up" | "down";
  type: string;
  typeVariant?: "company" | "project" | "fund";
  sector: string;
  description?: string;
  dataSource?: DataSource;
  website?: string;
  foreignBlocker?: React.ReactNode;
  className?: string;
  /* v1 = CTAs in header, tags + socials in meta row (default).
     v2 = CTAs hoisted to sidebar by parent; tags + socials demoted to footer row under description.
     v3 = Editorial layout: kicker row, big bold name with price callout right, larger brief, footer meta. No logo block. */
  variant?: "v1" | "v2" | "v3";
  /* Slim sticky-scroll mode (used by V1 only). Renders a single-row bar with logo, name, ticker/price, CTAs. */
  compact?: boolean;

  /* Crunchbase-style meta row data */
  marketCap?: string;
  listingLocation?: ListingLocation;
  parentGroupName?: string;
  sponsorName?: string;
  isRaising?: boolean;
  stage?: string;
  location?: string;
  yearEstablished?: number;
  languagesCount?: number;
  practiceAreas?: string[];
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

/* ── Component ─────────────────────────────────── */

export function EntityHeader({
  name,
  initials,
  ticker,
  exchange,
  price,
  priceChange,
  priceDirection = "up",
  type,
  sector,
  description,
  dataSource,
  website,
  foreignBlocker,
  className,
  marketCap,
  listingLocation,
  parentGroupName,
  sponsorName,
  isRaising,
  stage,
  location,
  yearEstablished,
  languagesCount,
  practiceAreas,
  socialLinks,
  variant = "v1",
  compact = false,
}: EntityHeaderProps) {
  const isV2 = variant === "v2";
  const isV3 = variant === "v3";

  /* ── Compact (sticky-scroll) mode ─────────────── */
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 min-w-0",
          className,
        )}
      >
        <div
          className="w-9 h-9 rounded-[var(--btn-r)] flex items-center justify-center font-display font-extrabold text-sm text-brand-l shrink-0"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-m), var(--surface-el))",
          }}
        >
          {initials}
        </div>
        <span className="font-display font-extrabold text-sm tracking-tight text-fg leading-none truncate">
          {name}
        </span>
        {exchange && ticker && (
          <span className="font-mono font-medium text-xs text-fg-3 tracking-[0.02em] shrink-0 max-md:hidden">
            {exchange}: {ticker}
          </span>
        )}
        {price && (
          <span className="font-mono font-semibold text-sm text-fg shrink-0 max-md:hidden">
            {price}
          </span>
        )}
        {priceChange && (
          <span
            className={cn(
              "font-mono font-semibold text-xs shrink-0 max-md:hidden",
              priceDirection === "up" ? "text-pos" : "text-neg",
            )}
          >
            {priceChange} {priceDirection === "up" ? "↑" : "↓"}
          </span>
        )}
        <div className="flex gap-2 ml-auto shrink-0">
          <button className="btn btn-secondary text-xs py-1.5 px-3 max-sm:hidden">
            Add to Watchlist
          </button>
          <button className="btn btn-signal text-xs py-1.5 px-3">
            Request Connection
          </button>
        </div>
      </div>
    );
  }
  /* Practice areas truncation: first 2 + "+N more" */
  let practiceAreasLabel: string | undefined;
  if (practiceAreas && practiceAreas.length > 0) {
    const head = practiceAreas.slice(0, 2).join(", ");
    practiceAreasLabel =
      practiceAreas.length > 2
        ? `${head} +${practiceAreas.length - 2} more`
        : head;
  }

  /* Build meta items in order. Each entry is rendered only when its data exists.
     Separator dots are interleaved so missing fields don't leave orphan dots. */
  const metaNodes: React.ReactNode[] = [];

  if (dataSource && !isV2) metaNodes.push(<ProfileBadgeWidget key="cmm" dataSource={dataSource} />);

  if (exchange && ticker) {
    metaNodes.push(
      <span
        key="ticker"
        className="font-mono font-medium text-xs text-fg-2 tracking-[0.02em]"
      >
        {exchange}: {ticker}
      </span>,
    );
  }

  if (price) {
    metaNodes.push(
      <span key="price" className="font-mono font-semibold text-xs text-fg">
        {price}
      </span>,
    );
  }

  if (priceChange) {
    metaNodes.push(
      <span
        key="change"
        className={cn(
          "font-mono font-semibold text-xs",
          priceDirection === "up" ? "text-pos" : "text-neg",
        )}
      >
        {priceChange} {priceDirection === "up" ? "↑" : "↓"}
      </span>,
    );
  }

  const typePill = (
    <span
      key="type"
      className="font-body font-medium text-[11px] py-0.5 px-2 rounded-[var(--btn-r)] bg-surface text-fg-2"
    >
      {type}
    </span>
  );

  const sectorPill = (
    <span
      key="sector"
      className="font-body font-medium text-[11px] py-0.5 px-2 rounded-[var(--btn-r)] bg-surface text-fg-2"
    >
      {sector}
    </span>
  );

  metaNodes.push(typePill);
  metaNodes.push(sectorPill);

  if (yearEstablished) {
    metaNodes.push(
      <MetaItem key="founded" icon={<Icons.Calendar />}>
        Founded {yearEstablished}
      </MetaItem>,
    );
  }

  if (stage) {
    metaNodes.push(
      <MetaItem key="stage" icon={<Icons.Layers />}>
        {stage}
      </MetaItem>,
    );
  }

  if (location) {
    metaNodes.push(
      <MetaItem key="location" icon={<Icons.MapPin />}>
        {location}
      </MetaItem>,
    );
  }

  if (languagesCount && languagesCount > 0) {
    metaNodes.push(
      <MetaItem key="langs" icon={<Icons.Languages />}>
        {languagesCount} {languagesCount === 1 ? "lang" : "langs"}
      </MetaItem>,
    );
  }

  if (practiceAreasLabel) {
    metaNodes.push(
      <MetaItem key="practice" icon={<Icons.Briefcase />}>
        {practiceAreasLabel}
      </MetaItem>,
    );
  }

  if (isRaising) {
    metaNodes.push(
      <MetaItem
        key="raising"
        accent="pos"
        icon={<span className="w-1.5 h-1.5 rounded-full bg-pos animate-pulse" />}
      >
        Raising
      </MetaItem>,
    );
  }

  const websiteNode = website ? (
    <MetaItem key="web" icon={<Icons.Globe />} href={website}>
      {website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
    </MetaItem>
  ) : null;

  if (websiteNode) {
    metaNodes.push(websiteNode);
  }

  /* Socials cluster as a single trailing group with no internal separators */
  const socialsCluster: React.ReactNode[] = [];
  if (socialLinks?.linkedin) {
    socialsCluster.push(
      <SocialIcon key="li" href={socialLinks.linkedin} icon={<Icons.Linkedin />} />,
    );
  }
  if (socialLinks?.twitter) {
    socialsCluster.push(
      <SocialIcon key="tw" href={socialLinks.twitter} icon={<Icons.Twitter />} />,
    );
  }
  if (socialLinks?.facebook) {
    socialsCluster.push(
      <SocialIcon key="fb" href={socialLinks.facebook} icon={<Icons.Facebook />} />,
    );
  }
  if (socialsCluster.length > 0) {
    metaNodes.push(
      <span key="socials" className="inline-flex items-center gap-1.5">
        {socialsCluster}
      </span>,
    );
  }

  /* Interleave separator dots between meta nodes */
  const interleaved: React.ReactNode[] = [];
  metaNodes.forEach((node, i) => {
    if (i > 0) interleaved.push(<MetaSep key={`sep-${i}`} />);
    interleaved.push(node);
  });

  /* ── V3: Editorial layout ───────────────────────── */
  if (isV3) {
    /* Footer meta: location/founded/raising/practice/website/socials. Exclude pricing + tags. */
    const v3FooterNodes = metaNodes.filter((n) => {
      const key = (n as { key?: string | null })?.key;
      return (
        key !== "type" &&
        key !== "sector" &&
        key !== "cmm" &&
        key !== "ticker" &&
        key !== "price" &&
        key !== "change"
      );
    });
    const v3FooterInterleaved: React.ReactNode[] = [];
    v3FooterNodes.forEach((node, i) => {
      if (i > 0) v3FooterInterleaved.push(<MetaSep key={`v3-sep-${i}`} />);
      v3FooterInterleaved.push(node);
    });

    return (
      <div className={cn("pb-10 border-b-2 border-border mb-10", className)}>
        {/* Kicker bar — colored marker + type · sector caps + CMM badge anchored right */}
        <div className="flex items-center gap-3 pb-4 mb-7 border-b border-border-s flex-wrap">
          <div className="w-1 h-4 bg-brand rounded-[1px]" />
          <span className="font-mono text-xs uppercase tracking-[0.16em] font-semibold text-fg">
            {type}
          </span>
          <span className="text-fg-3 font-mono">·</span>
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-fg-2">
            {sector}
          </span>
          {dataSource && (
            <div className="ml-auto">
              <ProfileBadgeWidget dataSource={dataSource} />
            </div>
          )}
        </div>

        {/* Hero: 2-column — big name + dek on left, anchored stat card on right */}
        <div className="grid grid-cols-[1fr_300px] gap-12 items-start max-lg:grid-cols-[1fr_260px] max-md:grid-cols-1 max-md:gap-6">
          {/* Left column: name + dek */}
          <div className="flex flex-col gap-5">
            <h1 className="font-display font-extrabold text-[64px] tracking-[-0.02em] leading-[0.95] text-fg max-lg:text-5xl max-md:text-4xl">
              {name}
            </h1>
            {description && (
              <p className="font-display font-medium text-xl leading-[1.4] text-fg-2 max-w-[60ch] max-md:text-lg">
                {description}
              </p>
            )}
          </div>

          {/* Right column: bordered stat card — only shown if there's pricing data */}
          {(price || (exchange && ticker)) && (
            <div className="border border-border bg-surface rounded-[var(--card-r)] p-5 flex flex-col gap-4 max-md:max-w-[320px]">
              {exchange && ticker && (
                <div className="font-mono text-[11px] uppercase tracking-[0.1em] font-semibold text-fg-3 pb-3 border-b border-border-s">
                  {exchange}: {ticker}
                </div>
              )}
              {price && (
                <div className="flex flex-col gap-1">
                  <span className="font-display text-[10px] uppercase tracking-[0.1em] font-semibold text-fg-3">
                    Price
                  </span>
                  <span className="font-mono font-bold text-[32px] text-fg leading-none tabular-nums">
                    {price}
                  </span>
                  {priceChange && (
                    <span
                      className={cn(
                        "font-mono font-semibold text-sm tabular-nums",
                        priceDirection === "up" ? "text-pos" : "text-neg",
                      )}
                    >
                      {priceChange} {priceDirection === "up" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Byline meta row */}
        {v3FooterInterleaved.length > 0 && (
          <div className="flex items-center gap-x-3 gap-y-1.5 flex-wrap pt-7 mt-7 border-t border-border-s">
            {v3FooterInterleaved}
          </div>
        )}

        {foreignBlocker && <div className="pt-4">{foreignBlocker}</div>}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-6 pb-8 border-b border-border-s mb-8 max-md:flex-col max-md:gap-4",
        className,
      )}
    >
      {/* Logo / Initials */}
      <div
        className={cn(
          "rounded-[var(--card-r)] flex items-center justify-center font-display font-extrabold text-brand-l shrink-0",
          isV2
            ? "w-40 self-stretch min-h-40 text-5xl max-md:w-28 max-md:h-28 max-md:min-h-0 max-md:self-auto max-md:text-3xl"
            : "w-28 h-28 min-w-28 text-3xl",
        )}
        style={{
          background:
            "linear-gradient(135deg, var(--brand-m), var(--surface-el))",
        }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* Row 1: Name + actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="font-display font-extrabold text-3xl tracking-tight text-fg leading-heading">
            {name}
          </h1>
          {isV2 && dataSource && <ProfileBadgeWidget dataSource={dataSource} />}
          {!isV2 && (
            <div className="flex gap-2 ml-auto max-md:ml-0 max-md:w-full">
              <button className="btn btn-secondary text-sm">Add to Watchlist</button>
              <button className="btn btn-signal text-sm">Request Connection</button>
            </div>
          )}
        </div>

        {/* Meta row above description (V1) */}
        {!isV2 && interleaved.length > 0 && (
          <div className="flex items-center gap-x-3 gap-y-1.5 flex-wrap">
            {interleaved}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className={cn("text-fg-2 leading-relaxed", isV2 ? "text-base" : "text-sm")}>
            {description}
          </p>
        )}

        {/* Meta row below description (V2) — full stats + tags + website + socials */}
        {isV2 && interleaved.length > 0 && (
          <div className="flex items-center gap-x-3 gap-y-1.5 flex-wrap pt-1">
            {interleaved}
          </div>
        )}

        {foreignBlocker && <div className="pt-1">{foreignBlocker}</div>}
      </div>
    </div>
  );
}
