import type { Metadata } from "next";
import { ContentDetailClient } from "./content-detail-client";
import { MOCK_ARTICLES } from "@/app/lib/mock-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = MOCK_ARTICLES.find((a) => a.slug === slug);

  return {
    title: article ? `${article.title} — MarketIQ` : "Insights — MarketIQ",
    description: article?.excerpt ?? "Research & analysis on Mongolia's capital markets.",
  };
}

export default async function ContentDetailPage({ params }: PageProps) {
  const { slug } = await params;

  return <ContentDetailClient slug={slug} />;
}
