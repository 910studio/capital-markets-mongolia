import type { Metadata } from "next";
import { DirectoryControls } from "./directory-controls";
import { apiGet } from "@/app/lib/api";
import { adaptEntityListItem } from "@/app/lib/api-adapters";

export const metadata: Metadata = {
  title: "Directory — MarketIQ",
  description:
    "Browse Mongolia's capital markets entities — public companies, private companies, projects, and service providers.",
};

export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  let entities: ReturnType<typeof adaptEntityListItem>[] = [];
  try {
    const res = await apiGet("/api/entities", {
      query: { limit: 100, offset: 0 },
      next: { revalidate: 60, tags: ["entities"] },
    });
    entities = res.items.map(adaptEntityListItem);
  } catch (err) {
    console.error("[directory] API fetch failed:", err);
  }

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
      <DirectoryControls entities={entities} />
    </div>
  );
}
