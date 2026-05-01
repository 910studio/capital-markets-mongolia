"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/app/components/ui";
import { NewsItemCard } from "@/app/components/feed/news-item-card";
import { MOCK_NEWS } from "@/app/lib/mock-data";
import { cn } from "@/app/lib/cn";

type ResearchType = "markets" | "companies" | "sectors" | "insights" | "ai";

interface ResearchItem {
  id: string;
  title: string;
  type: ResearchType;
  typeLabel: string;
  date: string;
  href?: string;
}

interface FallbackNews {
  id: string;
  title: string;
  source: string;
  date: string;
  href?: string;
}

interface EntityCoverageWidgetProps {
  entitySlug: string;
  research: ResearchItem[];
  fallbackNews?: FallbackNews[];
  useMockNews?: boolean;
  newsLimit?: number;
  researchLimit?: number;
}

export function EntityCoverageWidget({
  entitySlug,
  research,
  fallbackNews = [],
  useMockNews = false,
  newsLimit = 5,
  researchLimit = 5,
}: EntityCoverageWidgetProps) {
  const newsItems = useMockNews
    ? MOCK_NEWS.filter((n) => n.entitySlugs.includes(entitySlug))
        .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
        .slice(0, newsLimit)
    : [];

  const sortedResearch = [...research]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, researchLimit);

  const hasMockNews = newsItems.length > 0;
  const hasFallbackNews = fallbackNews.length > 0;
  const hasNews = hasMockNews || hasFallbackNews;
  const hasResearch = sortedResearch.length > 0;

  const tabs: ("news" | "research")[] = [];
  if (hasNews) tabs.push("news");
  if (hasResearch) tabs.push("research");

  const [active, setActive] = useState<"news" | "research">(tabs[0] ?? "news");

  if (tabs.length === 0) return null;

  return (
    <div className="widget">
      <div className="widget-header flex items-center justify-between">
        <div className="flex items-center gap-1">
          {hasNews && (
            <button
              onClick={() => setActive("news")}
              className={cn(
                "px-3 py-1 rounded-[var(--btn-r)] text-xs font-display font-semibold uppercase tracking-badge cursor-pointer transition-all duration-[150ms] border-none",
                active === "news"
                  ? "bg-brand-m text-brand"
                  : "bg-transparent text-fg-3 hover:text-fg"
              )}
            >
              In the News
            </button>
          )}
          {hasResearch && (
            <button
              onClick={() => setActive("research")}
              className={cn(
                "px-3 py-1 rounded-[var(--btn-r)] text-xs font-display font-semibold uppercase tracking-badge cursor-pointer transition-all duration-[150ms] border-none",
                active === "research"
                  ? "bg-brand-m text-brand"
                  : "bg-transparent text-fg-3 hover:text-fg"
              )}
            >
              CMM Research
            </button>
          )}
        </div>
        {active === "news" && hasMockNews && (
          <Link
            href={`/feed?entity=${entitySlug}`}
            className="font-mono text-[10px] uppercase tracking-badge text-brand hover:text-brand-h no-underline"
          >
            See all →
          </Link>
        )}
        {active === "research" && (
          <Link
            href="/insights"
            className="font-display font-semibold text-xs text-brand-l hover:text-brand transition-colors no-underline"
          >
            View All →
          </Link>
        )}
      </div>

      <div className="widget-body">
        {active === "news" && hasMockNews && (
          <div>
            {newsItems.map((item) => (
              <NewsItemCard key={item.id} item={item} variant="inline" />
            ))}
          </div>
        )}

        {active === "news" && !hasMockNews && hasFallbackNews && (
          <div>
            {fallbackNews.map((item) => (
              <a
                key={item.id}
                href={item.href ?? "#"}
                className="block py-3 border-b border-border-s last:border-b-0 last:pb-0 no-underline transition-colors duration-150 hover:bg-brand-m -mx-[var(--w-p)] px-[var(--w-p)]"
              >
                <div className="font-display font-semibold text-sm text-fg leading-snug mb-1 line-clamp-2 hover:text-brand transition-colors">
                  {item.title}
                </div>
                <div className="text-[11px] text-fg-3 flex items-center gap-1.5">
                  <span>{item.source}</span>
                  <span className="w-[3px] h-[3px] rounded-full bg-fg-3" />
                  <span>{item.date}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {active === "research" && (
          <div>
            {sortedResearch.map((item) => (
              <Link
                key={item.id}
                href={item.href ?? `/insights/${item.id}`}
                className="block py-3 border-b border-border-s last:border-b-0 last:pb-0 no-underline transition-colors duration-150 hover:bg-brand-m -mx-[var(--w-p)] px-[var(--w-p)]"
              >
                <div className="font-display font-semibold text-sm text-fg leading-snug mb-1 hover:text-brand transition-colors">
                  {item.title}
                </div>
                <div className="text-[11px] text-fg-3 flex items-center gap-1.5">
                  <Badge variant={item.type} className="!text-[9px]">
                    {item.typeLabel}
                  </Badge>
                  <span className="w-[3px] h-[3px] rounded-full bg-fg-3" />
                  <span>{item.date}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
