import type { Metadata } from "next";
import { MOCK_NEWS } from "@/app/lib/mock-data";
import { apiGet } from "@/app/lib/api";
import { adaptNewsItem } from "@/app/lib/api-adapters";
import { FeedStream } from "./feed-stream";

export const metadata: Metadata = {
  title: "Market Feed — MarketIQ",
  description:
    "Live news feed from Mongolia's capital markets, AI-aggregated and analyst-reviewed.",
};

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  let items;
  try {
    const res = await apiGet("/api/news/feed", {
      query: { limit: 50 },
      next: { revalidate: 60, tags: ["news"] },
    });
    items = res.items.map(adaptNewsItem);
    if (items.length === 0) items = MOCK_NEWS;
  } catch (err) {
    console.error("[feed] API fetch failed, falling back to mocks:", err);
    items = MOCK_NEWS;
  }

  return (
    <div className="content-max px-6">
      <FeedStream items={items} />
    </div>
  );
}
