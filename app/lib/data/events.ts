import "server-only";

import {
  MOCK_EVENTS,
  MOCK_SPEAKERS,
  type MockEvent,
  type MockSpeaker,
} from "@/app/lib/mock-data";
import { apiGet, path, ApiError } from "@/app/lib/api";
import {
  adaptEventListItem,
  adaptEventDetail,
  adaptEventSpeakers,
} from "@/app/lib/api-adapters";
import { IS_MOCK } from "./index";

export interface EventDetail {
  event: MockEvent;
  speakers: MockSpeaker[];
}

export async function getEvents(): Promise<MockEvent[]> {
  if (IS_MOCK) return [...MOCK_EVENTS];

  try {
    const res = await apiGet("/api/events", {
      query: { limit: 100 },
      next: { revalidate: 60, tags: ["events"] },
    });
    return res.items.map(adaptEventListItem);
  } catch (err) {
    console.error("[data:events] live fetch failed:", err);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  if (IS_MOCK) {
    const event = MOCK_EVENTS.find((e) => e.slug === slug);
    if (!event) return null;
    const speakers = event.speakerSlugs
      .map((s) => MOCK_SPEAKERS.find((sp) => sp.slug === s))
      .filter((s): s is MockSpeaker => Boolean(s));
    return { event, speakers };
  }

  try {
    const dto = await apiGet(path("/api/events/{slug}", { slug }), {
      next: { revalidate: 60, tags: [`event:${slug}`] },
    });
    return { event: adaptEventDetail(dto), speakers: adaptEventSpeakers(dto) };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    console.error(`[data:event:${slug}] live fetch failed:`, err);
    return null;
  }
}

export async function getSpeakerBySlug(slug: string): Promise<MockSpeaker | null> {
  if (IS_MOCK) {
    return MOCK_SPEAKERS.find((s) => s.slug === slug) ?? null;
  }

  // Speakers endpoint not yet implemented on BFF — fall back to mocks so
  // the page still renders in live mode until the API lands.
  return MOCK_SPEAKERS.find((s) => s.slug === slug) ?? null;
}
