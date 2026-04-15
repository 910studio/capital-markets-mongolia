"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/app/lib/cn";
import { Widget, WidgetHeader, WidgetBody } from "@/app/components/ui";

/* ── Types ─────────────────────────────── */

type TimePeriod = "1M" | "3M" | "1Y" | "ALL";

interface ChartDataPoint {
  x: number;
  y: number;
}

interface PeriodData {
  points: ChartDataPoint[];
  trend: "up" | "down" | "volatile";
  low: string;
  high: string;
  change: string;
}

interface StatItem {
  label: string;
  value: string;
  isMono?: boolean;
}

interface MarketDataWidgetProps {
  price: string;
  priceChange: string;
  priceDirection: "up" | "down";
  volume: string;
  dayRange: string;
  chartData: Record<TimePeriod, PeriodData>;
  stats: StatItem[];
  lastUpdated: string;
  source: string;
  className?: string;
}

/* ── SVG Chart ─────────────────────────── */

function pointsToPath(points: ChartDataPoint[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

function pointsToFill(points: ChartDataPoint[]): string {
  if (points.length === 0) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return (
    pointsToPath(points) + ` ${last.x},200 ${first.x},200`
  );
}

/* ── Component ─────────────────────────── */

export function MarketDataWidget({
  price,
  priceChange,
  priceDirection,
  volume,
  dayRange,
  chartData,
  stats,
  lastUpdated,
  source,
  className,
}: MarketDataWidgetProps) {
  const [activePeriod, setActivePeriod] = useState<TimePeriod>("3M");
  const [animated, setAnimated] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const periods: TimePeriod[] = ["1M", "3M", "1Y", "ALL"];
  const data = chartData[activePeriod];
  const isDown = data.trend === "down";
  const strokeColor = isDown ? "var(--neg)" : "var(--pos)";
  const gradientId = isDown ? "chartGradNeg" : "chartGradPos";

  // Animate chart on mount via IntersectionObserver
  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimated(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function handlePeriodChange(period: TimePeriod) {
    setActivePeriod(period);
    // Re-trigger draw animation
    setAnimated(false);
    requestAnimationFrame(() => setAnimated(true));
  }

  return (
    <Widget className={className}>
      <WidgetHeader title="Market Data" action={<span className="font-display font-semibold text-xs text-brand-l cursor-pointer hover:text-brand transition-colors">Full Chart &rarr;</span>} />
      <WidgetBody>
        {/* Stats row */}
        <div className="flex gap-6 mb-4 flex-wrap">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-fg-3 uppercase tracking-badge font-medium">
              Price
            </span>
            <span className="font-mono font-semibold text-base text-fg">
              {price}{" "}
              <span
                className={cn(
                  "text-xs ml-1",
                  priceDirection === "up" ? "text-pos" : "text-neg"
                )}
              >
                {priceChange}
              </span>
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-fg-3 uppercase tracking-badge font-medium">
              Volume
            </span>
            <span className="font-mono font-semibold text-base text-fg">
              {volume}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-fg-3 uppercase tracking-badge font-medium">
              Day Range
            </span>
            <span className="font-mono text-sm text-fg-2">{dayRange}</span>
          </div>
        </div>

        {/* Chart period tabs */}
        <div className="flex gap-0.5 mb-4 bg-surface rounded-xs p-[3px] w-fit">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodChange(period)}
              className={cn(
                "px-3.5 py-1.5 rounded-[3px] border-none cursor-pointer font-display font-semibold text-[11px] tracking-[0.02em] transition-all duration-150",
                activePeriod === period
                  ? "bg-[var(--white)] text-fg shadow-xs"
                  : "bg-transparent text-fg-3 hover:text-fg"
              )}
            >
              {period}
            </button>
          ))}
        </div>

        {/* SVG Chart */}
        <div
          ref={chartRef}
          className="w-full h-[200px] relative mb-2 cursor-crosshair"
        >
          <svg
            viewBox="0 0 700 200"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="chartGradPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="chartGradNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DC2626" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#DC2626" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="50" x2="700" y2="50" stroke="var(--border-s)" strokeWidth="1" className={cn("transition-opacity duration-500", animated ? "opacity-100" : "opacity-0")} />
            <line x1="0" y1="100" x2="700" y2="100" stroke="var(--border-s)" strokeWidth="1" className={cn("transition-opacity duration-500 delay-150", animated ? "opacity-100" : "opacity-0")} />
            <line x1="0" y1="150" x2="700" y2="150" stroke="var(--border-s)" strokeWidth="1" className={cn("transition-opacity duration-500 delay-300", animated ? "opacity-100" : "opacity-0")} />

            {/* Fill area */}
            <polygon
              points={pointsToFill(data.points)}
              fill={`url(#${gradientId})`}
              className={cn(
                "transition-opacity duration-700 delay-700",
                animated ? "opacity-100" : "opacity-0"
              )}
            />

            {/* Line */}
            <polyline
              points={pointsToPath(data.points)}
              fill="none"
              stroke={strokeColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2000"
              strokeDashoffset={animated ? "0" : "2000"}
              style={{
                transition: "stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />

            {/* Endpoint dot */}
            {data.points.length > 0 && (
              <>
                <circle
                  cx={data.points[data.points.length - 1].x}
                  cy={data.points[data.points.length - 1].y}
                  r={animated ? 4.5 : 0}
                  fill={strokeColor}
                  style={{
                    transition: "r 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1.8s",
                  }}
                />
                <circle
                  cx={data.points[data.points.length - 1].x}
                  cy={data.points[data.points.length - 1].y}
                  r={animated ? 7 : 0}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  opacity={0.3}
                  style={{
                    transition: "r 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1.8s",
                  }}
                />
              </>
            )}
          </svg>
        </div>

        <div className="text-[11px] text-fg-3 mb-4">
          Last updated: {lastUpdated} &middot; Source: {source}
        </div>

        {/* Stats grid */}
        {stats.length > 0 && (
          <div className="grid grid-cols-3 gap-px bg-border-s rounded-xs overflow-hidden">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[var(--white)] p-3 flex flex-col gap-0.5"
              >
                <span className="text-[11px] text-fg-3 font-medium">
                  {stat.label}
                </span>
                <span
                  className={cn(
                    "font-semibold text-sm text-fg tabular-nums",
                    stat.isMono !== false ? "font-mono" : "font-body"
                  )}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </WidgetBody>
    </Widget>
  );
}
