import { cn } from "@/app/lib/cn";

const SECTOR_COLORS: Record<string, string> = {
  "Mining & Resources": "bg-cat-sectors text-white",
  "Banking & Finance": "bg-cat-companies text-white",
  "Capital Markets": "bg-cat-markets text-white",
  "Energy": "bg-cat-insights text-white",
  "Technology": "bg-cat-ai text-white",
  "Real Estate & Infrastructure": "bg-info text-white",
  "Economy": "bg-cat-insights text-white",
};

/* ── Types ─────────────────────────────── */

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
  className?: string;
}

/* ── Component ─────────────────────────── */

export function EntityHeader({
  name,
  initials,
  ticker,
  exchange,
  price,
  priceChange,
  priceDirection = "up",
  type,
  typeVariant = "company",
  sector,
  description,
  className,
}: EntityHeaderProps) {
  const typeClass =
    typeVariant === "company"
      ? "bg-brand text-brand-t"
      : typeVariant === "project"
        ? "bg-cat-sectors text-white"
        : "bg-cat-insights text-white";

  return (
    <div
      className={cn(
        "flex items-start gap-5 pb-8 border-b border-border-s mb-8",
        className
      )}
    >
      {/* Logo / Initials */}
      <div
        className="w-14 h-14 min-w-14 rounded-[var(--card-r)] flex items-center justify-center font-display font-extrabold text-lg text-brand-l"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-m), var(--surface-el))",
        }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-extrabold text-2xl tracking-tight text-fg leading-heading mb-1.5">
          {name}
        </h1>

        {/* Ticker line */}
        {(ticker || price) && (
          <div className="flex items-center gap-2.5 mb-3 flex-wrap">
            {exchange && ticker && (
              <span className="font-mono font-medium text-sm text-fg-2 tracking-[0.02em]">
                {exchange}: {ticker}
              </span>
            )}
            {exchange && ticker && price && (
              <span className="w-1 h-1 rounded-full bg-border" />
            )}
            {price && (
              <span className="font-mono font-semibold text-base text-fg">
                {price}
              </span>
            )}
            {priceChange && (
              <span
                className={cn(
                  "font-mono font-semibold text-sm",
                  priceDirection === "up" ? "text-pos" : "text-neg"
                )}
              >
                {priceChange} {priceDirection === "up" ? "\u2191" : "\u2193"}
              </span>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex gap-1.5 mb-3.5 flex-wrap">
          <span
            className={cn(
              "badge",
              typeClass
            )}
          >
            {type}
          </span>
          <span className={cn("badge", SECTOR_COLORS[sector] ?? "bg-cat-sectors text-white")}>
            {sector}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button className="btn btn-signal">Request Connection</button>
          <button className="btn btn-secondary">Add to Watchlist</button>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-fg-2 leading-relaxed max-w-[640px]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
