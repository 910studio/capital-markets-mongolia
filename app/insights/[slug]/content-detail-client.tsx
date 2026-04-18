"use client";

import { useState } from "react";
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
import { DataTable, DataCell } from "@/app/components/ui/data-table";

/* ── Cover image SVG ───────────────────── */

function CoverImage() {
  return (
    <div className="mb-8 rounded-[var(--card-r)] overflow-hidden border border-border-s">
      <svg viewBox="0 0 1280 420" preserveAspectRatio="none" className="w-full block">
        <rect fill="#fff" width="1280" height="420" />
        <line x1="0" y1="105" x2="1280" y2="105" stroke="#EDEBF5" strokeWidth="1" />
        <line x1="0" y1="210" x2="1280" y2="210" stroke="#EDEBF5" strokeWidth="1" />
        <line x1="0" y1="315" x2="1280" y2="315" stroke="#EDEBF5" strokeWidth="1" />
        <defs>
          <linearGradient id="covg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(62,20,156,0.1)" />
            <stop offset="100%" stopColor="rgba(62,20,156,0)" />
          </linearGradient>
        </defs>
        <path d="M0,340 C80,330 160,300 240,270 C320,240 400,260 480,220 C560,180 640,190 720,160 C800,130 880,140 960,110 C1040,80 1120,90 1200,60 L1280,50 V420 H0Z" fill="url(#covg)" />
        <path d="M0,340 C80,330 160,300 240,270 C320,240 400,260 480,220 C560,180 640,190 720,160 C800,130 880,140 960,110 C1040,80 1120,90 1200,60 L1280,50" fill="none" stroke="#3E149C" strokeWidth="3" strokeLinecap="round" />
        <circle cx="1280" cy="50" r="5" fill="#3E149C" />
        <text x="40" y="60" className="font-display" fontSize="16" fill="#0C0A1D" fontWeight="700">MSE Mining Sub-Index</text>
        <text x="40" y="82" className="font-mono" fontSize="13" fill="#059669" fontWeight="600">1,847 pts  +18.4% YTD</text>
        <text x="40" y="400" className="font-body" fontSize="11" fill="#7A7793">Jan 2026</text>
        <text x="600" y="400" className="font-body" fontSize="11" fill="#7A7793">Feb 2026</text>
        <text x="1180" y="400" className="font-body" fontSize="11" fill="#7A7793">Mar 2026</text>
      </svg>
    </div>
  );
}

/* ── Table data ────────────────────────── */

const TABLE_HEADERS = ["Company", "Ticker", "Price (MNT)", "YTD Return", "Market Cap (B)"];

const TABLE_DATA = [
  { company: "Erdene Resource", ticker: "ERD", price: "4,280", ytd: "+34.2%", ytdPos: true, cap: "187.4" },
  { company: "Mongolian Mining Corp", ticker: "MMC", price: "1,520", ytd: "+18.7%", ytdPos: true, cap: "412.6" },
  { company: "Khan Resources", ticker: "KHN", price: "890", ytd: "+42.1%", ytdPos: true, cap: "56.3" },
  { company: "SouthGobi Resources", ticker: "SGQ", price: "2,150", ytd: "-4.3%", ytdPos: false, cap: "234.8" },
  { company: "Aspire Mining", ticker: "ASP", price: "680", ytd: "+11.5%", ytdPos: true, cap: "28.9" },
];

/* ── TOC + sidebar data ────────────────── */

const TOC_ITEMS = [
  { id: "s-executive", label: "Executive Summary" },
  { id: "s-mse", label: "MSE Mining Performance" },
  { id: "s-sector", label: "Sector Breakdown" },
  { id: "s-copper", label: "Copper Sub-Sector Analysis", locked: true },
  { id: "s-gold", label: "Gold Production Outlook", locked: true },
  { id: "s-regulatory", label: "Regulatory Environment", locked: true },
  { id: "s-recommendations", label: "Investment Recommendations", locked: true },
];

const RELATED_RESEARCH = [
  {
    title: "Erdene Resource Development: Q4 2025 Results & Forward Guidance",
    badge: "Deal Insight",
    date: "Mar 22, 2026",
    href: "/insights/erdene-resource-q4-2025",
  },
  {
    title: "Mongolia DealBook 2025: Annual Deal Activity Review",
    badge: "Research",
    date: "Jan 15, 2026",
    href: "/insights/mongolia-dealbook-2025",
  },
  {
    title: "Khan Resources: Uranium Play in the Dornod Region",
    badge: "Teaser",
    date: "Mar 14, 2026",
    href: "/insights/khan-resources-uranium",
  },
];

/* ── ContentDetailClient ───────────────── */

export function ContentDetailClient({ slug }: { slug: string }) {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-6 w-full">
      {/* Dev toggle — remove before prod */}
      <button
        onClick={() => setLoggedIn(!loggedIn)}
        className="fixed bottom-20 left-5 z-50 text-xs font-mono px-3 py-1.5 rounded-[var(--btn-r)] border border-border bg-[var(--white)] shadow-sm cursor-pointer hover:bg-surface transition-colors"
      >
        {loggedIn ? "🔓 Logged in" : "🔒 Guest"}
      </button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-fg-3 pt-6 pb-4">
        <Link href="/insights" className="text-brand-l no-underline font-medium hover:text-brand">
          Insights
        </Link>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-fg-3 shrink-0 opacity-50">
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span>Research Reports</span>
      </nav>

      {/* Article header — full width */}
      <ArticleHeader
        badges={[{ label: "Research Report", variant: "research" }]}
        title="Mongolia's Mining Sector: A Comprehensive 2026 Outlook"
        subtitle="An in-depth analysis covering copper, gold, coal, and critical minerals — including MSE-listed company performance, foreign investment trends, and regulatory developments shaping the sector through 2027."
        author={{
          name: "Namkhai Batdorj",
          initials: "NB",
          org: "CMM Research",
          href: "/contributors/namkhai-batdorj",
        }}
        date="March 28, 2026"
        readTime="14 min read"
        topics={["Mining & Resources", "Capital Markets"]}
      />

      <CoverImage />

      {/* Two-column layout: article + sidebar */}
      <div className="grid grid-cols-[1fr_200px] gap-14 items-start pt-8 px-12 max-lg:grid-cols-1 max-lg:px-0">
        {/* Article body */}
        <ArticleBody className="min-w-0 pb-16">

          <SectionHeading id="s-executive">Executive Summary</SectionHeading>

          <Paragraph>
            Mongolia&apos;s mining sector enters 2026 on the strongest footing in
            half a decade. Commodity prices for copper and gold remain elevated
            amid global supply constraints, and domestic policy reform —
            particularly the revised Minerals Law enacted in Q4 2025 — has
            meaningfully improved the regulatory environment for foreign
            operators. The MSE Mining sub-index has outperformed the broader
            TOP-20 by 12.3% year-to-date, driven by renewed institutional
            interest from South Korean and Japanese allocators.
          </Paragraph>

          <Paragraph>
            Key companies to watch include{" "}
            <EntityChip name="Erdene Resource" href="/directory/erdene-resource" />
            , which posted record quarterly revenue from the Bayan Khundii gold
            mine, and{" "}
            <EntityChip name="Oyu Tolgoi" href="/directory/oyu-tolgoi" />
            , where underground production ramp-up is tracking ahead of the
            revised feasibility study timeline. Meanwhile,{" "}
            <EntityChip name="Khan Resources" href="/directory/khan-resources" />{" "}
            has secured critical licensing for its Dornod uranium deposit,
            positioning the company as a strategic player in the nuclear energy
            supply chain.{" "}
            <EntityChip name="Mongolian Mining Corp" href="/directory/mongolian-mining-corp" />{" "}
            continues to benefit from coal logistics improvements along the
            southern corridor.
          </Paragraph>

          <Pullquote
            quote="The revised Minerals Law is the single most impactful policy change for Mongolia's resource sector since 2012. It fundamentally realigns the incentive structure for long-term foreign capital."
            cite="— Namkhai Batdorj, Head of Research, CMM"
          />

          <Paragraph>
            We forecast aggregate mining sector market capitalization on the MSE
            to grow 18-24% by year-end 2026, supported by volume expansion at
            Oyu Tolgoi, higher coal realizations, and at least two new listings
            in the critical minerals space. The primary risk vector remains
            Chinese demand softness, though current data suggests bottoming
            rather than deterioration.
          </Paragraph>

          <SectionHeading id="s-mse">MSE Mining Performance</SectionHeading>

          <Paragraph>
            The MSE Mining sub-index has been the standout performer in Q1 2026,
            reaching 1,847 points — a level not seen since the 2012-2013 mining
            boom. Daily trading volume in mining equities averaged MNT 3.2
            billion in March, nearly triple the 2025 daily average.{" "}
            <EntityChip name="Erdene Resource" href="/directory/erdene-resource" />{" "}
            alone accounted for 22% of total mining volume, reflecting
            concentrated but high-conviction institutional positioning.
          </Paragraph>

          <Paragraph>
            Foreign participation has been a defining feature of this rally. Net
            foreign inflows into MSE mining equities totaled MNT 48.7 billion in
            Q1, with South Korean securities firms accounting for approximately
            60% of cross-border activity. The CMM Foreign Participation Index
            for the mining sub-sector reached 0.34 — the highest reading since
            we began tracking in 2019.
          </Paragraph>

          {/* Data table */}
          <div className="my-8">
            <p className="font-display font-bold text-sm mb-3">
              Table 1: MSE Mining Equities — Q1 2026 Performance
            </p>
            <div className="overflow-x-auto rounded-[var(--card-r)] border border-border">
              <DataTable headers={TABLE_HEADERS}>
                {TABLE_DATA.map((row) => (
                  <tr key={row.ticker}>
                    <td className="font-display font-semibold">{row.company}</td>
                    <td className="font-mono text-xs text-fg-3">{row.ticker}</td>
                    <DataCell num>{row.price}</DataCell>
                    <DataCell num pos={row.ytdPos} neg={!row.ytdPos}>
                      {row.ytd}
                    </DataCell>
                    <DataCell num>{row.cap}</DataCell>
                  </tr>
                ))}
              </DataTable>
            </div>
          </div>

          <SectionHeading id="s-sector">Sector Breakdown</SectionHeading>

          <Paragraph>
            The mining sector&apos;s performance is not monolithic — significant
            divergence exists across commodity subsectors. Copper-gold plays have
            been the clear winners, benefiting from both price tailwinds and
            operational milestones. Coal equities have lagged due to persistent
            uncertainty around Chinese import quotas, though logistics
            improvements along the Gashuunsukhait-Ganqimaodu corridor have
            provided modest support. Critical minerals — uranium, lithium, and
            rare earths — represent the emerging frontier, with early-stage
            companies attracting speculative interest ahead of anticipated
            government incentive packages.
          </Paragraph>

          <Paragraph>
            Copper remains the dominant value driver, accounting for
            approximately 45% of total mining sector market capitalization. Oyu
            Tolgoi&apos;s underground block cave is the single largest variable —
            management has guided for 500,000 tonnes of annual copper production
            at full capacity, which would make it the world&apos;s fourth-largest
            copper mine. Current underground development is tracking 3-4 months
            ahead of the revised December 2025 feasibility study, with first
            sustainable production expected in Q3 2026. The implications for
            Mongolia&apos;s GDP growth, balance of payments position, and MSE
            listing potential are transformative.
          </Paragraph>

          {/* ── Locked sections (visible but gated) ── */}

          <SectionHeading id="s-copper">Copper Sub-Sector Analysis</SectionHeading>

          <Paragraph>
            The copper sub-sector has delivered exceptional returns in Q1 2026,
            driven by LME prices sustaining above $10,500/t and operational
            milestones at Oyu Tolgoi. We identify three distinct investment
            themes within the copper space: mega-project operators benefiting
            from volume ramp, junior explorers positioned on the Oyu Tolgoi
            trend, and service companies leveraging increased drilling activity
            across the South Gobi copper belt...
          </Paragraph>

          <SectionHeading id="s-gold">Gold Production Outlook</SectionHeading>

          <Paragraph>
            Mongolia&apos;s gold production reached 22.4 tonnes in 2025, a 14%
            increase year-over-year, driven primarily by{" "}
            <EntityChip name="Erdene Resource" href="/directory/erdene-resource" />
            &apos;s Bayan Khundii mine achieving nameplate capacity. The outlook
            for 2026 is equally constructive, with three additional projects
            expected to enter production or commence commissioning...
          </Paragraph>

          {/* Paywall gate or full content */}
          {!loggedIn ? (
            <PaywallWall />
          ) : (
            <>
              <SectionHeading id="s-regulatory">Regulatory Environment</SectionHeading>

              <Paragraph>
                The revised Minerals Law, enacted in Q4 2025, represents the most
                significant overhaul of Mongolia&apos;s mining regulatory framework
                in over a decade. Key provisions include streamlined licensing
                procedures (reducing average approval time from 18 months to 6),
                clearer foreign ownership rules, and a new stability agreement
                framework that provides fiscal certainty for investments exceeding
                $50 million. The law also introduces a &ldquo;strategic deposit&rdquo;
                reclassification mechanism that removes political discretion from
                licensing decisions for non-strategic minerals.
              </Paragraph>

              <Paragraph>
                The Financial Regulatory Commission has simultaneously advanced
                capital markets reform, approving Mongolia&apos;s first green bond
                framework and establishing guidelines for ESG disclosure
                requirements for MSE-listed companies. These regulatory
                developments are expected to unlock significant institutional
                capital flows from ESG-mandated funds in Japan, South Korea, and
                the European Union.
              </Paragraph>

              <SectionHeading id="s-recommendations">Investment Recommendations</SectionHeading>

              <Paragraph>
                Based on our analysis, we recommend the following positioning
                across the mining sub-sectors. For copper exposure, we maintain
                a <strong>Strong Buy</strong> on{" "}
                <EntityChip name="Erdene Resource" href="/directory/erdene-resource" />
                {" "}with a 12-month price target of MNT 5,800, representing 35%
                upside from current levels. The Bayan Khundii expansion timeline
                and updated resource estimates provide significant catalysts
                through H2 2026.
              </Paragraph>

              <Paragraph>
                For diversified mining exposure, we initiate coverage on{" "}
                <EntityChip name="Mongolian Mining Corp" href="/directory/mongolian-mining-corp" />
                {" "}with a <strong>Buy</strong> rating, driven by coal logistics
                improvements and a compelling valuation at 3.2x EV/EBITDA —
                a significant discount to regional peers. Our base case projects
                free cash flow yield of 18% in 2026, underpinned by higher
                realized coal prices and reduced transport costs along the
                southern corridor.
              </Paragraph>

              <Paragraph>
                We remain cautious on early-stage uranium plays, including{" "}
                <EntityChip name="Khan Resources" href="/directory/khan-resources" />,
                where licensing progress is encouraging but production economics
                remain unproven. We assign a <strong>Hold</strong> rating pending
                feasibility study results expected in Q4 2026.
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

        {/* Sidebar — single sticky container */}
        <aside className="hidden lg:flex flex-col gap-5 sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-none">
          <ArticleSidebar toc={loggedIn ? TOC_ITEMS.map(t => ({ ...t, locked: false })) : TOC_ITEMS} />

          <PdfBar
            fileSize="2.4 MB"
            pageCount={24}
            requiresAuth={!loggedIn}
          />
        </aside>
      </div>

      {/* Related Research */}
      <div className="border-t border-border-s pt-8 pb-20">
        <h3 className="font-display font-bold text-lg tracking-tight mb-5">Related Research</h3>

        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1 max-lg:grid-cols-2">
          {RELATED_RESEARCH.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="card block no-underline"
            >
              <span className="badge badge-solid-research">{item.badge}</span>
              <div className="font-display font-bold text-sm leading-[1.4] mt-2 mb-2 line-clamp-2">
                {item.title}
              </div>
              <span className="font-mono text-xs text-fg-3">{item.date}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
