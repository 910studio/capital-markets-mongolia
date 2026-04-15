import { cn } from "@/app/lib/cn";
import { Widget, WidgetHeader, WidgetBody } from "@/app/components/ui";

/* ── Types ─────────────────────────────── */

interface QuickStat {
  label: string;
  value: string;
  isMono?: boolean;
}

interface QuickStatsWidgetProps {
  stats: QuickStat[];
  className?: string;
}

/* ── Component ─────────────────────────── */

export function QuickStatsWidget({ stats, className }: QuickStatsWidgetProps) {
  return (
    <Widget className={className}>
      <WidgetHeader title="Quick Stats" />
      <WidgetBody>
        <div className="grid grid-cols-2 gap-px bg-border-s rounded-xs overflow-hidden">
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
      </WidgetBody>
    </Widget>
  );
}
