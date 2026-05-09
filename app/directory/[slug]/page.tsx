import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  MarketDataWidget,
  FinancialTableWidget,
  KeyPersonnelWidget,
  OwnershipWidget,
  SustainabilityWidget,
  DealsTableWidget,
  DownloadsWidget,
  RequestConnectionWidget,
  SubsidiariesWidget,
  BoardMembersWidget,
  ParentGroupCard,
  ExecutiveOrgChart,
  EntityCoverageWidget,
  AISourcedProfile,
} from "@/app/components/entity";
import { ArticleSidebar } from "@/app/components/content/article-sidebar";
import { BlockerLabel } from "@/app/components/ui/blocker-label";
import {
  MOCK_ENTITIES,
  MOCK_ARTICLES,
  ENTITY_TYPE_LABELS,
  type MockEntity,
} from "@/app/lib/mock-data";
import { apiGet, path, ApiError } from "@/app/lib/api";
import { adaptEntityDetail } from "@/app/lib/api-adapters";
import { ProfileVariants } from "./profile-variants";

/**
 * Hybrid loader: tries live API first, then mock by slug, merges API basics
 * (name/description/sector/ticker/website) over mock rich fields (financials,
 * sustainability, deals, etc.) so detail page renders both real + designed
 * content during the integration ramp.
 */
async function loadEntity(slug: string): Promise<MockEntity | null> {
  let apiEntity: MockEntity | null = null;
  try {
    const dto = await apiGet(path("/api/entities/{slug}", { slug }), {
      next: { revalidate: 60, tags: [`entity:${slug}`] },
    });
    apiEntity = adaptEntityDetail(dto);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      // fall through to mock
    } else {
      console.error(`[entity:${slug}] API fetch failed, mock-only:`, err);
    }
  }
  const mockEntity = MOCK_ENTITIES.find((e) => e.slug === slug);
  if (apiEntity && mockEntity) {
    // API basics override mock; mock retains rich fields the DTO doesn't expose.
    return {
      ...mockEntity,
      name: apiEntity.name,
      ticker: apiEntity.ticker ?? mockEntity.ticker,
      sector: apiEntity.sector,
      type: apiEntity.type,
      description: apiEntity.description || mockEntity.description,
      logo: apiEntity.logo ?? mockEntity.logo,
      website: apiEntity.website ?? mockEntity.website,
      yearEstablished: apiEntity.yearEstablished ?? mockEntity.yearEstablished,
      dataSource: apiEntity.dataSource ?? mockEntity.dataSource,
    };
  }
  return apiEntity ?? mockEntity ?? null;
}

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
  const ent = await loadEntity(slug);
  return {
    title: ent ? `${ent.name} — MarketIQ` : "Directory — MarketIQ",
    description: ent?.description ?? "Mongolia's capital markets company directory.",
  };
}

export default async function EntityProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const entity = await loadEntity(slug);
  if (!entity) notFound();

  /* AI-Sourced profiles render the thin fall-back layout */
  if (entity.dataSource === "AI-Sourced") {
    return <AISourcedProfile entity={entity} />;
  }

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
    dataSource: entity.dataSource,
    website: entity.website,
    marketCap: entity.marketCap,
    listingLocation: entity.listingLocation,
    parentGroupName: entity.parentGroup?.name,
    sponsorName: entity.sponsor?.name,
    isRaising: entity.isRaising,
    stage: entity.stage,
    location: entity.location,
    yearEstablished: entity.yearEstablished,
    languagesCount: entity.languages?.length,
    practiceAreas: entity.practiceAreas,
    socialLinks: entity.socialLinks,
    foreignBlocker:
      entity.listingLocation === "FOREIGN" ? (
        <BlockerLabel owner="Zane">
          Foreign market data is manually entered — long-term solution pending
        </BlockerLabel>
      ) : undefined,
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

  /* ── Table of Contents ── */
  const tocItems: { id: string; label: string }[] = [
    isPublic && { id: "market-data", label: "Market Data" },
    isProject && entity.keyMetrics && { id: "key-metrics", label: "Key Metrics" },
    isServiceProvider && entity.practiceAreas && entity.practiceAreas.length > 0 && {
      id: "practice-areas",
      label: "Practice Areas",
    },
    isServiceProvider && entity.notableEngagements && entity.notableEngagements.length > 0 && {
      id: "engagements",
      label: "Notable Engagements",
    },
    isServiceProvider && entity.notableClients && entity.notableClients.length > 0 && {
      id: "clients",
      label: "Notable Clients",
    },
    showFinancials && { id: "financials", label: "Financial Performance" },
    showSustainability && { id: "sustainability", label: "Sustainability" },
    (ownership.length > 0 ||
      (isPublic && (entity.parentGroup || (entity.subsidiaries && entity.subsidiaries.length > 0)))) && {
      id: "ownership-structure",
      label: "Ownership & Structure",
    },
    (isPublic ? (entity.ceo || (entity.executives && entity.executives.length > 0)) : personnel.length > 0) && {
      id: "leadership",
      label: isPublic ? "Executive Team" : "Key Personnel",
    },
    isPublic && entity.boardMembers && entity.boardMembers.length > 0 && {
      id: "board",
      label: "Board of Directors",
    },
    showDeals && { id: "deals", label: "Deal Insights" },
    (relatedArticles.length > 0 || isPublic) && { id: "coverage", label: "News & Research" },
    isServiceProvider && (entity.contactEmail || entity.contactPhone || entity.contactAddress) && {
      id: "contact",
      label: "Contact",
    },
  ].filter(Boolean) as { id: string; label: string }[];

  const mainContent = (
    <>
      {/* Sector taxonomy blocker — kept for non-public types while spec firms up */}
      {!isPublic && (
            <BlockerLabel owner="Namkhai / Zoloo" variant="block">
              Sector taxonomy is not yet finalized. The current sector tag
              (&quot;{entity.sector}&quot;) uses the placeholder vocabulary. Final category list
              pending from CMM research team before v1 launch.
            </BlockerLabel>
          )}

          {isPublic && (
            <section id="market-data" className="scroll-mt-[80px]">
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
            </section>
          )}

          {/* Project key metrics */}
          {isProject && entity.keyMetrics && (
            <section id="key-metrics" className="widget scroll-mt-[80px]">
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
            </section>
          )}

          {/* Service Provider: Practice Areas + Engagements */}
          {isServiceProvider && (
            <>
              {entity.practiceAreas && entity.practiceAreas.length > 0 && (
                <section id="practice-areas" className="widget scroll-mt-[80px]">
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
                </section>
              )}

              {entity.notableEngagements && entity.notableEngagements.length > 0 && (
                <section id="engagements" className="widget scroll-mt-[80px]">
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
                </section>
              )}

              {entity.notableClients && entity.notableClients.length > 0 && (
                <section id="clients" className="widget scroll-mt-[80px]">
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
                </section>
              )}
            </>
          )}

          {/* Financial Performance */}
          {showFinancials && (
            <section id="financials" className="flex flex-col gap-3 scroll-mt-[80px]">
              {!isPublic && (
                <BlockerLabel owner="Zoloo & Namkhai" variant="block">
                  Financial Performance structure (Summary Ratios + Multi-Year Tables) is
                  PENDING sign-off for private entities. Current tables use placeholder metrics
                  and will be reshaped once the team confirms the final field list.
                </BlockerLabel>
              )}

              {/* Summary Ratios */}
              {entity.summaryRatios && (
                <div className="widget">
                  <div className="widget-header">
                    <span>Summary Ratios</span>
                    {!isPublic && <span className="font-mono text-[10px] text-fg-3">DRAFT</span>}
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
                  source={isPublic ? `Source: ${entity.exchange ?? "MSE"} disclosures` : "DRAFT — Structure pending Zoloo & Namkhai sign-off."}
                />
              )}
            </section>
          )}

          {/* Sustainability */}
          {showSustainability && (
            <section id="sustainability" className="scroll-mt-[80px]">
              <SustainabilityWidget data={entity.sustainability!} />
            </section>
          )}

          {/* Ownership & Structure */}
          {(ownership.length > 0 ||
            (isPublic && (entity.parentGroup || (entity.subsidiaries && entity.subsidiaries.length > 0)))) && (
            <section id="ownership-structure" className="flex flex-col gap-4 scroll-mt-[80px]">
              {ownership.length > 0 && <OwnershipWidget owners={ownership} />}
              {isPublic && entity.parentGroup && <ParentGroupCard parent={entity.parentGroup} />}
              {isPublic && entity.subsidiaries && entity.subsidiaries.length > 0 && (
                <SubsidiariesWidget subsidiaries={entity.subsidiaries} />
              )}
            </section>
          )}

          {/* Executive Team */}
          {isPublic ? (
            (entity.ceo || (entity.executives && entity.executives.length > 0)) && (
              <section id="leadership" className="scroll-mt-[80px]">
                <ExecutiveOrgChart
                  ceo={entity.ceo}
                  executives={entity.executives ?? []}
                />
              </section>
            )
          ) : (
            personnel.length > 0 && (
              <section id="leadership" className="scroll-mt-[80px]">
                <KeyPersonnelWidget people={personnel} />
              </section>
            )
          )}

          {/* Board of Directors (public company premium) */}
          {isPublic && entity.boardMembers && entity.boardMembers.length > 0 && (
            <section id="board" className="scroll-mt-[80px]">
              <BoardMembersWidget members={entity.boardMembers} />
            </section>
          )}

          {/* Deal Insights */}
          {showDeals && (
            <section id="deals" className="scroll-mt-[80px]">
              <DealsTableWidget summary={entity.dealsSummary} deals={entity.deals!} />
            </section>
          )}

          {/* News & Research (combined coverage) */}
          {(relatedArticles.length > 0 || isPublic) && (
            <section id="coverage" className="scroll-mt-[80px]">
              <EntityCoverageWidget
                entitySlug={entity.slug}
                research={relatedArticles}
                useMockNews={isPublic}
                fallbackNews={!isPublic ? news.map((n) => ({ id: n.id, title: n.title, source: n.source, date: n.date })) : []}
              />
            </section>
          )}

          {/* Service Provider contact */}
          {isServiceProvider && (entity.contactEmail || entity.contactPhone || entity.contactAddress) && (
            <section id="contact" className="widget scroll-mt-[80px]">
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
            </section>
          )}
    </>
  );

  const sidebarContent = (
    <>
      {tocItems.length > 0 && <ArticleSidebar toc={tocItems} />}
      {showConnection && (
        <RequestConnectionWidget entityName={entity.name} loggedIn={false} />
      )}
      <DownloadsWidget
        reports={entity.reports}
        pitchDecks={entity.pitchDecks}
        sustainabilityDocs={entity.sustainabilityDocs}
        investmentTeasers={entity.investmentTeasers}
        operationalDocs={entity.operationalDocs}
        requiresAuth
      />
    </>
  );

  return (
    <ProfileVariants
      headerProps={headerProps}
      mainContent={mainContent}
      sidebarContent={sidebarContent}
    />
  );
}
