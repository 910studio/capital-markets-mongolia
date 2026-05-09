/**
 * Adapters that map API DTOs to the existing MockEntity / MockEvent / etc
 * shapes the UI components already render. Lets us keep the existing UI
 * unchanged while pulling real data.
 *
 * Where the API doesn't yet provide a field (financials, sustainability,
 * full deal history), the adapter leaves it undefined — UI components
 * already handle missing values.
 */

import type { components } from "./api-types";
import type {
  EntityType,
  MockEntity,
  MockEvent,
  EventStatus,
  EventFormat,
  MockNewsItem,
  NewsCategory,
} from "./mock-data";

type EntityListItemDto = components["schemas"]["EntityListItemDto"];
type EntityDetailDto = components["schemas"]["EntityDetailDto"];
type EventListItemDto = components["schemas"]["EventListItemDto"];
type EventDetailDto = components["schemas"]["EventDetailDto"];
type NewsFeedItemDto = components["schemas"]["NewsFeedItemDto"];
type InsightListItemDto = components["schemas"]["InsightListItemDto"];
type InsightDetailDto = components["schemas"]["InsightDetailDto"];
type ContributorListItemDto = components["schemas"]["ContributorListItemDto"];
type ContributorDetailDto = components["schemas"]["ContributorDetailDto"];

const ENTITY_TYPE_MAP: Record<string, EntityType> = {
  PUBLIC_COMPANY: "public_company",
  PRIVATE_COMPANY: "private_company",
  PROJECT: "project",
  SERVICE_PROVIDER: "service_provider",
};

const EVENT_STATUS_MAP: Record<string, EventStatus> = {
  UPCOMING: "upcoming",
  REGISTRATION_OPEN: "registration-open",
  SOLD_OUT: "sold-out",
  PAST: "past",
};

const EVENT_FORMAT_MAP: Record<string, EventFormat> = {
  IN_PERSON: "in-person",
  VIRTUAL: "virtual",
  HYBRID: "hybrid",
};

export function adaptEntityListItem(dto: EntityListItemDto): MockEntity {
  return {
    slug: dto.slug,
    name: dto.name,
    ticker: dto.mseCode,
    sector: dto.sectorSlug ?? "other",
    type: ENTITY_TYPE_MAP[dto.entityType] ?? "private_company",
    description: dto.descriptionPreview ?? "",
    logo: dto.logoUrl,
    dataSource:
      dto.profileSource === "CMM_VERIFIED"
        ? "CMM Verified"
        : dto.profileSource === "COMPANY_SUBMITTED"
          ? "Company Submitted"
          : "AI-Generated",
  };
}

export function adaptEntityDetail(dto: EntityDetailDto): MockEntity {
  const base = adaptEntityListItem(dto);
  return {
    ...base,
    description: dto.description ?? base.description,
    website: dto.websiteUrl,
    yearEstablished: dto.foundingYear,
  };
}

export function adaptEventListItem(dto: EventListItemDto): MockEvent {
  return {
    slug: dto.slug,
    title: dto.title,
    shortName: dto.shortName,
    tagline: dto.tagline ?? "",
    description: "",
    status: EVENT_STATUS_MAP[dto.status] ?? "upcoming",
    format: EVENT_FORMAT_MAP[dto.format] ?? "in-person",
    startDate: dto.startDate,
    endDate: dto.endDate,
    location: dto.location,
    city: dto.city,
    expectedAttendees: dto.expectedAttendees,
    registrationCount: dto.registrationCount,
    ticketPrice: dto.ticketPrice,
    coverImage: dto.coverImage,
    speakerSlugs: [],
    topics: dto.topics,
  };
}

/** Map backend signalCategory → frontend NewsCategory enum. */
const NEWS_CATEGORY_MAP: Record<string, NewsCategory> = {
  MARKET: "markets",
  CORPORATE: "companies",
  SECTOR: "sectors",
  POLICY: "policy",
  DEAL: "deals",
  MACRO: "macro",
  // lowercase variants (in case backend writes them)
  market: "markets",
  corporate: "companies",
  sector: "sectors",
  policy: "policy",
  deal: "deals",
  macro: "macro",
};

export function adaptNewsItem(dto: NewsFeedItemDto): MockNewsItem {
  const entitySlugs = (dto.entities ?? [])
    .map((e: { slug?: string | null }) => e.slug)
    .filter((s): s is string => typeof s === "string");
  return {
    id: dto.id,
    headline: dto.title,
    summary: dto.summary ?? dto.whyItMatters ?? undefined,
    source: dto.source,
    sourceUrl: dto.url,
    publishedAt: dto.publishedAt,
    category: dto.signalCategory
      ? (NEWS_CATEGORY_MAP[dto.signalCategory] ?? "markets")
      : "markets",
    entitySlugs,
    confidence: dto.signalScore ?? 0.8,
    reviewed: true,
  };
}

type SponsorTierLower = "platinum" | "gold" | "silver" | "partner";
const SPONSOR_TIER_MAP: Record<string, SponsorTierLower> = {
  PLATINUM: "platinum",
  GOLD: "gold",
  SILVER: "silver",
  PARTNER: "partner",
};

type AgendaItemTypeLower =
  | "keynote"
  | "panel"
  | "presentation"
  | "break"
  | "networking";
const AGENDA_TYPE_MAP: Record<string, AgendaItemTypeLower> = {
  KEYNOTE: "keynote",
  PANEL: "panel",
  PRESENTATION: "presentation",
  BREAK: "break",
  NETWORKING: "networking",
};

export function adaptEventDetail(dto: EventDetailDto): MockEvent {
  const base = adaptEventListItem(dto);

  const sponsors = (dto.sponsors as Array<{
    name: string;
    tier: string;
    logoUrl?: string | null;
    entitySlug?: string | null;
  }> | undefined)?.map((s) => ({
    name: s.name,
    tier: SPONSOR_TIER_MAP[s.tier] ?? "partner",
    logo: s.logoUrl ?? undefined,
  }));

  const agenda = (dto.agenda as Array<{
    time: string;
    title: string;
    type?: string | null;
    description?: string | null;
    speakers?: Array<{ slug: string; name: string }>;
  }> | undefined)?.map((a) => ({
    time: a.time,
    title: a.title,
    type: a.type ? AGENDA_TYPE_MAP[a.type] : undefined,
    description: a.description ?? undefined,
    speakerSlugs: (a.speakers ?? []).map((s) => s.slug),
  }));

  return {
    ...base,
    description: dto.description ?? "",
    venue: dto.venue,
    registrationDeadline: dto.registrationDeadline,
    presentingCompanies: dto.presentingCompanies,
    recapUrl: dto.recapUrl,
    replayUrl: dto.replayUrl,
    speakerSlugs: dto.speakers.map((s) => s.slug),
    sponsors,
    agenda,
  };
}

/** Adapt API speaker refs to MockSpeaker shape for the event detail page. */
export function adaptEventSpeakers(
  dto: EventDetailDto,
): import("./mock-data").MockSpeaker[] {
  return dto.speakers.map((s) => ({
    slug: s.slug,
    name: s.name,
    initials: s.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join(""),
    title: s.title ?? "",
    org: s.company ?? "",
    bio: "",
    photo: s.photoUrl ?? undefined,
  }));
}

// ── Insights / Contributors (BFF — Payload via NestJS) ────────────────────

import type { Article } from "../components/insights/insights-grid";

const CONTENT_TYPE_BADGE: Record<
  string,
  { label: string; variant: "research" | "article" | "deal" | "update" | "teaser" | "press" }
> = {
  article: { label: "Article", variant: "article" },
  "monthly-update": { label: "Monthly Update", variant: "update" },
  "investment-teaser": { label: "Investment Teaser", variant: "teaser" },
  "deal-insight": { label: "Deal Insight", variant: "deal" },
  "research-report": { label: "Research Report", variant: "research" },
  "press-release": { label: "Press Release", variant: "press" },
  "cmm-guide": { label: "CMM Guide", variant: "research" },
  // legacy mock alias
  "market-brief": { label: "Market Brief", variant: "update" },
};

/** Adapt API insight → frontend Article shape (insights-grid expects). */
export function adaptInsightToArticle(dto: InsightListItemDto): Article {
  return {
    slug: dto.slug,
    title: dto.title,
    excerpt: dto.excerpt ?? "",
    badge:
      CONTENT_TYPE_BADGE[dto.contentType] ?? {
        label: "Article",
        variant: "article",
      },
    author: dto.author?.name ?? "CMM Research",
    date: dto.publishedAt
      ? new Date(dto.publishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    topics: dto.topics ?? [],
  };
}

/** Adapt detail DTO too — same shape, body/entities used elsewhere. */
export type InsightDetail = InsightDetailDto;

import type { MockContributor } from "./mock-data";

function deriveInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function adaptContributor(
  dto: ContributorListItemDto | ContributorDetailDto,
): MockContributor {
  const detail = dto as ContributorDetailDto;
  return {
    slug: dto.slug,
    name: dto.name,
    initials: deriveInitials(dto.name),
    role: dto.title ?? "Contributor",
    org: dto.affiliation ?? "",
    bio: detail.bio ?? "",
  };
}
