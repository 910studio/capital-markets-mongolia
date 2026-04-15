"use client";

import { useState, useMemo } from "react";
import { FilterBar } from "@/app/components/ui/filter-bar";
import { InsightsGrid } from "@/app/components/insights/insights-grid";
import type { Article } from "@/app/components/insights/insights-grid";
import { Pagination } from "@/app/components/ui/pagination";
import { PaywallCounter } from "@/app/components/ui/paywall-counter";
import { cn } from "@/app/lib/cn";

const CONTENT_FILTERS = [
  { label: "All", value: "all" },
  { label: "Articles", value: "article" },
  { label: "Research Reports", value: "research" },
  { label: "Deal Insights", value: "deal" },
  { label: "Monthly Updates", value: "update" },
  { label: "Investment Teasers", value: "teaser" },
  { label: "Press Releases", value: "press" },
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

  return (
    <>
      <PaywallCounter used={2} total={3} className="py-2.5 px-4 bg-bg-alt rounded-[var(--card-r)] mb-5" />

      <FilterBar
        items={CONTENT_FILTERS}
        active={filter}
        onFilter={(v) => { setFilter(v); setPage(1); }}
        className="mb-4"
      />

      <div className="flex gap-1.5 flex-wrap mb-7">
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => { setTopic(topic === t ? null : t); setPage(1); }}
            className={cn(
              "font-body font-medium text-xs py-1 px-3",
              "rounded-[var(--btn-r)] cursor-pointer",
              "transition-all duration-[200ms]",
              topic === t
                ? "bg-brand-m text-brand"
                : "bg-surface text-fg-2 hover:bg-brand-m hover:text-brand"
            )}
          >
            {t}
          </button>
        ))}
      </div>

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
  );
}
