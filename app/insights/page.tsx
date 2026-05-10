import type { Metadata } from "next";
import Image from "next/image";
import { InsightsControls } from "./insights-controls";
import type { Article } from "@/app/components/insights/insights-grid";
import { MOCK_ARTICLES } from "@/app/lib/mock-data";
import { apiGet } from "@/app/lib/api";
import { adaptInsightToArticle } from "@/app/lib/api-adapters";

export const metadata: Metadata = {
  title: "Insights — MarketIQ",
  description: "Research & analysis on Mongolia's capital markets",
};

export const dynamic = "force-dynamic";

/* ── Map mock contentType → badge variant ── */

const BADGE_MAP: Record<
  string,
  {
    label: string;
    variant: "research" | "article" | "deal" | "update" | "teaser" | "press";
  }
> = {
  article: { label: "Article", variant: "article" },
  "market-brief": { label: "Market Brief", variant: "update" },
  "investment-teaser": { label: "Investment Teaser", variant: "teaser" },
  "deal-insight": { label: "Deal Insight", variant: "deal" },
  "research-report": { label: "Research Report", variant: "research" },
  "press-release": { label: "Press Release", variant: "press" },
};

const FALLBACK_ARTICLES: Article[] = MOCK_ARTICLES.map((a, i) => ({
  slug: a.slug,
  title: a.title,
  excerpt: a.excerpt,
  badge: BADGE_MAP[a.contentType] ?? { label: "Article", variant: "article" },
  author: a.author,
  date: new Date(a.publishedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }),
  readTime: `${a.readTime} min read`,
  topics: a.topics,
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
    if (articles.length === 0) articles = FALLBACK_ARTICLES;
  } catch (err) {
    console.error("[insights] BFF unavailable, using static seed:", err);
    articles = FALLBACK_ARTICLES;
  }

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
      <InsightsControls articles={articles} />
    </div>
  );
}
