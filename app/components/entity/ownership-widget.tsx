import { Widget, WidgetHeader, WidgetBody } from "@/app/components/ui";

/* ── Types ─────────────────────────────── */

interface Owner {
  name: string;
  percentage: number;
  color: string;
}

interface OwnershipWidgetProps {
  owners: Owner[];
  className?: string;
}

/* ── Component ─────────────────────────── */

export function OwnershipWidget({ owners, className }: OwnershipWidgetProps) {
  return (
    <Widget className={className}>
      <WidgetHeader title="Ownership" />
      <WidgetBody>
        {/* Stacked bar */}
        <div className="h-2 rounded-[4px] flex overflow-hidden mb-3.5">
          {owners.map((owner) => (
            <div
              key={owner.name}
              style={{
                width: `${owner.percentage}%`,
                background: owner.color,
              }}
            />
          ))}
        </div>

        {/* Owner list */}
        <div className="flex flex-col gap-2.5">
          {owners.map((owner) => (
            <div
              key={owner.name}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-fg-2 flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: owner.color }}
                />
                {owner.name}
              </span>
              <span className="font-mono font-semibold text-sm text-fg">
                {owner.percentage}%
              </span>
            </div>
          ))}
        </div>
      </WidgetBody>
    </Widget>
  );
}
