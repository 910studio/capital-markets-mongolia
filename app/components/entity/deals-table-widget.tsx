import type { Deal } from "@/app/lib/mock-data";

/* ── DealsTableWidget ────────────────── */

interface DealsTableWidgetProps {
  summary?: string;
  deals: Deal[];
}

export function DealsTableWidget({ summary, deals }: DealsTableWidgetProps) {
  return (
    <div className="widget">
      <div className="widget-header">
        <span>Deal Insights</span>
        {summary && <span className="font-mono text-[11px] text-fg-3">{summary}</span>}
      </div>
      <div className="widget-body !p-0 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Date", "Amount", "Investors", "Funding Type", "Purpose"].map((h) => (
                <th
                  key={h}
                  className="text-left font-display font-semibold text-[11px] uppercase tracking-[0.06em] text-fg-3 px-4 py-2.5 border-b border-border-s bg-bg-alt"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deals.map((d, i) => (
              <tr
                key={i}
                className="border-b border-border-s last:border-b-0 hover:bg-brand-m transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-fg-2 whitespace-nowrap">
                  {d.date}
                </td>
                <td className="px-4 py-3 font-mono text-sm font-semibold tabular-nums">
                  {d.amount}
                </td>
                <td className="px-4 py-3 text-sm text-fg">{d.investors.join(", ")}</td>
                <td className="px-4 py-3">
                  <span className="font-display font-semibold text-[10px] uppercase tracking-[0.06em] py-1 px-2 rounded-[var(--badge-r)] bg-brand-m text-brand">
                    {d.fundingType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-fg-2">{d.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
