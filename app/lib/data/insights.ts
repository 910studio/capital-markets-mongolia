import "server-only";

import {
  MOCK_ARTICLES,
  type MockArticle,
} from "@/app/lib/mock-data";
import { apiGet, path, ApiError } from "@/app/lib/api";
import { adaptInsightToArticle } from "@/app/lib/api-adapters";
import type { Article } from "@/app/components/insights/insights-grid";
import { IS_MOCK } from "./index";

const CONTENT_TYPE_BADGE: Record<
  MockArticle["contentType"],
  Article["badge"]
> = {
  article: { label: "Article", variant: "article" },
  "market-brief": { label: "Market Brief", variant: "update" },
  "investment-teaser": { label: "Investment Teaser", variant: "teaser" },
  "deal-insight": { label: "Deal Insight", variant: "deal" },
  "research-report": { label: "Research Report", variant: "research" },
  "press-release": { label: "Press Release", variant: "press" },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mockArticleToArticle(a: MockArticle): Article {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    badge:
      CONTENT_TYPE_BADGE[a.contentType] ?? { label: "Article", variant: "article" },
    author: a.author,
    date: formatDate(a.publishedAt),
    readTime: `${a.readTime} min`,
    topics: a.topics,
    coverImage: a.coverImage,
  };
}

export async function getInsights(): Promise<Article[]> {
  if (IS_MOCK) {
    return MOCK_ARTICLES.map(mockArticleToArticle);
  }
  try {
    const res = await apiGet("/api/insights", {
      query: { limit: 50, page: 1 },
      next: { revalidate: 60, tags: ["insights"] },
    });
    return res.items.map((dto) => ({
      ...adaptInsightToArticle(dto),
      coverImage: dto.coverImageUrl,
    }));
  } catch (err) {
    console.error("[data:insights] live fetch failed:", err);
    return [];
  }
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

/** Returns the article in MockArticle shape (the [slug] page's canonical type). */
export async function getInsightBySlug(slug: string): Promise<MockArticle | null> {
  if (IS_MOCK) {
    return MOCK_ARTICLES.find((a) => a.slug === slug) ?? null;
  }
  try {
    const dto = await apiGet(path("/api/insights/{slug}", { slug }), {
      next: { revalidate: 60, tags: [`insight:${slug}`] },
    });
    return {
      slug: dto.slug,
      title: dto.title,
      excerpt: dto.excerpt ?? "",
      contentType: CONTENT_TYPE_MAP[dto.contentType] ?? "article",
      topics: dto.topics ?? [],
      author: dto.author?.name ?? "CMM Research",
      publishedAt: dto.publishedAt ?? "",
      readTime: 5,
      isPremium: dto.isPremium ?? false,
      entityRefs: (dto.entities ?? []).map((e) => e.slug).filter(Boolean) as string[],
      coverImage: dto.coverImageUrl,
    };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    console.error(`[data:insight:${slug}] live fetch failed:`, err);
    return null;
  }
}
