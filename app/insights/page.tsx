import type { Metadata } from "next";
import { InsightsControls } from "./insights-controls";
import type { Article } from "@/app/components/insights/insights-grid";

export const metadata: Metadata = {
  title: "Insights — MarketIQ",
  description: "Research & analysis on Mongolia's capital markets",
};

/* ── SVG chart placeholder (server-rendered, zero JS) ── */

function FeaturedChart() {
  return (
    <svg viewBox="0 0 600 300" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <rect fill="#fff" width="600" height="300" />
      <line x1="0" y1="75" x2="600" y2="75" stroke="#EDEBF5" strokeWidth="1" />
      <line x1="0" y1="150" x2="600" y2="150" stroke="#EDEBF5" strokeWidth="1" />
      <line x1="0" y1="225" x2="600" y2="225" stroke="#EDEBF5" strokeWidth="1" />
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(62,20,156,0.12)" />
          <stop offset="100%" stopColor="rgba(62,20,156,0)" />
        </linearGradient>
      </defs>
      <path d="M0,220 C60,210 120,200 180,170 C240,140 280,160 320,130 C360,100 400,110 440,80 C480,50 520,60 560,40 L600,45 V300 H0Z" fill="url(#ag)" />
      <path d="M0,220 C60,210 120,200 180,170 C240,140 280,160 320,130 C360,100 400,110 440,80 C480,50 520,60 560,40 L600,45" fill="none" stroke="#3E149C" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="600" cy="45" r="4" fill="#3E149C" />
      <text x="560" y="35" className="font-mono" fontSize="11" fill="#3E149C" fontWeight="600">+18.4%</text>
    </svg>
  );
}

/* ── Mock articles (will come from CMS later) ── */

const ARTICLES: Article[] = [
  {
    slug: "mongolia-mining-sector-2026-outlook",
    title: "Mongolia\u2019s Mining Sector: A Comprehensive 2026 Outlook",
    excerpt: "An in-depth analysis covering copper, gold, coal, and critical minerals. Includes MSE-listed company performance, foreign investment trends, and regulatory developments shaping the sector through 2027.",
    badge: { label: "Research Report", variant: "research" },
    author: "Namkhai B.",
    date: "Mar 28, 2026",
    readTime: "14 min read",
    featured: true,
    image: <FeaturedChart />,
  },
  {
    slug: "erdene-resource-q4-2025",
    title: "Erdene Resource Development: Q4 2025 Results & Forward Guidance",
    excerpt: "Record quarterly revenue driven by Bayan Khundii gold production. Analysis of expansion plans and share performance.",
    badge: { label: "Deal Insight", variant: "deal" },
    author: "Tsogoo B.",
    date: "Mar 22, 2026",
  },
  {
    slug: "mse-monthly-march-2026",
    title: "MSE Monthly Market Update \u2014 March 2026",
    excerpt: "Top-20 index rises 4.2%. Trading volume reaches 18-month high. Banking sector leads gains.",
    badge: { label: "Monthly Update", variant: "update" },
    author: "CMM Research",
    date: "Apr 1, 2026",
  },
  {
    slug: "golomt-bank-expansion",
    title: "Golomt Bank\u2019s International Expansion: Southeast Asia Strategy",
    excerpt: "Mongolia\u2019s largest private bank eyes Singapore and Vietnam. What it means for foreign investors.",
    badge: { label: "Article", variant: "article" },
    author: "Namkhai B.",
    date: "Mar 18, 2026",
  },
  {
    slug: "khan-resources-uranium",
    title: "Khan Resources: Uranium Play in the Dornod Region",
    excerpt: "Single-entity equity research snapshot covering resource estimates, licensing, and thesis.",
    badge: { label: "Investment Teaser", variant: "teaser" },
    author: "Tsogoo B.",
    date: "Mar 14, 2026",
  },
  {
    slug: "cmm-tse-cross-listing",
    title: "CMM Signs MOU with Tokyo Stock Exchange for Cross-Listing Framework",
    excerpt: "Formal partnership to facilitate dual listings for Mongolian companies on TSE.",
    badge: { label: "Press Release", variant: "press" },
    author: "CMM",
    date: "Mar 10, 2026",
  },
  {
    slug: "mongolia-renewable-energy",
    title: "Mongolia\u2019s Renewable Energy Push: Policy and Investment Outlook",
    excerpt: "Government targets 30% renewable energy by 2030. Key projects and foreign capital opportunities.",
    badge: { label: "Article", variant: "article" },
    author: "Namkhai B.",
    date: "Mar 6, 2026",
  },
  {
    slug: "mongolia-dealbook-2025",
    title: "Mongolia DealBook 2025: Annual Deal Activity Review",
    excerpt: "Comprehensive review of M&A, equity, and debt activity across Mongolian capital markets in 2025.",
    badge: { label: "Research Report", variant: "research" },
    author: "CMM Research",
    date: "Jan 15, 2026",
  },
  {
    slug: "ard-financial-fintech-expansion",
    title: "Ard Financial Group: Fintech Expansion into Central Asian Markets",
    excerpt: "Ard\u2019s strategic push into Uzbekistan and Kazakhstan. Partnership structures and regulatory landscape.",
    badge: { label: "Deal Insight", variant: "deal" },
    author: "Tsogoo B.",
    date: "Feb 28, 2026",
  },
];

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
