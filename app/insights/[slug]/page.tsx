import type { Metadata } from "next";
import { ContentDetailClient } from "./content-detail-client";
import type { MockArticle } from "@/app/lib/mock-data";
import { MOCK_ARTICLES } from "@/app/lib/mock-data";
import { ApiError, apiGet, path } from "@/app/lib/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CONTENT_TYPE_MAP: Record<string, MockArticle["contentType"]> = {
  article: "article",
  "market-brief": "market-brief",
  "monthly-update": "market-brief",
  "investment-teaser": "investment-teaser",
  "deal-insight": "deal-insight",
  "research-report": "research-report",
  "press-release": "press-release",
  "cmm-guide": "research-report",
};

async function fetchInsight(slug: string): Promise<MockArticle | undefined> {
  try {
    const dto = await apiGet(
      path("/api/insights/{slug}", { slug }),
      { next: { revalidate: 60, tags: [`insight:${slug}`] } },
    );
    return {
      slug: dto.slug,
      title: dto.title,
      excerpt: dto.excerpt ?? "",
      contentType: CONTENT_TYPE_MAP[dto.contentType] ?? "article",
      topics: dto.topics ?? [],
      author: dto.author?.name ?? "CMM Research",
      publishedAt: dto.publishedAt ?? new Date().toISOString(),
      readTime: 8,
      isPremium: Boolean(dto.isPremium),
      entityRefs: (dto.entities ?? []).map((e) => e.slug),
      coverImage: dto.coverImageUrl,
    };
  } catch (err) {
    // 404 → fall through to mock fallback. Other errors → log & fall through.
    if (!(err instanceof ApiError) || err.status !== 404) {
      console.error("[insight detail] fetch failed:", err);
    }
    return undefined;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const live = await fetchInsight(slug);
  const article = live ?? MOCK_ARTICLES.find((a) => a.slug === slug);

  return {
    title: article ? `${article.title} — MarketIQ` : "Insights — MarketIQ",
    description: article?.excerpt ?? "Research & analysis on Mongolia's capital markets.",
  };
}

export const dynamic = "force-dynamic";

export default async function ContentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchInsight(slug);

  return <ContentDetailClient slug={slug} article={article} />;
}
