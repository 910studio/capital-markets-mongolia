import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEvents, getSpeakerBySlug } from "@/app/lib/data/events";
import { Avatar } from "@/app/components/events/speaker-card";
import { EventCard } from "@/app/components/events/event-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const speaker = await getSpeakerBySlug(slug);
  if (!speaker) return { title: "Speaker — MarketIQ" };
  return {
    title: `${speaker.name} — MarketIQ`,
    description: `${speaker.title}, ${speaker.org}`,
  };
}

export default async function SpeakerProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const speaker = await getSpeakerBySlug(slug);
  if (!speaker) notFound();

  const events = await getEvents();
  const eventsBySpeaker = events
    .filter((e) => e.speakerSlugs.includes(speaker.slug))
    .sort((a, b) => +new Date(b.startDate) - +new Date(a.startDate));

  const upcomingEvents = eventsBySpeaker.filter((e) => e.status !== "past");
  const pastEvents = eventsBySpeaker.filter((e) => e.status === "past");

  return (
    <div className="content-max px-6">
      <div className="pt-6 pb-3">
        <Link
          href="/events"
          className="text-sm font-display font-semibold text-fg-3 hover:text-brand no-underline"
        >
          ← Events
        </Link>
      </div>

      {/* Hero */}
      <header className="py-8 border-b border-border-s flex items-start gap-6 max-md:flex-col">
        <Avatar speaker={speaker} size="lg" />
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-extrabold text-2xl tracking-tight leading-heading">
            {speaker.name}
          </h1>
          <div className="text-base text-fg-2 mt-1">
            {speaker.title}
          </div>
          <div className="text-sm text-fg-3 mt-0.5">
            {speaker.orgSlug ? (
              <Link
                href={`/directory/${speaker.orgSlug}`}
                className="text-brand hover:text-brand-h no-underline"
              >
                {speaker.org}
              </Link>
            ) : (
              speaker.org
            )}
          </div>

          {speaker.expertise && speaker.expertise.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {speaker.expertise.map((tag) => (
                <span
                  key={tag}
                  className="font-body font-medium text-[11px] py-0.5 px-2 rounded-[var(--btn-r)] bg-surface text-fg-2"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 py-10">
        <div className="min-w-0 flex flex-col gap-10">
          {/* Bio */}
          <section>
            <h2 className="font-display font-extrabold text-md tracking-tight mb-3">
              About
            </h2>
            <p className="text-base text-fg-2 leading-[1.7] max-w-[680px]">
              {speaker.bio}
            </p>
          </section>

          {/* Upcoming sessions */}
          {upcomingEvents.length > 0 && (
            <section>
              <h2 className="font-display font-extrabold text-md tracking-tight mb-4">
                Upcoming sessions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {upcomingEvents.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            </section>
          )}

          {/* Past appearances */}
          {pastEvents.length > 0 && (
            <section>
              <h2 className="font-display font-extrabold text-md tracking-tight mb-4">
                Past appearances
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pastEvents.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside
          className="flex flex-col gap-4 lg:sticky lg:self-start"
          style={{ top: "calc(var(--header-h) + 24px)" }}
        >
          <div className="card !p-4">
            <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3 mb-3">
              Connect
            </div>
            {(speaker.linkedinUrl || speaker.twitterUrl || speaker.websiteUrl) ? (
              <div className="flex flex-col gap-2">
                {speaker.linkedinUrl && (
                  <Link href={speaker.linkedinUrl} className="text-sm font-medium text-brand hover:text-brand-h no-underline">
                    LinkedIn →
                  </Link>
                )}
                {speaker.twitterUrl && (
                  <Link href={speaker.twitterUrl} className="text-sm font-medium text-brand hover:text-brand-h no-underline">
                    Twitter →
                  </Link>
                )}
                {speaker.websiteUrl && (
                  <Link href={speaker.websiteUrl} className="text-sm font-medium text-brand hover:text-brand-h no-underline">
                    Website →
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-xs text-fg-3 leading-[1.5]">
                Reach out via{" "}
                <Link href="/concierge" className="text-brand hover:text-brand-h no-underline">
                  CMM Concierge
                </Link>{" "}
                to connect with {speaker.name.split(" ")[0]}.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
