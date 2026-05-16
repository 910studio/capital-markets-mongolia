"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { MockEvent } from "@/app/lib/mock-data";

interface EventsRailProps {
  events: MockEvent[];
  /** Card link CTA label. Default: "Recap →". Use "RSVP →" for upcoming. */
  cardCtaLabel?: string;
  /** Slug of the featured event — its card gets " · Featured" appended to the kicker. */
  featuredSlug?: string;
}

/**
 * Brutalist horizontal-scroll rail of events (past OR upcoming).
 * Mirrors public/demos/events.html v2 — prev/next arrow buttons, progress bar
 * with tick marks, "01 / 06" counter, and wheel-to-horizontal hijack.
 */
export function EventsRail({
  events,
  cardCtaLabel = "Recap →",
  featuredSlug,
}: EventsRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [curIdx, setCurIdx] = useState(1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const pct = max > 0 ? (rail.scrollLeft / max) * 100 : 0;
      setProgress(pct);

      const firstCard = rail.querySelector<HTMLElement>("[data-rail-card]");
      const cardW = (firstCard?.offsetWidth ?? 340) + 24;
      const idx = Math.min(events.length - 1, Math.round(rail.scrollLeft / cardW));
      setCurIdx(idx + 1);

      setAtStart(rail.scrollLeft <= 4);
      setAtEnd(rail.scrollLeft >= max - 4);
    };

    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // wheel hijack — vertical wheel becomes horizontal scroll, only when the
    // rail still has room to scroll in that direction. Otherwise let the page
    // scroll normally so the user can leave the section.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = rail.scrollWidth - rail.clientWidth;
      const atRailStart = rail.scrollLeft <= 0;
      const atRailEnd = rail.scrollLeft >= max - 1;
      if ((e.deltaY < 0 && atRailStart) || (e.deltaY > 0 && atRailEnd)) return;
      e.preventDefault();
      rail.scrollLeft += e.deltaY;
    };
    rail.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      rail.removeEventListener("wheel", onWheel);
    };
  }, [events.length]);

  function scrollBy(dir: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const firstCard = rail.querySelector<HTMLElement>("[data-rail-card]");
    const cardW = (firstCard?.offsetWidth ?? 340) + 24;
    rail.scrollBy({ left: dir * cardW, behavior: "smooth" });
  }

  const tickCount = events.length;

  return (
    <div className="relative">
      {/* Indicators row */}
      <div
        className="grid items-center gap-6 mb-5 px-6"
        style={{ gridTemplateColumns: "auto 1fr auto auto" }}
      >
        <div className="flex gap-2">
          <RailBtn
            label="Previous"
            disabled={atStart}
            onClick={() => scrollBy(-1)}
            char="←"
          />
          <RailBtn
            label="Next"
            disabled={atEnd}
            onClick={() => scrollBy(1)}
            char="→"
          />
        </div>

        {/* Progress bar with tick marks */}
        <div className="relative h-px bg-border">
          <div
            className="absolute -top-px left-0 h-1"
            style={{
              background: "var(--brand)",
              width: `${progress}%`,
              transition: "width .12s linear",
            }}
          />
          <div
            className="absolute inset-0 grid"
            style={{ gridTemplateColumns: `repeat(${tickCount}, 1fr)` }}
          >
            {Array.from({ length: tickCount }).map((_, i) => (
              <span
                key={i}
                className="border-l border-border"
                style={{
                  height: 6,
                  transform: "translateY(-2px)",
                  borderLeftWidth: i === 0 ? 0 : 1,
                }}
              />
            ))}
          </div>
        </div>

        <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-fg-3 flex items-baseline gap-1.5">
          <b className="font-bold text-[22px] text-fg">{String(curIdx).padStart(2, "0")}</b>
          <span>/</span>
          <span>{String(events.length).padStart(2, "0")}</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-3">
          <span style={{ color: "var(--brand)" }} className="font-bold">
            ↔
          </span>
          Drag · Wheel · Swipe
        </div>
      </div>

      {/* Rail */}
      <div
        ref={railRef}
        data-rail-skip-lenis
        className="flex gap-6 px-6 pb-4 overflow-x-auto overflow-y-hidden scrollbar-none"
        style={{
          // proximity (vs mandatory) doesn't force a snap mid-flick — less
          // browser layout work per scroll event.
          scrollSnapType: "x proximity",
          WebkitOverflowScrolling: "touch",
          // promote rail to its own compositor layer so card transforms
          // don't trigger layout work in surrounding sections.
          contain: "layout paint",
        }}
      >
        {events.map((event, i) => (
          <RailCard
            key={event.slug}
            event={event}
            index={i + 1}
            ctaLabel={cardCtaLabel}
            isFeatured={event.slug === featuredSlug}
          />
        ))}
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { scrollbar-width: none; }

        /* Card hover — subtle lift + image zoom + CTA brand-shift */
        .rail-card:hover {
          transform: translateY(-6px);
        }
        .rail-card:hover .rail-card-img {
          transform: scale(1.04);
        }
        .rail-card:hover .rail-card-cta {
          color: var(--brand);
          border-color: var(--brand);
        }

        @media (prefers-reduced-motion: reduce) {
          .rail-card,
          .rail-card-img,
          .rail-card-cta {
            transition: none !important;
          }
          .rail-card:hover,
          .rail-card:hover .rail-card-img {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

function RailBtn({
  label,
  disabled,
  onClick,
  char,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  char: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="font-mono font-bold text-[16px] cursor-pointer transition-colors disabled:cursor-not-allowed"
      style={{
        background: "var(--bg)",
        border: "1px solid var(--fg)",
        width: 44,
        height: 44,
        color: "var(--fg)",
        borderRadius: 2,
        opacity: disabled ? 0.25 : 1,
      }}
      onMouseEnter={(e) => {
        if (disabled) return;
        e.currentTarget.style.background = "var(--fg)";
        e.currentTarget.style.color = "var(--bg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg)";
        e.currentTarget.style.color = "var(--fg)";
      }}
    >
      {char}
    </button>
  );
}

function RailCard({
  event,
  index,
  ctaLabel,
  isFeatured,
}: {
  event: MockEvent;
  index: number;
  ctaLabel: string;
  isFeatured: boolean;
}) {
  const date = new Date(event.startDate);
  const yearShort = String(date.getFullYear()).slice(-2);
  const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  // pick a kicker — first topic, falls back to "Event"; featured card adds suffix
  const baseKicker = event.topics?.[0] ?? "Event";
  const kicker = isFeatured ? `${baseKicker} · Featured` : baseKicker;
  const stackedTitle = stackTitle(event.shortName ?? event.title);

  return (
    <article
      data-rail-card
      className="rail-card shrink-0 flex flex-col"
      style={{
        flex: "0 0 min(72vw, 340px)",
        scrollSnapAlign: "start",
        borderRadius: 2,
        transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        // GPU layer promotion — keeps card painted on its own composited
        // layer so horizontal scroll doesn't re-paint the surrounding section.
        transform: "translateZ(0)",
        contain: "layout paint",
      }}
    >
      <Link
        href={`/events/${event.slug}`}
        className="group no-underline flex flex-col"
      >
        {/* Image frame */}
        <div
          className="rail-card-frame relative w-full overflow-hidden bg-surface"
          style={{ aspectRatio: "4/3", borderRadius: 2 }}
        >
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="rail-card-img object-cover"
              sizes="(max-width: 768px) 86vw, 340px"
              style={{
                transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
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

          {/* top ticker overlay — solid white text + subtle text-shadow
              for legibility. mix-blend-mode would force a composite layer
              per ticker × per card on scroll, which tanks framerate. */}
          <div
            className="absolute top-0 left-0 right-0 flex justify-between items-center font-mono text-[10px] uppercase tracking-[0.1em]"
            style={{
              padding: "10px 12px",
              color: "#fff",
              textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            <span>
              EVT/ <b className="font-bold">{String(index).padStart(2, "0")}</b>
            </span>
            <span>
              {yearShort} · {month}
            </span>
          </div>

          {/* bottom ticker overlay */}
          <div
            className="absolute left-0 right-0 bottom-0 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em]"
            style={{
              padding: "10px 12px",
              color: "#fff",
              textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            <span>{kicker}</span>
            <span>{event.location.split(",")[0]}</span>
          </div>
        </div>

        {/* Title below image */}
        <div
          className="grid items-end gap-3"
          style={{ paddingTop: 14, gridTemplateColumns: "1fr auto" }}
        >
          <div>
            <div
              className="font-mono font-bold text-[10px] uppercase tracking-[0.1em] mb-1.5"
              style={{ color: "var(--brand)" }}
            >
              {kicker}
            </div>
            <h3
              className="font-display font-extrabold uppercase"
              style={{
                fontSize: "clamp(20px, 2vw, 24px)",
                lineHeight: 0.95,
                letterSpacing: "var(--ls-tight)",
                color: "var(--fg)",
              }}
            >
              {stackedTitle.map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h3>
          </div>
          <span
            className="rail-card-cta self-end font-mono text-[11px] uppercase tracking-[0.08em] pb-1 whitespace-nowrap"
            style={{
              color: "var(--fg-2)",
              borderBottom: "1px solid var(--fg)",
              transition: "color .2s ease, border-color .2s ease",
            }}
          >
            {ctaLabel}
          </span>
        </div>
      </Link>
    </article>
  );
}

/** Stack the title onto 2 lines if it's 3+ words long; otherwise one line. */
function stackTitle(title: string): string[] {
  const words = title.trim().split(/\s+/);
  if (words.length <= 2) return [title];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}
