import type { Metadata } from "next";
import Image from "next/image";
import { InsightsControls } from "./insights-controls";
import { FeedSidebar } from "@/app/components/insights/feed-sidebar";
import { getInsights } from "@/app/lib/data/insights";
import { getNewsItems } from "@/app/lib/data/feed";

export const metadata: Metadata = {
  title: "Insights — MarketIQ",
  description: "Research & analysis on Mongolia's capital markets",
};

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const [base, newsItems] = await Promise.all([getInsights(), getNewsItems()]);
  // Decorate with featured flag + wrap coverImage URL in <Image> JSX.
  // coverImage is now plumbed through the data layer for both mock + live.
  const articles = base.map((a, i) => ({
    ...a,
    featured: i === 0,
    image: a.coverImage ? (
      <Image
        src={a.coverImage}
        alt={a.title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 50vw"
      />
    ) : undefined,
  }));

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
      <div className="grid gap-8 grid-cols-[minmax(0,1fr)_240px] max-xl:grid-cols-1 max-xl:gap-6">
        <div className="min-w-0">
          <InsightsControls articles={articles} />
        </div>
        <FeedSidebar items={newsItems} />
      </div>
    </div>
  );
}
