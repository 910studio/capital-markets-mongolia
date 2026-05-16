import Link from "next/link";
import Image from "next/image";
import type { MockEvent } from "@/app/lib/mock-data";
import { formatDateRange } from "./event-card";
import { StrokeWriteText } from "./stroke-write-text";
import { textToPath } from "@/app/lib/text-to-path";

interface EventHeroProps {
  event: MockEvent;
  /** Index within the upcoming list, 1-based. */
  index?: number;
  total?: number;
  /** "CMM / EVENTS" line above the LIVE indicator on TL corner. */
  topLeftKicker?: string;
  /** "SEASON II — 2026" sub-line below the kicker. */
  topLeftSub?: string;
  /** TR corner status label. Default: "FEATURED". */
  topRightLabel?: string;
  /** BR corner second line — points to the next section. Default: "UPCOMING EVENTS". */
  bottomRightSubLabel?: string;
  /** Override the CTA label. Default: "Reserve a Seat". */
  ctaLabel?: string;
  /** Section id (for tab navigation / anchors). Default: "featured". */
  sectionId?: string;
}

/**
 * Full-viewport brutalist hero. Mirrors public/demos/events.html structure:
 * media bg + grain + 12-col grid overlay, mix-blend-difference text in corners,
 * huge stacked uppercase title at bottom, signal-orange CTA on right.
 */
export async function EventHero({
  event,
  index = 1,
  total,
  topLeftKicker = "CMM / EVENTS",
  topLeftSub = "SEASON II — 2026",
  topRightLabel = "FEATURED",
  bottomRightSubLabel = "UPCOMING EVENTS",
  ctaLabel = "Reserve a Seat",
  sectionId = "featured",
}: EventHeroProps) {
  const stack = splitTitleForStack(event.shortName ?? event.title);
  const dateStr = formatDateRange(event.startDate, event.endDate).toUpperCase();
  const timeStr = formatTimeRange(event.startDate, event.endDate);
  const venue = event.venue ?? event.location;

  // Pre-compute SVG path data for every stroke-outline line so the client
  // gets ready-to-render <path> markup. Path lookup is parallel + cached.
  const strokePaths = await Promise.all(
    stack.map((line) => (line.stroke ? textToPath(line.text) : Promise.resolve(null))),
  );

  return (
    <section
      id={sectionId}
      data-snap
      aria-label={`Featured event: ${event.title}`}
      className="relative w-full overflow-hidden bg-[var(--bg)]"
      style={{ height: "100vh", minHeight: 600 }}
    >
      {/* Media bg — image if present, else brand-tinted conic gradient */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          background: event.coverImage
            ? undefined
            : "conic-gradient(from 210deg at 30% 60%, #2a1860, #6b4cc0, #fca311, #2a1860), var(--bg)",
          backgroundBlendMode: event.coverImage ? undefined : "screen",
          filter: "saturate(1.05)",
        }}
      >
        {event.coverImage && (
          <Image
            src={event.coverImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        {/* brand purple tint — vignette gradient using hardcoded dark-theme
            CMM colors (bg-void #0A0720 at edges, brand #3E149C in the middle).
            Hardcoded so it doesn't flip with data-mode=dark theme overrides. */}
        {event.coverImage && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,7,32,0.82) 0%, rgba(46,15,117,0.55) 35%, rgba(46,15,117,0.55) 65%, rgba(10,7,32,0.9) 100%)",
            }}
          />
        )}
        {/* film grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
            mixBlendMode: "overlay",
            opacity: 0.5,
          }}
        />
      </div>

      {/* 12-col hairline grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "calc(100% / 12) 100%",
        }}
      />

      {/* Corner: TL */}
      <div
        className="hero-fade-in absolute font-mono text-[11px] uppercase tracking-[0.1em] leading-[1.4]"
        style={{
          top: "calc(var(--header-h) + 24px)",
          left: 24,
          color: "#fff",
          animationDelay: "100ms",
        }}
      >
        <div>{topLeftKicker}</div>
        <div>{topLeftSub}</div>
      </div>

      {/* Corner: TR */}
      <div
        className="hero-fade-in absolute text-right font-mono text-[11px] uppercase tracking-[0.1em] leading-[1.4]"
        style={{
          top: "calc(var(--header-h) + 24px)",
          right: 24,
          color: "#fff",
          animationDelay: "180ms",
        }}
      >
        <div
          className="inline-flex items-center gap-2 font-bold"
          style={{ color: "var(--signal)" }}
        >
          <span
            className="w-1.5 h-1.5"
            style={{
              background: "var(--signal)",
              animation: "event-hero-pulse 1.6s infinite",
            }}
          />
          {topRightLabel}
        </div>
        {total && (
          <div className="mt-1.5">
            {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
        )}
      </div>

      {/* Scroll hint — centered at the bottom of the hero. Wrapper handles
          horizontal centering via translateX(-50%); inner div runs the
          fade-in animation (translateY only) so the two transforms don't
          collide. Hidden on small screens where the title-block fills the
          viewport bottom. */}
      <div
        className="hidden md:block absolute"
        style={{
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <div
          className="hero-fade-in font-mono text-[11px] uppercase tracking-[0.1em] leading-[1.4] text-center"
          style={{ color: "#fff", animationDelay: "1100ms" }}
        >
          <div>SCROLL ↓</div>
          <div>{bottomRightSubLabel}</div>
        </div>
      </div>

      {/* Title block */}
      <div
        className="absolute left-0 right-0 bottom-0 grid items-end gap-8 max-md:grid-cols-1 max-md:gap-6"
        style={{
          padding: "0 24px 32px",
          gridTemplateColumns: "1fr auto",
        }}
      >
        <div className="min-w-0">
          <div
            className="hero-fade-in flex items-center gap-4 flex-wrap mb-5 font-mono text-[12px] uppercase tracking-[0.1em]"
            style={{ color: "#fff", animationDelay: "300ms" }}
          >
            <span>{dateStr}</span>
            <span className="inline-block w-7 h-px" style={{ background: "currentColor" }} />
            <span>{venue}</span>
            {timeStr && (
              <>
                <span className="inline-block w-7 h-px" style={{ background: "currentColor" }} />
                <span>{timeStr}</span>
              </>
            )}
          </div>

          <h1
            className="font-display font-black uppercase"
            style={{
              fontSize: "clamp(56px, 14vw, 220px)",
              lineHeight: 0.82,
              letterSpacing: "-0.05em",
              color: "#fff",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {stack.map((line, i) => {
              const delay = 420 + i * 160;
              const pathData = strokePaths[i];
              if (line.stroke && pathData) {
                // Stroke-outline line gets path-traced write-on (real bezier
                // tracing via server-computed SVG path data).
                return <StrokeWriteText key={i} pathData={pathData} delay={delay} />;
              }
              return (
                <span
                  key={i}
                  className="hero-mask-reveal block"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {line.text}
                </span>
              );
            })}
          </h1>
        </div>

        <div className="flex flex-col gap-4 items-end max-md:items-start" style={{ minWidth: 280 }}>
          <p
            className="hero-fade-in font-body text-[14px] leading-[1.5] max-w-[280px] text-right max-md:text-left"
            style={{ color: "#fff", animationDelay: "850ms" }}
          >
            {event.tagline}
          </p>
          <Link
            href={`/events/${event.slug}`}
            className="hero-cta hero-fade-in group inline-flex items-center gap-3 font-display font-bold uppercase no-underline"
            style={{
              background: "var(--signal)",
              color: "var(--fg)",
              padding: "18px 24px",
              fontSize: 14,
              letterSpacing: "0.08em",
              borderRadius: 2,
              animationDelay: "1000ms",
              transition:
                "background-color .15s ease, transform .25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {ctaLabel}
            <span
              className="hero-cta-arrow font-mono text-[18px]"
              style={{
                transition: "transform .25s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "inline-block",
              }}
            >
              →
            </span>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes event-hero-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* Entrance — soft fade + small Y travel (for corners, eyebrow, tagline, CTA) */
        @keyframes hero-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-in {
          opacity: 0;
          animation: hero-fade-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* Entrance — curtain reveal for the huge stacked title.
           clip-path rises from below + Y travel for a brutalist drop-in. */
        @keyframes hero-mask-reveal {
          from {
            opacity: 0;
            transform: translateY(60px);
            clip-path: inset(0 0 110% 0);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            clip-path: inset(0 0 -2% 0);
          }
        }
        .hero-mask-reveal {
          opacity: 0;
          animation: hero-mask-reveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* Write-on reveal — clip-path slides left-to-right, like the line
           is being drawn. Used on stroke-outline title lines so the outline
           appears to be hand-traced across the screen. */
        @keyframes hero-write {
          0%   { opacity: 0; clip-path: inset(0 100% -10% 0); }
          12%  { opacity: 1; }
          100% { opacity: 1; clip-path: inset(0 -2% -10% 0); }
        }
        .hero-write {
          opacity: 0;
          animation: hero-write 1.4s cubic-bezier(0.55, 0.085, 0.245, 1) both;
        }

        /* CTA hover */
        .hero-cta:hover {
          background-color: var(--signal-h) !important;
          transform: translateY(-2px);
        }
        .hero-cta:active {
          transform: translateY(0) scale(0.97);
        }
        .hero-cta:hover .hero-cta-arrow {
          transform: translateX(6px);
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-fade-in, .hero-mask-reveal {
            animation: none;
            opacity: 1;
            transform: none;
            clip-path: none;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * Split an event title into stacked lines for the brutalist display treatment.
 * Roughly even-word splits with the middle chunk getting the stroke-outline.
 * Long titles get up to 3 lines; short ones get 1-2.
 */
function splitTitleForStack(title: string): Array<{ text: string; stroke?: boolean }> {
  const words = title.trim().split(/\s+/);
  if (words.length === 1) {
    return [{ text: words[0].toUpperCase() }];
  }
  if (words.length === 2) {
    return [{ text: words[0].toUpperCase() }, { text: words[1].toUpperCase(), stroke: true }];
  }
  // 3+ words: front | middle (stroke) | back
  const third = Math.ceil(words.length / 3);
  const front = words.slice(0, third).join(" ").toUpperCase();
  const mid = words.slice(third, third * 2).join(" ").toUpperCase();
  const back = words.slice(third * 2).join(" ").toUpperCase();
  return [
    { text: front },
    { text: mid, stroke: true },
    ...(back ? [{ text: back }] : []),
  ];
}

function formatTimeRange(start: string, end?: string): string | null {
  const s = new Date(start);
  // skip if all-day / no time info
  if (s.getHours() === 0 && s.getMinutes() === 0) return null;
  const t = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  if (!end) return t(s);
  const e = new Date(end);
  // same-day range
  if (s.toDateString() === e.toDateString()) {
    return `${t(s)} — ${t(e)}`;
  }
  return t(s);
}
