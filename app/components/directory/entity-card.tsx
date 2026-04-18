import Link from "next/link";
import { cn } from "@/app/lib/cn";
import type { MockEntity, EntityType } from "@/app/lib/mock-data";
import { ENTITY_TYPE_LABELS } from "@/app/lib/mock-data";

/* ── Badge styling per entity type ────────── */

const TYPE_BADGE: Record<EntityType, string> = {
  public_company: "bg-brand text-brand-t",
  private_company: "bg-cat-companies text-white",
  project: "bg-cat-sectors text-white",
  service_provider: "bg-fg-3 text-white",
};

const SECTOR_BADGE: Record<string, string> = {
  "Mining & Resources": "badge-sectors",
  "Banking & Finance": "badge-companies",
  "Capital Markets": "badge-markets",
  "Energy": "badge-insights",
  "Technology": "badge-ai",
  "Real Estate & Infrastructure": "badge-companies",
  "Agriculture": "badge-sectors",
  "Professional Services": "badge-markets",
};

/* ── EntityCard ───────────────────────────── */

export function EntityCard({ entity }: { entity: MockEntity }) {
  const initials = entity.name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const hasTicker = entity.ticker && entity.ticker !== "—";

  return (
    <Link
      href={`/directory/${entity.slug}`}
      className="card block no-underline group overflow-hidden min-w-0"
    >
      {/* Top: initials + name + ticker */}
      <div className="flex gap-3 min-w-0">
        <div
          className="w-10 h-10 shrink-0 rounded-[var(--card-r)] flex items-center justify-center font-display font-bold text-sm text-brand-l"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-m), var(--surface-el))",
          }}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-[var(--card-title-s)] font-bold leading-[1.3] tracking-[-0.01em] truncate">
            {entity.name}
          </h3>

          {hasTicker && entity.price != null && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-xs text-fg-3">
                {entity.ticker}
              </span>
              <span className="font-mono text-xs font-medium text-fg">
                {entity.price.toLocaleString()}
              </span>
              {entity.changePercent != null && (
                <span
                  className={cn(
                    "font-mono text-xs font-medium",
                    entity.changePercent >= 0 ? "text-pos" : "text-neg"
                  )}
                >
                  {entity.changePercent >= 0 ? "+" : ""}
                  {entity.changePercent}%
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-fg-3 leading-[1.5] line-clamp-2 mt-2.5">
        {entity.description}
      </p>

      {/* Badges */}
      <div className="flex gap-1 mt-2.5 flex-wrap">
        <span className={cn("badge", TYPE_BADGE[entity.type])}>
          {ENTITY_TYPE_LABELS[entity.type]}
        </span>
        <span
          className={cn(
            "badge",
            SECTOR_BADGE[entity.sector] ?? "badge-markets"
          )}
        >
          {entity.sector}
        </span>
        {entity.isRaising && (
          <span className="badge badge-signal">Raising</span>
        )}
      </div>
    </Link>
  );
}
