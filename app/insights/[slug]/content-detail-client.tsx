"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArticleHeader } from "@/app/components/content/article-header";
import {
  ArticleBody,
  SectionHeading,
  Paragraph,
  Pullquote,
  KeyMetricBox,
} from "@/app/components/content/article-body";
import { EntityChip } from "@/app/components/content/entity-chip";
import { ArticleSidebar } from "@/app/components/content/article-sidebar";
import { PdfBar } from "@/app/components/content/pdf-bar";
import { PaywallWall } from "@/app/components/content/paywall-wall";
import { MOCK_ARTICLES, MOCK_CONTRIBUTORS, MOCK_ENTITIES } from "@/app/lib/mock-data";

/* ── Badge mapping ─────────────────────── */

const BADGE_MAP: Record<string, { label: string; variant: "research" | "article" | "deal" | "update" | "teaser" | "press" }> = {
  "article": { label: "Article", variant: "article" },
  "monthly-update": { label: "Monthly Update", variant: "update" },
  "investment-teaser": { label: "Investment Teaser", variant: "teaser" },
  "deal-insight": { label: "Deal Insight", variant: "deal" },
  "research-report": { label: "Research Report", variant: "research" },
  "press-release": { label: "Press Release", variant: "press" },
  "cmm-guide": { label: "CMM Guide", variant: "research" },
};

/* ── Author → contributor slug mapping ── */

const AUTHOR_SLUG_MAP: Record<string, string> = {
  "Enkhjin A.": "enkhjin-a",
  "Namkhaidorj B.": "namkhaidorj-b",
  "Zolbayar E.": "zolbayar-e",
  "Tselmeg E.": "tselmeg-e",
  "Ariunzaya O.": "ariunzaya-o",
  "Enkhtaivan B.": "enkhjin-a",
  "CMM Research": "cmm-research",
};

/* ── ContentDetailClient ───────────────── */

function LinkedExcerpt({ text, entities }: { text: string; entities: { name: string; href: string }[] }) {
  if (!entities.length) return <>{text}</>;

  // Sort by name length descending so longer names match first
  const sorted = [...entities].sort((a, b) => b.name.length - a.name.length);

  // Only include entities whose name actually appears in the text
  const matched = sorted.filter(e => text.toLowerCase().includes(e.name.toLowerCase()));
  if (!matched.length) return <>{text}</>;

  const pattern = new RegExp(`(${matched.map(e => e.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");

  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        const entity = matched.find(e => e.name.toLowerCase() === part.toLowerCase());
        if (entity) {
          return <EntityChip key={i} name={entity.name} href={entity.href} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function ContentDetailClient({ slug }: { slug: string }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

  const article = MOCK_ARTICLES.find((a) => a.slug === slug);
  if (!article) return <div className="content-max py-20 text-center text-fg-3">Article not found.</div>;

  const badge = BADGE_MAP[article.contentType] ?? { label: "Article", variant: "article" as const };
  const authorSlug = AUTHOR_SLUG_MAP[article.author];
  const contributor = MOCK_CONTRIBUTORS.find((c) => c.slug === authorSlug);
  const authorInitials = contributor?.initials ?? article.author.split(/[\s.]+/).map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

  const mentionedEntities = article.entityRefs
    .map((ref) => MOCK_ENTITIES.find((e) => e.slug === ref))
    .filter(Boolean)
    .map((e) => ({ name: e!.name, href: `/directory/${e!.slug}` }))
    .filter((e) => article.excerpt.toLowerCase().includes(e.name.toLowerCase()));

  const related = MOCK_ARTICLES
    .filter((a) => a.slug !== slug)
    .filter((a) => a.topics.some((t) => article.topics.includes(t)))
    .slice(0, 3);

  const tocItems = [
    { id: "s-overview", label: "Overview" },
    { id: "s-analysis", label: "Analysis" },
    { id: "s-outlook", label: "Outlook", locked: !loggedIn && article.isPremium },
    { id: "s-implications", label: "Implications", locked: !loggedIn && article.isPremium },
  ];

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
      {/* Dev toggle */}
      <button
        onClick={() => setLoggedIn(!loggedIn)}
        className="fixed bottom-20 left-5 z-50 text-xs font-mono px-3 py-1.5 rounded-[var(--btn-r)] border border-border bg-[var(--white)] shadow-sm cursor-pointer hover:bg-surface transition-colors"
      >
        {loggedIn ? "🔓 Logged in" : "🔒 Guest"}
      </button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm pt-6 pb-4">
        <Link href="/insights" className="text-fg-3 no-underline font-medium hover:text-brand transition-colors">
          Insights
        </Link>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-fg-3 shrink-0 opacity-40">
          <path d="m9 18 6-6-6-6" />
        </svg>
        <Link href={`/insights?type=${badge.variant}`} className="text-fg-3 no-underline font-medium hover:text-brand transition-colors">
          {badge.label}
        </Link>
        {article.topics[0] && (
          <>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-fg-3 shrink-0 opacity-40">
              <path d="m9 18 6-6-6-6" />
            </svg>
            <Link href={`/insights?topic=${encodeURIComponent(article.topics[0])}`} className="text-fg no-underline font-semibold hover:text-brand transition-colors">
              {article.topics[0]}
            </Link>
          </>
        )}
      </nav>

      {/* Article header */}
      <ArticleHeader
        badges={[badge]}
        title={article.title}
        author={{
          name: article.author,
          initials: authorInitials,
          org: contributor?.org ?? "CMM",
          href: authorSlug ? `/contributors/${authorSlug}` : undefined,
        }}
        date={new Date(article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        readTime={`${article.readTime} min read`}
        topics={article.topics}
      />

      {/* Cover image */}
      {article.coverImage && (
        <div className="mb-8 rounded-[var(--card-r)] overflow-hidden border border-border-s relative aspect-[21/9] max-[440px]:aspect-[4/3] max-[440px]:-mx-6 max-[440px]:rounded-none max-[440px]:border-x-0">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_280px] gap-32 items-start pt-8 mx-auto max-w-[1120px] max-xl:gap-12 max-xl:max-w-none max-xl:px-6 max-lg:grid-cols-1 max-lg:max-w-none max-lg:gap-0 max-lg:px-0">
        <ArticleBody className="min-w-0 pb-16">
          <SectionHeading id="s-overview">Overview</SectionHeading>
          <Paragraph>
            <LinkedExcerpt text={article.excerpt} entities={mentionedEntities} />
          </Paragraph>

          <SectionHeading id="s-analysis">Analysis</SectionHeading>
          <Paragraph>
            This analysis examines the key factors driving developments in Mongolia&apos;s
            {article.topics[0] ? ` ${article.topics[0].toLowerCase()}` : ""} sector,
            with implications for institutional investors evaluating exposure to Mongolian
            capital markets. The findings draw on CMM&apos;s proprietary data, regulatory
            filings, and direct engagement with market participants.
          </Paragraph>

          <Pullquote
            quote={article.excerpt.split(".").slice(0, 2).join(".") + "."}
            cite={`— ${article.author}, CMM`}
          />

          <Paragraph>
            Foreign portfolio flows into Mongolia continue to demonstrate selective
            conviction, with institutional allocators from South Korea, Japan, and
            increasingly the Middle East deploying capital into liquid equities and
            structured credit. The regulatory environment has improved meaningfully
            following recent legislative reforms, though execution risks remain
            the primary concern for new entrants.
          </Paragraph>

          {/* Premium content gate */}
          {article.isPremium && !loggedIn ? (
            <PaywallWall />
          ) : (
            <>
              <SectionHeading id="s-outlook">Outlook</SectionHeading>
              <Paragraph>
                Looking ahead, the trajectory for Mongolia&apos;s{" "}
                {article.topics[0]?.toLowerCase() ?? "capital markets"} sector
                remains constructive. Key catalysts include ongoing regulatory
                reform, increased foreign institutional participation, and
                improving macroeconomic fundamentals. However, geopolitical
                positioning between China and Russia continues to present
                structural complexities that require careful navigation.
              </Paragraph>

              <SectionHeading id="s-implications">Implications</SectionHeading>
              <Paragraph>
                For institutional investors, Mongolia represents a frontier market
                opportunity with improving accessibility. The combination of
                natural resource endowment, demographic trajectory, and strategic
                geographic positioning creates a compelling medium-term investment
                thesis. Near-term catalysts and risks are well-defined and
                contractually manageable for appropriately structured allocations.
              </Paragraph>
            </>
          )}

          <KeyMetricBox title="Disclaimer">
            This report is for informational purposes only and does not
            constitute investment advice. Past performance is not indicative of
            future results. CMM is a registered capital markets advisory firm in
            Mongolia.
          </KeyMetricBox>
        </ArticleBody>

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col gap-5 sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-none">
          <ArticleSidebar
            toc={loggedIn ? tocItems.map(t => ({ ...t, locked: false })) : tocItems}
            entities={mentionedEntities}
          />
          <PdfBar
            fileSize="2.4 MB"
            pageCount={article.readTime > 15 ? 24 : 8}
            requiresAuth={!loggedIn}
          />
        </aside>
      </div>

      {/* Related Research */}
      {related.length > 0 && (
        <div className="border-t border-border-s pt-8 pb-20">
          <h3 className="font-display font-bold text-lg tracking-tight mb-5">Related Research</h3>
          <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2">
            {related.map((item) => {
              const itemBadge = BADGE_MAP[item.contentType] ?? { label: "Article", variant: "article" as const };
              return (
                <Link key={item.slug} href={`/insights/${item.slug}`} className="card block no-underline">
                  {item.coverImage && (
                    <div className="relative aspect-[16/9] rounded-[var(--card-r)] overflow-hidden mb-3 border border-border-s">
                      <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="400px" />
                    </div>
                  )}
                  <span className={`badge badge-${itemBadge.variant === "article" ? "companies" : itemBadge.variant === "deal" ? "sectors" : itemBadge.variant === "update" ? "markets" : itemBadge.variant === "teaser" ? "companies" : itemBadge.variant === "press" ? "markets" : "insights"}`}>{itemBadge.label}</span>
                  <div className="font-display font-bold text-sm leading-[1.4] mt-2 mb-2 line-clamp-2">{item.title}</div>
                  <span className="font-mono text-xs text-fg-3">
                    {new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
