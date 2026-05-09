import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_EVENTS, MOCK_SPEAKERS, type MockEvent, type MockSpeaker, type MockEventAgendaItem } from "@/app/lib/mock-data";
import { apiGet, path, ApiError } from "@/app/lib/api";
import { adaptEventDetail, adaptEventSpeakers } from "@/app/lib/api-adapters";
import { RegistrationForm } from "@/app/components/events/registration-form";
import { SpeakerCard } from "@/app/components/events/speaker-card";
import { formatDateRange, FORMAT_LABEL, STATUS_LABEL } from "@/app/components/events/event-card";
import { cn } from "@/app/lib/cn";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loadEvent(
  slug: string,
): Promise<{ event: MockEvent; speakers: MockSpeaker[] } | null> {
  try {
    const dto = await apiGet(path("/api/events/{slug}", { slug }), {
      next: { revalidate: 60, tags: [`event:${slug}`] },
    });
    return { event: adaptEventDetail(dto), speakers: adaptEventSpeakers(dto) };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    console.error(`[event:${slug}] API fetch failed, falling back to mocks:`, err);
    const event = MOCK_EVENTS.find((e) => e.slug === slug);
    if (!event) return null;
    const speakers = event.speakerSlugs
      .map((s) => MOCK_SPEAKERS.find((sp) => sp.slug === s))
      .filter((s): s is NonNullable<typeof s> => Boolean(s));
    return { event, speakers };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await loadEvent(slug);
  if (!loaded) return { title: "Event Not Found — MarketIQ" };
  return {
    title: `${loaded.event.title} — MarketIQ`,
    description: loaded.event.tagline,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const loaded = await loadEvent(slug);
  if (!loaded) notFound();
  const { event, speakers } = loaded;

  const status = STATUS_LABEL[event.status];
  const isPast = event.status === "past";

  return (
    <div className="content-max px-6">
      {/* Breadcrumb */}
      <div className="pt-6 pb-3">
        <Link
          href="/events"
          className="text-sm font-display font-semibold text-fg-3 hover:text-brand no-underline"
        >
          ← All events
        </Link>
      </div>

      {/* Hero */}
      <header className="pb-8 border-b border-border-s">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span
            className={cn(
              "inline-flex items-center font-mono uppercase font-semibold tracking-badge rounded-[var(--btn-r)] text-[10px] px-2 py-0.5",
              status.tone === "signal" && "bg-[var(--signal-m)] text-[color:var(--signal-h)]",
              status.tone === "pos" && "bg-[var(--pos-m)] text-[color:var(--pos-t)]",
              status.tone === "neg" && "bg-[var(--neg-m)] text-[color:var(--neg-t)]",
              status.tone === "fg" && "bg-surface text-fg-2"
            )}
          >
            {status.label}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-badge text-fg-3">
            {FORMAT_LABEL[event.format]}
          </span>
          {event.topics?.map((t) => (
            <span
              key={t}
              className="font-body font-medium text-[11px] py-0.5 px-2 rounded-[var(--btn-r)] bg-surface text-fg-2"
            >
              {t}
            </span>
          ))}
        </div>

        <h1 className="font-display font-extrabold text-3xl tracking-tight leading-[1.05] max-w-[800px] max-md:text-2xl">
          {event.title}
        </h1>
        <p className="mt-3 text-base text-fg-2 max-w-[680px] leading-[1.55]">
          {event.tagline}
        </p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="When" value={formatDateRange(event.startDate, event.endDate)} />
          <Stat label="Where" value={event.location} />
          {event.expectedAttendees && (
            <Stat label="Attendees" value={`${event.expectedAttendees}+`} />
          )}
          {event.presentingCompanies && (
            <Stat label="Presenting" value={`${event.presentingCompanies} companies`} />
          )}
        </div>
      </header>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 py-10">
        <div className="min-w-0 flex flex-col gap-10">
          {/* About */}
          <section>
            <SectionHeading>About this event</SectionHeading>
            <p className="text-base text-fg-2 leading-[1.7] max-w-[680px]">
              {event.description}
            </p>
          </section>

          {/* Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <section>
              <SectionHeading>Agenda</SectionHeading>
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
              <SectionHeading>Speakers</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {speakers.map((s) => (
                  <SpeakerCard key={s.slug} speaker={s} />
                ))}
              </div>
            </section>
          )}

          {/* Sponsors */}
          {event.sponsors && event.sponsors.length > 0 && (
            <section>
              <SectionHeading>Sponsors</SectionHeading>
              {(["platinum", "gold", "silver", "partner"] as const).map((tier) => {
                const tierSponsors = event.sponsors!.filter((s) => s.tier === tier);
                if (tierSponsors.length === 0) return null;
                return (
                  <div key={tier} className="mb-5 last:mb-0">
                    <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3 mb-2">
                      {tier}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tierSponsors.map((s) => (
                        <span
                          key={s.name}
                          className="card !py-2 !px-3 text-sm font-display font-semibold"
                        >
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {/* Past event recap */}
          {isPast && (event.recapUrl || event.replayUrl) && (
            <section className="card !p-6">
              <div className="font-display font-extrabold text-base mb-2">
                Event recap
              </div>
              <p className="text-sm text-fg-2 mb-4 leading-[1.5]">
                This event has concluded. Catch up on the highlights below.
              </p>
              <div className="flex flex-wrap gap-2">
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

        {/* Sidebar */}
        <aside
          className="flex flex-col gap-4 lg:sticky lg:self-start"
          style={{ top: "calc(var(--header-h) + 24px)" }}
        >
          {!isPast && (
            <RegistrationForm
              eventTitle={event.shortName ?? event.title}
              ticketPrice={event.ticketPrice}
              registrationDeadline={event.registrationDeadline}
            />
          )}

          {event.registrationCount && !isPast && (
            <div className="card !p-4 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-pos animate-pulse" />
              <div className="text-xs text-fg-2">
                <span className="font-display font-bold text-fg">
                  {event.registrationCount}
                </span>{" "}
                registered so far
              </div>
            </div>
          )}

          {event.venue && (
            <div className="card !p-4">
              <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3 mb-2">
                Venue
              </div>
              <div className="font-display font-bold text-sm mb-1">
                {event.venue}
              </div>
              <div className="text-xs text-fg-2 leading-[1.5]">
                {event.location}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="sticky z-20 -mx-2 px-2 py-2 backdrop-blur-md bg-[var(--header-blur)] border-b border-border-s mb-4"
      style={{ top: "var(--header-h)" }}
    >
      <h2 className="font-display font-extrabold text-md tracking-tight">
        {children}
      </h2>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3 mb-1">
        {label}
      </div>
      <div className="font-display font-bold text-sm leading-[1.3]">
        {value}
      </div>
    </div>
  );
}

const AGENDA_TYPE_TONE: Record<NonNullable<MockEventAgendaItem["type"]>, string> = {
  keynote: "border-brand",
  panel: "border-[color:var(--info)]",
  presentation: "border-[color:var(--cat-sectors)]",
  break: "border-border-s",
  networking: "border-[color:var(--signal)]",
};

function AgendaRow({
  item,
  speakerLookup,
}: {
  item: MockEventAgendaItem;
  speakerLookup: typeof MOCK_SPEAKERS;
}) {
  const tone = item.type ? AGENDA_TYPE_TONE[item.type] : "border-border-s";
  const speakers = (item.speakerSlugs ?? [])
    .map((s) => speakerLookup.find((sp) => sp.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <li className={cn("flex gap-4 py-3 pl-4 border-l-2 -ml-px", tone)}>
      <div className="font-mono text-xs font-semibold text-fg-2 w-14 shrink-0 pt-0.5">
        {item.time}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-sm leading-[1.35]">
          {item.title}
        </div>
        {item.description && (
          <div className="text-xs text-fg-2 mt-1 leading-[1.5]">
            {item.description}
          </div>
        )}
        {speakers.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1.5">
            {speakers.map((s) => (
              <Link
                key={s.slug}
                href={`/events/speakers/${s.slug}`}
                className="text-[11px] text-fg-3 hover:text-brand no-underline"
              >
                {s.name} <span className="text-fg-3">· {s.org}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
      {item.type && (
        <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3 shrink-0 pt-0.5">
          {item.type}
        </div>
      )}
    </li>
  );
}
