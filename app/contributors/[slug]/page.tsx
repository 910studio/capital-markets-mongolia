import type { Metadata } from "next";
import Link from "next/link";
import { MOCK_CONTRIBUTORS, MOCK_ARTICLES } from "@/app/lib/mock-data";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const contributor = MOCK_CONTRIBUTORS.find((c) => c.slug === slug);

  return {
    title: contributor ? `${contributor.name} — MarketIQ` : "Contributor — MarketIQ",
    description: contributor?.bio ?? "MarketIQ contributor profile.",
  };
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

export default async function ContributorPage({ params }: PageProps) {
  const { slug } = await params;
  const contributor = MOCK_CONTRIBUTORS.find((c) => c.slug === slug);

  if (!contributor) notFound();

  const articles = MOCK_ARTICLES.filter((a) => {
    const authorSlug = AUTHOR_SLUG_MAP[a.author];
    return authorSlug === slug;
  });

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
