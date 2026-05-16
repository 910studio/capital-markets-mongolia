import type { Metadata } from "next";
import { getEvents } from "@/app/lib/data/events";
import { EventTabs } from "@/app/components/events/event-tabs";
import { EventHero } from "@/app/components/events/event-hero";
import { EventsRail } from "@/app/components/events/events-rail";
import { ScrollSnap } from "@/app/components/events/scroll-snap";

export const metadata: Metadata = {
  title: "Events — MarketIQ",
  description:
    "Conferences, investor days, and capital markets events curated by CMM.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getEvents();

  const upcoming = events
    .filter((e) => e.status !== "past")
    .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));
  const past = events
    .filter((e) => e.status === "past")
    .sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate));

  const featured = upcoming[0];

  return (
    <div data-mode="dark" style={{ marginTop: "calc(-1 * var(--header-h))", background: "var(--bg)", color: "var(--fg)" }}>
      <ScrollSnap />
      {/* Subtle black top-to-bottom gradient — darkens hero behind the
          transparent nav. zIndex:30 so tabs (z-40) and nav (z-50) stay clear. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0"
        style={{
          height: 140,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0) 100%)",
          zIndex: 30,
        }}
      />

      {featured && (
        <EventHero
          event={featured}
          index={1}
          total={upcoming.length}
          sectionId="featured"
          topRightLabel="FEATURED"
          bottomRightSubLabel="UPCOMING EVENTS"
        />
      )}

      <EventTabs
        tabs={[
          { id: "featured", label: "Featured", count: featured ? 1 : 0 },
          { id: "upcoming", label: "Upcoming", count: upcoming.length },
          { id: "past", label: "Past", count: past.length },
        ]}
        meta="Season II · 2026"
      />

      {/* Upcoming events rail */}
      {upcoming.length > 0 && (
        <RailSection
          id="upcoming"
          ariaLabel="Upcoming events"
          eyebrow={`/ Calendar · ${shortYear(upcoming[0].startDate)}`}
          title="Upcoming"
          titleSecondLine="Events"
          countLabel={`Featuring ${pad2(upcoming.length)} sessions`}
          tickCount={upcoming.length}
        >
          <EventsRail
            events={upcoming}
            cardCtaLabel="RSVP →"
            featuredSlug={featured?.slug}
          />
        </RailSection>
      )}

      {/* Past events rail */}
      {past.length > 0 && (
        <RailSection
          id="past"
          ariaLabel="Past events"
          eyebrow={`/ Archive · ${minYear(past)}—${maxYear(past)}`}
          title="Past"
          titleSecondLine="Events"
          countLabel={`Featuring ${pad2(past.length)} sessions`}
          tickCount={past.length}
        >
          <EventsRail events={past} cardCtaLabel="Recap →" />
        </RailSection>
      )}
    </div>
  );
}

/* ── Reusable section shell that wraps a rail with brutalist head ─── */

function RailSection({
  id,
  ariaLabel,
  eyebrow,
  title,
  titleSecondLine,
  countLabel,
  children,
}: {
  id: string;
  ariaLabel: string;
  eyebrow: string;
  title: string;
  titleSecondLine?: string;
  countLabel: string;
  tickCount: number;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-snap
      aria-label={ariaLabel}
      className="border-t border-border"
      style={{ paddingTop: 120, paddingBottom: 64, background: "var(--bg)" }}
    >
      <div
        className="grid items-end gap-8 mb-14 px-6 pb-6 border-b border-border max-md:grid-cols-1 max-md:gap-3"
        style={{ gridTemplateColumns: "auto 1fr auto" }}
      >
        <div>
          <div
            className="font-mono text-[12px] uppercase tracking-[0.1em] font-bold"
            style={{ color: "var(--brand)" }}
          >
            {eyebrow}
          </div>
          <div
            className="font-display font-extrabold uppercase mt-3"
            style={{
              fontSize: "clamp(40px, 7vw, 96px)",
              lineHeight: 0.9,
              letterSpacing: "var(--ls-hero)",
            }}
          >
            {title}
            {titleSecondLine && (
              <>
                <br />
                {titleSecondLine}
              </>
            )}
          </div>
        </div>
        <div />
        <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-fg-3 text-right max-md:text-left">
          {countLabel}
        </div>
      </div>

      {children}
    </section>
  );
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function shortYear(dateStr: string): string {
  return String(new Date(dateStr).getFullYear()).slice(-2);
}

function minYear(events: { startDate: string }[]): string {
  if (events.length === 0) return "—";
  const years = events.map((e) => new Date(e.startDate).getFullYear());
  return String(Math.min(...years)).slice(-2);
}

function maxYear(events: { startDate: string }[]): string {
  if (events.length === 0) return "—";
  const years = events.map((e) => new Date(e.startDate).getFullYear());
  return String(Math.max(...years)).slice(-2);
}
