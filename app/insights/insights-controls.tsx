"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { InsightsGrid, type GridLayout } from "@/app/components/insights/insights-grid";
import type { Article } from "@/app/components/insights/insights-grid";
import { PaywallCounter } from "@/app/components/ui/paywall-counter";
import { cn } from "@/app/lib/cn";

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

const LAYOUT_VARIANTS: { id: string; label: string; layout: GridLayout; showTags: boolean }[] = [
  { id: "v1", label: "V1 · No hero · Tags", layout: "no-hero", showTags: true },
  { id: "v2", label: "V2 · No hero · No tags", layout: "no-hero", showTags: false },
  { id: "v3", label: "V3 · Semafor · Tags", layout: "semafor", showTags: true },
  { id: "v4", label: "V4 · Semafor · No tags", layout: "semafor", showTags: false },
];


interface InsightsControlsProps {
  articles: Article[];
}

export function InsightsControls({ articles }: InsightsControlsProps) {
  const [filter, setFilter] = useState("all");
  const [topic, setTopic] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [variantId, setVariantId] = useState<string>("v1");
  const [switcherOpen, setSwitcherOpen] = useState(true);

  const variant = LAYOUT_VARIANTS.find((v) => v.id === variantId) ?? LAYOUT_VARIANTS[0];

  const filtered = useMemo(() => {
    let result = articles;
    if (filter !== "all") {
      result = result.filter((a) => a.badge.variant === filter);
    }
    return result;
  }, [articles, filter]);

  const total = filtered.length;
  const hasFilters = filter !== "all" || topic !== null;
  const activeCount = (filter !== "all" ? 1 : 0) + (topic ? 1 : 0);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const handleBadgeClick = useCallback((variant: string) => {
    setFilter(variant);
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      {/* Slide-in drawer + backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/30"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <div
        className={cn(
          "fixed top-0 left-0 z-[61] h-full w-[340px] max-w-[85vw] bg-[var(--white)] border-r border-border shadow-xl",
          "flex flex-col",
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-s shrink-0">
          <span className="font-display font-bold text-base">Filters</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 rounded-[var(--btn-r)] grid place-items-center cursor-pointer border-none bg-transparent text-fg-3 hover:bg-surface hover:text-fg transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none p-5">
          <span className="font-display font-bold text-xs uppercase tracking-[0.08em] text-fg-3 mb-3 block">Type</span>
          <div className="flex flex-col gap-0.5 mb-8">
            {CONTENT_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => { setFilter(f.value); }}
                className={cn(
                  "text-left px-3 py-2 rounded-[var(--btn-r)] text-sm font-medium cursor-pointer transition-all duration-[200ms] border-none",
                  f.value === filter
                    ? "bg-brand-m text-brand font-semibold"
                    : "bg-transparent text-fg-2 hover:bg-surface hover:text-fg"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="font-display font-bold text-xs uppercase tracking-[0.08em] text-fg-3 mb-3 block">Topics</span>
          <div className="flex flex-col gap-0.5">
            {TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => { setTopic(topic === t ? null : t); }}
                className={cn(
                  "flex items-center gap-2 text-left px-3 py-2 rounded-[var(--btn-r)] text-sm font-medium cursor-pointer transition-all duration-[200ms] border-none",
                  topic === t
                    ? "bg-brand-m text-brand font-semibold"
                    : "bg-transparent text-fg-2 hover:text-brand"
                )}
              >
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                  topic === t ? "bg-brand" : "bg-fg-3"
                )} />
                {t}
              </button>
            ))}
          </div>
        </div>

        {hasFilters && (
          <div className="px-5 py-4 border-t border-border-s shrink-0">
            <button
              onClick={() => { setFilter("all"); setTopic(null); }}
              className="btn btn-secondary w-full text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Page title — dynamic */}
      <div className="pt-8 pb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-extrabold text-2xl tracking-tight">
            {filter !== "all"
              ? CONTENT_FILTERS.find(f => f.value === filter)?.label ?? "Insights"
              : "Latest Insights"}
          </h1>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="font-display font-semibold text-sm text-fg-3 hover:text-brand cursor-pointer bg-transparent border-none leading-none mt-px"
            >
              ← All
            </button>
          )}
        </div>
        <p className="text-base text-fg-2 mt-1">
          Research &amp; analysis on Mongolia&apos;s capital markets
        </p>
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen(true)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-[var(--btn-r)] border text-sm font-display font-semibold cursor-pointer transition-all duration-[200ms]",
              hasFilters
                ? "border-brand bg-brand-m text-brand"
                : "border-border bg-[var(--white)] text-fg-2 hover:border-brand-l"
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="14" y2="12" />
              <line x1="4" y1="18" x2="10" y2="18" />
            </svg>
            Filters
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold grid place-items-center">
                {activeCount}
              </span>
            )}
          </button>

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

        <div className="flex items-center gap-4">
          <span className="text-xs text-fg-3 font-mono">{total} results</span>
          <PaywallCounter used={2} total={3} />
        </div>
      </div>

      {/* Content grid */}
      {filtered.length > 0 ? (
        <InsightsGrid
          articles={filtered}
          onBadgeClick={handleBadgeClick}
          activeFilter={filter}
          layout={variant.layout}
          showTags={variant.showTags}
        />
      ) : (
        <div className="py-20 text-center">
          <div className="w-12 h-12 rounded-[var(--card-r)] bg-surface grid place-items-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-fg-3">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
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

      {/* ── Floating layout switcher ── */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center gap-2">
        {switcherOpen ? (
          <div className="bg-[var(--white)] border border-border rounded-[var(--card-r)] shadow-xl p-2 min-w-[220px]">
            <div className="flex items-center justify-between px-2 py-1.5 mb-1">
              <span className="font-display font-bold text-[11px] uppercase tracking-[0.08em] text-fg-3">
                Layout preview
              </span>
              <button
                onClick={() => setSwitcherOpen(false)}
                aria-label="Close switcher"
                className="w-5 h-5 rounded grid place-items-center cursor-pointer border-none bg-transparent text-fg-3 hover:text-fg"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {LAYOUT_VARIANTS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  className={cn(
                    "text-left px-3 py-2 rounded-[var(--btn-r)] text-xs font-medium cursor-pointer transition-all duration-[200ms] border-none",
                    v.id === variantId
                      ? "bg-brand-m text-brand font-semibold"
                      : "bg-transparent text-fg-2 hover:bg-surface hover:text-fg"
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setSwitcherOpen(true)}
            className="bg-[var(--white)] border border-border rounded-full shadow-xl px-4 py-2 text-xs font-display font-bold text-fg cursor-pointer hover:border-brand-l transition-colors"
          >
            Layout · {variant.id.toUpperCase()}
          </button>
        )}
      </div>
    </>
  );
}
