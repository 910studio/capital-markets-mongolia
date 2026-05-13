import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MOCK_NEWS,
  MOCK_ENTITIES,
  NEWS_CATEGORY_COLORS,
  NEWS_CATEGORY_LABELS,
  type MockNewsItem,
} from "@/app/lib/mock-data";
import { NewsItemCard } from "@/app/components/feed/news-item-card";
import { cn } from "@/app/lib/cn";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface NewsDetailDto {
  id: string;
  title: string;
  url?: string;
  source: string;
  publishedAt: string;
  signalScore?: number;
  signalCategory?: string;
  isIncludedInBrief?: boolean;
  summary?: string;
  whyItMatters?: string;
  resolvedBody?: string;
  entities?: { slug: string; name?: string }[];
}

const NEWS_CATEGORY_MAP: Record<string, MockNewsItem["category"]> = {
  MARKET: "markets", CORPORATE: "companies", SECTOR: "sectors",
  POLICY: "policy", DEAL: "deals", MACRO: "macro",
  market: "markets", corporate: "companies", sector: "sectors",
  policy: "policy", deal: "deals", macro: "macro",
};

async function fetchNews(id: string): Promise<MockNewsItem | undefined> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/news/articles/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    const dto = (await res.json()) as NewsDetailDto;
    const summary =
      dto.summary?.trim() ||
      dto.whyItMatters?.trim() ||
      extractBodyExcerpt(dto.resolvedBody);
    return {
      id: dto.id,
      headline: dto.title,
      summary: summary || undefined,
      source: dto.source,
      sourceUrl: dto.url,
      publishedAt: dto.publishedAt,
      category: NEWS_CATEGORY_MAP[dto.signalCategory ?? ""] ?? "markets",
      topics: [],
      entitySlugs: (dto.entities ?? [])
        .map((e) => e.slug)
        .filter((s): s is string => typeof s === "string"),
      confidence: typeof dto.signalScore === "number" ? dto.signalScore : 0.7,
      reviewed: Boolean(dto.isIncludedInBrief),
    };
  } catch {
    return undefined;
  }
}

/**
 * Pull the first decent paragraph out of the scraped markdown body.
 * Skips title repeats, nav links, and image markdown — finds the first
 * meaningful prose chunk (≥120 chars).
 */
function extractBodyExcerpt(body: string | undefined, maxChars = 360): string {
  if (!body) return "";
  // Drop URL-only lines, headings, list markdown, image refs.
  const lines = body
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => {
      if (l.length < 60) return false;
      if (/^#{1,6}\s/.test(l)) return false;
      if (/^!\[/.test(l)) return false;
      if (/^\[.*?\]\(https?:\/\//.test(l)) return false;
      if (/^https?:\/\//.test(l)) return false;
      return true;
    });
  const first = lines.find((l) => l.length >= 120);
  if (!first) return "";
  // Strip markdown link syntax: [text](url) → text, and asterisks/underscores.
  const clean = first
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= maxChars) return clean;
  const cut = clean.slice(0, maxChars);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  if (lastStop > maxChars * 0.6) return cut.slice(0, lastStop + 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const live = await fetchNews(id);
  const item = live ?? MOCK_NEWS.find((n) => n.id === id);
  if (!item) return { title: "News Not Found — MarketIQ" };
  return {
    title: `${item.headline} — MarketIQ`,
    description: item.summary,
  };
}

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  const live = await fetchNews(id);
  const item = live ?? MOCK_NEWS.find((n) => n.id === id);
  if (!item) notFound();

  const entities = item.entitySlugs
    .map((slug) => MOCK_ENTITIES.find((e) => e.slug === slug))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  const related = MOCK_NEWS.filter(
    (n) =>
      n.id !== item.id &&
      (n.category === item.category ||
        n.entitySlugs.some((s) => item.entitySlugs.includes(s)))
  )
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, 4);

  const lowConfidence = item.confidence < 0.75;
  const categoryColor = NEWS_CATEGORY_COLORS[item.category];
  const categoryLabel = NEWS_CATEGORY_LABELS[item.category];

  const publishedDate = new Date(item.publishedAt).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="content-max px-6">
      <div className="pt-6 pb-3">
        <Link
          href="/feed"
          className="text-sm font-display font-semibold text-fg-3 hover:text-brand no-underline"
        >
          ← Market Feed
        </Link>
      </div>

      <article className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 pb-12">
        <div className="min-w-0">
          <header className="pb-6 border-b border-border-s">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span
                className="inline-flex items-center gap-1.5 font-mono uppercase font-semibold tracking-badge rounded-[var(--btn-r)] text-[10px] px-2 py-0.5 text-fg-2"
                style={{ background: "var(--surface)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: categoryColor }}
                />
                {categoryLabel}
              </span>
              {item.isBreaking && (
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-badge font-bold text-[color:var(--neg-t)] bg-[var(--neg-m)] px-1.5 py-0.5 rounded-[var(--btn-r)]">
                  <span className="w-1 h-1 rounded-full bg-[color:var(--neg)] animate-pulse" />
                  Breaking
                </span>
              )}
              {lowConfidence && (
                <span
                  className={cn(
                    "inline-flex items-center font-mono text-[10px] uppercase tracking-badge font-semibold",
                    "text-fg-3 border border-border bg-[var(--surface-down)] px-1.5 py-0.5 rounded-[var(--btn-r)]"
                  )}
                  title="Low-confidence AI tagging — pending analyst review"
                >
                  Unverified
                </span>
              )}
            </div>

            <h1 className="font-display font-extrabold text-2xl leading-[1.15] tracking-tight max-md:text-xl">
              {item.headline}
            </h1>

            <div className="flex items-center gap-2 mt-4 font-mono text-[11px] text-fg-3">
              <span className="font-semibold text-fg-2">{item.source}</span>
              <span>·</span>
              <span>{publishedDate}</span>
            </div>
          </header>

          {item.summary && (
            <section className="py-6">
              <p className="text-base text-fg-2 leading-[1.7] max-w-[680px]">
                {item.summary}
              </p>
              <p className="text-sm text-fg-3 leading-[1.6] mt-4 max-w-[680px]">
                Full coverage and analyst commentary will appear here once linked from {item.source}.
                {item.sourceUrl && (
                  <>
                    {" "}
                    <Link
                      href={item.sourceUrl}
                      className="text-brand hover:text-brand-h no-underline"
                    >
                      Read original →
                    </Link>
                  </>
                )}
              </p>
            </section>
          )}

          {related.length > 0 && (
            <section className="pt-6 mt-6 border-t border-border-s">
              <h2 className="font-display font-extrabold text-md tracking-tight mb-4">
                Related coverage
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {related.map((r) => (
                  <NewsItemCard key={r.id} item={r} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside
          className="flex flex-col gap-4 lg:sticky lg:self-start"
          style={{ top: "calc(var(--header-h) + 24px)" }}
        >
          <div className="card !p-4">
            <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3 mb-3">
              Confidence
            </div>
            <div className="flex items-baseline gap-2">
              <div className="font-display font-extrabold text-2xl">
                {Math.round(item.confidence * 100)}%
              </div>
              <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3">
                {item.reviewed ? "Analyst-reviewed" : lowConfidence ? "Pending review" : "Auto-tagged"}
              </div>
            </div>
          </div>

          {entities.length > 0 && (
            <div className="card !p-4">
              <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3 mb-3">
                Linked entities
              </div>
              <div className="flex flex-col gap-1">
                {entities.map((e) => (
                  <Link
                    key={e.slug}
                    href={`/directory/${e.slug}`}
                    className="text-sm font-display font-semibold text-fg hover:text-brand no-underline py-1"
                  >
                    {e.name}
                    {e.ticker && (
                      <span className="font-mono text-[11px] text-fg-3 ml-2">
                        {e.ticker}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {item.topics && item.topics.length > 0 && (
            <div className="card !p-4">
              <div className="font-mono text-[10px] uppercase tracking-badge text-fg-3 mb-3">
                Topics
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.topics.map((t) => (
                  <span
                    key={t}
                    className="font-body font-medium text-[11px] py-0.5 px-2 rounded-[var(--btn-r)] bg-surface text-fg-2"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </article>
    </div>
  );
}
