import Link from "next/link";
import { cn } from "@/app/lib/cn";
import { SECTOR_SLUG_TO_LABEL, type MockEntity } from "@/app/lib/mock-data";

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

          {/* Stats row — always reserves space so cards with/without stats match height */}
          <div className="flex items-center gap-1.5 mt-0.5 h-[18px]">
            {hasTicker && entity.price != null && (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-fg-3 leading-[1.5] line-clamp-2 mt-2.5">
        {entity.description}
      </p>

      {/* Tags — muted sector pill + highlighted raising pill (type comes from section context) */}
      <div className="flex gap-1.5 mt-2.5 flex-wrap">
        <span className="font-body font-medium text-[11px] py-0.5 px-2 rounded-[var(--btn-r)] bg-surface text-fg-2">
          {SECTOR_SLUG_TO_LABEL[entity.sector] ?? entity.sector}
        </span>
        {entity.isRaising && (
          <span className="inline-flex items-center gap-1.5 font-body font-semibold text-[11px] py-0.5 px-2 rounded-[var(--btn-r)] bg-brand text-[var(--brand-t)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-t)] animate-pulse" />
            Raising
          </span>
        )}
      </div>
    </Link>
  );
}
