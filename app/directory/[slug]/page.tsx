import type { Metadata } from "next";
import Link from "next/link";
import {
  EntityHeader,
  MarketDataWidget,
  FinancialTableWidget,
  KeyPersonnelWidget,
  OwnershipWidget,
  ResearchWidget,
  NewsWidget,
  QuickStatsWidget,
} from "@/app/components/entity";
import { MOCK_ENTITIES } from "@/app/lib/mock-data";

/* ═══════════════════════════════════════════════════════════
   Entity Profile Page — /directory/[slug]
   Widgets rendered dynamically based on entity type.
   Mock data: Erdene Resource Development (public company)
   ═══════════════════════════════════════════════════════════ */

/* ── Mock Data ─────────────────────────── */

const entity = {
  name: "Erdene Resource Development",
  initials: "ER",
  ticker: "ERDN",
  exchange: "MSE",
  price: "\u20AE4,280",
  priceChange: "+2.4%",
  priceDirection: "up" as const,
  type: "Public Company",
  typeVariant: "company" as const,
  sector: "Mining & Resources",
  description:
    "Erdene Resource Development is a diversified mining company focused on gold and base metal exploration in southwestern Mongolia. Listed on the MSE and TSX, the company\u2019s flagship asset is the Bayan Khundii Gold Project in the Khundii Gold District.",
};

const chartData = {
  "1M": {
    points: [
      { x: 40, y: 68 }, { x: 80, y: 72 }, { x: 120, y: 78 }, { x: 160, y: 72 },
      { x: 200, y: 82 }, { x: 240, y: 88 }, { x: 280, y: 85 }, { x: 320, y: 95 },
      { x: 360, y: 92 }, { x: 400, y: 100 }, { x: 440, y: 105 }, { x: 480, y: 98 },
      { x: 520, y: 108 }, { x: 560, y: 115 }, { x: 600, y: 112 }, { x: 640, y: 120 },
      { x: 670, y: 125 },
    ],
    trend: "down" as const,
    low: "4,080",
    high: "4,420",
    change: "-3.8%",
  },
  "3M": {
    points: [
      { x: 40, y: 160 }, { x: 80, y: 152 }, { x: 120, y: 148 }, { x: 160, y: 135 },
      { x: 200, y: 142 }, { x: 240, y: 128 }, { x: 280, y: 118 }, { x: 320, y: 125 },
      { x: 360, y: 110 }, { x: 400, y: 105 }, { x: 440, y: 98 }, { x: 480, y: 102 },
      { x: 520, y: 88 }, { x: 560, y: 82 }, { x: 600, y: 78 }, { x: 640, y: 85 },
      { x: 670, y: 72 },
    ],
    trend: "up" as const,
    low: "3,620",
    high: "4,310",
    change: "+18.2%",
  },
  "1Y": {
    points: [
      { x: 40, y: 175 }, { x: 80, y: 168 }, { x: 120, y: 160 }, { x: 160, y: 148 },
      { x: 200, y: 140 }, { x: 240, y: 125 }, { x: 280, y: 118 }, { x: 320, y: 130 },
      { x: 360, y: 142 }, { x: 400, y: 128 }, { x: 440, y: 115 }, { x: 480, y: 108 },
      { x: 520, y: 95 }, { x: 560, y: 88 }, { x: 600, y: 80 }, { x: 640, y: 78 },
      { x: 670, y: 72 },
    ],
    trend: "up" as const,
    low: "2,180",
    high: "4,520",
    change: "+96.3%",
  },
  ALL: {
    points: [
      { x: 40, y: 72 }, { x: 80, y: 78 }, { x: 120, y: 85 }, { x: 160, y: 95 },
      { x: 200, y: 110 }, { x: 240, y: 125 }, { x: 280, y: 140 }, { x: 320, y: 128 },
      { x: 360, y: 115 }, { x: 400, y: 130 }, { x: 440, y: 148 }, { x: 480, y: 155 },
      { x: 520, y: 140 }, { x: 560, y: 120 }, { x: 600, y: 95 }, { x: 640, y: 82 },
      { x: 670, y: 72 },
    ],
    trend: "volatile" as const,
    low: "1,840",
    high: "4,520",
    change: "+132%",
  },
};

const marketStats = [
  { label: "Open", value: "\u20AE4,180" },
  { label: "High", value: "\u20AE4,310" },
  { label: "Low", value: "\u20AE4,160" },
  { label: "Volume", value: "1.2M" },
  { label: "52W High", value: "\u20AE4,520" },
  { label: "52W Low", value: "\u20AE2,180" },
  { label: "Avg Volume", value: "840K" },
  { label: "P/E", value: "47.7x" },
  { label: "Div Yield", value: "0.8%" },
];

const financialData = {
  "P&L": [
    { metric: "Revenue (\u20AEB)", values: ["42.8", "67.3", "89.1"] },
    { metric: "Net Income (\u20AEB)", values: ["-2.1", "8.4", "18.7"] },
    { metric: "EBITDA (\u20AEB)", values: ["12.3", "28.9", "41.2"] },
    { metric: "Total Assets (\u20AEB)", values: ["156.4", "198.2", "243.8"] },
    { metric: "Total Debt (\u20AEB)", values: ["45.2", "38.6", "31.4"] },
  ],
  "Balance Sheet": [
    { metric: "Total Assets (\u20AEB)", values: ["156.4", "198.2", "243.8"] },
    { metric: "Current Assets (\u20AEB)", values: ["28.3", "42.1", "58.6"] },
    { metric: "Total Liabilities (\u20AEB)", values: ["68.9", "72.4", "65.8"] },
    { metric: "Shareholders Equity (\u20AEB)", values: ["87.5", "125.8", "178.0"] },
    { metric: "Book Value/Share (\u20AE)", values: ["2,180", "3,140", "4,450"] },
  ],
  "Cash Flow": [
    { metric: "Operating CF (\u20AEB)", values: ["8.2", "24.6", "38.4"] },
    { metric: "Investing CF (\u20AEB)", values: ["-22.1", "-18.4", "-14.2"] },
    { metric: "Financing CF (\u20AEB)", values: ["15.6", "-4.8", "-8.6"] },
    { metric: "Free Cash Flow (\u20AEB)", values: ["-13.9", "6.2", "24.2"] },
    { metric: "CAPEX (\u20AEB)", values: ["22.1", "18.4", "14.2"] },
  ],
};

const personnel = [
  { initials: "PD", name: "Peter Dalton", title: "Chief Executive Officer" },
  { initials: "BE", name: "Bat-Erdene G.", title: "Chief Financial Officer" },
  { initials: "JC", name: "Jay Cleary", title: "VP Exploration" },
];

const quickStats = [
  { label: "Market Cap", value: "\u20AE892B" },
  { label: "P/E Ratio", value: "47.7x" },
  { label: "52W High", value: "\u20AE4,520" },
  { label: "52W Low", value: "\u20AE2,180" },
  { label: "Avg Volume", value: "840K" },
  { label: "Sector", value: "Mining", isMono: false },
];

const ownership = [
  { name: "Erdene Mining Corp", percentage: 72, color: "var(--brand)" },
  { name: "Institutional", percentage: 18, color: "var(--brand-l)" },
  { name: "Public Float", percentage: 10, color: "var(--surface-el)" },
];

const research = [
  {
    id: "erdene-q4-2025",
    title: "Erdene Resource Development: Q4 2025 Results & Forward Guidance",
    type: "insights" as const,
    typeLabel: "Deal Insight",
    date: "Mar 22, 2026",
  },
  {
    id: "mongolia-mining-2026",
    title: "Mongolia\u2019s Mining Sector: A Comprehensive 2026 Outlook",
    type: "markets" as const,
    typeLabel: "Research Report",
    date: "Mar 28, 2026",
  },
  {
    id: "bayan-khundii-update",
    title: "Bayan Khundii Gold District: Resource Estimate Update",
    type: "companies" as const,
    typeLabel: "Investment Teaser",
    date: "Feb 14, 2026",
  },
];

const news = [
  {
    id: "n1",
    title: "Erdene Reports Record Gold Production in Q1 2026",
    source: "Mining Weekly",
    date: "Apr 5, 2026",
  },
  {
    id: "n2",
    title: "Mongolia Mining Sector Attracts $2.1B in Foreign Investment",
    source: "Bloomberg",
    date: "Apr 2, 2026",
  },
  {
    id: "n3",
    title: "Bayan Khundii Expansion Permit Approved by MRAM",
    source: "UB Post",
    date: "Mar 29, 2026",
  },
];

/* ── Page Component ────────────────────── */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ent = MOCK_ENTITIES.find((e) => e.slug === slug);

  return {
    title: ent ? `${ent.name} — MarketIQ` : "Directory — MarketIQ",
    description: ent?.description ?? "Mongolia's capital markets company directory.",
  };
}

export default async function EntityProfilePage({ params }: PageProps) {
  await params;

  return (
    <div className="content-max mx-auto py-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-fg-3 pt-8 pb-5">
        <Link
          href="/directory"
          className="text-fg-3 no-underline hover:text-brand transition-colors"
        >
          Directory
        </Link>
        <span className="text-[11px] opacity-50">&rsaquo;</span>
        <Link
          href="/directory"
          className="text-fg-3 no-underline hover:text-brand transition-colors"
        >
          Public Companies
        </Link>
        <span className="text-[11px] opacity-50">&rsaquo;</span>
        <span className="text-fg-2">{entity.name}</span>
      </nav>

      {/* Entity Header */}
      <EntityHeader {...entity} />

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_340px] gap-7 pb-20 items-start max-lg:grid-cols-1">
        {/* Main column */}
        <div className="flex flex-col gap-5">
          <MarketDataWidget
            price={entity.price}
            priceChange={entity.priceChange}
            priceDirection={entity.priceDirection}
            volume="1.2M"
            dayRange="4,180 \u2014 4,310"
            chartData={chartData}
            stats={marketStats}
            lastUpdated="Apr 7, 2026"
            source="MSE"
          />

          <FinancialTableWidget
            years={["2023", "2024", "2025"]}
            data={financialData}
            source="MSE Annual Report 2025. Audited figures."
          />

          <KeyPersonnelWidget people={personnel} />
        </div>

        {/* Sidebar */}
        <aside className="sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto flex flex-col gap-5 scrollbar-none max-lg:static max-lg:max-h-none max-lg:grid max-lg:grid-cols-2 max-md:grid-cols-1">
          <QuickStatsWidget stats={quickStats} />
          <OwnershipWidget owners={ownership} />
          <ResearchWidget items={research} />
          <NewsWidget items={news} />
        </aside>
      </div>
    </div>
  );
}
