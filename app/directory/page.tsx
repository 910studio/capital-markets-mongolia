import type { Metadata } from "next";
import { DirectoryControls } from "./directory-controls";
import { apiGet } from "@/app/lib/api";
import { adaptEntityListItem } from "@/app/lib/api-adapters";
import { MOCK_ENTITIES } from "@/app/lib/mock-data";

export const metadata: Metadata = {
  title: "Directory — MarketIQ",
  description:
    "Browse Mongolia's capital markets entities — public companies, private companies, projects, and service providers.",
};

export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  let entities;
  try {
    const res = await apiGet("/api/entities", {
      query: { limit: 100, offset: 0 },
      next: { revalidate: 60, tags: ["entities"] },
    });
    entities = res.items.map(adaptEntityListItem);
    if (entities.length === 0) entities = MOCK_ENTITIES;
  } catch (err) {
    console.error("[directory] API fetch failed, falling back to mocks:", err);
    entities = MOCK_ENTITIES;
  }

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
      <DirectoryControls entities={entities} />
    </div>
  );
}
