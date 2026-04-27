import type { Metadata } from "next";
import { ConciergeForm } from "./concierge-form";

export const metadata: Metadata = {
  title: "CMM Concierge — MarketIQ",
  description:
    "Request introductions to investors, companies, deal flow, or custom research. Routed to a CMM analyst within 1 business day.",
};

const VALUE_PROPS = [
  {
    label: "Direct access",
    title: "Curated investor & operator intros",
    body: "Hand-matched introductions to senior decision makers across mining, banking, and infrastructure.",
  },
  {
    label: "Deal flow",
    title: "Pre-marketing & private placements",
    body: "First look at active mandates — bonds, equity raises, project finance — before they hit broader distribution.",
  },
  {
    label: "Research",
    title: "Bespoke market intelligence",
    body: "Custom research, deep dives, and counterparty diligence delivered by CMM's analyst team.",
  },
];

export default function ConciergePage() {
  return (
    <div className="content-max px-6 pb-16">
      <div className="pt-10 pb-8 text-center">
        <div className="font-mono text-[11px] uppercase tracking-badge text-brand mb-3">
          CMM Concierge
        </div>
        <h1 className="font-display font-extrabold text-3xl tracking-tight leading-[1.05] max-md:text-2xl">
          Get connected — fast.
        </h1>
        <p className="text-base text-fg-2 mt-3 max-w-[620px] mx-auto">
          Tell us what you need and a CMM analyst will route your request within 1 business day. Used by 200+ investors and corporates this year.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12 max-w-[920px] mx-auto">
        {VALUE_PROPS.map((p) => (
          <div
            key={p.label}
            className="card flex flex-col gap-2"
          >
            <div className="font-mono text-[10px] uppercase tracking-badge text-brand">
              {p.label}
            </div>
            <div className="font-display font-extrabold text-sm leading-[1.3]">
              {p.title}
            </div>
            <p className="text-xs text-fg-2 leading-[1.55]">
              {p.body}
            </p>
          </div>
        ))}
      </div>

      <ConciergeForm />
    </div>
  );
}
