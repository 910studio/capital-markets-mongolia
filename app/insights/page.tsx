import type { Metadata } from "next";
import Image from "next/image";
import { InsightsControls } from "./insights-controls";
import type { Article } from "@/app/components/insights/insights-grid";
import { MOCK_ARTICLES } from "@/app/lib/mock-data";

export const metadata: Metadata = {
  title: "Insights — MarketIQ",
  description: "Research & analysis on Mongolia's capital markets",
};

/* ── Map contentType to badge variant ── */

const BADGE_MAP: Record<string, { label: string; variant: "research" | "article" | "deal" | "update" | "teaser" | "press" }> = {
  "article": { label: "Article", variant: "article" },
  "monthly-update": { label: "Monthly Update", variant: "update" },
  "investment-teaser": { label: "Investment Teaser", variant: "teaser" },
  "deal-insight": { label: "Deal Insight", variant: "deal" },
  "research-report": { label: "Research Report", variant: "research" },
  "press-release": { label: "Press Release", variant: "press" },
  "cmm-guide": { label: "CMM Guide", variant: "research" },
};

/* ── Transform mock data to grid articles ── */

const ARTICLES: Article[] = MOCK_ARTICLES.map((a, i) => ({
  slug: a.slug,
  title: a.title,
  excerpt: a.excerpt,
  badge: BADGE_MAP[a.contentType] ?? { label: "Article", variant: "article" },
  author: a.author,
  date: new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  readTime: `${a.readTime} min read`,
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

/* ── Page (Server Component) ── */

export default function InsightsPage() {
  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
      <div className="pt-8 pb-6">
        <h1 className="font-display font-extrabold text-2xl tracking-tight mb-1">
          Insights
        </h1>
        <p className="text-base text-fg-2">
          Research & analysis on Mongolia&apos;s capital markets
        </p>
      </div>

      <InsightsControls articles={ARTICLES} />
    </div>
  );
}
