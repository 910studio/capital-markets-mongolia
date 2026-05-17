import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getInsights } from "@/app/lib/data/insights";
import { getEvents } from "@/app/lib/data/events";
import { MOCK_ARTICLES, type MockEvent } from "@/app/lib/mock-data";

export const metadata: Metadata = {
  title: "Capital Markets Mongolia",
  description:
    "Mongolia's capital markets research, advisory, and intelligence platform. Insights, events, and a directory of issuers and intermediaries.",
};

export const dynamic = "force-dynamic";

const PARTNERS = [
  "Khan Bank",
  "Golomt Bank",
  "TDB",
  "Erdenes Mongol",
  "Rio Tinto",
  "Ard Financial Group",
  "Bogd Bank",
  "MSE",
  "FRC Mongolia",
  "Oyu Tolgoi",
];

export default async function Home() {
  const [articles, events] = await Promise.all([getInsights(), getEvents()]);
  const mockArticleBySlug = new Map(MOCK_ARTICLES.map((a) => [a.slug, a]));
  const latestInsights = articles.slice(0, 4);
  const upcomingEvents = events
    .filter((e) => e.status !== "past")
    .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate))
    .slice(0, 3);

  return (
    <>
      {/* ═════════════════ HERO ═════════════════ */}
      <section className="content-max px-6 pt-20 pb-24 max-md:pt-12 max-md:pb-16">
        <p className="font-display font-extrabold text-[11px] tracking-[0.18em] uppercase text-brand mb-4">
          / Capital Markets Mongolia
        </p>
        <h1
          className="font-display font-extrabold uppercase tracking-tight leading-[0.95] max-w-[1100px]"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 7rem)",
            letterSpacing: "-0.035em",
          }}
        >
          Shaping
          <br />
          Mongolia&apos;s
          <br />
          <span
            style={{
              color: "transparent",
              WebkitTextStroke: "2px var(--fg)",
            }}
          >
            capital market
          </span>
          <br />
          future.
        </h1>
        <p className="mt-8 text-lg text-fg-2 leading-[1.55] max-w-[640px]">
          CMM is a research and advisory firm connecting Mongolian issuers,
          intermediaries, and global investors. Insights, events, and the
          directory backbone for institutional capital in Mongolia.
        </p>
        <div className="mt-8 flex items-center gap-3 flex-wrap">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-display font-bold uppercase tracking-[0.08em] text-sm no-underline transition-colors"
            style={{
              background: "var(--signal)",
              color: "var(--fg)",
              padding: "16px 22px",
              borderRadius: 2,
            }}
          >
            Upcoming events
            <span className="font-mono">→</span>
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 font-display font-bold uppercase tracking-[0.08em] text-sm no-underline transition-colors"
            style={{
              background: "var(--fg)",
              color: "var(--bg)",
              padding: "16px 22px",
              borderRadius: 2,
            }}
          >
            About CMM
            <span className="font-mono">→</span>
          </Link>
        </div>
      </section>

      {/* ═════════════════ LATEST INSIGHTS ═════════════════ */}
      <section
        id="insights"
        className="border-t-[2px] border-fg"
        style={{ background: "var(--bg-alt)" }}
      >
        <div className="content-max px-6 py-16">
          <SectionHead label="Latest Insights" moreHref="/insights" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-border-s">
            {latestInsights.map((a, i) => {
              const cover = mockArticleBySlug.get(a.slug)?.coverImage;
              return (
                <Link
                  key={a.slug}
                  href={`/insights/${a.slug}`}
                  className={`group block no-underline border-b border-border-s ${
                    i < 3 ? "lg:border-r" : ""
                  } ${i < 2 ? "md:max-lg:border-r md:max-lg:border-b-0" : ""} p-6`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface mb-4">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={a.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--brand), var(--brand-l) 60%, var(--signal))",
                        }}
                      />
                    )}
                  </div>
                  <p
                    className="font-mono font-bold text-[10px] uppercase tracking-[0.1em] mb-2"
                    style={{ color: "var(--brand)" }}
                  >
                    {a.badge.label}
                  </p>
                  <h3 className="font-display font-extrabold uppercase text-lg leading-[1.1] tracking-tight group-hover:text-brand transition-colors line-clamp-3">
                    {a.title}
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-3 mt-3">
                    {a.date}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═════════════════ UPCOMING EVENTS ═════════════════ */}
      <section
        id="events"
        className="border-t-[2px] border-fg"
      >
        <div className="content-max px-6 py-16">
          <SectionHead label="Upcoming Events" moreHref="/events" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((e) => (
              <LandingEventCard key={e.slug} event={e} />
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════ PARTNERS ═════════════════ */}
      <section
        className="border-t-[2px] border-fg"
        style={{ background: "var(--bg-alt)" }}
      >
        <div className="content-max px-6 py-16">
          <SectionHead label="Partners & Coverage" />
          <p className="text-base text-fg-2 leading-[1.6] max-w-[640px] mb-10">
            Trusted by Mongolia&apos;s leading banks, miners, and capital markets institutions.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 border border-border-s">
            {PARTNERS.map((p) => (
              <div
                key={p}
                className="aspect-[3/2] flex items-center justify-center border-r border-b border-border-s last:border-r-0 px-4 transition-colors hover:bg-[var(--bg)]"
              >
                <span className="font-display font-extrabold uppercase text-sm tracking-tight text-fg-2 text-center leading-tight">
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ── SectionHead — thick rule + label + optional View all ────────── */
function SectionHead({
  label,
  moreHref,
  moreLabel = "View all",
}: {
  label: string;
  moreHref?: string;
  moreLabel?: string;
}) {
  return (
    <div className="border-t-[2px] border-fg pt-3 mb-8 flex items-end justify-between">
      <h2 className="font-display font-extrabold uppercase tracking-tight leading-none text-2xl md:text-3xl">
        {label}
      </h2>
      {moreHref && (
        <Link
          href={moreHref}
          className="text-[11px] uppercase tracking-[0.14em] font-display font-bold text-fg-3 hover:text-brand no-underline transition-colors"
        >
          {moreLabel} →
        </Link>
      )}
    </div>
  );
}

/* ── LandingEventCard — magazine-cover-ish editorial ───────────── */
function LandingEventCard({ event }: { event: MockEvent }) {
  const date = new Date(event.startDate);
  const monthShort = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = date.getDate();
  const year = date.getFullYear();

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block no-underline border border-border-s overflow-hidden transition-all hover:border-fg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, var(--brand), var(--brand-l) 60%, var(--signal))",
            }}
          />
        )}
        {/* Date plate */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em]"
          style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}
        >
          {monthShort} {day} · {year}
        </div>
      </div>
      <div className="p-5">
        <p
          className="font-mono font-bold text-[10px] uppercase tracking-[0.1em] mb-2"
          style={{ color: "var(--brand)" }}
        >
          {event.topics?.[0] ?? "Event"}
        </p>
        <h3 className="font-display font-extrabold uppercase tracking-tight leading-[1.1] text-lg group-hover:text-brand transition-colors line-clamp-2 mb-3">
          {event.shortName ?? event.title}
        </h3>
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-fg-3">
          {event.location}
        </p>
      </div>
    </Link>
  );
}
