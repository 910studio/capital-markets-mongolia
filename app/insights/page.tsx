import type { Metadata } from "next";
import Image from "next/image";
import { InsightsControls } from "./insights-controls";
import { getInsights } from "@/app/lib/data/insights";
import { MOCK_ARTICLES } from "@/app/lib/mock-data";

export const metadata: Metadata = {
  title: "Insights — MarketIQ",
  description: "Research & analysis on Mongolia's capital markets",
};

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const base = await getInsights();
  // Decorate with featured flag + cover image element. Mock articles carry
  // coverImage; live articles' image URL is added by the live branch's adapter
  // — for now, pull the cover from the mock-data by slug lookup.
  const mockBySlug = new Map(MOCK_ARTICLES.map((a) => [a.slug, a]));
  const articles = base.map((a, i) => ({
    ...a,
    featured: i === 0,
    image: mockBySlug.get(a.slug)?.coverImage ? (
      <Image
        src={mockBySlug.get(a.slug)!.coverImage!}
        alt={a.title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 50vw"
      />
    ) : undefined,
  }));

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
      <InsightsControls articles={articles} />
    </div>
  );
}
