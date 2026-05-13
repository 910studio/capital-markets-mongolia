import type { Metadata } from "next";
import Image from "next/image";
import { InsightsControls } from "./insights-controls";
import type { Article } from "@/app/components/insights/insights-grid";
import { apiGet } from "@/app/lib/api";
import { adaptInsightToArticle } from "@/app/lib/api-adapters";

export const metadata: Metadata = {
  title: "Insights — MarketIQ",
  description: "Research & analysis on Mongolia's capital markets",
};

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  let articles: Article[] = [];
  try {
    const res = await apiGet("/api/insights", {
      query: { limit: 50, page: 1 },
      next: { revalidate: 60, tags: ["insights"] },
    });
    articles = res.items.map((dto, i) => ({
      ...adaptInsightToArticle(dto),
      featured: i === 0,
      image: dto.coverImageUrl ? (
        <Image
          src={dto.coverImageUrl}
          alt={dto.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      ) : undefined,
    }));
  } catch (err) {
    console.error("[insights] BFF fetch failed:", err);
  }

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
      <InsightsControls articles={articles} />
    </div>
  );
}
