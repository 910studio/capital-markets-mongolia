import "server-only";

import { MOCK_NEWS, type MockNewsItem } from "@/app/lib/mock-data";
import { apiGet } from "@/app/lib/api";
import { adaptNewsItem } from "@/app/lib/api-adapters";
import { IS_MOCK } from "./index";

export async function getNewsItems(): Promise<MockNewsItem[]> {
  if (IS_MOCK) return [...MOCK_NEWS];

  try {
    const res = await apiGet("/api/news/feed", {
      query: { limit: 50 },
      next: { revalidate: 60, tags: ["news"] },
    });
    return res.items.map(adaptNewsItem);
  } catch (err) {
    console.error("[data:news] live fetch failed:", err);
    return [];
  }
}
