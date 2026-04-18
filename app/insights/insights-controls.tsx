"use client";

import { useState, useMemo } from "react";
import { InsightsGrid } from "@/app/components/insights/insights-grid";
import type { Article } from "@/app/components/insights/insights-grid";
import { Pagination } from "@/app/components/ui/pagination";
import { PaywallCounter } from "@/app/components/ui/paywall-counter";
import { cn } from "@/app/lib/cn";

const CONTENT_FILTERS = [
  { label: "All", value: "all" },
  { label: "Articles", value: "article" },
  { label: "Research", value: "research" },
  { label: "Deal Insights", value: "deal" },
  { label: "Monthly Updates", value: "update" },
  { label: "Teasers", value: "teaser" },
  { label: "Press", value: "press" },
];

const TOPICS = [
  "Mining & Resources",
  "Capital Markets",
  "Banking & Finance",
  "Energy",
  "Economy",
  "Politics & Government",
  "ESG & Sustainability",
  "Technology",
  "Real Estate",
];

interface InsightsControlsProps {
  articles: Article[];
}

export function InsightsControls({ articles }: InsightsControlsProps) {
  const [filter, setFilter] = useState("all");
  const [topic, setTopic] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = articles;
    if (filter !== "all") {
      result = result.filter((a) => a.badge.variant === filter);
    }
    return result;
  }, [articles, filter]);

  const total = filtered.length;
  const hasFilters = filter !== "all" || topic !== null;

  return (
    <div className="grid grid-cols-[220px_1fr] gap-10 items-start max-lg:grid-cols-1">
      {/* Sidebar */}
      <aside className="sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-none hidden lg:block">
        <PaywallCounter used={2} total={3} className="py-2.5 px-3 bg-bg-alt rounded-[var(--card-r)] mb-6" />

        <div className="widget mb-5">
          <div className="widget-header">
            <span>Type</span>
          </div>
          <div className="widget-body">
            <div className="flex flex-col gap-0.5">
              {CONTENT_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => { setFilter(f.value); setPage(1); }}
                  className={cn(
                    "text-left px-2.5 py-1.5 rounded-[var(--btn-r)] text-xs font-medium cursor-pointer",
                    "transition-all duration-[200ms] border-none",
                    f.value === filter
                      ? "bg-brand-m text-brand font-semibold"
                      : "bg-transparent text-fg-2 hover:bg-surface hover:text-fg"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="widget">
          <div className="widget-header">
            <span>Topics</span>
          </div>
          <div className="widget-body">
            <div className="flex flex-col gap-0.5">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTopic(topic === t ? null : t); setPage(1); }}
                  className={cn(
                    "flex items-center gap-2 text-left px-2.5 py-1.5 rounded-[var(--btn-r)] text-xs font-medium cursor-pointer",
                    "transition-all duration-[200ms] border-none",
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
        </div>

        {hasFilters && (
          <button
            onClick={() => { setFilter("all"); setTopic(null); setPage(1); }}
            className="mt-4 text-xs text-brand-l font-medium hover:text-brand cursor-pointer bg-transparent border-none w-full text-left px-2.5"
          >
            Clear all filters
          </button>
        )}
      </aside>

      {/* Mobile filters (shown below lg) */}
      <div className="lg:hidden mb-6">
        <PaywallCounter used={2} total={3} className="py-2.5 px-4 bg-bg-alt rounded-[var(--card-r)] mb-4" />

        {/* Horizontal scroll type filters */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-3 -mx-6 px-6">
          {CONTENT_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setFilter(f.value); setPage(1); }}
              className={cn(
                "font-display font-semibold text-xs py-1.5 px-3 rounded-[var(--btn-r)] border cursor-pointer transition-all duration-[200ms] whitespace-nowrap shrink-0",
                f.value === filter
                  ? "bg-brand-m border-brand-l text-brand"
                  : "bg-[var(--white)] border-border text-fg-2"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Collapsible topics */}
        <details className="group border border-border rounded-[var(--btn-r)] overflow-hidden">
          <summary className="flex items-center justify-between py-2.5 px-3 cursor-pointer text-xs font-display font-semibold text-fg list-none bg-[var(--white)]">
            <span>{topic ?? "Filter by topic"}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-fg-3 transition-transform group-open:rotate-180">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </summary>
          <div className="flex flex-col border-t border-border bg-[var(--white)]">
            {TOPICS.map((t) => (
              <button
                key={t}
                onClick={(e) => {
                  setTopic(topic === t ? null : t);
                  setPage(1);
                  (e.currentTarget.closest("details") as HTMLDetailsElement).open = false;
                }}
                className={cn(
                  "text-left px-3 py-2 text-xs font-medium cursor-pointer border-none transition-all duration-[200ms]",
                  topic === t
                    ? "bg-brand-m text-brand font-semibold"
                    : "bg-transparent text-fg-2 hover:bg-surface"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </details>

        {hasFilters && (
          <button
            onClick={() => { setFilter("all"); setTopic(null); setPage(1); }}
            className="text-xs text-brand-l font-medium hover:text-brand cursor-pointer bg-transparent border-none mt-1"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Content grid */}
      <div>
        {filtered.length > 0 ? (
          <>
            <InsightsGrid articles={filtered} />

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border-s">
              <span className="text-sm text-fg-3">
                Showing {Math.min(total, 12)} of {total} results
              </span>
              <Pagination
                total={total}
                current={page}
                perPage={12}
                onChange={setPage}
              />
            </div>
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="w-12 h-12 rounded-[var(--card-r)] bg-surface grid place-items-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-fg-3">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <p className="font-display font-bold text-base mb-1">No results found</p>
            <p className="text-sm text-fg-3 mb-5">Try adjusting your filters or search a different topic.</p>
            <button
              onClick={() => { setFilter("all"); setTopic(null); setPage(1); }}
              className="btn btn-secondary text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
