"use client";

import { useState, useMemo, useCallback } from "react";
import { InsightsGrid } from "@/app/components/insights/insights-grid";
import type { Article, GridLayout } from "@/app/components/insights/insights-grid";
// import { PaywallCounter } from "@/app/components/ui/paywall-counter"; // disabled: free reads feature off
import { cn } from "@/app/lib/cn";

const LAYOUT_OPTIONS: { value: GridLayout; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "featured", label: "Featured" },
  { value: "editorial", label: "Editorial" },
];

const CONTENT_FILTERS = [
  { label: "All", value: "all" },
  { label: "Articles", value: "article" },
  { label: "Market Briefs", value: "update" },
  { label: "Research", value: "research" },
  { label: "Deal Insights", value: "deal" },
  { label: "Teasers", value: "teaser" },
  { label: "Press", value: "press" },
];

const TOPICS = [
  "Mining & Resources",
  "Energy",
  "Banking & Finance",
  "Capital Markets",
  "Economy & Macro",
  "Policy & Regulation",
  "ESG & Climate",
  "Technology",
  "Real Estate & Infrastructure",
  "State-Owned Enterprises",
  "Ratings & Governance",
  "Trade & Geopolitics",
];

interface InsightsControlsProps {
  articles: Article[];
}

export function InsightsControls({ articles }: InsightsControlsProps) {
  const [filter, setFilter] = useState("all");
  const [topic, setTopic] = useState<string | null>(null);
  const [layout, setLayout] = useState<GridLayout>("default");

  const filtered = useMemo(() => {
    let result = articles;
    if (filter !== "all") {
      result = result.filter((a) => a.badge.variant === filter);
    }
    if (topic) {
      result = result.filter((a) => a.topics?.includes(topic));
    }
    return result;
  }, [articles, filter, topic]);

  const total = filtered.length;
  const hasFilters = filter !== "all" || topic !== null;

  const handleBadgeClick = useCallback((variant: string) => {
    setFilter(variant);
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="grid grid-cols-[220px_1fr] gap-10 max-lg:grid-cols-1 max-lg:gap-6">
      {/* ── Sticky sidebar ─────────────────────────────── */}
      <aside
        className={cn(
          "sticky self-start py-8 pr-2",
          "top-[var(--header-h)]",
          "max-h-[calc(100vh-var(--header-h))] overflow-y-auto scrollbar-none",
          "max-lg:static max-lg:max-h-none max-lg:py-4 max-lg:pr-0 max-lg:overflow-visible",
        )}
        aria-label="Filters"
      >
        <SidebarSectionLabel>Type</SidebarSectionLabel>
        <ul className="flex flex-col mb-7 -mx-2">
          {CONTENT_FILTERS.map((f) => (
            <li key={f.value}>
              <button
                onClick={() => setFilter(f.value)}
                className={cn(
                  "group w-full text-left px-2 py-1.5 text-[13px] font-display font-semibold cursor-pointer transition-colors duration-[180ms] border-none bg-transparent",
                  "flex items-center gap-2",
                  f.value === filter ? "text-fg" : "text-fg-3 hover:text-fg",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-px transition-all duration-[280ms] ease-[cubic-bezier(0.7,0,0.2,1)]",
                    f.value === filter ? "w-4 bg-fg" : "w-1.5 bg-fg-3 group-hover:w-3 group-hover:bg-fg",
                  )}
                />
                <span>{f.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <SidebarSectionLabel>Topics</SidebarSectionLabel>
        <ul className="flex flex-col -mx-2">
          {TOPICS.map((t) => {
            const active = topic === t;
            return (
              <li key={t}>
                <button
                  onClick={() => setTopic(active ? null : t)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 text-[13px] cursor-pointer transition-colors duration-[180ms] border-none bg-transparent",
                    active ? "text-fg font-display font-semibold" : "text-fg-3 hover:text-fg",
                  )}
                >
                  {t}
                </button>
              </li>
            );
          })}
        </ul>

        {hasFilters && (
          <button
            onClick={() => { setFilter("all"); setTopic(null); }}
            className="mt-6 text-[11px] uppercase tracking-[0.12em] font-display font-bold text-fg-3 hover:text-brand cursor-pointer bg-transparent border-none px-2"
          >
            Clear all
          </button>
        )}
      </aside>

      {/* ── Content column ─────────────────────────────── */}
      <div className="min-w-0">
        {/* Page header */}
        <header className="pt-8 pb-6 border-b border-fg flex items-end justify-between gap-6">
          <div>
            <p className="font-display font-bold text-[11px] tracking-[0.18em] uppercase text-fg-3 mb-2">
              Insights
            </p>
            <h1 className="font-display font-extrabold text-3xl tracking-tight leading-none">
              {filter !== "all"
                ? CONTENT_FILTERS.find(f => f.value === filter)?.label ?? "Latest"
                : "Latest"}
            </h1>
          </div>

          <div className="flex items-center gap-4 pb-1">
            <div className="flex items-center gap-1 p-0.5 rounded-[var(--btn-r)] border border-border bg-[var(--white)]">
              {LAYOUT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLayout(opt.value)}
                  className={cn(
                    "px-2.5 py-1 rounded-[var(--btn-r)] text-xs font-display font-semibold cursor-pointer transition-all duration-[200ms] border-none",
                    layout === opt.value
                      ? "bg-brand text-white"
                      : "bg-transparent text-fg-2 hover:text-brand",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-fg-3 font-mono whitespace-nowrap">{total} results</span>
            {/* <PaywallCounter used={2} total={3} />  // disabled: free reads feature off */}
          </div>
        </header>

        {/* Active filter chips */}
        {(filter !== "all" || topic) && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-[10px] uppercase tracking-[0.12em] font-display font-bold text-fg-3">Filtering by</span>
            {filter !== "all" && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand bg-brand-m px-2.5 py-1 rounded-[var(--btn-r)]">
                {CONTENT_FILTERS.find(f => f.value === filter)?.label}
                <button onClick={() => setFilter("all")} className="text-brand hover:text-brand-h cursor-pointer bg-transparent border-none p-0 text-xs font-bold">×</button>
              </span>
            )}
            {topic && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-brand bg-brand-m px-2.5 py-1 rounded-[var(--btn-r)]">
                {topic}
                <button onClick={() => setTopic(null)} className="text-brand hover:text-brand-h cursor-pointer bg-transparent border-none p-0 text-xs font-bold">×</button>
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="mt-7">
          {filtered.length > 0 ? (
            <InsightsGrid
              articles={filtered}
              onBadgeClick={handleBadgeClick}
              activeFilter={filter}
              layout={layout}
              showTags
            />
          ) : (
            <div className="py-20 text-center">
              <p className="font-display font-bold text-base mb-1">No results found</p>
              <p className="text-sm text-fg-3 mb-5">Try adjusting your filters.</p>
              <button
                onClick={() => { setFilter("all"); setTopic(null); }}
                className="btn btn-secondary text-sm"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-display font-bold text-[10px] tracking-[0.18em] uppercase text-fg-3 mb-2 pb-2 border-b border-border-s">
      {children}
    </p>
  );
}
