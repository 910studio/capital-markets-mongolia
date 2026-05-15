import type { Metadata } from "next";
import Link from "next/link";
import { getEvents } from "@/app/lib/data/events";
import { EventCard } from "@/app/components/events/event-card";

export const metadata: Metadata = {
  title: "Past Events — MarketIQ",
  description: "Archive of CMM-hosted forums, briefings, and conferences.",
};

export const dynamic = "force-dynamic";

export default async function PastEventsPage() {
  const events = await getEvents();
  const past = events
    .filter((e) => e.status === "past")
    .sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate));

  const grouped = past.reduce<Record<string, typeof past>>((acc, e) => {
    const year = new Date(e.startDate).getFullYear().toString();
    (acc[year] ??= []).push(e);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => +b - +a);

  return (
    <div className="content-max px-6">
      <div className="pt-6 pb-3">
        <Link
          href="/events"
          className="text-sm font-display font-semibold text-fg-3 hover:text-brand no-underline"
        >
          ← All events
        </Link>
      </div>

      <div className="pb-6">
        <div className="font-mono text-[11px] uppercase tracking-badge text-fg-3 mb-2">
          Archive
        </div>
        <h1 className="font-display font-extrabold text-2xl tracking-tight leading-heading">
          Past events
        </h1>
        <p className="text-base text-fg-2 mt-2 max-w-[560px]">
          Recaps, replays, and recordings from CMM-hosted forums and member briefings.
        </p>
      </div>

      <div className="flex flex-col gap-12 pb-16">
        {years.map((year) => (
          <section key={year}>
            <div
              className="sticky z-20 -mx-2 px-2 py-2 backdrop-blur-md bg-[var(--header-blur)] border-b border-border-s flex items-baseline gap-3 mb-4"
              style={{ top: "var(--header-h)" }}
            >
              <h2 className="font-display font-extrabold text-md tracking-tight">
                {year}
              </h2>
              <span className="font-mono text-[11px] text-fg-3 uppercase tracking-badge">
                {grouped[year].length} events
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped[year].map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          </section>
        ))}

        {past.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-base text-fg-3">No past events yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
