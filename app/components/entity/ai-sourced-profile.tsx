import { Widget, WidgetHeader, WidgetBody } from "@/app/components/ui";
import { EntityHeader } from "./entity-header";
import { NewsWidget } from "./news-widget";
import type {
  AIConfidence,
  AISourceCitation,
  MockEntity,
} from "@/app/lib/mock-data";
import { ENTITY_TYPE_LABELS } from "@/app/lib/mock-data";

/* ═══════════════════════════════════════════════════════════
   AI-Sourced Entity Profile (fall-back tier)
   Sections: header, AI disclaimer, overview, news, citations.
   Single sidebar CTA: claim this profile.
   Same MockEntity shape as premium — most fields null.
   ═══════════════════════════════════════════════════════════ */

const CONFIDENCE_STYLE: Record<AIConfidence, string> = {
  high: "bg-pos-m text-pos",
  medium: "bg-signal-m text-signal-h",
  low: "bg-neg-m text-neg-t",
};

function ConfidenceDot({ level }: { level: AIConfidence }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[var(--badge-r)] text-[10px] font-mono font-semibold uppercase tracking-wider ${CONFIDENCE_STYLE[level]}`}
    >
      {level}
    </span>
  );
}

interface AISourcedProfileProps {
  entity: MockEntity;
}

export function AISourcedProfile({ entity }: AISourcedProfileProps) {
  const initials = entity.name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const typeLabel = ENTITY_TYPE_LABELS[entity.type];
  const ai = entity.aiMeta;

  /* News pipeline still runs on AI-Sourced profiles — this is the free strength */
  const news = [
    {
      id: "n1",
      title: `Mongolia ${entity.sector.toLowerCase()} sector outlook for Q2 2026`,
      source: "Mining Weekly",
      date: "Apr 28, 2026",
    },
    {
      id: "n2",
      title: `${entity.name} reportedly named in MRPAM license disclosure`,
      source: "UB Post",
      date: "Apr 14, 2026",
    },
    {
      id: "n3",
      title: `Foreign investor interest in Mongolia's ${entity.sector} sector grows`,
      source: "Bloomberg",
      date: "Apr 02, 2026",
    },
  ];

  /* Sort citations: low confidence first (analyst attention) */
  const sortedCitations: AISourceCitation[] = ai
    ? [...ai.citations].sort((a, b) => {
        const order: Record<AIConfidence, number> = { low: 0, medium: 1, high: 2 };
        return order[a.confidence] - order[b.confidence];
      })
    : [];

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
      {/* Header */}
      <div className="profile-header pt-6">
        <EntityHeader
          name={entity.name}
          initials={initials}
          ticker={entity.ticker}
          exchange={entity.exchange ?? (entity.ticker ? "MSE" : undefined)}
          type={typeLabel}
          typeVariant={entity.type === "project" ? "project" : "company"}
          sector={entity.sector}
          dataSource="AI-Sourced"
          website={entity.website}
          location={entity.location}
          yearEstablished={entity.yearEstablished}
          socialLinks={entity.socialLinks}
        />
      </div>

      {/* AI disclaimer band */}
      <div className="rounded-[var(--card-r)] border border-signal/30 bg-signal-m px-4 py-3 mb-6 flex items-start gap-3">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-signal-h shrink-0 mt-0.5"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-sm text-fg leading-snug">
            This profile is AI-sourced and has not been verified by CMM analysts.
          </div>
          <div className="text-xs text-fg-2 mt-1 leading-relaxed">
            Data assembled from public registries, filings, and web sources by an automated
            pipeline. Treat as a starting point, not a research-grade profile.
            {ai && (
              <>
                {" "}
                Last refreshed{" "}
                <span className="font-mono">
                  {new Date(ai.lastCrawled).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                .
              </>
            )}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_340px] gap-12 pb-20 items-start max-lg:grid-cols-1 max-lg:gap-6">
        {/* ── Main column ── */}
        <div className="flex flex-col gap-5 min-w-0">
          {/* AI-generated description */}
          {entity.description && (
            <Widget>
              <WidgetHeader
                title="Overview"
                action={
                  <span className="font-mono text-[10px] uppercase tracking-wider text-fg-3">
                    AI-generated
                  </span>
                }
              />
              <WidgetBody>
                <p className="text-sm text-fg-2 leading-relaxed m-0">
                  {entity.description}
                </p>
              </WidgetBody>
            </Widget>
          )}

          {/* Recent News (free strength of the AI pipeline) */}
          <NewsWidget items={news} />

          {/* AI source citations */}
          {ai && (
            <Widget>
              <WidgetHeader
                title="AI Source Citations"
                action={
                  <span className="font-mono text-[10px] uppercase tracking-wider text-fg-3">
                    {sortedCitations.length} fields
                  </span>
                }
              />
              <WidgetBody>
                <p className="text-xs text-fg-3 leading-relaxed mt-0 mb-3">
                  Field-level provenance for analyst review. Low-confidence rows shown first.
                </p>
                <div className="flex flex-col">
                  {sortedCitations.map((c) => (
                    <div
                      key={c.field}
                      className="flex items-center justify-between gap-3 py-2 border-b border-border-s last:border-b-0 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs text-fg-2 w-32 shrink-0 truncate">
                          {c.field}
                        </span>
                        <span className="text-xs text-fg-3 truncate">{c.source}</span>
                      </div>
                      <ConfidenceDot level={c.confidence} />
                    </div>
                  ))}
                </div>
                {ai.pipelineRun && (
                  <div className="mt-3 pt-3 border-t border-border-s text-[11px] font-mono text-fg-3">
                    Run: {ai.pipelineRun}
                  </div>
                )}
              </WidgetBody>
            </Widget>
          )}
        </div>

        {/* ── Sticky sidebar (claim CTA only) ── */}
        <aside className="lg:sticky lg:top-[80px] flex flex-col gap-5">
          <div
            className="rounded-[var(--card-r)] border-2 border-brand p-5 flex flex-col gap-3"
            style={{ background: "linear-gradient(135deg, var(--brand-m), var(--surface-el))" }}
          >
            <div className="font-display font-extrabold text-base text-fg leading-tight">
              Are you {entity.name}?
            </div>
            <p className="text-xs text-fg-2 leading-relaxed m-0">
              Claim this profile to verify your information, upload official assets, and reach
              Mongolia&apos;s capital markets community.
            </p>
            <button className="btn btn-primary text-sm w-full">Claim this profile</button>
            <div className="text-[11px] text-fg-3 leading-snug">
              Verification typically takes 2-3 business days.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
