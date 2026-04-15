import { cn } from "@/app/lib/cn";
import { Widget, WidgetHeader, WidgetBody } from "@/app/components/ui";

/* ── Types ─────────────────────────────── */

interface TechnicalSpec {
  label: string;
  value: string;
}

interface TechnicalSpecsWidgetProps {
  specs: TechnicalSpec[];
  className?: string;
}

/* ── Component ─────────────────────────── */

export function TechnicalSpecsWidget({
  specs,
  className,
}: TechnicalSpecsWidgetProps) {
  return (
    <Widget className={className}>
      <WidgetHeader title="Technical Specifications" />
      <WidgetBody>
        <div className="flex flex-col">
          {specs.map((spec, i) => (
            <div
              key={spec.label}
              className={cn(
                "flex items-center justify-between py-2.5",
                i < specs.length - 1 && "border-b border-border-s"
              )}
            >
              <span className="text-sm text-fg-2">{spec.label}</span>
              <span className="font-mono font-medium text-sm text-fg tabular-nums">
                {spec.value}
              </span>
            </div>
          ))}
        </div>
      </WidgetBody>
    </Widget>
  );
}
