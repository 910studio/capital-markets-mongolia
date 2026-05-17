import type { Metadata } from "next";
import { ContentDetailClient } from "./content-detail-client";
import { getInsightBySlug } from "@/app/lib/data/insights";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getInsightBySlug(slug);
  return {
    title: article ? `${article.title} — MarketIQ` : "Insights — MarketIQ",
    description: article?.excerpt ?? "Research & analysis on Mongolia's capital markets.",
  };
}

export const dynamic = "force-dynamic";

export default async function ContentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = (await getInsightBySlug(slug)) ?? undefined;
  return <ContentDetailClient slug={slug} article={article} />;
}
