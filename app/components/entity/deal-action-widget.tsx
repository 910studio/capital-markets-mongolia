import { Widget, WidgetHeader, WidgetBody, Badge } from "@/app/components/ui";

/* ── Types ─────────────────────────────── */

type DealStatus = "open" | "closing" | "closed" | "upcoming";

interface DealActionWidgetProps {
  roundName: string;
  amount: string;
  status: DealStatus;
  statusLabel?: string;
  description?: string;
  className?: string;
}

const statusVariantMap: Record<DealStatus, "pos" | "signal" | "neg" | "companies"> = {
  open: "pos",
  closing: "signal",
  closed: "neg",
  upcoming: "companies",
};

/* ── Component ─────────────────────────── */

export function DealActionWidget({
  roundName,
  amount,
  status,
  statusLabel,
  description,
  className,
}: DealActionWidgetProps) {
  const badgeVariant = statusVariantMap[status];
  const label = statusLabel ?? status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Widget className={className}>
      <WidgetHeader title="Deal Activity" />
      <WidgetBody>
        <div className="flex flex-col gap-4">
          {/* Round info */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-display font-semibold text-sm text-fg mb-0.5">
                {roundName}
              </div>
              <div className="font-mono font-semibold text-lg text-fg tabular-nums">
                {amount}
              </div>
            </div>
            <Badge variant={badgeVariant}>{label}</Badge>
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs text-fg-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* CTA */}
          <button className="btn btn-signal w-full">
            Request Connection
          </button>
        </div>
      </WidgetBody>
    </Widget>
  );
}
