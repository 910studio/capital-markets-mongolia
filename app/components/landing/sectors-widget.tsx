"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/app/lib/cn";

interface Sector {
  name: string;
  width: string;
  value: string;
  direction: "pos" | "neg";
}

const SECTORS: Sector[] = [
  { name: "Mining", width: "82%", value: "+4.2%", direction: "pos" },
  { name: "Tech", width: "48%", value: "+2.1%", direction: "pos" },
  { name: "Finance", width: "40%", value: "+1.8%", direction: "pos" },
  { name: "Energy", width: "22%", value: "+0.9%", direction: "pos" },
  { name: "Real Estate", width: "8%", value: "-0.3%", direction: "neg" },
];

export function SectorsWidget() {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = barsRef.current;
    if (!container) return;

    const bars = container.querySelectorAll<HTMLDivElement>("[data-bar-width]");
    const timers: ReturnType<typeof setTimeout>[] = [];

    bars.forEach((bar, i) => {
      const t = setTimeout(() => {
        bar.style.width = bar.dataset.barWidth ?? "0%";
      }, 600 + i * 80);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="widget">
      <div className="p-4 px-5">
        <div className="mb-3 font-display text-xs font-bold">Sectors</div>
        <div ref={barsRef}>
          {SECTORS.map((s) => (
            <div key={s.name} className="flex items-center gap-2 py-1">
              <span className="w-[70px] shrink-0 font-mono text-[10px] text-fg-2">
                {s.name}
              </span>
              <div
                data-bar-width={s.width}
                className={cn(
                  "h-[14px] flex-1 rounded-[3px] transition-[width] duration-[600ms]",
                  s.direction === "neg" ? "bg-neg opacity-20" : "bg-brand opacity-20"
                )}
                style={{
                  width: "0%",
                  transitionTimingFunction: "var(--ease)",
                }}
              />
              <span
                className={cn(
                  "min-w-[36px] text-right font-mono text-[10px] font-semibold",
                  s.direction === "pos" ? "text-pos" : "text-neg"
                )}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
