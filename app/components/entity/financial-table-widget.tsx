"use client";

import { useState } from "react";
import { cn } from "@/app/lib/cn";
import { Widget, WidgetHeader, WidgetBody, DataTable } from "@/app/components/ui";

/* ── Types ─────────────────────────────── */

type FinancialTab = "P&L" | "Balance Sheet" | "Cash Flow";

interface FinancialRow {
  metric: string;
  values: string[];
}

interface FinancialTableWidgetProps {
  years: string[];
  data: Record<FinancialTab, FinancialRow[]>;
  source?: string;
  className?: string;
}

/* ── Component ─────────────────────────── */

export function FinancialTableWidget({
  years,
  data,
  source,
  className,
}: FinancialTableWidgetProps) {
  const tabs = Object.keys(data) as FinancialTab[];
  const [activeTab, setActiveTab] = useState<FinancialTab>(tabs[0]);
  const rows = data[activeTab];
  const headers = ["Metric", ...years];

  return (
    <Widget className={className}>
      <WidgetHeader
        title="Financial Performance"
        action={
          <div className="flex gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "font-display font-medium text-xs text-fg-3 px-3 py-1 cursor-pointer rounded-xs transition-all duration-150 bg-transparent border-none",
                  activeTab === tab &&
                    "bg-brand-m text-brand font-semibold"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        }
      />
      <WidgetBody>
        <DataTable headers={headers}>
          {rows.map((row) => (
            <tr key={row.metric}>
              <td>{row.metric}</td>
              {row.values.map((val, i) => {
                const isNeg = val.startsWith("-");
                return (
                  <td
                    key={`${row.metric}-${i}`}
                    className={cn(isNeg && "!text-neg")}
                  >
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </DataTable>
        {source && (
          <div className="text-[11px] text-fg-3 mt-2.5">{source}</div>
        )}
      </WidgetBody>
    </Widget>
  );
}
