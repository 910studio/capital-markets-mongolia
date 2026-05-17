import type { Metadata } from "next";
import { DirectoryControls } from "./directory-controls";
import { getEntities } from "@/app/lib/data/directory";
import { type EntityType, type MockEntity } from "@/app/lib/mock-data";

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
    // Default landing — fetch each type's first slice in parallel.
    const sections = await Promise.all(
      SECTION_TYPES.map(async (t) => {
        const page = await getEntities({
          entityType: t,
          limit: SECTION_PREVIEW,
          offset: 0,
        });
        return { type: t, items: page.items, total: page.total };
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

  // Filtered view — single paginated fetch through the data layer.
  const pageResult = await getEntities({
    q,
    entityType: type,
    sectorSlug: sector,
    raising,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });
  const items: MockEntity[] = pageResult.items;
  const total = pageResult.total;

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
