import Link from "next/link";
import type { MockEvent } from "@/app/lib/mock-data";
import { cn } from "@/app/lib/cn";

const STATUS_LABEL: Record<MockEvent["status"], { label: string; tone: "signal" | "pos" | "neg" | "fg" }> = {
  upcoming: { label: "Upcoming", tone: "signal" },
  "registration-open": { label: "Registration Open", tone: "pos" },
  "sold-out": { label: "Sold Out", tone: "neg" },
  past: { label: "Past Event", tone: "fg" },
};

const FORMAT_LABEL: Record<MockEvent["format"], string> = {
  "in-person": "In Person",
  virtual: "Virtual",
  hybrid: "Hybrid",
};

function formatDateRange(start: string, end?: string): string {
  const s = new Date(start);
  const monthShort = (d: Date) => d.toLocaleDateString("en-US", { month: "short" });
  const day = (d: Date) => d.getDate();
  const year = (d: Date) => d.getFullYear();

  if (!end) {
    return `${monthShort(s)} ${day(s)}, ${year(s)}`;
  }
  const e = new Date(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${monthShort(s)} ${day(s)}–${day(e)}, ${year(s)}`;
  }
  return `${monthShort(s)} ${day(s)} – ${monthShort(e)} ${day(e)}, ${year(e)}`;
}

interface EventCardProps {
  event: MockEvent;
  variant?: "default" | "featured" | "compact";
}

export function EventCard({ event, variant = "default" }: EventCardProps) {
  const status = STATUS_LABEL[event.status];

  if (variant === "featured") {
    return (
      <Link
        href={`/events/${event.slug}`}
        className="card block no-underline !p-0 overflow-hidden h-full flex flex-col group"
      >
        <div
          className="relative aspect-[16/8] w-full shrink-0 bg-gradient-to-br from-brand to-brand-l"
          style={{ borderBottom: "1px solid var(--border-s)" }}
        >
          <div className="absolute inset-0 flex items-end p-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-badge text-white/80 mb-2">
                {FORMAT_LABEL[event.format]}
              </div>
              <div className="font-display text-3xl font-extrabold text-white leading-[1.1] tracking-tight max-sm:text-2xl">
                {event.shortName ?? event.title}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-7 flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={status} />
            <span className="font-mono text-[11px] text-fg-3">
              {formatDateRange(event.startDate, event.endDate)}
            </span>
          </div>
          <h2 className="font-display text-xl font-extrabold leading-[1.2] tracking-tight">
            {event.title}
          </h2>
          <p className="text-sm text-fg-2 leading-[1.5] line-clamp-3">
            {event.description}
          </p>
          <div className="text-xs text-fg-3 leading-relaxed">
            {event.location}
          </div>
          {(event.expectedAttendees || event.presentingCompanies) && (
            <div className="flex items-center gap-4 text-xs text-fg-2 mt-1">
              {event.expectedAttendees && (
                <span>
                  <span className="font-display font-bold text-fg">{event.expectedAttendees}+</span> attendees
                </span>
              )}
              {event.presentingCompanies && (
                <span>
                  <span className="font-display font-bold text-fg">{event.presentingCompanies}</span> presenting
                </span>
              )}
            </div>
          )}
          <div className="mt-auto pt-3">
            <span className="btn btn-primary text-sm w-full justify-center">
              View Details
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/events/${event.slug}`}
        className="card flex items-start gap-4 no-underline group"
      >
        <DateBlock startDate={event.startDate} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={status} size="xs" />
            <span className="font-mono text-[10px] text-fg-3">
              {FORMAT_LABEL[event.format]}
            </span>
          </div>
          <h3 className="font-display font-bold text-sm leading-[1.3] mb-1 group-hover:text-brand transition-colors">
            {event.title}
          </h3>
          <div className="text-[11px] text-fg-3">
            {event.location}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/events/${event.slug}`}
      className="card flex flex-col no-underline overflow-hidden min-w-0 group"
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <StatusBadge status={status} />
        <span className="font-mono text-[10px] uppercase tracking-badge text-fg-3">
          {FORMAT_LABEL[event.format]}
        </span>
      </div>
      <h3 className="font-display text-base font-bold leading-[1.3] tracking-tight mb-2 group-hover:text-brand transition-colors">
        {event.title}
      </h3>
      <p className="text-sm text-fg-2 leading-[1.55] line-clamp-2 mb-4">
        {event.tagline}
      </p>
      <div className="mt-auto pt-3 border-t border-border-s flex flex-col gap-1">
        <div className="font-mono text-[11px] text-fg font-medium">
          {formatDateRange(event.startDate, event.endDate)}
        </div>
        <div className="text-[11px] text-fg-3 truncate">
          {event.location}
        </div>
      </div>
    </Link>
  );
}

function StatusBadge({
  status,
  size = "sm",
}: {
  status: { label: string; tone: "signal" | "pos" | "neg" | "fg" };
  size?: "xs" | "sm";
}) {
  const toneClass =
    status.tone === "signal"
      ? "bg-[var(--signal-m)] text-[color:var(--signal-h)]"
      : status.tone === "pos"
      ? "bg-[var(--pos-m)] text-[color:var(--pos-t)]"
      : status.tone === "neg"
      ? "bg-[var(--neg-m)] text-[color:var(--neg-t)]"
      : "bg-surface text-fg-2";
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono uppercase font-semibold tracking-badge rounded-[var(--btn-r)]",
        toneClass,
        size === "xs" ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-0.5"
      )}
    >
      {status.label}
    </span>
  );
}

function DateBlock({ startDate }: { startDate: string }) {
  const d = new Date(startDate);
  const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  return (
    <div
      className="shrink-0 w-[52px] text-center rounded-[var(--card-r)] border border-border-s bg-surface-down py-1.5"
      aria-hidden
    >
      <div className="font-mono text-[10px] font-semibold tracking-badge text-brand">
        {month}
      </div>
      <div className="font-display text-lg font-extrabold leading-none mt-0.5">
        {day}
      </div>
    </div>
  );
}

export { formatDateRange, FORMAT_LABEL, STATUS_LABEL };
