import type { Metadata } from "next";
import Image from "next/image";
import { InsightsControls } from "./insights-controls";
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

  // Layout (classic vs live), feed sidebar visibility, and floating variant
  // switcher all live inside InsightsControls so the variant can swap them
  // together client-side.
  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
      <InsightsControls articles={articles} newsItems={newsItems} />
    </div>
  );
}
