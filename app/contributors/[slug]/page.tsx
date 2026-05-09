import type { Metadata } from "next";
import Link from "next/link";
import { MOCK_CONTRIBUTORS, MOCK_ARTICLES, type MockContributor } from "@/app/lib/mock-data";
import { notFound } from "next/navigation";
import { apiGet, path, ApiError } from "@/app/lib/api";
import { adaptContributor, adaptInsightToArticle } from "@/app/lib/api-adapters";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ContributorArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  publishedAt: string;
  contentType: string;
  topics: string[];
}

interface LoadedContributor {
  contributor: MockContributor;
  articles: ContributorArticle[];
}

const AUTHOR_SLUG_MAP: Record<string, string> = {
  "Enkhjin A.": "enkhjin-a",
  "Namkhaidorj B.": "namkhaidorj-b",
  "Zolbayar E.": "zolbayar-e",
  "Tselmeg E.": "tselmeg-e",
  "Ariunzaya O.": "ariunzaya-o",
  "Enkhtaivan B.": "enkhjin-a",
  "CMM Research": "cmm-research",
};

async function loadContributor(slug: string): Promise<LoadedContributor | null> {
  // Try BFF first
  try {
    const dto = await apiGet(path("/api/contributors/{slug}", { slug }), {
      next: { revalidate: 60, tags: [`contributor:${slug}`] },
    });
    const contributor = adaptContributor(dto);
    // Fetch all insights, filter by author slug client-side (BFF list is small)
    let articles: ContributorArticle[] = [];
    try {
      const insightsRes = await apiGet("/api/insights", {
        query: { limit: 50 },
        next: { revalidate: 60, tags: ["insights"] },
      });
      articles = insightsRes.items
        .filter((it) => it.author?.slug === slug)
        .map((it) => {
          const a = adaptInsightToArticle(it);
          return {
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt,
            date: a.date,
            publishedAt: a.date,
            contentType: it.contentType,
            topics: a.topics ?? [],
          };
        });
    } catch (err) {
      console.error(`[contributor:${slug}] insights fetch failed:`, err);
    }
    return { contributor, articles };
  } catch (err) {
    if (!(err instanceof ApiError && err.status === 404)) {
      console.error(`[contributor:${slug}] BFF failed, falling back to mock:`, err);
    }
  }
  // Mock fallback
  const mock = MOCK_CONTRIBUTORS.find((c) => c.slug === slug);
  if (!mock) return null;
  const articles: ContributorArticle[] = MOCK_ARTICLES
    .filter((a) => AUTHOR_SLUG_MAP[a.author] === slug)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      date: new Date(a.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      publishedAt: new Date(a.publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      contentType: a.contentType,
      topics: a.topics,
    }));
  return { contributor: mock, articles };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await loadContributor(slug);
  return {
    title: loaded ? `${loaded.contributor.name} — MarketIQ` : "Contributor — MarketIQ",
    description: loaded?.contributor.bio ?? "MarketIQ contributor profile.",
  };
}

export default async function ContributorPage({ params }: PageProps) {
  const { slug } = await params;
  const loaded = await loadContributor(slug);
  if (!loaded) notFound();
  const { contributor, articles } = loaded;

  return (
    <div className="content-max">
      <nav className="flex items-center gap-2 text-xs text-fg-3 pt-6 pb-4">
        <Link href="/insights" className="text-brand-l no-underline font-medium hover:text-brand">
          Insights
        </Link>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-fg-3 shrink-0 opacity-50">
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span>Contributors</span>
      </nav>

      {/* Profile header */}
      <div className="flex items-start gap-5 pb-8 border-b border-border-s mb-8">
        <div
          className="w-16 h-16 shrink-0 rounded-full flex items-center justify-center font-display font-bold text-xl text-brand-l"
          style={{ background: "linear-gradient(135deg, var(--brand-m), var(--surface-el))" }}
        >
          {contributor.initials}
        </div>
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight mb-1">
            {contributor.name}
          </h1>
          <p className="text-sm text-fg-3 mb-3">
            {contributor.role} · {contributor.org}
          </p>
          <p className="text-base text-fg-2 leading-[1.7] max-w-[600px]">
            {contributor.bio}
          </p>
        </div>
      </div>

      {/* Articles by this contributor */}
      <h2 className="font-display font-bold text-lg tracking-tight mb-5">
        Articles ({articles.length})
      </h2>

      {articles.length > 0 ? (
        <div className="flex flex-col gap-4 pb-20">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="card block no-underline"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="badge badge-solid-research text-[10px]">
                    {article.contentType.replace("-", " ")}
                  </span>
                  <h3 className="font-display font-bold text-base leading-[1.4] mt-2 mb-1">
                    {article.title}
                  </h3>
                  <p className="text-sm text-fg-3 line-clamp-2">{article.excerpt}</p>
                </div>
                <span className="font-mono text-xs text-fg-3 shrink-0 mt-1">
                  {article.publishedAt}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-fg-3 pb-20">No articles yet.</p>
      )}
    </div>
  );
}
