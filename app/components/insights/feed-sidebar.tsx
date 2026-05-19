"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { MockNewsItem } from "@/app/lib/mock-data";
import { formatSourceLabel } from "@/app/lib/format-source";

/**
 * Right-rail "live" market feed for /insights. Shows the most recent news
 * items with relative timestamps that tick every 30s — gives the page a
 * frequently-updating signal without an actual WebSocket.
 */
export function FeedSidebar({ items }: { items: MockNewsItem[] }) {
  // Re-render every 30s so relative timestamps stay fresh.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  // Sort newest first; cap at 20 visible.
  const sorted = [...items]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, 20);

  return (
    <aside
      className="hidden xl:flex flex-col self-start sticky max-h-[calc(100vh-var(--header-h)-2rem)]"
      style={{
        top: "calc(var(--header-h) + 1rem)",
      }}
      aria-label="Live market feed"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-[2px] border-fg">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              background: "var(--pos)",
              animation: "feed-live-pulse 1.6s infinite",
            }}
          />
          <h2 className="font-display font-extrabold text-[11px] tracking-[0.14em] uppercase">
            Live · Market Feed
          </h2>
        </div>
        <Link
          href="/feed"
          className="text-[10px] uppercase tracking-[0.1em] font-display font-bold text-fg-3 hover:text-brand no-underline transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Items */}
      <ol
        className="flex flex-col overflow-y-auto scrollbar-none"
        // hidden from tick lint
        data-tick={tick}
      >
        {sorted.map((item) => (
          <FeedItem key={item.id} item={item} />
        ))}
      </ol>

      <style>{`
        @keyframes feed-live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </aside>
  );
}

function FeedItem({ item }: { item: MockNewsItem }) {
  const rel = relativeTime(new Date(item.publishedAt));
  return (
    <li className="border-b border-border-s py-3 first:pt-3">
      <Link
        href={item.sourceUrl ?? "/feed"}
        target={item.sourceUrl ? "_blank" : undefined}
        rel={item.sourceUrl ? "noopener noreferrer" : undefined}
        className="group block no-underline"
      >
        <div className="flex items-baseline gap-2 mb-1">
          {item.isBreaking && (
            <span
              className="font-mono font-bold text-[9px] uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-[2px]"
              style={{ background: "var(--neg-m)", color: "var(--neg-t)" }}
            >
              Breaking
            </span>
          )}
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-3">
            {rel}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fg-3 ml-auto">
            {formatSourceLabel(item.source)}
          </span>
        </div>
        <h3 className="font-display font-bold text-[13px] leading-[1.3] text-fg group-hover:text-brand transition-colors line-clamp-3">
          {item.headline}
        </h3>
      </Link>
    </li>
  );
}

function relativeTime(then: Date): string {
  const diffMs = Date.now() - then.getTime();
  const sec = Math.max(1, Math.floor(diffMs / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
