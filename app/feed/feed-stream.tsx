"use client";

import { useMemo, useState } from "react";
import {
  type MockNewsItem,
  type NewsCategory,
  NEWS_CATEGORY_LABELS,
} from "@/app/lib/mock-data";
import { NewsItemCard } from "@/app/components/feed/news-item-card";
import { cn } from "@/app/lib/cn";

const CATEGORIES: { value: NewsCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "markets", label: NEWS_CATEGORY_LABELS.markets },
  { value: "companies", label: NEWS_CATEGORY_LABELS.companies },
  { value: "sectors", label: NEWS_CATEGORY_LABELS.sectors },
  { value: "policy", label: NEWS_CATEGORY_LABELS.policy },
  { value: "deals", label: NEWS_CATEGORY_LABELS.deals },
  { value: "macro", label: NEWS_CATEGORY_LABELS.macro },
];

type SourceFilter = "all" | "verified" | "unverified";

interface FeedStreamProps {
  items: MockNewsItem[];
}

export function FeedStream({ items }: FeedStreamProps) {
  const [category, setCategory] = useState<NewsCategory | "all">("all");
  const [source, setSource] = useState<SourceFilter>("all");
  const [activeSource, setActiveSource] = useState<string | null>(null);

  const sources = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => set.add(i.source));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (category !== "all") result = result.filter((i) => i.category === category);
    if (source === "verified") result = result.filter((i) => i.confidence >= 0.75);
    if (source === "unverified") result = result.filter((i) => i.confidence < 0.75);
    if (activeSource) result = result.filter((i) => i.source === activeSource);
    return result;
  }, [items, category, source, activeSource]);

  const grouped = useMemo(() => groupByDay(filtered), [filtered]);

  const activeCategoryLabel =
    category === "all" ? null : NEWS_CATEGORY_LABELS[category];

  return (
    <>
      {/* Page title — dynamic */}
      <div className="pt-8 pb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-extrabold text-2xl tracking-tight leading-heading">
            {activeCategoryLabel ?? "Market Feed"}
          </h1>
          {activeCategoryLabel && (
            <button
              onClick={() => setCategory("all")}
              className="font-display font-semibold text-sm text-fg-3 hover:text-brand cursor-pointer bg-transparent border-none leading-none mt-px"
            >
              ← All
            </button>
          )}
        </div>
        <p className="text-base text-fg-2 mt-1">
          Headlines from local and global wires, AI-tagged to entities and reviewed by CMM analysts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
        <div className="min-w-0">
          {/* Category tabs */}
          <div className="flex items-center gap-1 mb-4 overflow-x-auto scrollbar-none -mx-1 px-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={cn(
                  "px-3 py-1.5 rounded-[var(--btn-r)] text-sm font-display font-semibold whitespace-nowrap transition-all border border-transparent cursor-pointer",
                  category === c.value
                    ? "bg-brand-m text-brand"
                    : "text-fg-2 hover:text-fg hover:bg-surface"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Result meta */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[11px] text-fg-3 uppercase tracking-badge">
              {filtered.length} item{filtered.length === 1 ? "" : "s"}
            </span>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-badge text-fg-3">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pos animate-pulse" />
                Live
              </span>
            </div>
          </div>

          {/* Grouped feed */}
          {grouped.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-base text-fg-3">No items match these filters.</p>
              <button
                onClick={() => {
                  setCategory("all");
                  setSource("all");
                  setActiveSource(null);
                }}
                className="btn btn-secondary text-sm mt-4"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {grouped.map(([label, group]) => (
                <section key={label}>
                  <div
                    className="sticky z-20 -mx-2 px-2 py-2 backdrop-blur-md bg-[var(--header-blur)] border-b border-border-s flex items-center gap-3 mb-3"
                    style={{ top: "var(--header-h)" }}
                  >
                    <h2 className="font-display font-extrabold text-sm tracking-tight text-fg-2">
                      {label}
                    </h2>
                    <div className="flex-1 h-px bg-border-s" />
                    <span className="font-mono text-[10px] text-fg-3 uppercase tracking-badge">
                      {group.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {group.map((item) => (
                      <NewsItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside
          className="flex flex-col gap-4 lg:sticky lg:self-start"
          style={{ top: "calc(var(--header-h) + 24px)" }}
        >
          <div className="card !p-4">
            <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3 mb-3">
              Confidence
            </div>
            <div className="flex flex-col gap-1">
              {(["all", "verified", "unverified"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  className={cn(
                    "text-left px-2 py-1.5 rounded-[var(--btn-r)] text-sm font-medium cursor-pointer transition-colors border-none",
                    source === s
                      ? "bg-brand-m text-brand font-semibold"
                      : "bg-transparent text-fg-2 hover:bg-surface hover:text-fg"
                  )}
                >
                  {s === "all" ? "All items" : s === "verified" ? "Analyst-reviewed" : "Pending review"}
                </button>
              ))}
            </div>
          </div>

          <div className="card !p-4">
            <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3 mb-3">
              Sources
            </div>
            <div className="flex flex-col gap-1 max-h-[240px] overflow-y-auto scrollbar-none">
              <button
                onClick={() => setActiveSource(null)}
                className={cn(
                  "text-left px-2 py-1.5 rounded-[var(--btn-r)] text-sm font-medium cursor-pointer transition-colors border-none",
                  activeSource === null
                    ? "bg-brand-m text-brand font-semibold"
                    : "bg-transparent text-fg-2 hover:bg-surface hover:text-fg"
                )}
              >
                All sources
              </button>
              {sources.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSource(activeSource === s ? null : s)}
                  className={cn(
                    "text-left px-2 py-1.5 rounded-[var(--btn-r)] text-sm font-medium cursor-pointer transition-colors border-none",
                    activeSource === s
                      ? "bg-brand-m text-brand font-semibold"
                      : "bg-transparent text-fg-2 hover:bg-surface hover:text-fg"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function groupByDay(items: MockNewsItem[]): [string, MockNewsItem[]][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMs = today.getTime();
  const yesterdayMs = todayMs - 24 * 60 * 60 * 1000;
  const weekAgoMs = todayMs - 7 * 24 * 60 * 60 * 1000;

  const buckets: Record<string, MockNewsItem[]> = {
    Today: [],
    Yesterday: [],
    "This week": [],
    Earlier: [],
  };

  items
    .slice()
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .forEach((item) => {
      const t = new Date(item.publishedAt).getTime();
      if (t >= todayMs) buckets.Today.push(item);
      else if (t >= yesterdayMs) buckets.Yesterday.push(item);
      else if (t >= weekAgoMs) buckets["This week"].push(item);
      else buckets.Earlier.push(item);
    });

  return Object.entries(buckets).filter(([, v]) => v.length > 0);
}
