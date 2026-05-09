import type { Metadata } from "next";
import Link from "next/link";
import { MOCK_EVENTS } from "@/app/lib/mock-data";
import { apiGet } from "@/app/lib/api";
import { adaptEventListItem } from "@/app/lib/api-adapters";
import { EventCard } from "@/app/components/events/event-card";

export const metadata: Metadata = {
  title: "Events — MarketIQ",
  description:
    "Conferences, investor days, and capital markets events curated by CMM.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  let events;
  try {
    const res = await apiGet("/api/events", {
      query: { limit: 100 },
      next: { revalidate: 60, tags: ["events"] },
    });
    events = res.items.map(adaptEventListItem);
    if (events.length === 0) events = MOCK_EVENTS;
  } catch (err) {
    console.error("[events] API fetch failed, falling back to mocks:", err);
    events = MOCK_EVENTS;
  }

  const upcoming = events
    .filter((e) => e.status !== "past")
    .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));
  const past = events
    .filter((e) => e.status === "past")
    .sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate))
    .slice(0, 3);

  const featured = upcoming[0];
  const rest = upcoming.slice(1);

  return (
    <div className="content-max px-6">
      <div className="pt-8 pb-6">
        <div className="font-mono text-[11px] uppercase tracking-badge text-brand mb-2">
          Events
        </div>
        <h1 className="font-display font-extrabold text-2xl tracking-tight leading-heading">
          Capital markets events, in person and virtual
        </h1>
        <p className="text-base text-fg-2 mt-2 max-w-[560px]">
          CMM-hosted forums, member briefings, and curated industry conferences. Register early — most fill up.
        </p>
      </div>

      {/* Featured upcoming */}
      {featured && (
        <section className="mb-12">
          <div
            className="sticky z-20 -mx-2 px-2 py-2 backdrop-blur-md bg-[var(--header-blur)] border-b border-border-s flex items-baseline justify-between mb-4"
            style={{ top: "var(--header-h)" }}
          >
            <h2 className="font-display font-extrabold text-md tracking-tight">
              Next up
            </h2>
            <span className="font-mono text-[11px] text-fg-3 uppercase tracking-badge">
              {upcoming.length} upcoming
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <EventCard event={featured} variant="featured" />
            </div>
            <div className="flex flex-col gap-3">
              {rest.slice(0, 3).map((e) => (
                <EventCard key={e.slug} event={e} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All upcoming grid */}
      {rest.length > 0 && (
        <section className="mb-12">
          <div
            className="sticky z-20 -mx-2 px-2 py-2 backdrop-blur-md bg-[var(--header-blur)] border-b border-border-s mb-4"
            style={{ top: "var(--header-h)" }}
          >
            <h2 className="font-display font-extrabold text-md tracking-tight">
              All upcoming
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </section>
      )}

      {/* Past events teaser */}
      {past.length > 0 && (
        <section className="mb-16">
          <div
            className="sticky z-20 -mx-2 px-2 py-2 backdrop-blur-md bg-[var(--header-blur)] border-b border-border-s flex items-baseline justify-between mb-4"
            style={{ top: "var(--header-h)" }}
          >
            <h2 className="font-display font-extrabold text-md tracking-tight">
              Recent past events
            </h2>
            <Link
              href="/events/past"
              className="text-sm font-display font-semibold text-brand hover:text-brand-h no-underline"
            >
              View archive →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {past.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
