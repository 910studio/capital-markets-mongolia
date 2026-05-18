import "server-only";

import { IS_MOCK } from "./index";

export type PageSlug = "about" | "privacy" | "terms" | "concierge";

export interface PageSection {
  title: string;
  body: string;
}

export interface PageContent {
  slug: PageSlug;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  lastUpdated?: string;
  /** Sectioned legal-doc shape (privacy, terms). Wins over richBody when present. */
  sections?: PageSection[];
  /** Free-form rich-text body (about, concierge). Lexical JSON stringified. */
  richBody?: unknown;
  seo?: {
    title?: string;
    description?: string;
  };
}

/**
 * Static page content getter. Mock mode returns null so existing hardcoded
 * page components (app/{about,privacy,terms,concierge}/page.tsx) keep their
 * current copy unchanged. Live mode hits the Payload `pages` collection
 * via the BFF.
 *
 * BFF endpoint not yet implemented — add `GET /api/pages/:slug` reading
 * from `cms.pages` (same direct-SQL pattern the insights.service.ts switch
 * established). Until then, live mode falls through to null and the page
 * component renders its hardcoded fallback.
 */
export async function getPage(slug: PageSlug): Promise<PageContent | null> {
  if (IS_MOCK) return null;

  // TODO: wire `GET /api/pages/:slug` on the BFF, then call:
  //   try {
  //     const dto = await apiGet(path("/api/pages/{slug}", { slug }), {
  //       next: { revalidate: 300, tags: [`page:${slug}`] },
  //     });
  //     return adaptPage(dto);
  //   } catch (err) {
  //     if (err instanceof ApiError && err.status === 404) return null;
  //     console.error(`[data:page:${slug}] live fetch failed:`, err);
  //     return null;
  //   }
  return null;
}
