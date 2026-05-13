import type { Metadata } from "next";
import { DirectoryControls } from "./directory-controls";
import { apiGet } from "@/app/lib/api";
import { adaptEntityListItem } from "@/app/lib/api-adapters";
import {
  ENTITY_TYPE_TO_BACKEND,
  type EntityType,
  type MockEntity,
} from "@/app/lib/mock-data";

export const metadata: Metadata = {
  title: "Directory — MarketIQ",
  description:
    "Browse Mongolia's capital markets entities — public companies, private companies, projects, and service providers.",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 24;
const SECTION_PREVIEW = 8;
const SECTION_TYPES: EntityType[] = [
  "public_company",
  "private_company",
  "project",
  "service_provider",
];

interface PageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    sector?: string;
    raising?: string;
    page?: string;
  }>;
}

export default async function DirectoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const type =
    params.type && params.type !== "all" ? (params.type as EntityType) : undefined;
  const sector = params.sector || undefined;
  const raising = params.raising === "1";
  const page = Math.max(1, Number(params.page) || 1);

  const hasFilters = !!(q || type || sector || raising);
  const filterState = {
    q: q ?? "",
    type: type ?? "all",
    sector: sector ?? null,
    raising,
  };

  if (!hasFilters) {
    // Default landing — fetch each type's first slice in parallel for the
    // section preview view.
    const sections = await Promise.all(
      SECTION_TYPES.map(async (t) => {
        try {
          const res = await apiGet("/api/entities", {
            query: {
              entityType: ENTITY_TYPE_TO_BACKEND[t],
              limit: SECTION_PREVIEW,
              offset: 0,
            },
            next: { revalidate: 60, tags: ["entities"] },
          });
          return {
            type: t,
            items: res.items.map(adaptEntityListItem),
            total: res.total,
          };
        } catch (err) {
          console.error(`[directory] section ${t} fetch failed:`, err);
          return { type: t, items: [] as MockEntity[], total: 0 };
        }
      }),
    );

    return (
      <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
        <DirectoryControls
          mode="sections"
          sections={sections}
          filters={filterState}
        />
      </div>
    );
  }

  // Filtered view — single paginated fetch.
  let items: MockEntity[] = [];
  let total = 0;
  try {
    const res = await apiGet("/api/entities", {
      query: {
        q,
        entityType: type ? ENTITY_TYPE_TO_BACKEND[type] : undefined,
        sectorSlug: sector,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      },
      next: { revalidate: 60, tags: ["entities"] },
    });
    items = res.items.map(adaptEntityListItem);
    total = res.total;
    // `raising` isn't a backend filter yet — narrow the page locally.
    if (raising) {
      items = items.filter((e) => e.isRaising);
    }
  } catch (err) {
    console.error("[directory] filtered fetch failed:", err);
  }

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
      <DirectoryControls
        mode="filtered"
        items={items}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        filters={filterState}
      />
    </div>
  );
}
