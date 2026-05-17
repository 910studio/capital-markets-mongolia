import type { Metadata } from "next";
import { getNewsItems } from "@/app/lib/data/feed";
import { FeedStream } from "./feed-stream";

export const metadata: Metadata = {
  title: "Market Feed — MarketIQ",
  description:
    "Live news feed from Mongolia's capital markets, AI-aggregated and analyst-reviewed.",
};

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const items = await getNewsItems();
  return (
    <div className="content-max px-6">
      <FeedStream items={items} />
    </div>
  );
}
