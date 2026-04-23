import type { Sustainability } from "@/app/lib/mock-data";

/* ── SustainabilityWidget ────────────────── */

interface SustainabilityWidgetProps {
  data: Sustainability;
}

export function SustainabilityWidget({ data }: SustainabilityWidgetProps) {
  const flags: { label: string; value: boolean }[] = [
    { label: "ESG Policy", value: data.esgPolicy },
    { label: "Sustainability Disclosure", value: data.disclosure },
    { label: "Transition / Mitigation Strategy", value: data.transitionStrategy },
    { label: "Impact Tracked", value: data.impactTracked },
    { label: "Impact Verified", value: data.impactVerified },
  ];

  return (
    <div className="widget">
      <div className="widget-header">
        <span>Sustainability</span>
      </div>
      <div className="widget-body flex flex-col gap-5">
        {/* Outcomes */}
        {data.outcomes.length > 0 && (
          <div>
            <span className="font-display font-bold text-[11px] uppercase tracking-[0.08em] text-fg-3 mb-2 block">
              Sustainability Outcomes
            </span>
            <div className="flex flex-wrap gap-1.5">
              {data.outcomes.map((o) => (
                <span
                  key={o}
                  className="font-body font-medium text-xs py-1 px-3 rounded-[var(--btn-r)] bg-pos-m text-pos"
                >
                  {o}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SDGs */}
        {data.sdgs.length > 0 && (
          <div>
            <span className="font-display font-bold text-[11px] uppercase tracking-[0.08em] text-fg-3 mb-2 block">
              UN SDGs
            </span>
            <div className="flex flex-wrap gap-1.5">
              {data.sdgs.map((n) => (
                <span
                  key={n}
                  className="font-mono font-bold text-xs py-1 px-2.5 rounded-[var(--btn-r)] bg-brand-m text-brand"
                  title={`Sustainable Development Goal ${n}`}
                >
                  SDG {n}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Yes/No flags */}
        <div className="grid grid-cols-1 gap-1">
          {flags.map((f) => (
            <div key={f.label} className="flex items-center justify-between py-1 text-sm">
              <span className="text-fg-2">{f.label}</span>
              <span
                className={`font-display font-bold text-xs ${
                  f.value ? "text-pos" : "text-fg-3"
                }`}
              >
                {f.value ? "YES" : "NO"}
              </span>
            </div>
          ))}
        </div>

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div>
            <span className="font-display font-bold text-[11px] uppercase tracking-[0.08em] text-fg-3 mb-2 block">
              Certifications
            </span>
            <div className="flex flex-wrap gap-1.5">
              {data.certifications.map((c) => (
                <span
                  key={c.name}
                  className="font-mono font-medium text-xs py-1 px-2.5 rounded-[var(--btn-r)] bg-surface text-fg-2 border border-border-s"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
