import type { Metadata } from "next";
import { MOCK_NEWS } from "@/app/lib/mock-data";
import { FeedStream } from "./feed-stream";

export const metadata: Metadata = {
  title: "Market Feed — MarketIQ",
  description:
    "Live news feed from Mongolia's capital markets, AI-aggregated and analyst-reviewed.",
};

export default function FeedPage() {
  return (
    <div className="content-max px-6">
      <FeedStream items={MOCK_NEWS} />
    </div>
  );
}
