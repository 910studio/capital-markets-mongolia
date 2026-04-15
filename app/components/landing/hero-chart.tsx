"use client";

import { useEffect, useRef } from "react";

const CHART_PATH =
  "M0,95 C20,90 40,82 60,78 C80,74 100,80 120,72 C140,64 160,70 180,58 C200,50 220,55 240,42 C260,35 280,40 300,30 C320,22 340,28 360,18 L380,15";

const FILL_PATH =
  "M0,95 C20,90 40,82 60,78 C80,74 100,80 120,72 C140,64 160,70 180,58 C200,50 220,55 240,42 C260,35 280,40 300,30 C320,22 340,28 360,18 L380,15 L380,120 L0,120 Z";

interface StatItem {
  label: string;
  value: string;
}

const STATS: StatItem[] = [
  { label: "Volume", value: "\u20AE4.2B" },
  { label: "52W High", value: "35,180" },
  { label: "52W Low", value: "28,420" },
  { label: "Mkt Cap", value: "\u20AE12.8T" },
];

export function HeroChart() {
  const lineRef = useRef<SVGPathElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = lineRef.current;
    const chart = chartRef.current;
    if (!line || !chart) return;

    const len = line.getTotalLength();
    line.style.setProperty("--len", String(len));

    const timer = setTimeout(() => {
      chart.classList.add("drawn");
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="widget overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--border-s)" }}
      >
        <span className="font-display text-sm font-bold">MSE Top 20 Index</span>
        <span className="flex items-center gap-[5px] font-mono text-[10px] font-medium text-pos">
          <span className="live-dot" />
          Live
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Price */}
        <div className="font-mono text-[2rem] font-bold leading-none tracking-tight">
          34,721
        </div>

        {/* Meta */}
        <div className="mt-1 flex items-center gap-2 font-mono text-xs text-fg-2">
          <span className="rounded-xs bg-pos-m px-1.5 py-0.5 font-semibold text-pos-t">
            +1.8%
          </span>
          <span>+612.4 today</span>
          <span>&middot;</span>
          <span>Apr 3, 2026</span>
        </div>

        {/* Chart */}
        <div ref={chartRef} className="hcc-chart relative mt-4 h-[120px] w-full">
          <svg
            viewBox="0 0 380 120"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.12} />
                <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <path className="fill" d={FILL_PATH} />
            <path ref={lineRef} className="line" d={CHART_PATH} />
          </svg>
        </div>

        {/* Stats row */}
        <div className="mt-4 flex gap-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-sm p-2"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border-s)",
              }}
            >
              <div className="font-mono text-[9px] uppercase tracking-badge text-fg-2">
                {s.label}
              </div>
              <div className="mt-0.5 font-mono text-[13px] font-semibold">
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
