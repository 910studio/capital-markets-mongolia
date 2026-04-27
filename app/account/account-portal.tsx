"use client";

import { useState } from "react";
import Link from "next/link";
import { ProfileForm } from "./profile-form";
import {
  MOCK_ARTICLES,
  MOCK_EVENTS,
  type MockArticle,
  type MockEvent,
} from "@/app/lib/mock-data";
import { EventCard } from "@/app/components/events/event-card";
import { cn } from "@/app/lib/cn";

const TABS = [
  { id: "saved", label: "Saved Insights" },
  { id: "events", label: "My Events" },
  { id: "requests", label: "Concierge Requests" },
  { id: "alerts", label: "Alerts" },
  { id: "profile", label: "Profile" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* Mocked user state — wire to real backend later */
const SAVED_ARTICLE_SLUGS = [
  "mongolia-banking-sector-q1-2026-earnings-review",
  "mongolia-dealbook-2025",
  "tsetsens-mining-300m-bond",
];

const REGISTERED_EVENT_SLUGS = ["mif-2026", "cmm-investor-day-spring-2026"];

const MOCK_REQUESTS = [
  {
    id: "r-001",
    summary: "Investor introduction — Singapore credit funds active in Mongolian banks",
    type: "investor-intro",
    submittedAt: "2026-04-22",
    status: "in-progress",
    assignee: "Namkhaidorj B.",
  },
  {
    id: "r-002",
    summary: "Custom research — Mongolian renewable energy IPP pipeline",
    type: "research-request",
    submittedAt: "2026-04-09",
    status: "delivered",
    assignee: "Enkhjin A.",
  },
];

const MOCK_ALERTS_STATUS = {
  enabled: false,
};

export function AccountPortal() {
  const [tab, setTab] = useState<TabId>("saved");

  const savedArticles = MOCK_ARTICLES.filter((a) =>
    SAVED_ARTICLE_SLUGS.includes(a.slug)
  );
  const registeredEvents = MOCK_EVENTS.filter((e) =>
    REGISTERED_EVENT_SLUGS.includes(e.slug)
  ).sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
      {/* Sidebar nav */}
      <aside className="flex flex-col gap-1 lg:sticky lg:top-[calc(var(--header-h)+24px)] self-start">
        <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3 mb-2 px-2">
          Account
        </div>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "text-left px-3 py-2 rounded-[var(--btn-r)] text-sm font-medium cursor-pointer transition-colors border-none",
              tab === t.id
                ? "bg-brand-m text-brand font-semibold"
                : "bg-transparent text-fg-2 hover:bg-surface hover:text-fg"
            )}
          >
            {t.label}
          </button>
        ))}
      </aside>

      {/* Tab content */}
      <div className="min-w-0">
        {tab === "saved" && <SavedTab articles={savedArticles} />}
        {tab === "events" && <EventsTab events={registeredEvents} />}
        {tab === "requests" && <RequestsTab />}
        {tab === "alerts" && <AlertsTab />}
        {tab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
}

/* ── Saved Insights ─────────────────────────────────── */

function SavedTab({ articles }: { articles: MockArticle[] }) {
  if (articles.length === 0) {
    return (
      <Empty
        title="No saved insights yet"
        body="Hit the bookmark icon on any article to save it for later."
        cta={{ label: "Browse Insights", href: "/insights" }}
      />
    );
  }
  return (
    <div>
      <SectionHeader
        title="Saved Insights"
        subtitle={`${articles.length} saved`}
      />
      <div className="flex flex-col gap-3">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/insights/${a.slug}`}
            className="card flex items-start gap-4 no-underline group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[10px] uppercase tracking-badge text-brand">
                  {a.contentType.replace("-", " ")}
                </span>
                <span className="font-mono text-[10px] text-fg-3">
                  {new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <h3 className="font-display font-bold text-sm leading-[1.3] mb-1 group-hover:text-brand transition-colors">
                {a.title}
              </h3>
              <p className="text-xs text-fg-2 leading-[1.5] line-clamp-2">
                {a.excerpt}
              </p>
              <div className="text-[11px] text-fg-3 mt-2">
                {a.author} · {a.readTime} min read
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ── Registered Events ──────────────────────────────── */

function EventsTab({ events }: { events: MockEvent[] }) {
  const upcoming = events.filter((e) => e.status !== "past");
  const past = events.filter((e) => e.status === "past");

  if (events.length === 0) {
    return (
      <Empty
        title="No registered events"
        body="Register for upcoming forums and briefings to track them here."
        cta={{ label: "See upcoming events", href: "/events" }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <SectionHeader
          title="My Events"
          subtitle={`${events.length} registered`}
        />
        {upcoming.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcoming.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div>
          <SectionHeader title="Past attended" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {past.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Concierge Requests ─────────────────────────────── */

const REQUEST_STATUS_LABEL: Record<string, { label: string; tone: "signal" | "pos" | "fg" }> = {
  "in-progress": { label: "In Progress", tone: "signal" },
  delivered: { label: "Delivered", tone: "pos" },
  closed: { label: "Closed", tone: "fg" },
};

function RequestsTab() {
  if (MOCK_REQUESTS.length === 0) {
    return (
      <Empty
        title="No concierge requests"
        body="Get curated investor introductions, deal flow, or custom research."
        cta={{ label: "Open a request", href: "/concierge" }}
      />
    );
  }

  return (
    <div>
      <SectionHeader title="Concierge Requests" subtitle={`${MOCK_REQUESTS.length} active`} action={{ label: "New request", href: "/concierge" }} />
      <div className="flex flex-col gap-3">
        {MOCK_REQUESTS.map((r) => {
          const status = REQUEST_STATUS_LABEL[r.status] ?? REQUEST_STATUS_LABEL.closed;
          return (
            <div key={r.id} className="card flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "inline-flex items-center font-mono uppercase font-semibold tracking-badge rounded-[var(--btn-r)] text-[10px] px-2 py-0.5",
                    status.tone === "signal" && "bg-[var(--signal-m)] text-[color:var(--signal-h)]",
                    status.tone === "pos" && "bg-[var(--pos-m)] text-[color:var(--pos-t)]",
                    status.tone === "fg" && "bg-surface text-fg-2"
                  )}
                >
                  {status.label}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-badge text-fg-3">
                  {r.type.replace("-", " ")}
                </span>
                <span className="ml-auto font-mono text-[10px] text-fg-3">
                  Submitted {new Date(r.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <h3 className="font-display font-bold text-sm leading-[1.35]">
                {r.summary}
              </h3>
              <div className="text-[11px] text-fg-3 mt-auto pt-2 border-t border-border-s">
                Assigned to <span className="text-fg-2 font-semibold">{r.assignee}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Alerts (v2 placeholder) ────────────────────────── */

function AlertsTab() {
  if (!MOCK_ALERTS_STATUS.enabled) {
    return (
      <div className="card !p-8 text-center flex flex-col items-center gap-3 max-w-[480px] mx-auto">
        <div className="w-10 h-10 rounded-full bg-brand-m grid place-items-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </div>
        <div>
          <div className="font-display font-extrabold text-base mb-1">
            Alerts coming in v2
          </div>
          <p className="text-sm text-fg-2 leading-[1.55]">
            Watchlists, custom alerts, and email digests are part of the next release. Existing paid members will get early access.
          </p>
        </div>
      </div>
    );
  }
  return null;
}

/* ── Profile ────────────────────────────────────────── */

function ProfileTab() {
  return (
    <div>
      <SectionHeader title="Profile" subtitle="ganerdene.dev@gmail.com" />
      <div className="max-w-[520px]">
        <ProfileForm />
      </div>
    </div>
  );
}

/* ── Section helpers ────────────────────────────────── */

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <h2 className="font-display font-extrabold text-md tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <span className="font-mono text-[11px] uppercase tracking-badge text-fg-3">
          {subtitle}
        </span>
      )}
      {action && (
        <Link
          href={action.href}
          className="ml-auto text-sm font-display font-semibold text-brand hover:text-brand-h no-underline"
        >
          {action.label} →
        </Link>
      )}
    </div>
  );
}

function Empty({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="card !p-8 text-center flex flex-col items-center gap-3 max-w-[480px] mx-auto">
      <div className="font-display font-extrabold text-base">{title}</div>
      <p className="text-sm text-fg-2 leading-[1.55]">{body}</p>
      <Link href={cta.href} className="btn btn-primary text-sm mt-2">
        {cta.label}
      </Link>
    </div>
  );
}
