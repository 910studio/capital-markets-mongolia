import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MOCK_SPEAKERS, type MockEventAgendaItem, type MockSpeaker } from "@/app/lib/mock-data";
import { getEventBySlug } from "@/app/lib/data/events";
import { RegistrationForm } from "@/app/components/events/registration-form";
import { Avatar } from "@/app/components/events/speaker-card";
import { formatDateRange, FORMAT_LABEL, STATUS_LABEL } from "@/app/components/events/event-card";
import { cn } from "@/app/lib/cn";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await getEventBySlug(slug);
  if (!loaded) return { title: "Event Not Found — MarketIQ" };
  return {
    title: `${loaded.event.title} — MarketIQ`,
    description: loaded.event.tagline,
  };
}

const STATUS_TONE: Record<keyof typeof STATUS_LABEL, string> = {
  upcoming: "text-[color:var(--signal-h)]",
  "registration-open": "text-[color:var(--pos-t)]",
  "sold-out": "text-[color:var(--neg-t)]",
  past: "text-fg-3",
};

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const loaded = await getEventBySlug(slug);
  if (!loaded) notFound();
  const { event, speakers } = loaded;

  const isPast = event.status === "past";

  return (
    <div className="content-max px-6 pb-20">
      {/* Breadcrumb */}
      <div className="pt-6 pb-3">
        <Link
          href="/events"
          className="text-[11px] uppercase tracking-[0.14em] font-display font-bold text-fg-3 hover:text-brand no-underline transition-colors"
        >
          ← All events
        </Link>
      </div>

      {/* Hero */}
      <header className="pb-10 border-b-[2px] border-fg">
        <p
          className={cn(
            "font-display font-extrabold text-[10px] tracking-[0.18em] uppercase mb-4",
            STATUS_TONE[event.status],
          )}
        >
          {STATUS_LABEL[event.status].label}
        </p>

        <h1
          className="font-bold tracking-[-0.02em] leading-[1.02] text-fg max-w-[920px]"
          style={{
            fontFamily: "var(--font-s)",
            fontSize: "clamp(2rem, 5vw, 4rem)",
          }}
        >
          {event.title}
        </h1>

        <p
          className="mt-5 text-fg-2 italic leading-[1.5] max-w-[680px]"
          style={{ fontFamily: "var(--font-s)", fontSize: "1.25rem" }}
        >
          {event.tagline}
        </p>

        {event.coverImage && (
          <div className="relative aspect-[21/9] overflow-hidden bg-surface mt-8">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
              priority
            />
          </div>
        )}

        {/* Meta strip — date · location · format */}
        <div
          className="mt-7 text-[13px] text-fg-3 italic flex items-center gap-2 flex-wrap"
          style={{ fontFamily: "var(--font-s)" }}
        >
          <span className="not-italic font-display font-semibold text-[11px] tracking-[0.1em] uppercase text-fg-2">
            {formatDateRange(event.startDate, event.endDate)}
          </span>
          <span className="meta-dot inline-block w-[3px] h-[3px] rounded-full bg-fg-3" />
          <span>{event.location}</span>
          <span className="meta-dot inline-block w-[3px] h-[3px] rounded-full bg-fg-3" />
          <span className="not-italic font-display font-medium text-[11px] tracking-[0.1em] uppercase text-fg-3">
            {FORMAT_LABEL[event.format]}
          </span>
          {event.topics?.map((t) => (
            <span key={t} className="contents">
              <span className="meta-dot inline-block w-[3px] h-[3px] rounded-full bg-fg-3" />
              <span className="not-italic">{t}</span>
            </span>
          ))}
        </div>

        {/* Stats strip */}
        {(event.expectedAttendees || event.presentingCompanies || event.registrationDeadline) && (
          <div className="mt-7 pt-6 border-t border-border-s grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[720px]">
            {event.expectedAttendees && (
              <Stat label="Attendees" value={`${event.expectedAttendees}+`} />
            )}
            {event.presentingCompanies && (
              <Stat label="Presenting" value={`${event.presentingCompanies}`} sub="companies" />
            )}
            {event.ticketPrice && !isPast && (
              <Stat label="Members" value={event.ticketPrice} />
            )}
            {event.registrationDeadline && !isPast && (
              <Stat
                label="Register by"
                value={new Date(event.registrationDeadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              />
            )}
          </div>
        )}
      </header>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-x-14 gap-y-10 pt-12">
        <div className="min-w-0 flex flex-col gap-14">
          {/* About */}
          <section>
            <SectionHead label="About this event" />
            <p
              className="text-fg-2 leading-[1.7] max-w-[680px]"
              style={{ fontFamily: "var(--font-s)", fontSize: "1.0625rem" }}
            >
              {event.description}
            </p>
          </section>

          {/* Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <section>
              <SectionHead label="Agenda" />
              <ol className="flex flex-col">
                {event.agenda.map((item, i) => (
                  <AgendaRow key={i} item={item} speakerLookup={MOCK_SPEAKERS} />
                ))}
              </ol>
            </section>
          )}

          {/* Speakers */}
          {speakers.length > 0 && (
            <section>
              <SectionHead label="Speakers" count={speakers.length} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {speakers.map((s) => (
                  <SpeakerRow key={s.slug} speaker={s} />
                ))}
              </div>
            </section>
          )}

          {/* Sponsors */}
          {event.sponsors && event.sponsors.length > 0 && (
            <section>
              <SectionHead label="Sponsors" />
              <div className="flex flex-col gap-7">
                {(["platinum", "gold", "silver", "partner"] as const).map((tier) => {
                  const tierSponsors = event.sponsors!.filter((s) => s.tier === tier);
                  if (tierSponsors.length === 0) return null;
                  return (
                    <div key={tier} className="border-t border-border-s pt-4">
                      <div className="font-display font-extrabold text-[10px] tracking-[0.18em] uppercase text-fg-3 mb-3">
                        {tier}
                      </div>
                      <div className="flex flex-wrap gap-x-8 gap-y-2">
                        {tierSponsors.map((s) => (
                          <span
                            key={s.name}
                            className="font-bold text-fg leading-tight"
                            style={{
                              fontFamily: "var(--font-s)",
                              fontSize:
                                tier === "platinum"
                                  ? "1.5rem"
                                  : tier === "gold"
                                    ? "1.25rem"
                                    : tier === "silver"
                                      ? "1.0625rem"
                                      : "0.9375rem",
                              letterSpacing: "-0.01em",
                            }}
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Past event recap */}
          {isPast && (event.recapUrl || event.replayUrl) && (
            <section className="border-t-[2px] border-fg pt-8">
              <p className="font-display font-extrabold text-[10px] tracking-[0.18em] uppercase text-fg-3 mb-3">
                Event recap
              </p>
              <p
                className="text-fg-2 italic leading-[1.55] max-w-[560px] mb-5"
                style={{ fontFamily: "var(--font-s)", fontSize: "1.0625rem" }}
              >
                This event has concluded. Catch up on the highlights below.
              </p>
              <div className="flex flex-wrap gap-3">
                {event.recapUrl && (
                  <Link href={event.recapUrl} className="btn btn-primary text-sm">
                    Read recap
                  </Link>
                )}
                {event.replayUrl && (
                  <Link href={event.replayUrl} className="btn btn-secondary text-sm">
                    Watch replay
                  </Link>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar — functional */}
        <aside
          className="flex flex-col gap-4 lg:sticky lg:self-start lg:max-h-[calc(100vh-var(--header-h)-48px)] lg:overflow-y-auto"
          style={{ top: "calc(var(--header-h) + 24px)" }}
        >
          {!isPast && (
            <RegistrationForm
              slug={event.slug}
              eventTitle={event.shortName ?? event.title}
              ticketPrice={event.ticketPrice}
              registrationDeadline={event.registrationDeadline}
            />
          )}

          {event.registrationCount && !isPast && (
            <div className="border-t border-border-s pt-4 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-pos animate-pulse" />
              <div className="text-[12px] text-fg-2">
                <span
                  className="font-bold text-fg"
                  style={{ fontFamily: "var(--font-s)" }}
                >
                  {event.registrationCount}
                </span>{" "}
                <span className="italic" style={{ fontFamily: "var(--font-s)" }}>
                  registered so far
                </span>
              </div>
            </div>
          )}

          {event.venue && (
            <div className="border-t border-border-s pt-4">
              <p className="font-display font-extrabold text-[10px] tracking-[0.18em] uppercase text-fg-3 mb-2">
                Venue
              </p>
              <div
                className="font-bold text-fg text-[15px] mb-1 leading-tight"
                style={{ fontFamily: "var(--font-s)" }}
              >
                {event.venue}
              </div>
              <div
                className="text-[12px] text-fg-3 italic leading-[1.5]"
                style={{ fontFamily: "var(--font-s)" }}
              >
                {event.location}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ── SectionHead — thick rule + serif title ──────────── */

function SectionHead({ label, count }: { label: string; count?: number }) {
  return (
    <div className="border-t-[2px] border-fg pt-3 mb-6 flex items-end justify-between sticky top-[var(--header-h)] z-10 bg-[var(--bg)]">
      <h2 className="font-display font-extrabold text-[22px] tracking-tight text-fg leading-none">
        {label}
        {count !== undefined && (
          <span className="ml-3 text-[11px] font-mono font-medium text-fg-3 tracking-[0.05em] tabular-nums align-baseline">
            {String(count).padStart(2, "0")}
          </span>
        )}
      </h2>
    </div>
  );
}

/* ── Stat — big serif number, small caps label ──────── */

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-display font-semibold text-[10px] tracking-[0.12em] uppercase text-fg-3 leading-none">
        {label}
      </span>
      <span
        className="font-bold text-fg leading-none tabular-nums"
        style={{ fontFamily: "var(--font-s)", fontSize: "1.5rem", letterSpacing: "-0.01em" }}
      >
        {value}
      </span>
      {sub && (
        <span
          className="text-[11px] text-fg-3 italic leading-none"
          style={{ fontFamily: "var(--font-s)" }}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

/* ── SpeakerRow — bylined portrait, no card chrome ──── */

function SpeakerRow({ speaker }: { speaker: MockSpeaker }) {
  return (
    <Link
      href={`/events/speakers/${speaker.slug}`}
      className={cn(
        "no-underline group flex items-start gap-4 py-4 border-t border-border-s",
        "md:[&:nth-child(even)]:pl-6 md:[&:nth-child(odd)]:pr-6",
        "md:[&:nth-child(even)]:border-l md:[&:nth-child(even)]:border-border-s",
      )}
    >
      <Avatar speaker={speaker} size="md" />
      <div className="min-w-0 flex-1">
        <div
          className="font-bold text-fg text-[17px] leading-[1.25] group-hover:text-brand transition-colors"
          style={{ fontFamily: "var(--font-s)", letterSpacing: "-0.01em" }}
        >
          {speaker.name}
        </div>
        <div
          className="text-[12px] text-fg-2 italic mt-1 leading-[1.4]"
          style={{ fontFamily: "var(--font-s)" }}
        >
          {speaker.title}
        </div>
        <div className="font-display font-semibold text-[10px] tracking-[0.1em] uppercase text-fg-3 mt-1">
          {speaker.org}
        </div>
      </div>
    </Link>
  );
}

/* ── AgendaRow — editorial timeline, time gutter ─────── */

const AGENDA_TYPE_DOT: Record<NonNullable<MockEventAgendaItem["type"]>, string> = {
  keynote: "bg-brand",
  panel: "bg-[color:var(--info)]",
  presentation: "bg-[color:var(--cat-sectors)]",
  break: "bg-border-m",
  networking: "bg-[color:var(--signal)]",
};

function AgendaRow({
  item,
  speakerLookup,
}: {
  item: MockEventAgendaItem;
  speakerLookup: typeof MOCK_SPEAKERS;
}) {
  const speakers = (item.speakerSlugs ?? [])
    .map((s) => speakerLookup.find((sp) => sp.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const dotColor = item.type ? AGENDA_TYPE_DOT[item.type] : "bg-border-m";

  return (
    <li className="grid grid-cols-[72px_1fr] gap-5 py-5 border-t border-border-s last:border-b last:border-border-s">
      <div className="flex flex-col gap-1.5">
        <span
          className="font-mono text-[12px] font-bold text-fg tabular-nums leading-none"
        >
          {item.time}
        </span>
        {item.type && (
          <span className="inline-flex items-center gap-1.5">
            <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
            <span className="font-display font-semibold text-[9px] tracking-[0.12em] uppercase text-fg-3">
              {item.type}
            </span>
          </span>
        )}
      </div>
      <div className="min-w-0">
        <div
          className="font-bold text-fg text-[17px] leading-[1.25]"
          style={{ fontFamily: "var(--font-s)", letterSpacing: "-0.01em" }}
        >
          {item.title}
        </div>
        {item.description && (
          <p
            className="text-[13px] text-fg-2 mt-1.5 leading-[1.55] italic"
            style={{ fontFamily: "var(--font-s)" }}
          >
            {item.description}
          </p>
        )}
        {speakers.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {speakers.map((s) => (
              <Link
                key={s.slug}
                href={`/events/speakers/${s.slug}`}
                className="text-[11px] text-fg-3 hover:text-brand no-underline italic"
                style={{ fontFamily: "var(--font-s)" }}
              >
                {s.name}{" "}
                <span className="not-italic font-display font-medium text-fg-3">
                  · {s.org}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
