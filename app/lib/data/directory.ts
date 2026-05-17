import "server-only";

import {
  MOCK_ENTITIES,
  ENTITY_TYPE_TO_BACKEND,
  type MockEntity,
  type EntityType,
} from "@/app/lib/mock-data";
import { apiGet, path, ApiError } from "@/app/lib/api";
import { adaptEntityListItem, adaptEntityDetail } from "@/app/lib/api-adapters";
import { IS_MOCK } from "./index";

interface EntityListFilters {
  q?: string;
  entityType?: EntityType;
  sectorSlug?: string;
  raising?: boolean;
  limit?: number;
  offset?: number;
}

export interface EntityListPage {
  items: MockEntity[];
  total: number;
}

function filterMockEntities(filters: EntityListFilters): MockEntity[] {
  let items = [...MOCK_ENTITIES];
  if (filters.entityType) {
    items = items.filter((e) => e.type === filters.entityType);
  }
  if (filters.sectorSlug) {
    const target = filters.sectorSlug;
    items = items.filter(
      (e) => e.sector?.toLowerCase().replace(/[^a-z0-9]+/g, "-") === target,
    );
  }
  if (filters.raising) {
    items = items.filter((e) => e.isRaising);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.ticker?.toLowerCase().includes(q) ||
        e.sector?.toLowerCase().includes(q) ||
        false,
    );
  }
  return items;
}

export async function getEntities(filters: EntityListFilters): Promise<EntityListPage> {
  if (IS_MOCK) {
    const filtered = filterMockEntities(filters);
    const offset = filters.offset ?? 0;
    const limit = filters.limit ?? filtered.length;
    return {
      items: filtered.slice(offset, offset + limit),
      total: filtered.length,
    };
  }

  try {
    const res = await apiGet("/api/entities", {
      query: {
        q: filters.q,
        entityType: filters.entityType ? ENTITY_TYPE_TO_BACKEND[filters.entityType] : undefined,
        sectorSlug: filters.sectorSlug,
        limit: filters.limit,
        offset: filters.offset,
      },
      next: { revalidate: 60, tags: ["entities"] },
    });
    let items = res.items.map(adaptEntityListItem);
    // `raising` isn't a backend filter yet — narrow locally.
    if (filters.raising) items = items.filter((e) => e.isRaising);
    return { items, total: res.total };
  } catch (err) {
    console.error("[data:entities] live fetch failed:", err);
    return { items: [], total: 0 };
  }
}

export async function getEntityBySlug(slug: string): Promise<MockEntity | null> {
  if (IS_MOCK) {
    return MOCK_ENTITIES.find((e) => e.slug === slug) ?? null;
  }
  try {
    const dto = await apiGet(path("/api/entities/{slug}", { slug }), {
      next: { revalidate: 60, tags: [`entity:${slug}`] },
    });
    return adaptEntityDetail(dto);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    console.error(`[data:entity:${slug}] live fetch failed:`, err);
    return null;
  }
}
