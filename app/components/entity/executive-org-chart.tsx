import { Widget, WidgetHeader, WidgetBody } from "@/app/components/ui";
import type { Person } from "@/app/lib/mock-data";
import { cn } from "@/app/lib/cn";

interface ExecutiveOrgChartProps {
  ceo?: Person;
  executives: Person[];
  className?: string;
  title?: string;
}

type Tier = "ceo" | "csuite" | "director" | "other";

function getInitials(p: Person): string {
  return (
    p.initials ??
    p.name
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase()
  );
}

function classify(p: Person): Tier {
  const t = p.title.toLowerCase();
  if (t.includes("chief executive officer") || /\bceo\b/.test(t)) return "ceo";
  if (t.startsWith("president") || t.includes(" president")) return "csuite";
  if (t.startsWith("chief")) return "csuite";
  if (t.startsWith("director") || t.includes(", director") || t.includes("director,")) return "director";
  return "other";
}

export function ExecutiveOrgChart({
  ceo,
  executives,
  title = "Executive Team",
  className,
}: ExecutiveOrgChartProps) {
  const tiers: Record<Tier, Person[]> = { ceo: [], csuite: [], director: [], other: [] };
  if (ceo) tiers.ceo.push(ceo);
  executives.forEach((e) => {
    const tier = classify(e);
    if (tier === "ceo" && tiers.ceo.length > 0) {
      tiers.csuite.push(e);
    } else {
      tiers[tier].push(e);
    }
  });

  const total = tiers.ceo.length + tiers.csuite.length + tiers.director.length + tiers.other.length;
  if (total === 0) return null;

  const hasNextAfterCeo = tiers.csuite.length > 0 || tiers.director.length > 0 || tiers.other.length > 0;
  const hasNextAfterCsuite = tiers.director.length > 0 || tiers.other.length > 0;

  return (
    <Widget className={className}>
      <WidgetHeader title={title} />
      <WidgetBody>
        <div className="flex flex-col items-stretch">
          {/* Tier 1 — CEO */}
          {tiers.ceo.length > 0 && (
            <div className="flex justify-center">
              {tiers.ceo.map((p) => (
                <ExecCard key={p.name} person={p} variant="lead" />
              ))}
            </div>
          )}

          {/* CEO → C-Suite trunk (single line dropping toward the bus) */}
          {tiers.ceo.length > 0 && tiers.csuite.length > 0 && <Trunk height={16} />}

          {/* CEO → Directors (when no csuite) */}
          {tiers.ceo.length > 0 && tiers.csuite.length === 0 && hasNextAfterCeo && <Trunk />}

          {/* Tier 2 — C-Suite (fixed-width columns + gap; bus segments extend into the gap) */}
          {tiers.csuite.length > 0 && (
            <div className="flex justify-center items-stretch gap-3 flex-wrap">
              {tiers.csuite.map((p, i) => {
                const isFirst = i === 0;
                const isLast = i === tiers.csuite.length - 1;
                const onlyOne = tiers.csuite.length === 1;
                return (
                  <div
                    key={p.name}
                    className="flex flex-col items-stretch w-[220px] max-w-full"
                  >
                    {tiers.ceo.length > 0 && (
                      <div className="relative h-4" aria-hidden>
                        {!onlyOne && (
                          <div
                            className={cn(
                              "absolute top-0 h-[2px] bg-border",
                              isFirst
                                ? "left-1/2 -right-3"
                                : isLast
                                ? "-left-3 right-1/2"
                                : "-left-3 -right-3"
                            )}
                          />
                        )}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-border" />
                      </div>
                    )}
                    <ExecCard person={p} variant="senior" />
                  </div>
                );
              })}
            </div>
          )}

          {/* C-Suite → Directors trunk */}
          {tiers.csuite.length > 0 && hasNextAfterCsuite && <Trunk />}

          {/* Tier 3 — Directors */}
          {tiers.director.length > 0 && (
            <div className={cn(tiers.ceo.length > 0 || tiers.csuite.length > 0 ? "mt-1" : "")}>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[10px] uppercase tracking-badge text-fg-3">
                  Division Directors
                </span>
                <div className="flex-1 h-px bg-border-s" />
                <span className="font-mono text-[10px] text-fg-3">{tiers.director.length}</span>
              </div>
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-1.5">
                {tiers.director.map((p) => (
                  <ExecCard key={p.name} person={p} variant="row" />
                ))}
              </div>
            </div>
          )}

          {/* Tier 4 — Other */}
          {tiers.other.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[10px] uppercase tracking-badge text-fg-3">
                  Other
                </span>
                <div className="flex-1 h-px bg-border-s" />
                <span className="font-mono text-[10px] text-fg-3">{tiers.other.length}</span>
              </div>
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-1.5">
                {tiers.other.map((p) => (
                  <ExecCard key={p.name} person={p} variant="row" />
                ))}
              </div>
            </div>
          )}
        </div>
      </WidgetBody>
    </Widget>
  );
}

/** Single vertical trunk connecting tier to tier */
function Trunk({ height = 24 }: { height?: number }) {
  return (
    <div className="flex justify-center" aria-hidden>
      <div className="w-[2px] bg-border" style={{ height }} />
    </div>
  );
}

function ExecCard({
  person,
  variant,
}: {
  person: Person;
  variant: "lead" | "senior" | "row";
}) {
  const initials = getInitials(person);

  if (variant === "lead") {
    return (
      <div className="inline-flex items-center gap-3 px-4 py-3 rounded-[var(--card-r)] border-2 border-brand bg-brand-m max-w-full">
        <div
          className="shrink-0 w-12 h-12 rounded-full grid place-items-center font-display font-extrabold text-sm text-brand-t"
          style={{ background: "var(--brand)" }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-badge text-brand mb-0.5">
            CEO
          </div>
          <div className="font-display font-extrabold text-sm leading-[1.2]">
            {person.name}
          </div>
          <div className="text-[11px] text-fg-2 leading-[1.3]">
            {person.title}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "senior") {
    return (
      <div className="flex items-start gap-2.5 px-3 py-2 rounded-[var(--card-r)] border border-border bg-[var(--white)] w-full">
        <div
          className="shrink-0 w-9 h-9 rounded-full grid place-items-center font-display font-bold text-[11px] text-brand-l"
          style={{
            background: "linear-gradient(135deg, var(--brand-m), var(--surface-el))",
          }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <div className="font-display font-semibold text-sm leading-[1.25]">
            {person.name}
          </div>
          <div className="text-[11px] text-fg-3 leading-[1.3]">
            {person.title}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--btn-r)] hover:bg-brand-m transition-colors">
      <div
        className="shrink-0 w-7 h-7 rounded-full grid place-items-center font-display font-bold text-[10px] text-fg-3"
        style={{ background: "var(--surface)" }}
      >
        {initials}
      </div>
      <div className="min-w-0">
        <div className="font-display font-semibold text-xs leading-[1.25]">
          {person.name}
        </div>
        <div className="text-[10px] text-fg-3 leading-[1.3]">
          {person.title}
        </div>
      </div>
    </div>
  );
}
