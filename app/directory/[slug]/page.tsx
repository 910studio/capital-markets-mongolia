import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  EntityHeader,
  MarketDataWidget,
  FinancialTableWidget,
  KeyPersonnelWidget,
  OwnershipWidget,
  ResearchWidget,
  NewsWidget,
  QuickStatsWidget,
  SustainabilityWidget,
  DealsTableWidget,
  DownloadsWidget,
  RequestConnectionWidget,
  ProfileBadgeWidget,
} from "@/app/components/entity";
import { BlockerLabel } from "@/app/components/ui/blocker-label";
import {
  MOCK_ENTITIES,
  MOCK_ARTICLES,
  ENTITY_TYPE_LABELS,
  type MockEntity,
} from "@/app/lib/mock-data";

/* ═══════════════════════════════════════════════════════════
   Entity Profile — /directory/[slug]
   Implements Entity Fields Master spec (2026-04-23).
   Widgets render conditionally per entity type.
   Blocker labels mark sections awaiting other teams.
   ═══════════════════════════════════════════════════════════ */

/* ── Chart data generator (deterministic mock) ───────── */

function makeChartData(seed: number) {
  const base = 50 + (seed % 40);
  const gen = (amplitude: number) => {
    const points = [];
    let y = base;
    for (let i = 0; i < 17; i++) {
      y += Math.sin((i + seed) * 0.8) * amplitude + Math.cos(i * 1.3) * amplitude * 0.5;
      y = Math.max(30, Math.min(170, y));
      points.push({ x: 40 + i * 40, y: Math.round(y) });
    }
    return points;
  };
  return {
    "1M": { points: gen(6), trend: "down" as const, low: "—", high: "—", change: "-3.8%" },
    "3M": { points: gen(12), trend: "up" as const, low: "—", high: "—", change: "+18.2%" },
    "1Y": { points: gen(20), trend: "up" as const, low: "—", high: "—", change: "+96.3%" },
    "ALL": { points: gen(30), trend: "volatile" as const, low: "—", high: "—", change: "+132%" },
  };
}

/* ── Flatten financials into table shape ───────── */

function buildFinancialTable(entity: MockEntity) {
  if (!entity.financials || !entity.financials.length) return null;
  const years = entity.financials.map((f) => f.year);

  function collect(
    key: "pl" | "balanceSheet" | "cashFlow",
  ): { metric: string; values: string[] }[] {
    const allMetrics = new Set<string>();
    entity.financials!.forEach((f) => {
      Object.keys(f[key] ?? {}).forEach((k) => allMetrics.add(k));
    });
    return Array.from(allMetrics).map((metric) => ({
      metric,
      values: entity.financials!.map((f) => f[key]?.[metric] ?? "—"),
    }));
  }

  return {
    years,
    data: {
      "P&L": collect("pl"),
      "Balance Sheet": collect("balanceSheet"),
      "Cash Flow": collect("cashFlow"),
    },
  };
}

/* ── Map entity type → typeVariant for EntityHeader ───────── */

function getTypeVariant(type: MockEntity["type"]): "company" | "project" | "fund" {
  if (type === "project") return "project";
  if (type === "service_provider") return "fund";
  return "company";
}

/* ── Page ───────────── */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ent = MOCK_ENTITIES.find((e) => e.slug === slug);
  return {
    title: ent ? `${ent.name} — MarketIQ` : "Directory — MarketIQ",
    description: ent?.description ?? "Mongolia's capital markets company directory.",
  };
}

export default async function EntityProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const entity = MOCK_ENTITIES.find((e) => e.slug === slug);
  if (!entity) notFound();

  const initials = entity.name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const typeLabel = ENTITY_TYPE_LABELS[entity.type];
  const isPublic = entity.type === "public_company";
  const isPrivate = entity.type === "private_company";
  const isProject = entity.type === "project";
  const isServiceProvider = entity.type === "service_provider";
  const showFinancials = isPublic || isPrivate;
  const showSustainability = (isPublic || isPrivate || isProject) && !!entity.sustainability;
  const showDeals = (isPublic || isPrivate) && entity.deals && entity.deals.length > 0;
  const showConnection = !isServiceProvider && entity.isRaising;

  const financialTable = buildFinancialTable(entity);

  /* ── Header props ── */
  const headerProps = {
    name: entity.name,
    initials,
    ticker: entity.ticker,
    exchange: entity.exchange ?? (entity.ticker ? "MSE" : undefined),
    price: entity.price ? `₮${entity.price.toLocaleString()}` : undefined,
    priceChange: entity.changePercent != null ? `${entity.changePercent >= 0 ? "+" : ""}${entity.changePercent}%` : undefined,
    priceDirection: (entity.changePercent ?? 0) >= 0 ? ("up" as const) : ("down" as const),
    type: typeLabel,
    typeVariant: getTypeVariant(entity.type),
    sector: entity.sector,
    description: entity.description,
  };

  /* ── Related research ── */
  const relatedArticles = MOCK_ARTICLES.filter((a) => a.entityRefs.includes(entity.slug))
    .slice(0, 4)
    .map((a) => ({
      id: a.slug,
      title: a.title,
      type: (a.contentType === "deal-insight"
        ? "insights"
        : a.contentType === "research-report"
        ? "markets"
        : "companies") as "insights" | "markets" | "companies",
      typeLabel:
        a.contentType === "deal-insight"
          ? "Deal Insight"
          : a.contentType === "research-report"
          ? "Research Report"
          : a.contentType === "market-brief"
          ? "Market Brief"
          : a.contentType === "investment-teaser"
          ? "Investment Teaser"
          : a.contentType === "press-release"
          ? "Press Release"
          : "Article",
      date: new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }));

  /* ── Quick stats (header sidebar) ── */
  const quickStats = isServiceProvider
    ? [
        { label: "Type", value: typeLabel, isMono: false },
        { label: "Sector", value: entity.sector, isMono: false },
        ...(entity.yearEstablished ? [{ label: "Established", value: String(entity.yearEstablished), isMono: true }] : []),
        ...(entity.languages && entity.languages.length > 0
          ? [{ label: "Languages", value: entity.languages.join(", "), isMono: false }]
          : []),
      ]
    : isProject
    ? [
        { label: "Stage", value: entity.stage ?? "—", isMono: false },
        { label: "Sector", value: entity.sector, isMono: false },
        ...(entity.location ? [{ label: "Location", value: entity.location, isMono: false }] : []),
      ]
    : isPublic
    ? [
        { label: "Market Cap", value: entity.marketCap ?? "—" },
        { label: "Ticker", value: entity.ticker ?? "—", isMono: true },
        { label: "Sector", value: entity.sector, isMono: false },
        ...(entity.price ? [{ label: "Price", value: `₮${entity.price.toLocaleString()}`, isMono: true }] : []),
      ]
    : [
        { label: "Type", value: typeLabel, isMono: false },
        { label: "Sector", value: entity.sector, isMono: false },
        ...(entity.isRaising ? [{ label: "Status", value: "Actively Raising", isMono: false }] : []),
      ];

  /* ── Ownership ── */
  const ownership =
    entity.shareholders && entity.shareholders.length > 0
      ? entity.shareholders.map((s, i) => ({
          name: s.name + (s.controlling ? " (controlling)" : ""),
          percentage: s.percentage,
          color: i === 0 ? "var(--brand)" : i === 1 ? "var(--brand-l)" : "var(--surface-el)",
        }))
      : isPublic
      ? [
          { name: "Institutional", percentage: 52, color: "var(--brand)" },
          { name: "Public Float", percentage: 35, color: "var(--brand-l)" },
          { name: "Insider", percentage: 13, color: "var(--surface-el)" },
        ]
      : [];

  /* ── News feed (mock placeholder) ── */
  const news = [
    { id: "n1", title: `${entity.name} reports quarterly update`, source: "CMM", date: "Apr 5, 2026" },
    { id: "n2", title: `${entity.sector} sector outlook remains constructive`, source: "Bloomberg", date: "Apr 2, 2026" },
    { id: "n3", title: `Foreign investors increase positions in ${entity.sector} plays`, source: "UB Post", date: "Mar 29, 2026" },
  ];

  const chartData = makeChartData(entity.slug.charCodeAt(0) + entity.slug.length);

  /* ── Personnel (fall back to placeholders if not set) ── */
  const personnel = [
    entity.ceo,
    ...(entity.executives ?? []),
  ].filter(Boolean).map((p) => ({
    initials: p!.initials ?? p!.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase(),
    name: p!.name,
    title: p!.title,
  }));

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full py-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm pt-6 pb-5">
        <Link href="/directory" className="text-fg-3 no-underline font-medium hover:text-brand transition-colors">
          Directory
        </Link>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-fg-3 shrink-0 opacity-40">
          <path d="m9 18 6-6-6-6" />
        </svg>
        <Link href={`/directory?type=${entity.type}`} className="text-fg-3 no-underline font-medium hover:text-brand transition-colors">
          {typeLabel}
        </Link>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-fg-3 shrink-0 opacity-40">
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span className="text-fg font-semibold">{entity.name}</span>
      </nav>

      {/* Entity Header */}
      <EntityHeader {...headerProps} />

      {/* Profile badge + website row */}
      <div className="flex items-center gap-3 flex-wrap -mt-4 mb-6 text-xs">
        {entity.dataSource && <ProfileBadgeWidget dataSource={entity.dataSource} />}
        {entity.website && (
          <a
            href={entity.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-brand-l hover:text-brand font-medium no-underline"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {entity.website.replace(/^https?:\/\//, "")}
          </a>
        )}
        {entity.listingLocation === "FOREIGN" && (
          <BlockerLabel owner="Zane">
            Foreign market data is manually entered — long-term solution pending
          </BlockerLabel>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_340px] gap-12 pb-20 items-start max-lg:grid-cols-1 max-lg:gap-6">
        {/* ── Main column ── */}
        <div className="flex flex-col gap-5 min-w-0">
          {/* Sector taxonomy blocker */}
          <BlockerLabel owner="Namkhai / Zoloo" variant="block">
            Sector taxonomy is not yet finalized. The current sector tag
            (&quot;{entity.sector}&quot;) uses the placeholder vocabulary. Final category list
            pending from CMM research team before v1 launch.
          </BlockerLabel>

          {isPublic && (
            <MarketDataWidget
              price={headerProps.price ?? "—"}
              priceChange={headerProps.priceChange ?? "—"}
              priceDirection={headerProps.priceDirection}
              volume={entity.volume ?? "—"}
              dayRange="—"
              chartData={chartData}
              stats={[
                { label: "Open", value: "—" },
                { label: "High", value: "—" },
                { label: "Low", value: "—" },
                { label: "Volume", value: entity.volume ?? "—" },
                { label: "52W High", value: "—" },
                { label: "52W Low", value: "—" },
                { label: "Avg Volume", value: "—" },
                { label: "P/E", value: entity.summaryRatios?.pe ?? "—" },
                { label: "Div Yield", value: entity.summaryRatios?.divYield ?? "—" },
              ]}
              lastUpdated={entity.lastUpdated ?? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              source={entity.exchange ?? "—"}
            />
          )}

          {/* Project key metrics */}
          {isProject && entity.keyMetrics && (
            <div className="widget">
              <div className="widget-header">
                <span>Key Metrics</span>
              </div>
              <div className="widget-body grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                {Object.entries(entity.keyMetrics).map(([k, v]) => (
                  <div key={k} className="flex flex-col py-2 border-b border-border-s last:border-b-0 max-sm:last:border-b">
                    <span className="font-display font-semibold text-[11px] uppercase tracking-[0.06em] text-fg-3">
                      {k}
                    </span>
                    <span className="font-mono text-base font-semibold text-fg mt-1">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Provider: Practice Areas + Engagements */}
          {isServiceProvider && (
            <>
              {entity.practiceAreas && entity.practiceAreas.length > 0 && (
                <div className="widget">
                  <div className="widget-header">
                    <span>Practice Areas</span>
                  </div>
                  <div className="widget-body flex flex-wrap gap-1.5">
                    {entity.practiceAreas.map((p) => (
                      <span
                        key={p}
                        className="font-body font-medium text-xs py-1.5 px-3 rounded-[var(--btn-r)] bg-surface text-fg-2 border border-border-s"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {entity.notableEngagements && entity.notableEngagements.length > 0 && (
                <div className="widget">
                  <div className="widget-header">
                    <span>Notable Engagements</span>
                  </div>
                  <div className="widget-body">
                    <ul className="flex flex-col gap-2 m-0 p-0 list-none">
                      {entity.notableEngagements.map((e) => (
                        <li key={e} className="flex items-start gap-2 text-sm text-fg-2 leading-[1.5]">
                          <span className="w-1 h-1 rounded-full bg-brand shrink-0 mt-2.5" />
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {entity.notableClients && entity.notableClients.length > 0 && (
                <div className="widget">
                  <div className="widget-header">
                    <span>Notable Clients</span>
                  </div>
                  <div className="widget-body flex flex-wrap gap-1.5">
                    {entity.notableClients.map((c) => (
                      <span
                        key={c}
                        className="font-display font-semibold text-xs py-1.5 px-3 rounded-[var(--btn-r)] bg-brand-m text-brand"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Financial Performance — BLOCKED */}
          {showFinancials && (
            <div className="flex flex-col gap-3">
              <BlockerLabel owner="Zoloo & Namkhai" variant="block">
                Financial Performance structure (Summary Ratios + Multi-Year Tables) is
                PENDING sign-off. Current tables use placeholder metrics from the spec
                draft and will be reshaped once the team confirms the final field list.
              </BlockerLabel>

              {/* Summary Ratios */}
              {entity.summaryRatios && (
                <div className="widget">
                  <div className="widget-header">
                    <span>Summary Ratios</span>
                    <span className="font-mono text-[10px] text-fg-3">DRAFT</span>
                  </div>
                  <div className="widget-body grid grid-cols-3 gap-3 max-sm:grid-cols-2">
                    {[
                      ["P/E", entity.summaryRatios.pe],
                      ["P/B", entity.summaryRatios.pb],
                      ["EV/EBITDA", entity.summaryRatios.evEbitda],
                      ["Div Yield", entity.summaryRatios.divYield],
                      ["ROE", entity.summaryRatios.roe],
                      ["Market Cap", entity.summaryRatios.marketCap],
                    ]
                      .filter(([, v]) => v)
                      .map(([label, v]) => (
                        <div key={label} className="flex flex-col py-2">
                          <span className="font-display font-semibold text-[11px] uppercase tracking-[0.06em] text-fg-3">
                            {label}
                          </span>
                          <span className="font-mono text-base font-semibold text-fg mt-1">{v}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Multi-Year Tables */}
              {financialTable && (
                <FinancialTableWidget
                  years={financialTable.years}
                  data={financialTable.data}
                  source="DRAFT — Structure pending Zoloo & Namkhai sign-off."
                />
              )}
            </div>
          )}

          {/* Sustainability */}
          {showSustainability && <SustainabilityWidget data={entity.sustainability!} />}

          {/* Deal Insights */}
          {showDeals && <DealsTableWidget summary={entity.dealsSummary} deals={entity.deals!} />}

          {/* Key People */}
          {personnel.length > 0 && <KeyPersonnelWidget people={personnel} />}

          {/* Service Provider contact */}
          {isServiceProvider && (entity.contactEmail || entity.contactPhone || entity.contactAddress) && (
            <div className="widget">
              <div className="widget-header">
                <span>Contact</span>
              </div>
              <div className="widget-body flex flex-col gap-2 text-sm">
                {entity.contactEmail && (
                  <div className="flex items-center gap-3">
                    <span className="font-display font-semibold text-[11px] uppercase tracking-[0.06em] text-fg-3 w-20 shrink-0">Email</span>
                    <a href={`mailto:${entity.contactEmail}`} className="text-brand-l hover:text-brand no-underline font-mono">
                      {entity.contactEmail}
                    </a>
                  </div>
                )}
                {entity.contactPhone && (
                  <div className="flex items-center gap-3">
                    <span className="font-display font-semibold text-[11px] uppercase tracking-[0.06em] text-fg-3 w-20 shrink-0">Phone</span>
                    <span className="font-mono text-fg">{entity.contactPhone}</span>
                  </div>
                )}
                {entity.contactAddress && (
                  <div className="flex items-start gap-3">
                    <span className="font-display font-semibold text-[11px] uppercase tracking-[0.06em] text-fg-3 w-20 shrink-0 mt-1">Office</span>
                    <span className="text-fg-2 leading-[1.5]">{entity.contactAddress}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Sticky sidebar ── */}
        <aside className="sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto flex flex-col gap-5 scrollbar-none max-lg:static max-lg:max-h-none max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1">
          {showConnection && (
            <RequestConnectionWidget entityName={entity.name} loggedIn={false} />
          )}
          <QuickStatsWidget stats={quickStats} />
          {ownership.length > 0 && <OwnershipWidget owners={ownership} />}
          <DownloadsWidget
            reports={entity.reports}
            pitchDecks={entity.pitchDecks}
            sustainabilityDocs={entity.sustainabilityDocs}
            investmentTeasers={entity.investmentTeasers}
            operationalDocs={entity.operationalDocs}
            requiresAuth
          />
          {relatedArticles.length > 0 && <ResearchWidget items={relatedArticles} />}
          <NewsWidget items={news} />
        </aside>
      </div>
    </div>
  );
}
